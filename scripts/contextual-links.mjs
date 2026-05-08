/**
 * Add contextual inline links to existing body text across all articles and pages.
 * Also removes any "Further Reading" sections previously added.
 *
 * Run: JWT_TOKEN=<token> node scripts/contextual-links.mjs
 */

const JWT = process.env.JWT_TOKEN
const BASE = 'https://chrisgarlick.com/api'
if (!JWT) { console.error('Set JWT_TOKEN'); process.exit(1) }

const headers = { 'Authorization': `Bearer ${JWT}` }
const jsonHeaders = { ...headers, 'Content-Type': 'application/json' }

async function get(path) {
  const r = await fetch(`${BASE}${path}`, { headers })
  if (!r.ok) return null
  return (await r.json()).data
}

async function patch(path, data) {
  const r = await fetch(`${BASE}${path}`, { method: 'PATCH', headers: jsonHeaders, body: JSON.stringify(data) })
  return r.ok
}

// ─── Link rules: phrase → URL (only link each URL once per page) ──

const LINK_RULES = [
  // Service pages
  { phrase: 'AI systems for law firms', href: '/services/ai-for-law-firms' },
  { phrase: 'law firms', href: '/services/ai-for-law-firms' },
  { phrase: 'law firm', href: '/services/ai-for-law-firms' },
  { phrase: 'agencies', href: '/services/ai-for-agencies' },
  { phrase: 'agency', href: '/services/ai-for-agencies' },
  { phrase: 'accountancy firms', href: '/services/ai-for-accountancy-firms' },
  { phrase: 'accountancy practice', href: '/services/ai-for-accountancy-firms' },
  { phrase: 'implementation problem', href: '/services/ai-implementation' },
  { phrase: 'AI integration', href: '/services/ai-implementation' },
  { phrase: 'AI implementation', href: '/services/ai-implementation' },
  { phrase: 'workflow automation', href: '/services/ai-implementation' },

  // Articles - specific phrases that appear in the text
  { phrase: 'document drafting', href: '/article/what-ai-implementation-means-law-firm' },
  { phrase: 'client intake', href: '/article/what-ai-implementation-means-law-firm' },
  { phrase: 'compliance prep', href: '/article/what-ai-implementation-means-law-firm' },
  { phrase: 'templated documents', href: '/article/what-ai-implementation-means-law-firm' },
  { phrase: 'reporting pipeline', href: '/article/agency-workflows-automate-first' },
  { phrase: 'content production', href: '/article/agency-workflows-automate-first' },
  { phrase: 'client onboarding', href: '/article/agency-workflows-automate-first' },
  { phrase: 'Zapier', href: '/article/agency-workflows-automate-first' },
  { phrase: '79% of enterprises', href: '/article/why-79-of-enterprises-are-failing-at-ai-adoption' },
  { phrase: 'pilot mode', href: '/article/why-79-of-enterprises-are-failing-at-ai-adoption' },
  { phrase: 'AI adoption', href: '/article/why-79-of-enterprises-are-failing-at-ai-adoption' },
  { phrase: '48% of enterprises', href: '/article/ai-adoption-disappointment-why-companies-fail' },
  { phrase: 'AI coding tools', href: '/article/51-of-code-on-github-is-ai-generated-that-should-worry-you' },
  { phrase: 'AI-generated code', href: '/article/51-of-code-on-github-is-ai-generated-that-should-worry-you' },

  // Cross-links
  { phrase: 'get in touch', href: '/contact' },
  { phrase: 'site audit', href: '/tools/site-audit' },
]

/**
 * Process a TipTap doc: find phrases in text nodes and convert them to links.
 * Only links each URL once per document to avoid over-linking.
 */
function addLinksToDoc(doc, skipHref) {
  if (!doc?.content) return { doc, count: 0 }

  const usedHrefs = new Set()
  if (skipHref) usedHrefs.add(skipHref) // Don't link to self
  let count = 0

  // Remove any "Further Reading" sections we previously added
  const cleaned = []
  let skipUntilHr = false
  for (let i = 0; i < doc.content.length; i++) {
    const node = doc.content[i]

    // Detect our previously added "Further Reading" heading
    if (node.type === 'heading' && node.content?.[0]?.text === 'Further Reading') {
      // Skip this heading and everything until the next horizontalRule
      skipUntilHr = true
      // Also remove the preceding hr if it was ours
      if (cleaned.length > 0 && cleaned[cleaned.length - 1].type === 'horizontalRule') {
        cleaned.pop()
      }
      continue
    }
    if (skipUntilHr) {
      if (node.type === 'horizontalRule') {
        skipUntilHr = false
      }
      continue
    }
    cleaned.push(node)
  }
  doc.content = cleaned

  // Now process each node to add contextual links
  for (const node of doc.content) {
    if (node.type !== 'paragraph' || !node.content) continue

    const newContent = []
    for (const textNode of node.content) {
      // Skip nodes that already have a link mark
      if (textNode.marks?.some(m => m.type === 'link')) {
        newContent.push(textNode)
        continue
      }
      if (textNode.type !== 'text' || !textNode.text) {
        newContent.push(textNode)
        continue
      }

      // Try to find a matching phrase in this text node
      let text = textNode.text
      let processed = false

      for (const rule of LINK_RULES) {
        if (usedHrefs.has(rule.href)) continue

        const idx = text.toLowerCase().indexOf(rule.phrase.toLowerCase())
        if (idx === -1) continue

        // Found a match - split the text node into before, link, after
        const before = text.slice(0, idx)
        const match = text.slice(idx, idx + rule.phrase.length)
        const after = text.slice(idx + rule.phrase.length)

        const existingMarks = textNode.marks || []

        if (before) {
          newContent.push({ type: 'text', text: before, ...(existingMarks.length ? { marks: [...existingMarks] } : {}) })
        }
        newContent.push({
          type: 'text',
          text: match,
          marks: [...existingMarks, { type: 'link', attrs: { href: rule.href, target: null } }],
        })
        if (after) {
          // Continue processing the remainder for more links
          newContent.push({ type: 'text', text: after, ...(existingMarks.length ? { marks: [...existingMarks] } : {}) })
        }

        usedHrefs.add(rule.href)
        count++
        processed = true
        break // Only one link per text node to keep it simple
      }

      if (!processed) {
        newContent.push(textNode)
      }
    }
    node.content = newContent
  }

  return { doc, count }
}

/** Same logic but for service page blocks (which have richText body fields) */
function addLinksToBlocks(blocks, skipHref) {
  if (!Array.isArray(blocks)) return { blocks, count: 0 }

  const usedHrefs = new Set()
  if (skipHref) usedHrefs.add(skipHref)
  let totalCount = 0

  // Remove any "Further reading" text-section blocks we added before
  const cleaned = blocks.filter(b =>
    !(b.type === 'text-section' && b.fields?.label?.toLowerCase() === 'further reading')
  )

  for (const block of cleaned) {
    if (block.type === 'text-section' && block.fields?.body?.content) {
      for (const node of block.fields.body.content) {
        if (node.type !== 'paragraph' || !node.content) continue

        const newContent = []
        for (const textNode of node.content) {
          if (textNode.marks?.some(m => m.type === 'link')) {
            newContent.push(textNode)
            continue
          }
          if (textNode.type !== 'text' || !textNode.text) {
            newContent.push(textNode)
            continue
          }

          let text = textNode.text
          let processed = false

          for (const rule of LINK_RULES) {
            if (usedHrefs.has(rule.href)) continue
            const idx = text.toLowerCase().indexOf(rule.phrase.toLowerCase())
            if (idx === -1) continue

            const before = text.slice(0, idx)
            const match = text.slice(idx, idx + rule.phrase.length)
            const after = text.slice(idx + rule.phrase.length)
            const existingMarks = textNode.marks || []

            if (before) newContent.push({ type: 'text', text: before, ...(existingMarks.length ? { marks: [...existingMarks] } : {}) })
            newContent.push({ type: 'text', text: match, marks: [...existingMarks, { type: 'link', attrs: { href: rule.href, target: null } }] })
            if (after) newContent.push({ type: 'text', text: after, ...(existingMarks.length ? { marks: [...existingMarks] } : {}) })

            usedHrefs.add(rule.href)
            totalCount++
            processed = true
            break
          }

          if (!processed) newContent.push(textNode)
        }
        node.content = newContent
      }
    }
  }

  return { blocks: cleaned, count: totalCount }
}

// ─── Process articles ───────────────────────────────────────────

console.log('=== ARTICLES ===\n')

const articleList = await get('/article?limit=50')
const articles = Array.isArray(articleList) ? articleList : []

for (const article of articles) {
  const slug = article.slug
  const selfHref = `/article/${slug}`
  console.log(`${slug}`)

  if (!article.body?.content) { console.log('  no body - skip'); continue }

  const { doc, count } = addLinksToDoc(article.body, selfHref)
  if (count === 0 && !article.body.content.some(n => n.content?.[0]?.text === 'Further Reading')) {
    console.log('  no links to add')
    continue
  }

  const ok = await patch(`/article/${article.id}`, { body: doc })
  console.log(`  ${ok ? 'OK' : 'FAIL'} - ${count} contextual links added`)
}

// ─── Process service pages ──────────────────────────────────────

console.log('\n=== SERVICE PAGES ===\n')

const serviceSlugs = ['ai-implementation', 'ai-for-law-firms', 'ai-for-agencies', 'ai-for-accountancy-firms']

for (const slug of serviceSlugs) {
  const selfHref = `/services/${slug}`
  console.log(`${slug}`)

  const page = await get(`/page/slug/${slug}`)
  if (!page) { console.log('  not found - skip'); continue }

  const content = typeof page.content === 'string' ? JSON.parse(page.content) : (page.content || [])
  const { blocks, count } = addLinksToBlocks(content, selfHref)

  const ok = await patch(`/page/${page.id}`, { content: blocks })
  console.log(`  ${ok ? 'OK' : 'FAIL'} - ${count} contextual links, removed Further Reading section`)
}

// ─── Clean up About page ────────────────────────────────────────

console.log('\n=== ABOUT PAGE ===\n')

const aboutPage = await get('/page/slug/about')
if (aboutPage) {
  const content = typeof aboutPage.content === 'string' ? JSON.parse(aboutPage.content) : (aboutPage.content || [])

  // Remove the services text-section we added
  const cleaned = content.filter(b =>
    !(b.type === 'text-section' && b.fields?.label?.toLowerCase() === 'services')
  )

  // Add contextual links to existing text blocks
  const { blocks, count } = addLinksToBlocks(cleaned, '/about')
  const ok = await patch(`/page/${aboutPage.id}`, { content: blocks })
  console.log(`  ${ok ? 'OK' : 'FAIL'} - removed Further Reading, ${count} contextual links`)
}

console.log('\nDone! Rebuild to make live: bunx astro build')
