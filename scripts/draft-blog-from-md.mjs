/**
 * Push a markdown blog post (with frontmatter) into Kritano as a DRAFT article.
 *
 * Run: JWT_TOKEN=<token> bun scripts/draft-blog-from-md.mjs docs/trend/2026-05-15-data-extraction-uk-guide/blog.md
 *
 * Supports a small markdown subset that matches what /trend blogs produce:
 *   - # / ## / ### headings
 *   - paragraphs with **bold**, *italic*, and [link](url) inline
 *   - - bullet lists
 *   - --- thematic breaks (rendered as TipTap horizontal rule)
 *   - HTML comments stripped
 */

import fs from 'node:fs'
import path from 'node:path'

const JWT = process.env.JWT_TOKEN
const BASE = process.env.CMS_API_BASE || 'https://chrisgarlick.com/api'
if (!JWT) { console.error('Set JWT_TOKEN'); process.exit(1) }

const auth = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${JWT}` }

const mdPath = process.argv[2]
if (!mdPath) { console.error('Usage: draft-blog-from-md.mjs <path-to-blog.md>'); process.exit(1) }
const raw = fs.readFileSync(path.resolve(mdPath), 'utf8')

// ─── frontmatter parser ────────────────────────────────────────────────────
function parseFrontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!m) return { meta: {}, body: text }
  const metaText = m[1]
  const body = m[2]
  const meta = {}
  const lines = metaText.split('\n')
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    const kv = line.match(/^([a-zA-Z_]+):\s*(.*)$/)
    if (kv) {
      const key = kv[1]
      let val = kv[2].trim()
      // Array (next lines starting with `  - `)
      if (val === '') {
        const arr = []
        while (i + 1 < lines.length && lines[i+1].match(/^\s*-\s+/)) {
          arr.push(lines[++i].replace(/^\s*-\s+/, '').replace(/^"(.*)"$/, '$1'))
        }
        meta[key] = arr
      } else {
        meta[key] = val.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1')
        if (val === 'true') meta[key] = true
        if (val === 'false') meta[key] = false
      }
    }
    i++
  }
  return { meta, body }
}

// ─── markdown -> tiptap ────────────────────────────────────────────────────
// Inline parser: handles **bold**, *italic*, [text](href). Returns array of text nodes.
function parseInline(text) {
  const nodes = []
  // Tokenise greedily by scanning for bold, italic, link
  let i = 0
  let buffer = ''
  const flushBuffer = (marks) => {
    if (buffer.length === 0) return
    const node = { type: 'text', text: buffer }
    if (marks && marks.length) node.marks = marks
    nodes.push(node)
    buffer = ''
  }
  while (i < text.length) {
    // Link: [text](href)
    const linkMatch = text.slice(i).match(/^\[([^\]]+)\]\(([^)]+)\)/)
    if (linkMatch) {
      flushBuffer()
      nodes.push({ type: 'text', text: linkMatch[1], marks: [{ type: 'link', attrs: { href: linkMatch[2], target: null } }] })
      i += linkMatch[0].length
      continue
    }
    // Bold: **text**
    if (text.slice(i, i+2) === '**') {
      const end = text.indexOf('**', i+2)
      if (end > -1) {
        flushBuffer()
        nodes.push({ type: 'text', text: text.slice(i+2, end), marks: [{ type: 'bold' }] })
        i = end + 2
        continue
      }
    }
    // Italic: *text*  (single asterisk, only if surrounded by word boundaries)
    if (text[i] === '*' && text[i-1] !== '*' && text[i+1] !== '*') {
      const end = text.indexOf('*', i+1)
      if (end > -1 && text[end+1] !== '*') {
        flushBuffer()
        nodes.push({ type: 'text', text: text.slice(i+1, end), marks: [{ type: 'italic' }] })
        i = end + 1
        continue
      }
    }
    buffer += text[i]
    i++
  }
  flushBuffer()
  return nodes
}

function parseBody(md) {
  // Strip HTML comments
  md = md.replace(/<!--[\s\S]*?-->/g, '')
  const blocks = []
  const lines = md.split('\n')
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    // Skip blank
    if (line.trim() === '') { i++; continue }

    // Headings
    let m = line.match(/^(#+)\s+(.*)$/)
    if (m) {
      const level = m[1].length
      if (level === 1) { i++; continue } // H1 is the post title, skip
      blocks.push({ type: 'heading', attrs: { level: Math.min(level, 4) }, content: parseInline(m[2]) })
      i++; continue
    }

    // Thematic break
    if (line.trim() === '---') {
      blocks.push({ type: 'horizontalRule' })
      i++; continue
    }

    // Bullet list (consume contiguous `- ` lines)
    if (line.match(/^-\s+/)) {
      const items = []
      while (i < lines.length && lines[i].match(/^-\s+/)) {
        const itemText = lines[i].replace(/^-\s+/, '')
        items.push({ type: 'listItem', content: [{ type: 'paragraph', content: parseInline(itemText) }] })
        i++
      }
      blocks.push({ type: 'bulletList', content: items })
      continue
    }

    // Paragraph (consume contiguous non-blank, non-heading, non-bullet lines)
    const paraLines = []
    while (i < lines.length && lines[i].trim() !== '' && !lines[i].match(/^#/) && !lines[i].match(/^-\s/) && lines[i].trim() !== '---') {
      paraLines.push(lines[i])
      i++
    }
    if (paraLines.length > 0) {
      blocks.push({ type: 'paragraph', content: parseInline(paraLines.join(' ')) })
    }
  }
  return { type: 'doc', content: blocks }
}

// ─── execute ───────────────────────────────────────────────────────────────
const { meta, body: mdBody } = parseFrontmatter(raw)
const tiptap = parseBody(mdBody)

console.log(`Posting "${meta.title}" as DRAFT...`)
console.log(`Slug: ${meta.slug}`)
console.log(`Body blocks: ${tiptap.content.length}`)

const STATUS = process.env.STATUS || 'draft'

const payload = {
  title: meta.title,
  slug: meta.slug,
  body: tiptap,
  excerpt: meta.description,
  status: STATUS,
  seo: {
    metaTitle: meta.title,
    metaDescription: meta.description,
    focusKeyword: meta.keyword,
    secondaryKeywords: Array.isArray(meta.secondary_keywords) ? meta.secondary_keywords.join(', ') : (meta.secondary_keywords || ''),
    ogType: 'article',
    ogTitle: meta.title,
    ogDescription: meta.description,
  },
}

const res = await fetch(`${BASE}/article`, {
  method: 'POST',
  headers: auth,
  body: JSON.stringify(payload),
})
if (!res.ok) {
  const err = await res.text()
  console.error(`HTTP ${res.status}: ${err.slice(0, 500)}`)
  process.exit(1)
}
const data = await res.json()
const newId = data.data.id
console.log(`\n✓ Article created (${newId})`)
console.log(`  Slug: ${data.data.slug}`)
console.log(`  Status (as returned): ${data.data.status}`)

// Kritano typically ignores `status` on POST and creates as draft. Call the
// explicit publish endpoint if the caller asked for publish.
if (STATUS === 'published') {
  const pub = await fetch(`${BASE}/article/${newId}/publish`, { method: 'POST', headers: auth })
  if (pub.ok) console.log('  ✓ Published via /publish endpoint')
  else console.error(`  ✗ Publish endpoint failed: HTTP ${pub.status}`)
}
console.log(`  Admin URL: https://chrisgarlick.com/admin/article/${newId}`)
console.log(`  Live URL (after build): https://chrisgarlick.com/article/${data.data.slug}`)
