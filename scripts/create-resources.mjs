/**
 * Seed the resource collection in the live CMS.
 * Run with: JWT_TOKEN=<token> node scripts/create-resources.mjs
 *
 * Idempotent: skips resources whose slug already exists.
 * If a markdown file exists at public/resources/<slug>/<slug>.md the content
 * is loaded into the resource's markdownBody field.
 */

import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

const JWT = process.env.JWT_TOKEN
const BASE = process.env.CMS_API_BASE || 'https://chrisgarlick.com/api'

if (!JWT) { console.error('Set JWT_TOKEN env var'); process.exit(1) }

const auth = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${JWT}` }

async function loadMarkdown(slug) {
  const path = resolve(`public/resources/${slug}/${slug}.md`)
  if (!existsSync(path)) return null
  return await readFile(path, 'utf8')
}

function t(text) { return { type: 'text', text } }
function p(content) { return { type: 'paragraph', content: Array.isArray(content) ? content : [t(content)] } }
function h2(text) { return { type: 'heading', attrs: { level: 2 }, content: [t(text)] } }
function li(text) { return { type: 'listItem', content: [p(text)] } }
function ul(...items) { return { type: 'bulletList', content: items.map(i => li(i)) } }
function doc(...nodes) { return { type: 'doc', content: nodes } }

async function findBySlug(slug) {
  const res = await fetch(`${BASE}/resource/slug/${slug}`, { headers: auth })
  if (res.status === 404) return null
  if (!res.ok) return null
  const json = await res.json()
  return json.data || null
}

async function createResource(data) {
  const existing = await findBySlug(data.slug)
  if (existing) {
    // PATCH any fields that have changed in the seed since last run. API returns snake_case,
    // we send camelCase — keep both in sync below.
    const patch = {}
    if (data.markdownBody       !== undefined && existing.markdown_body      !== data.markdownBody)       patch.markdownBody      = data.markdownBody
    if (data.typesetClient      !== undefined && existing.typeset_client     !== data.typesetClient)      patch.typesetClient     = data.typesetClient
    if (data.keywords           !== undefined && existing.keywords           !== data.keywords)           patch.keywords           = data.keywords
    if (data.secondaryKeywords  !== undefined && existing.secondary_keywords !== data.secondaryKeywords)  patch.secondaryKeywords  = data.secondaryKeywords
    if (data.summary            !== undefined && existing.summary            !== data.summary)            patch.summary            = data.summary
    if (data.description        !== undefined && JSON.stringify(existing.description) !== JSON.stringify(data.description)) patch.description = data.description
    if (data.sector             !== undefined && existing.sector             !== data.sector)             patch.sector             = data.sector
    if (data.tier               !== undefined && existing.tier               !== data.tier)               patch.tier               = data.tier
    if (data.funnelStage        !== undefined && existing.funnel_stage       !== data.funnelStage)        patch.funnelStage        = data.funnelStage
    if (data.hasDocx            !== undefined && existing.has_docx           !== data.hasDocx)            patch.hasDocx            = data.hasDocx
    if (data.sortOrder          !== undefined && String(existing.sort_order) !== String(data.sortOrder))  patch.sortOrder          = data.sortOrder
    if (Object.keys(patch).length > 0) {
      // If a combined PATCH fails, bisect: try each field individually so we can identify the bad one.
      const patchRes = await fetch(`${BASE}/resource/${existing.id}`, {
        method: 'PATCH',
        headers: auth,
        body: JSON.stringify(patch),
      })
      if (patchRes.ok) console.log(`Updated [${Object.keys(patch).join(', ')}]: ${data.title} (${existing.id})`)
      else {
        console.error(`  Bulk PATCH failed for [${Object.keys(patch).join(', ')}]:`, patchRes.status, await patchRes.text())
        console.error(`  Bisecting field-by-field...`)
        for (const key of Object.keys(patch)) {
          const singleRes = await fetch(`${BASE}/resource/${existing.id}`, {
            method: 'PATCH',
            headers: auth,
            body: JSON.stringify({ [key]: patch[key] }),
          })
          if (singleRes.ok) console.log(`    OK: ${key}`)
          else console.error(`    FAIL: ${key} (${singleRes.status}) ${(await singleRes.text()).slice(0,200)}`)
        }
      }
    } else {
      console.log(`Skip: ${data.title} (already exists, no changes, ${existing.id})`)
    }

    // Handle status transitions on existing resources. Status isn't part of
    // the regular PATCH set — the API uses separate /publish and /unpublish
    // endpoints. We compare seed → current and call the right one.
    if (data.status === 'published' && existing.status !== 'published') {
      const pubRes = await fetch(`${BASE}/resource/${existing.id}/publish`, { method: 'POST', headers: auth })
      if (pubRes.ok) console.log(`  → Published (was ${existing.status})`)
      else console.error(`  Publish failed:`, pubRes.status, await pubRes.text())
    } else if (data.status === 'draft' && existing.status === 'published') {
      const unpubRes = await fetch(`${BASE}/resource/${existing.id}/unpublish`, { method: 'POST', headers: auth })
      if (unpubRes.ok) console.log(`  → Unpublished (was published)`)
      else console.error(`  Unpublish failed:`, unpubRes.status, await unpubRes.text())
    }

    return existing.id
  }

  const payload = JSON.stringify(data)
  const res = await fetch(`${BASE}/resource`, { method: 'POST', headers: auth, body: payload })
  const result = await res.json()
  if (!res.ok) {
    console.error(`FAIL creating ${data.title}: HTTP ${res.status}`)
    console.error('  Response:', JSON.stringify(result, null, 2))
    console.error('  Payload size:', payload.length, 'bytes')
    console.error('  Payload keys:', Object.keys(data).join(', '))
    console.error('  markdownBody length:', (data.markdownBody || '').length)
    console.error('  description JSON snippet:', (data.description ? JSON.stringify(data.description).slice(0, 300) : '(none)'))
    return null
  }

  const id = result.data.id
  console.log(`Created: ${data.title} (${id})`)

  // Respect the seed `status` field. Only auto-publish when explicitly set to
  // 'published'. Drafts stay drafts so we can stage resources ahead of their
  // matching page going live.
  if (data.status === 'published') {
    const pubRes = await fetch(`${BASE}/resource/${id}/publish`, { method: 'POST', headers: auth })
    if (pubRes.ok) console.log(`  Published`)
    else console.error(`  Publish failed:`, await pubRes.text())
  } else {
    console.log(`  Left as draft (seed status: ${data.status || 'draft'})`)
  }

  return id
}

// ─── Placeholder: Prompt Library ────────────────────────────────

const promptLibrarySlug = 'prompt-library-for-professional-services'
const promptLibraryMd = await loadMarkdown(promptLibrarySlug)

await createResource({
  title: 'The Prompt Library for Professional Services',
  slug: promptLibrarySlug,
  summary: 'A working set of copy-paste prompts for law firms, accountancies and agencies. Client comms, document drafting and internal ops — every prompt used in real client work.',
  description: doc(
    p('Ten production-ready prompts across three categories — client communication, document and drafting, and internal operations — with a short guide on how to adapt each one for your firm.'),
    h2('What\'s inside'),
    ul(
      'A four-part framework for adapting any prompt (role, context, constraints, examples)',
      'Three client-comms prompts: inbound reply, status update, difficult-message draft',
      'Three document-drafting prompts: first-pass review, key-term extraction, file-note formalisation',
      'Four internal-ops prompts: standup digest, inbox triage, meeting-transcript actions, proposal drafting',
    ),
    h2('Who it\'s for'),
    p('Solicitors, accountants and agency leads who already use ChatGPT or Claude but want sharper, repeatable prompts that produce usable output the first time.'),
  ),
  markdownBody: promptLibraryMd || '',
  typesetClient: 'chris_garlick_dark',
  keywords: 'ai prompt library, chatgpt prompts for law firms, ai prompts for accountants, ai prompts for agencies, professional services ai prompts',
  secondaryKeywords: 'prompt engineering, business prompt templates, client communication prompts, document drafting ai, meeting notes ai, contract review prompts, inbox triage ai, status update email prompts, file note ai, proposal writing ai, uk legal ai prompts',
  sector: 'All',
  tier: '2',
  funnelStage: 'TOFU',
  hasDocx: 'no',
  sortOrder: 10,
  status: 'published',
})

// ─── LLM Cheat Sheet 2026 ───────────────────────────────────────

const llmCheatSheetSlug = 'llm-cheat-sheet-2026'
const llmCheatSheetMd = await loadMarkdown(llmCheatSheetSlug)

await createResource({
  title: 'The LLM Cheat Sheet 2026',
  slug: llmCheatSheetSlug,
  summary: 'Every LLM that matters for UK business in 2026 on one page. Closed-API frontier models and the open-source field that closed the gap. Price, strengths, gotchas, and when each one is the right pick.',
  description: doc(
    p('A single-document reference covering eight production LLMs side-by-side. Claude, GPT, Gemini and DeepSeek on the closed-API side. Llama 4, Qwen 3.5, Mistral Large 3 and Gemma 4 on the self-hosted open-source side. Every entry includes price, context window, what it\'s actually best at, and a one-line "pick when" for UK business buyers.'),
    h2('What\'s inside'),
    ul(
      'A 2026 pricing and capability table for every model worth shortlisting',
      'UK data-residency notes for each model (Azure UK, EU Vertex, native self-hosted)',
      'The DeepSeek question answered: vendor API vs self-hosted weights, and why one is safe and the other isn\'t',
      'An honest summary: when frontier API wins, when self-hosted wins, and the hybrid setup most serious teams actually run',
    ),
    h2('Who it\'s for'),
    p('UK business owners, technical directors and operations leads evaluating which LLM to standardise on, or whether to switch. Especially useful for legal, accountancy and agency firms weighing data-residency trade-offs.'),
  ),
  markdownBody: llmCheatSheetMd || '',
  typesetClient: 'chris-garlick-light',
  keywords: 'how to choose an llm, llm comparison 2026, claude vs gpt vs gemini, best llm for uk business, open source llm uk',
  secondaryKeywords: 'claude sonnet, claude opus, gpt comparison, gemini pro, gemini flash, deepseek, llama, qwen, mistral large, gemma, self hosted llm uk, llm pricing comparison, llm for law firms, llm for accountants, llm cost calculator, vendor lock in, gdpr llm uk',
  sector: 'All',
  tier: '2',
  funnelStage: 'TOFU',
  hasDocx: 'no',
  sortOrder: 20,
  status: 'published',
})

// ─── /for/ audience expansion resources (kept as drafts until their page ships) ───
//
// Each of these is created as a stub on day 1 so the resource collection has
// stable slugs to link to. Markdown body, full description and `status: 'draft'`
// → `'published'` happens on the day the matched /for/<slug> page ships. See
// `small_businesses_implementation.md` for the full sequence.

// Day 2: /for/agency-starters
const zeroTeamAgencySlug = 'zero-team-agency-playbook'
const zeroTeamAgencyMd = await loadMarkdown(zeroTeamAgencySlug)

await createResource({
  title: 'The Zero-Team Agency Playbook',
  slug: zeroTeamAgencySlug,
  summary: 'How to build an AI-enabled agency that ships like a five-person team without hiring one. Stack, workflows, pricing.',
  markdownBody: zeroTeamAgencyMd || '',
  typesetClient: 'chris-garlick-light',
  keywords: 'ai agency, solo agency uk, ai enabled agency, no team agency, ai agency stack',
  secondaryKeywords: 'agency automation, agency delivery stack, ai for marketing agency, productised agency, solo founder agency, agency cost reduction, agency client onboarding, ai cold outreach',
  sector: 'Agency',
  tier: '2',
  funnelStage: 'TOFU',
  hasDocx: 'no',
  sortOrder: 30,
  status: 'published',
})

// Day 3: /for/consultants
const oneFrameworkSlug = 'one-framework-six-months-of-content'
const oneFrameworkMd = await loadMarkdown(oneFrameworkSlug)

await createResource({
  title: 'One Framework, Six Months of Content',
  slug: oneFrameworkSlug,
  summary: 'How independent consultants turn a single methodology into half a year of inbound content. Blog, LinkedIn, short-form video, landing pages.',
  markdownBody: oneFrameworkMd || '',
  typesetClient: 'chris-garlick-light',
  keywords: 'consultant content marketing, productise consulting, thought leadership ai, consulting frameworks content',
  secondaryKeywords: 'independent consultant marketing, repurpose content, consulting authority, framework content, consulting lead generation, linkedin consulting, consulting blog ideas',
  sector: 'All',
  tier: '2',
  funnelStage: 'TOFU',
  hasDocx: 'no',
  sortOrder: 40,
  status: 'draft',
})

// Day 4: /for/freelancers
const freelancerProposalSlug = 'freelancers-ai-proposal-pack'
const freelancerProposalMd = await loadMarkdown(freelancerProposalSlug)

await createResource({
  title: 'The Freelancer\'s AI Proposal Pack',
  slug: freelancerProposalSlug,
  summary: 'Win more clients, write less. Proposal templates, brief-to-proposal prompts, and the AI onboarding sequence I use with my own clients.',
  markdownBody: freelancerProposalMd || '',
  typesetClient: 'chris-garlick-light',
  keywords: 'freelancer proposal template, ai proposal writing, freelance ai tools, freelancer onboarding',
  secondaryKeywords: 'freelance scaling, freelance ai workflow, project proposal template uk, freelancer client onboarding, freelance productivity ai, freelance pricing, freelance contract template',
  sector: 'All',
  tier: '2',
  funnelStage: 'TOFU',
  hasDocx: 'no',
  sortOrder: 50,
  status: 'draft',
})

// Day 5: /for/solo-operators
const soloAiStackSlug = 'ai-stack-under-two-hours-a-day'
const soloAiStackMd = await loadMarkdown(soloAiStackSlug)

await createResource({
  title: 'The Solo Operator AI Stack',
  slug: soloAiStackSlug,
  summary: 'The exact tools and workflows for running a one-person business in under two hours of admin a day. Voice-note to content, automated reviews, monthly SEO post.',
  markdownBody: soloAiStackMd || '',
  typesetClient: 'chris-garlick-light',
  keywords: 'solo operator ai, one person business ai, solopreneur ai stack, small business automation uk',
  secondaryKeywords: 'sole trader ai, ai for one person business, voice note to content, automated review requests, monthly seo blog ai, solo business productivity',
  sector: 'All',
  tier: '2',
  funnelStage: 'TOFU',
  hasDocx: 'no',
  sortOrder: 60,
  status: 'draft',
})

// Day 6: /for/tradespeople
const tradesToolsSlug = '5-ai-tools-tradespeople-2026'
const tradesToolsMd = await loadMarkdown(tradesToolsSlug)

await createResource({
  title: '5 AI Tools Every Tradesperson Should Use in 2026',
  slug: tradesToolsSlug,
  summary: 'No marketing agency. No copywriter. The five tools that handle posting, follow-ups, Google reviews and seasonal campaigns from your phone.',
  markdownBody: tradesToolsMd || '',
  typesetClient: 'chris-garlick-light',
  keywords: 'ai tools for tradespeople, ai for trades uk, plumber marketing ai, electrician marketing ai, builder marketing ai',
  secondaryKeywords: 'checkatrade marketing, trades google business posts, trades before after video, automated quote follow up, trades local seo, trades google reviews, trades phone marketing',
  sector: 'All',
  tier: '2',
  funnelStage: 'TOFU',
  hasDocx: 'no',
  sortOrder: 70,
  status: 'draft',
})

console.log('Done. Run `cms build` or redeploy to surface the resource on the static site.')
