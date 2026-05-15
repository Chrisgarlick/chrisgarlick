/**
 * SEO pass for the new + recently-refactored pages:
 *   - industries (landing)
 *   - ai-engineering (new service)
 *   - ai-for-law-firms, ai-for-accountancy-firms, ai-for-agencies (moved to /industries)
 *
 * Targets strong UK ranking. Each metaTitle stays under ~70 chars, metaDescription
 * under ~165. Secondary keywords lean UK-locational. Robots/Twitter card defaults
 * set everywhere they were missing.
 *
 * Idempotent.
 *
 * Run: JWT_TOKEN=<token> bun scripts/seo-pass-industries-engineering.mjs
 */

const JWT = process.env.JWT_TOKEN
const BASE = process.env.CMS_API_BASE || 'https://chrisgarlick.com/api'
if (!JWT) { console.error('Set JWT_TOKEN'); process.exit(1) }
const auth = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${JWT}` }

const UPDATES = {
  industries: {
    metaTitle: 'Industry-Specific AI Implementation UK | Chris Garlick',
    metaDescription: 'Vertical AI implementation for UK law firms, accountancy practices and creative agencies. Contract extraction, statement parsing, brief processing. Solo developer, fixed pricing, free site audit.',
    focusKeyword: 'industry-specific AI UK',
    secondaryKeywords: 'vertical AI UK, AI for UK businesses, AI implementation UK, AI consultant UK, AI for professional services UK, AI for law firms UK, AI for accountancy UK, AI for agencies UK, UK AI engineer, AI specialist United Kingdom, England Scotland Wales Northern Ireland AI',
    ogType: 'website',
    ogTitle: 'Industry-Specific AI Implementation UK',
    ogDescription: 'Vertical AI builds for UK law firms, accountancy and agencies. Pick your industry.',
    twitterCard: 'summary_large_image',
    robotsIndex: 'index',
    robotsFollow: 'follow',
  },

  'ai-engineering': {
    metaTitle: 'AI Engineering UK: Model Selection, RAG, Private AI | Chris Garlick',
    metaDescription: 'AI engineering for UK businesses. Model selection across Claude, GPT, Llama, Mistral. RAG with pgvector and Qdrant. Private on-premises AI with Ollama. Beyond prompt-writing.',
    focusKeyword: 'AI engineer UK',
    secondaryKeywords: 'AI engineering UK, RAG implementation UK, retrieval augmented generation UK, private AI UK, on-premises AI UK, Ollama implementation UK, vector database UK, AI model selection, pgvector consultant, Qdrant developer UK, UK AI engineer, Claude API developer UK, LLM engineer UK, AI infrastructure UK, local LLM UK',
    ogType: 'website',
    ogTitle: 'AI Engineering UK | Chris Garlick',
    ogDescription: 'Model selection, RAG, private AI. The technical depth behind AI implementation.',
    twitterCard: 'summary_large_image',
    robotsIndex: 'index',
    robotsFollow: 'follow',
  },

  'ai-for-law-firms': {
    metaTitle: 'AI for UK Law Firms | Contract & Intake Automation | Chris Garlick',
    metaDescription: 'AI implementation for UK law firms. Contract data extraction, first-pass review, client intake automation, matter summarisation. Integrates with Clio, iManage and Microsoft 365.',
    focusKeyword: 'AI for law firms UK',
    secondaryKeywords: 'AI for solicitors UK, AI for UK barristers, legal AI implementation UK, AI contract review UK, AI for conveyancers UK, AI for family law firms, AI for commercial law UK, law firm automation UK, SRA-aware AI, AI for English law firms, AI for Scottish law firms, AI legal practice UK, AI for London law firms, AI for Manchester law firms, AI for Birmingham law firms, AI for Edinburgh law firms',
    ogType: 'website',
    ogTitle: 'AI for UK Law Firms',
    ogDescription: 'Contract review, intake automation, matter summarisation. Built for UK solicitors and law firms.',
    twitterCard: 'summary_large_image',
    robotsIndex: 'index',
    robotsFollow: 'follow',
  },

  'ai-for-accountancy-firms': {
    metaTitle: 'AI for UK Accountants | Reporting & Statement Parsing | Chris Garlick',
    metaDescription: 'AI implementation for UK accountancy practices. Statement parsing, MTD-aligned reporting, client onboarding, narrative drafting. Integrates with Xero, QuickBooks, Sage and FreeAgent.',
    focusKeyword: 'AI for accountants UK',
    secondaryKeywords: 'AI for accountancy firms UK, AI for UK accountancy practices, AI bookkeeping UK, AI statement parsing UK, AI for Xero UK, AI for QuickBooks UK, AI for Sage UK, MTD automation, ICAEW AI, AI for chartered accountants UK, accountancy practice automation, AI for UK CPA firms, AI for London accountants, AI for Manchester accountants, AI for Birmingham accountants',
    ogType: 'website',
    ogTitle: 'AI for UK Accountants',
    ogDescription: 'Statement parsing, reporting, onboarding. Built for UK accountancy practices on Xero, QuickBooks and Sage.',
    twitterCard: 'summary_large_image',
    robotsIndex: 'index',
    robotsFollow: 'follow',
  },

  'ai-for-agencies': {
    metaTitle: 'AI for UK Agencies | Brief Processing & Client Reporting | Chris Garlick',
    metaDescription: 'AI implementation for UK marketing, design and content agencies. Brief processing, client reporting, status updates, competitor research. Integrates with Notion, ClickUp, Asana and Slack.',
    focusKeyword: 'AI for marketing agencies UK',
    secondaryKeywords: 'AI for UK creative agencies, AI for UK digital agencies, AI for content agencies UK, AI for SEO agencies UK, agency automation UK, AI brief processing UK, AI client reporting UK, AI competitor research, AI for London agencies, AI for Manchester agencies, AI for Bristol agencies, AI for UK PR agencies, AI for marketing operations UK, AI for design agencies UK',
    ogType: 'website',
    ogTitle: 'AI for UK Marketing Agencies',
    ogDescription: 'Brief processing, client reporting, competitor research. Built for UK creative, digital and content agencies.',
    twitterCard: 'summary_large_image',
    robotsIndex: 'index',
    robotsFollow: 'follow',
  },
}

// ── fetch + patch ───────────────────────────────────────────────────────────
async function getPageBySlug(slug) {
  // CMS API ignores complex where-clauses on /page list — fetch all and filter.
  const res = await fetch(`${BASE}/page?limit=200`, { headers: auth })
  if (!res.ok) throw new Error(`Fetch list failed: HTTP ${res.status}`)
  const json = await res.json()
  return (json.data || []).find((p) => p.slug === slug) || null
}

// Common questions block to append to the AI Engineering page so the visible content
// matches the FAQ schema in src/pages/services/[slug].astro (Google requires both).
const AI_ENGINEERING_FAQ_BLOCK = {
  type: 'text-section',
  fields: {
    label: 'Common questions',
    heading: 'What people actually want to know.',
    body: {
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Is AI engineering different from AI implementation?' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'AI implementation is the outcome. Scope, build, deliver a working system that replaces manual work. AI engineering is the craft you bring to that project beyond writing prompts. Choosing models, designing retrieval, evaluating outputs, instrumenting failure modes. The two travel together. You cannot have a reliable implementation without the engineering depth.' }] },
        { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Why do most of your builds use Claude?' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Claude Sonnet currently leads on the kind of work most clients need: nuanced reasoning over real documents, reliable tool use, instruction-following without rambling. GPT is competitive on a few specific tasks like very long-context exact match. Open-weight models are gaining fast but mostly have not caught up on tool use and structured output yet. Model choice gets revisited at scoping every project. If a different model wins on cost or quality for your workload, that is what gets built.' }] },
        { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Can you run AI on our own servers?' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Yes, with caveats. The standard stack for on-premises is Ollama for smaller deployments and vLLM for larger ones, running open-weight models from the Llama, Mistral, Qwen or Gemma families. I have used Ollama with Gemma locally for prototyping. I have not deployed an on-premises model to production yet. For most builds the answer is a managed-cloud API with a properly scoped data-processing agreement and zero-retention mode rather than self-hosted. Where compliance genuinely requires self-hosted, the stack above is the plan.' }] },
        { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'What is RAG and do I need it?' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Retrieval-augmented generation. Instead of relying on what the model learned at training time, you give the model your documents at query time. The model still does the language work. A search system finds the relevant chunks first. You need it whenever the right answer is in your data rather than the model\'s training data. Internal knowledge bases, policy lookup, contract Q&A, document search at scale.' }] },
        { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'How long does an AI engineering build take?' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Most engineering-heavy builds run four to eight weeks. The first week is scoping and stack selection. The next two to four weeks are the build. The last week or two is evaluation, observability setup and handover. Smaller targeted engagements like a single workflow or single model integration can run two to four weeks total.' }] },
      ],
    },
  },
}

const FAQ_QUESTION_MARKER = 'Is AI engineering different from AI implementation?'

const parseContent = (x) => typeof x === 'string' ? JSON.parse(x) : x

const pages = await fetch(`${BASE}/page?limit=200`, { headers: auth }).then((r) => r.json()).then((j) => j.data)

console.log('Updating SEO metadata...')
for (const [slug, seo] of Object.entries(UPDATES)) {
  const page = pages.find((p) => p.slug === slug)
  if (!page) { console.log(`  ${slug} — not found, skip`); continue }

  // Merge: don't clobber any existing SEO fields not in our payload.
  const merged = { ...(page.seo || {}), ...seo }
  const res = await fetch(`${BASE}/page/${page.id}`, {
    method: 'PATCH',
    headers: auth,
    body: JSON.stringify({ seo: merged }),
  })
  if (res.ok) {
    console.log(`  ✓ ${slug}`)
  } else {
    const err = await res.text().catch(() => '')
    console.error(`  ✗ ${slug} — HTTP ${res.status}: ${err.slice(0, 200)}`)
  }
}

console.log('\nAdding FAQ block to ai-engineering (idempotent)...')
const aiEng = pages.find((p) => p.slug === 'ai-engineering')
if (aiEng) {
  const content = parseContent(aiEng.content)
  if (JSON.stringify(content).includes(FAQ_QUESTION_MARKER)) {
    console.log('  ai-engineering — FAQ block already present, skip')
  } else {
    // Insert FAQ before the final CTA block (which is the last item).
    const lastIdx = content.length - 1
    const newContent = [...content.slice(0, lastIdx), AI_ENGINEERING_FAQ_BLOCK, ...content.slice(lastIdx)]
    const res = await fetch(`${BASE}/page/${aiEng.id}`, {
      method: 'PATCH',
      headers: auth,
      body: JSON.stringify({ content: newContent }),
    })
    if (res.ok) console.log('  ✓ FAQ block added to ai-engineering')
    else {
      const err = await res.text().catch(() => '')
      console.error(`  ✗ FAQ block patch failed — HTTP ${res.status}: ${err.slice(0, 200)}`)
    }
  }
}

console.log('\nDone.')
