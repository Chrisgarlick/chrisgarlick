/**
 * Strip em-dashes (both `&mdash;` HTML entities and `—` Unicode) from every CMS record I've
 * authored, per CLAUDE.md brand voice rules.
 *
 * Replacement: ', ' — preserves meaning in most cases. Hand-edit anything that reads weird.
 *
 * Run: JWT_TOKEN=<token> bun scripts/strip-emdashes.mjs
 */

const JWT = process.env.JWT_TOKEN
const BASE = process.env.CMS_API_BASE || 'https://chrisgarlick.com/api'
if (!JWT) { console.error('Set JWT_TOKEN'); process.exit(1) }
const auth = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${JWT}` }

// Records to sweep. Slugs only — IDs are looked up.
const TARGETS = {
  page: [
    'home',
    'services',
    'ai-implementation',
    'workflow-automation',
    'ai-agents',
    'data-extraction',
    'ai-for-law-firms',
    'ai-for-accountancy-firms',
    'ai-for-agencies',
    'about',
    'contact',
  ],
  article: [
    'automate-client-intake-without-custom-software',
    'replacing-manual-data-entry-with-ai-agents',
  ],
  resource: [
    'prompt-library-for-professional-services',
  ],
}

// Match optional surrounding whitespace so we replace " &mdash; " with ", " (not ",  ")
const EMDASH_RE = /\s*(?:&mdash;|—)\s*/g

function cleanString(s) {
  if (typeof s !== 'string') return s
  return s.replace(EMDASH_RE, ', ')
}

function walk(node) {
  if (Array.isArray(node)) return node.map(walk)
  if (node && typeof node === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(node)) {
      // Only rewrite string fields. Leave keys alone.
      if (typeof v === 'string') out[k] = cleanString(v)
      else out[k] = walk(v)
    }
    return out
  }
  return node
}

async function fetchRecord(collection, slug) {
  const r = await fetch(`${BASE}/${collection}/slug/${slug}`, { headers: auth })
  if (r.status === 404 || !r.ok) return null
  return (await r.json()).data || null
}

async function sweep(collection, slug) {
  const record = await fetchRecord(collection, slug)
  if (!record) { console.log(`  Skip ${collection}/${slug} (not found)`); return }

  // Parse string-encoded content/body where applicable
  let content = record.content
  let body = record.body
  const description = record.description
  const summary = record.summary
  const excerpt = record.excerpt
  const seo = record.seo
  const markdownBody = record.markdown_body

  const parse = (x) => typeof x === 'string' ? JSON.parse(x) : x
  const before = JSON.stringify({ content, body, description, summary, excerpt, seo, markdownBody })

  const patch = {}
  if (content !== undefined && content !== null) patch.content = walk(parse(content))
  if (body !== undefined && body !== null) patch.body = walk(parse(body))
  if (description !== undefined && description !== null) patch.description = walk(parse(description))
  if (typeof summary === 'string') patch.summary = cleanString(summary)
  if (typeof excerpt === 'string') patch.excerpt = cleanString(excerpt)
  if (seo && typeof seo === 'object') patch.seo = walk(seo)
  if (typeof markdownBody === 'string') patch.markdownBody = cleanString(markdownBody)

  const after = JSON.stringify(patch)
  if (after === '{}') { console.log(`  No fields to update ${collection}/${slug}`); return }

  // Quick check: did anything actually change?
  const beforeNorm = before.replace(/\\u2014|&mdash;|—/g, 'X')
  const afterNorm = after.replace(/\\u2014|&mdash;|—/g, 'X')
  if (beforeNorm === afterNorm && !before.includes('&mdash;') && !before.includes('—')) {
    console.log(`  Clean ${collection}/${slug} (no em-dashes found)`)
    return
  }

  const r = await fetch(`${BASE}/${collection}/${record.id}`, {
    method: 'PATCH',
    headers: auth,
    body: JSON.stringify(patch),
  })
  if (r.ok) console.log(`  ✓ Cleaned ${collection}/${slug}`)
  else console.error(`  ✗ ${collection}/${slug} — HTTP ${r.status}: ${await r.text()}`)
}

console.log('Sweeping em-dashes from all authored CMS content…\n')

console.log('Pages:')
for (const slug of TARGETS.page) await sweep('page', slug)

console.log('\nArticles:')
for (const slug of TARGETS.article) await sweep('article', slug)

console.log('\nResources:')
for (const slug of TARGETS.resource) await sweep('resource', slug)

console.log('\nDone.')
