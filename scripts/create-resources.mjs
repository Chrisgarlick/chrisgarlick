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
function bold(text) { return { type: 'text', text, marks: [{ type: 'bold' }] } }
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
    // Update markdownBody (the most likely change between seed runs); leave other fields intact.
    if (data.markdownBody && existing.markdownBody !== data.markdownBody) {
      const patchRes = await fetch(`${BASE}/resource/${existing.id}`, {
        method: 'PATCH',
        headers: auth,
        body: JSON.stringify({ markdownBody: data.markdownBody }),
      })
      if (patchRes.ok) console.log(`Updated markdownBody: ${data.title} (${existing.id})`)
      else console.error(`  Update failed:`, patchRes.status, await patchRes.text())
    } else {
      console.log(`Skip: ${data.title} (already exists, ${existing.id})`)
    }
    return existing.id
  }

  const res = await fetch(`${BASE}/resource`, { method: 'POST', headers: auth, body: JSON.stringify(data) })
  const result = await res.json()
  if (!res.ok) { console.error(`FAIL creating ${data.title}:`, result); return null }

  const id = result.data.id
  console.log(`Created: ${data.title} (${id})`)

  const pubRes = await fetch(`${BASE}/resource/${id}/publish`, { method: 'POST', headers: auth })
  if (pubRes.ok) console.log(`  Published`)
  else console.error(`  Publish failed:`, await pubRes.text())

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
  sector: 'All',
  tier: '2',
  funnelStage: 'TOFU',
  hasDocx: 'no',
  sortOrder: 10,
  status: 'draft',
})

console.log('Done. Run `cms build` or redeploy to surface the resource on the static site.')
