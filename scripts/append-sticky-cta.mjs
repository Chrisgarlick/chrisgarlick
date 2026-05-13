/**
 * Append the standardised sticky CTA to every article body (pivot §5.3).
 *
 * Format (inline in TipTap):
 *   <hr>
 *   **Want to find out which tasks on your site are costing you the most time?**
 *   [Run a free audit →]   [Book a 30-min call →]
 *
 * Idempotent: checks for the unique question string before appending.
 *
 * Run: JWT_TOKEN=<token> bun scripts/append-sticky-cta.mjs
 */

const JWT = process.env.JWT_TOKEN
const BASE = process.env.CMS_API_BASE || 'https://chrisgarlick.com/api'
if (!JWT) { console.error('Set JWT_TOKEN'); process.exit(1) }
const auth = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${JWT}` }

const STICKY_QUESTION = 'Want to find out which tasks on your site are costing you the most time?'

const ARTICLE_IDS = [
  '2a88f309-fb78-4bde-99c8-577b4607cf0b',  // agency-workflows-automate-first
  'b5ed556e-ef80-4a77-b145-ecda17ca87c8',  // ai-adoption-disappointment
  '4a998bab-7dff-4c7c-90b8-d07fc02b5f73',  // the-ai-implementation-playbook
  '5707eea1-2b89-428a-bee5-01f93d0e77d5',  // why-79-of-enterprises-are-failing
  '0b11362d-7a4c-44a6-8db7-f394ed14031b',  // 51-of-code-on-github-is-ai-generated
  'd354f83f-8159-4db4-a95f-16642e77be53',  // what-ai-implementation-means-law-firm
  '14a7daf5-6fe2-4a6e-9365-6b63e74ffd20',  // automate-client-intake-without-custom-software
  '000e9df5-04db-4a2c-8352-64a11c805c82',  // replacing-manual-data-entry-with-ai-agents
]

const t    = (text) => ({ type: 'text', text })
const bold = (text) => ({ type: 'text', text, marks: [{ type: 'bold' }] })
const link = (text, href) => ({ type: 'text', text, marks: [{ type: 'link', attrs: { href, target: null } }] })
const p    = (...parts) => ({ type: 'paragraph', content: parts })
const hr   = () => ({ type: 'horizontalRule' })

function stickyCtaNodes() {
  return [
    hr(),
    p(bold(STICKY_QUESTION)),
    p(
      link('Run a free audit →', '/tools/site-audit'),
      t('   ·   '),
      link('Book a 30-min call →', '/contact'),
    ),
  ]
}

function bodyHasSticky(body) {
  return JSON.stringify(body || {}).includes(STICKY_QUESTION)
}

const parse = (x) => typeof x === 'string' ? JSON.parse(x) : x

for (const articleId of ARTICLE_IDS) {
  const r = await fetch(`${BASE}/article/${articleId}`, { headers: auth })
  if (!r.ok) { console.log(`  ${articleId} — fetch failed (${r.status}), skip`); continue }
  const article = (await r.json()).data
  const body = parse(article.body)
  if (!body || !Array.isArray(body.content)) { console.log(`  ${article.slug} — no body, skip`); continue }

  if (bodyHasSticky(body)) {
    console.log(`  ${article.slug} — already has sticky CTA, skip`)
    continue
  }

  const newBody = { ...body, content: [...body.content, ...stickyCtaNodes()] }
  const patchRes = await fetch(`${BASE}/article/${article.id}`, {
    method: 'PATCH',
    headers: auth,
    body: JSON.stringify({ body: newBody }),
  })
  if (patchRes.ok) console.log(`  ✓ ${article.slug}`)
  else console.error(`  ✗ ${article.slug} — HTTP ${patchRes.status}`)
}
