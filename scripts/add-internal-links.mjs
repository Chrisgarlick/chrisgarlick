/**
 * Add internal links across all articles and service pages.
 * Adds contextual links within body text + "Further reading" sections.
 *
 * Run: JWT_TOKEN=<token> node scripts/add-internal-links.mjs
 */

const JWT = process.env.JWT_TOKEN
const BASE = 'https://chrisgarlick.com/api'
if (!JWT) { console.error('Set JWT_TOKEN'); process.exit(1) }

const headers = { 'Authorization': `Bearer ${JWT}` }
const jsonHeaders = { ...headers, 'Content-Type': 'application/json' }

async function get(path) {
  const r = await fetch(`${BASE}${path}`, { headers })
  return (await r.json()).data
}

async function patch(path, data) {
  const r = await fetch(`${BASE}${path}`, { method: 'PATCH', headers: jsonHeaders, body: JSON.stringify(data) })
  return { ok: r.ok, data: (await r.json()).data }
}

// TipTap helpers
const t = (text) => ({ type: 'text', text })
const bold = (text) => ({ type: 'text', text, marks: [{ type: 'bold' }] })
const link = (text, href) => ({ type: 'text', text, marks: [{ type: 'link', attrs: { href, target: null } }] })
const p = (content) => ({ type: 'paragraph', content: Array.isArray(content) ? content : [t(content)] })
const h2 = (text) => ({ type: 'heading', attrs: { level: 2 }, content: [t(text)] })
const hr = () => ({ type: 'horizontalRule' })

// ─── Link map: what links to what ───────────────────────────────

const ARTICLE_LINKS = {
  'what-ai-implementation-means-law-firm': {
    contextual: [
      // Add links to existing body paragraphs by inserting before FAQ section
      { text: 'document drafting, client intake, and compliance prep', linkText: 'AI systems for law firms', href: '/services/ai-for-law-firms' },
    ],
    related: [
      { label: 'Why 79% of Enterprises Are Failing at AI Adoption', href: '/article/why-79-of-enterprises-are-failing-at-ai-adoption' },
      { label: 'The 3 Workflows Every Agency Should Automate First', href: '/article/agency-workflows-automate-first' },
      { label: 'AI Services for Law Firms', href: '/services/ai-for-law-firms' },
      { label: 'All AI Implementation Services', href: '/services/ai-implementation' },
    ],
  },
  'agency-workflows-automate-first': {
    related: [
      { label: 'What AI Implementation Actually Means for a Law Firm', href: '/article/what-ai-implementation-means-law-firm' },
      { label: 'Why 79% of Enterprises Are Failing at AI Adoption', href: '/article/why-79-of-enterprises-are-failing-at-ai-adoption' },
      { label: 'AI Workflow Automation for Agencies', href: '/services/ai-for-agencies' },
      { label: 'All AI Implementation Services', href: '/services/ai-implementation' },
    ],
  },
  'why-79-of-enterprises-are-failing-at-ai-adoption': {
    related: [
      { label: 'Why 48% of Companies Say AI Adoption Has Been a Disappointment', href: '/article/ai-adoption-disappointment-why-companies-fail' },
      { label: 'What AI Implementation Actually Means for a Law Firm', href: '/article/what-ai-implementation-means-law-firm' },
      { label: 'AI Implementation Services', href: '/services/ai-implementation' },
    ],
  },
  'ai-adoption-disappointment-why-companies-fail': {
    related: [
      { label: 'Why 79% of Enterprises Are Failing at AI Adoption', href: '/article/why-79-of-enterprises-are-failing-at-ai-adoption' },
      { label: 'The 3 Workflows Every Agency Should Automate First', href: '/article/agency-workflows-automate-first' },
      { label: 'AI Implementation Services', href: '/services/ai-implementation' },
    ],
  },
  '51-of-code-on-github-is-ai-generated-that-should-worry-you': {
    related: [
      { label: 'Why 79% of Enterprises Are Failing at AI Adoption', href: '/article/why-79-of-enterprises-are-failing-at-ai-adoption' },
      { label: 'Why 48% of Companies Say AI Adoption Has Been a Disappointment', href: '/article/ai-adoption-disappointment-why-companies-fail' },
      { label: 'AI Implementation Services', href: '/services/ai-implementation' },
    ],
  },
}

// Service pages: add blog links via a new text-section block
const SERVICE_LINKS = {
  'ai-implementation': {
    heading: 'Further reading',
    links: [
      { label: 'What AI Implementation Actually Means for a Law Firm', href: '/article/what-ai-implementation-means-law-firm' },
      { label: 'The 3 Workflows Every Agency Should Automate First', href: '/article/agency-workflows-automate-first' },
      { label: 'Why 79% of Enterprises Are Failing at AI Adoption', href: '/article/why-79-of-enterprises-are-failing-at-ai-adoption' },
    ],
  },
  'ai-for-law-firms': {
    heading: 'Further reading',
    links: [
      { label: 'What AI Implementation Actually Means for a Law Firm', href: '/article/what-ai-implementation-means-law-firm' },
      { label: 'Why 79% of Enterprises Are Failing at AI Adoption', href: '/article/why-79-of-enterprises-are-failing-at-ai-adoption' },
      { label: 'AI Implementation - How It Works', href: '/services/ai-implementation' },
    ],
  },
  'ai-for-agencies': {
    heading: 'Further reading',
    links: [
      { label: 'The 3 Workflows Every Agency Should Automate First', href: '/article/agency-workflows-automate-first' },
      { label: 'Why 79% of Enterprises Are Failing at AI Adoption', href: '/article/why-79-of-enterprises-are-failing-at-ai-adoption' },
      { label: 'AI Implementation - How It Works', href: '/services/ai-implementation' },
    ],
  },
  'ai-for-accountancy-firms': {
    heading: 'Further reading',
    links: [
      { label: 'What AI Implementation Actually Means for a Law Firm', href: '/article/what-ai-implementation-means-law-firm' },
      { label: 'Why 79% of Enterprises Are Failing at AI Adoption', href: '/article/why-79-of-enterprises-are-failing-at-ai-adoption' },
      { label: 'AI Implementation - How It Works', href: '/services/ai-implementation' },
    ],
  },
}

// ─── 1. Patch articles: insert "Further reading" section before FAQ ──

console.log('=== ARTICLES ===\n')

for (const [slug, config] of Object.entries(ARTICLE_LINKS)) {
  console.log(`Processing: ${slug}`)

  const article = await get(`/article/slug/${slug}`)
  if (!article) { console.log('  NOT FOUND - skipping'); continue }

  const body = article.body
  if (!body?.content) { console.log('  NO BODY - skipping'); continue }

  // Check if "Further reading" already exists
  const hasRelated = body.content.some(n =>
    n.type === 'heading' && n.content?.[0]?.text === 'Further Reading'
  )
  if (hasRelated) { console.log('  Already has Further Reading - skipping'); continue }

  // Find the FAQ heading index (or end of content)
  let insertIdx = body.content.length
  for (let i = 0; i < body.content.length; i++) {
    if (body.content[i].type === 'heading' &&
        body.content[i].content?.[0]?.text?.toLowerCase().includes('frequently asked')) {
      insertIdx = i
      break
    }
  }

  // Build the "Further reading" section
  const relatedNodes = [
    hr(),
    h2('Further Reading'),
  ]

  for (const item of config.related) {
    relatedNodes.push(p([
      t('\u2192 '),
      link(item.label, item.href),
    ]))
  }

  relatedNodes.push(hr())

  // Insert before FAQ
  body.content.splice(insertIdx, 0, ...relatedNodes)

  const result = await patch(`/article/${article.id}`, { body })
  console.log(`  ${result.ok ? 'OK' : 'FAIL'} - ${body.content.length} blocks (inserted ${relatedNodes.length} link nodes)`)
}

// ─── 2. Patch service pages: add "Further reading" text-section before CTA ──

console.log('\n=== SERVICE PAGES ===\n')

for (const [slug, config] of Object.entries(SERVICE_LINKS)) {
  console.log(`Processing: ${slug}`)

  const page = await get(`/page/slug/${slug}`)
  if (!page) { console.log('  NOT FOUND - skipping'); continue }

  const content = typeof page.content === 'string' ? JSON.parse(page.content) : (page.content || [])

  // Check if already has a further-reading block
  const hasRelated = content.some(b =>
    b.type === 'text-section' && b.fields?.label?.toLowerCase() === 'further reading'
  )
  if (hasRelated) { console.log('  Already has Further Reading - skipping'); continue }

  // Build the rich text body with links
  const bodyNodes = config.links.map(item =>
    p([t('\u2192 '), link(item.label, item.href)])
  )

  const readingBlock = {
    id: crypto.randomUUID(),
    type: 'text-section',
    fields: {
      label: 'Further reading',
      heading: config.heading,
      body: { type: 'doc', content: bodyNodes },
    },
  }

  // Insert before the last block (which is typically the CTA)
  const insertIdx = Math.max(content.length - 1, 0)
  content.splice(insertIdx, 0, readingBlock)

  const result = await patch(`/page/${page.id}`, { content })
  console.log(`  ${result.ok ? 'OK' : 'FAIL'} - ${content.length} blocks`)
}

// ─── 3. Add service links to About page ──

console.log('\n=== ABOUT PAGE ===\n')

const aboutPage = await get('/page/slug/about')
if (aboutPage) {
  const content = typeof aboutPage.content === 'string' ? JSON.parse(aboutPage.content) : (aboutPage.content || [])

  const hasServices = content.some(b =>
    b.type === 'text-section' && b.fields?.label?.toLowerCase() === 'services'
  )

  if (!hasServices && content.length > 0) {
    const servicesBlock = {
      id: crypto.randomUUID(),
      type: 'text-section',
      fields: {
        label: 'Services',
        heading: 'What I do',
        body: {
          type: 'doc',
          content: [
            p([t('I build AI systems for professional service firms. Here\'s how I work with each sector:')]),
            p([t('\u2192 '), link('AI Implementation - The Full Process', '/services/ai-implementation')]),
            p([t('\u2192 '), link('AI for Law Firms', '/services/ai-for-law-firms')]),
            p([t('\u2192 '), link('AI for Agencies', '/services/ai-for-agencies')]),
            p([t('\u2192 '), link('AI for Accountancy Firms', '/services/ai-for-accountancy-firms')]),
          ],
        },
      },
    }

    // Insert before last block (CTA)
    const insertIdx = Math.max(content.length - 1, 0)
    content.splice(insertIdx, 0, servicesBlock)

    const result = await patch(`/page/${aboutPage.id}`, { content })
    console.log(`About: ${result.ok ? 'OK' : 'FAIL'} - added services links`)
  } else {
    console.log('About: already has services section or empty')
  }
} else {
  console.log('About page not found')
}

console.log('\nDone! All internal links added.')
console.log('Rebuild the site to make them live: bunx astro build')
