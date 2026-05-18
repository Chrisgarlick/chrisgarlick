/**
 * Apply alternating light/dark themes to every block on every CMS page.
 *
 * Pattern: block 0 = light (heroes always light), then strict alternation.
 *   index  0  1  2  3  4  5  6  7  8  9
 *   theme  L  D  L  D  L  D  L  D  L  D
 *
 * Idempotent. Re-running produces the same result.
 *
 * Run: JWT_TOKEN=<token> bun scripts/alternate-themes.mjs
 */

const JWT = process.env.JWT_TOKEN
const BASE = process.env.CMS_API_BASE || 'https://chrisgarlick.com/api'
if (!JWT) { console.error('Set JWT_TOKEN'); process.exit(1) }
const auth = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${JWT}` }

const parse = (x) => typeof x === 'string' ? JSON.parse(x) : x

const list = await fetch(`${BASE}/page?limit=200`, { headers: auth }).then((r) => r.json())
if (!list.data) { console.error('No pages returned'); process.exit(1) }

console.log(`Found ${list.data.length} pages. Applying alternating themes…\n`)

for (const page of list.data) {
  const content = parse(page.content)
  if (!Array.isArray(content) || content.length === 0) {
    console.log(`  ${page.slug} — no blocks, skip`)
    continue
  }

  const updated = content.map((block, i) => {
    // Heroes (always at index 0 for our pages) stay light.
    const theme = i === 0 ? 'light' : (i % 2 === 1 ? 'dark' : 'light')
    return {
      ...block,
      fields: { ...block.fields, theme },
    }
  })

  const res = await fetch(`${BASE}/page/${page.id}`, {
    method: 'PATCH',
    headers: auth,
    body: JSON.stringify({ content: updated }),
  })
  if (res.ok) {
    const rhythm = updated.map((b) => b.fields.theme === 'dark' ? 'D' : 'L').join('')
    console.log(`  ✓ ${page.slug.padEnd(28)}  ${rhythm}`)
  } else {
    const err = await res.text().catch(() => '')
    console.error(`  ✗ ${page.slug} — HTTP ${res.status}: ${err.slice(0, 150)}`)
  }
}

console.log('\nDone.')
