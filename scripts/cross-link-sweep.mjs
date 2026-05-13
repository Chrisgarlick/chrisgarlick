/**
 * Full cross-linking pass per pivot Part 9. Adds "Related" closing sections to:
 *
 *   - the three outcome pages (workflow-automation, ai-agents, data-extraction):
 *       → pillar (uplink) + sibling outcome page + relevant industry page
 *   - the three industry pages (law, accountancy, agencies):
 *       → pillar uplink (the specific outcome links are already in body)
 *   - the pillar (ai-implementation):
 *       → further reading: the playbook article
 *   - the six existing articles:
 *       → "Related" closing with the service pages specified in pivot 9.2
 *   - the prompt-library resource description:
 *       → link to /services/workflow-automation
 *
 * Idempotent: each insertion is marked with a stable block label "Related"
 * (or a unique ID for paragraph insertions) and skipped on re-run.
 *
 * Run: JWT_TOKEN=<token> bun scripts/cross-link-sweep.mjs
 */

const JWT = process.env.JWT_TOKEN
const BASE = process.env.CMS_API_BASE || 'https://chrisgarlick.com/api'
if (!JWT) { console.error('Set JWT_TOKEN'); process.exit(1) }
const auth = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${JWT}` }

const t    = (text) => ({ type: 'text', text })
const bold = (text) => ({ type: 'text', text, marks: [{ type: 'bold' }] })
const link = (text, href) => ({ type: 'text', text, marks: [{ type: 'link', attrs: { href, target: null } }] })
const p    = (...parts) => ({ type: 'paragraph', content: parts.flatMap(part => Array.isArray(part) ? part : [typeof part === 'string' ? t(part) : part]) })
const ul   = (...items) => ({ type: 'bulletList', content: items.map(line => ({ type: 'listItem', content: [Array.isArray(line) ? p(...line) : p(line)] })) })
const doc  = (...nodes) => ({ type: 'doc', content: nodes })
const hr   = () => ({ type: 'horizontalRule' })
const id   = () => crypto.randomUUID()

// ───────────────────────────────────────────────────────────────────────
//   1. OUTCOME PAGES — add a "Related" text-section before the CTA
// ───────────────────────────────────────────────────────────────────────

const RELATED_LABEL = 'Related'

function relatedBlockForOutcome(opts) {
  return {
    id: id(),
    type: 'text-section',
    fields: {
      label: RELATED_LABEL,
      heading: 'Where this fits in.',
      body: doc(
        p('Part of the wider ', link('AI implementation', '/services/ai-implementation'), ' work I do. The other outcome lanes:'),
        ul(...opts.siblings.map(s => [link(s.label, s.href), ', ', s.blurb])),
        opts.industries && opts.industries.length
          ? p('Working in a specific sector? ', ...opts.industries.flatMap((s, i) => [
              i > 0 ? t(' · ') : t(''),
              link(s.label, s.href),
            ]))
          : p(''),
      ),
    },
  }
}

const OUTCOME_CROSSLINKS = {
  'workflow-automation': {
    siblings: [
      { label: 'Custom AI agents', href: '/services/ai-agents', blurb: 'for tasks that need reading and thinking, not just execution.' },
      { label: 'Data extraction', href: '/services/data-extraction', blurb: 'for pulling structured data out of PDFs, statements and web pages.' },
    ],
    industries: [
      { label: 'For agencies', href: '/services/ai-for-agencies' },
    ],
  },
  'ai-agents': {
    siblings: [
      { label: 'Workflow automation', href: '/services/workflow-automation', blurb: 'for repeatable multi-step processes.' },
      { label: 'Data extraction', href: '/services/data-extraction', blurb: 'for getting structured data out of messy documents.' },
    ],
    industries: [
      { label: 'For law firms', href: '/services/ai-for-law-firms' },
      { label: 'For agencies', href: '/services/ai-for-agencies' },
    ],
  },
  'data-extraction': {
    siblings: [
      { label: 'Workflow automation', href: '/services/workflow-automation', blurb: 'for the broader pipelines that data extraction usually feeds.' },
      { label: 'Custom AI agents', href: '/services/ai-agents', blurb: 'when the extraction needs judgement, not just parsing.' },
    ],
    industries: [
      { label: 'For law firms', href: '/services/ai-for-law-firms' },
      { label: 'For accountancy', href: '/services/ai-for-accountancy-firms' },
    ],
  },
}

// ───────────────────────────────────────────────────────────────────────
//   2. INDUSTRY PAGES — append a pillar uplink + further reading
// ───────────────────────────────────────────────────────────────────────

function pillarUplinkBlock(opts) {
  return {
    id: id(),
    type: 'text-section',
    fields: {
      label: RELATED_LABEL,
      heading: 'Where this fits in.',
      body: doc(
        p('This page covers the ', opts.sectorLabel, ' angle. The broader practice is ', link('AI implementation', '/services/ai-implementation'), ' — the audit, scoping, build and measure process I follow across every engagement, regardless of sector.'),
        opts.relevantArticle
          ? p('Worth reading: ', link(opts.relevantArticle.label, opts.relevantArticle.href), '.')
          : null,
      ).content.length ? doc(
        p('This page covers the ', opts.sectorLabel, ' angle. The broader practice is ', link('AI implementation', '/services/ai-implementation'), ' — the audit, scoping, build and measure process I follow across every engagement, regardless of sector.'),
        ...(opts.relevantArticle ? [p('Worth reading: ', link(opts.relevantArticle.label, opts.relevantArticle.href), '.')] : []),
      ) : doc(),
    },
  }
}

const INDUSTRY_CROSSLINKS = {
  'ai-for-law-firms': {
    sectorLabel: 'law-firm',
    relevantArticle: { label: 'What AI Implementation Actually Means for a Law Firm', href: '/article/what-ai-implementation-means-law-firm' },
  },
  'ai-for-accountancy-firms': {
    sectorLabel: 'accountancy',
    relevantArticle: { label: 'Replacing Manual Data Entry with AI Agents', href: '/article/replacing-manual-data-entry-with-ai-agents' },
  },
  'ai-for-agencies': {
    sectorLabel: 'agency',
    relevantArticle: { label: 'The 3 Workflows Every Agency Should Automate First', href: '/article/agency-workflows-automate-first' },
  },
}

// ───────────────────────────────────────────────────────────────────────
//   3. PILLAR — add a further reading section
// ───────────────────────────────────────────────────────────────────────

function pillarFurtherReadingBlock() {
  return {
    id: id(),
    type: 'text-section',
    fields: {
      label: RELATED_LABEL,
      heading: 'Further reading.',
      body: doc(
        p('Three deeper pieces if you want the longer-form take:'),
        ul(
          [link('The AI Implementation Playbook for Service Businesses', '/article/the-ai-implementation-playbook-for-service-businesses'), ', the long version of the four-phase process.'],
          [link('How to Automate Client Intake Without Custom Software', '/article/automate-client-intake-without-custom-software'), ', a worked example of compressing an 8-step intake into 2.'],
          [link('Replacing Manual Data Entry with AI Agents', '/article/replacing-manual-data-entry-with-ai-agents'), ', a practical guide to the modern extraction stack.'],
        ),
      ),
    },
  }
}

// ───────────────────────────────────────────────────────────────────────
//   4. ARTICLES — append a "Related reading" doc node at the end
// ───────────────────────────────────────────────────────────────────────

// Tag we use to detect a previously-added related block (so we don't double-append)
const ARTICLE_RELATED_MARKER = '__related_link_block__'

function relatedReadingNodes(links) {
  return [
    hr(),
    {
      type: 'heading',
      attrs: { level: 2, [ARTICLE_RELATED_MARKER]: true },
      content: [t('Where to next.')],
    },
    p('If this was useful, the related pages and pieces:'),
    ul(...links.map(l => [link(l.label, l.href), l.blurb ? `. ${l.blurb}` : ''])),
  ]
}

const ARTICLE_LINKS = {
  '2a88f309-fb78-4bde-99c8-577b4607cf0b': {  // agency-workflows-automate-first
    slug: 'agency-workflows-automate-first',
    links: [
      { label: 'Workflow Automation', href: '/services/workflow-automation', blurb: 'the broader build pattern these three workflows fit into' },
      { label: 'AI for Agencies', href: '/services/ai-for-agencies', blurb: 'agency-specific automations and the stack I use' },
      { label: 'Run a free site audit', href: '/tools/site-audit', blurb: 'find the workflow eating your team\'s week' },
    ],
  },
  'b5ed556e-ef80-4a77-b145-ecda17ca87c8': {  // ai-adoption-disappointment
    slug: 'ai-adoption-disappointment-why-companies-fail',
    links: [
      { label: 'Quick fit check', href: '/diagnostic', blurb: '5-question diagnostic to figure out whether implementation makes sense for you yet' },
      { label: 'AI Implementation', href: '/services/ai-implementation', blurb: 'the four-phase process that avoids the disappointment trap' },
    ],
  },
  '4a998bab-7dff-4c7c-90b8-d07fc02b5f73': {  // the-ai-implementation-playbook
    slug: 'the-ai-implementation-playbook-for-service-businesses',
    links: [
      { label: 'AI Implementation', href: '/services/ai-implementation', blurb: 'the service version, with case study examples and FAQ' },
      { label: 'Workflow Automation', href: '/services/workflow-automation', blurb: 'how the multi-step automation lane is built' },
      { label: 'Custom AI Agents', href: '/services/ai-agents', blurb: 'when the task needs judgement, not just execution' },
      { label: 'Data Extraction', href: '/services/data-extraction', blurb: 'getting structured data out of messy sources' },
    ],
  },
  '5707eea1-2b89-428a-bee5-01f93d0e77d5': {  // why-79-of-enterprises-are-failing
    slug: 'why-79-of-enterprises-are-failing-at-ai-adoption',
    links: [
      { label: 'Quick fit check', href: '/diagnostic', blurb: 'figure out whether you\'re in the 21% or the 79%' },
      { label: 'AI Implementation', href: '/services/ai-implementation', blurb: 'how I avoid the failure patterns' },
    ],
  },
  '0b11362d-7a4c-44a6-8db7-f394ed14031b': {  // 51-of-code-on-github-is-ai-generated
    slug: '51-of-code-on-github-is-ai-generated-that-should-worry-you',
    links: [
      { label: 'About me', href: '/about', blurb: 'how I actually write code (and why one-person execution matters)' },
      { label: 'AI Implementation', href: '/services/ai-implementation', blurb: 'what AI-assisted development looks like when it\'s done right' },
    ],
  },
  'd354f83f-8159-4db4-a95f-16642e77be53': {  // what-ai-implementation-means-law-firm
    slug: 'what-ai-implementation-means-law-firm',
    links: [
      { label: 'AI for Law Firms', href: '/services/ai-for-law-firms', blurb: 'the four legal workflows worth automating first' },
      { label: 'Data Extraction', href: '/services/data-extraction', blurb: 'how the contract-extraction pipeline gets built' },
      { label: 'Custom AI Agents', href: '/services/ai-agents', blurb: 'for first-pass contract review and matter summarisation' },
      { label: 'Run a free site audit', href: '/tools/site-audit', blurb: 'tell me the workflow eating your fee-earners\' weeks' },
    ],
  },
}

// ───────────────────────────────────────────────────────────────────────
//   Helpers
// ───────────────────────────────────────────────────────────────────────

async function fetchPageBySlug(slug) {
  const r = await fetch(`${BASE}/page/slug/${slug}`, { headers: auth })
  if (r.status === 404 || !r.ok) return null
  return (await r.json()).data
}

async function fetchArticleById(id) {
  const r = await fetch(`${BASE}/article/${id}`, { headers: auth })
  if (r.status === 404 || !r.ok) return null
  return (await r.json()).data
}

async function patchPage(id, content) {
  const r = await fetch(`${BASE}/page/${id}`, { method: 'PATCH', headers: auth, body: JSON.stringify({ content }) })
  if (!r.ok) { console.error(`  PATCH page ${id} failed:`, r.status, (await r.text()).slice(0, 200)); return false }
  return true
}

async function patchArticle(id, body) {
  const r = await fetch(`${BASE}/article/${id}`, { method: 'PATCH', headers: auth, body: JSON.stringify({ body }) })
  if (!r.ok) { console.error(`  PATCH article ${id} failed:`, r.status, (await r.text()).slice(0, 200)); return false }
  return true
}

function parseMaybeJson(x) { return typeof x === 'string' ? JSON.parse(x) : x }

function hasRelatedBlock(content) {
  return Array.isArray(content) && content.some((b) => b?.fields?.label === RELATED_LABEL)
}

function hasArticleRelatedMarker(bodyDoc) {
  const stringified = JSON.stringify(bodyDoc || {})
  return stringified.includes(ARTICLE_RELATED_MARKER)
}

function insertBeforeLastCta(content, block) {
  const ctaIdx = content.map((b, i) => b.type === 'cta' ? i : -1).filter(i => i >= 0).pop()
  if (ctaIdx === undefined || ctaIdx < 0) return [...content, block]  // no CTA → just append
  return [...content.slice(0, ctaIdx), block, ...content.slice(ctaIdx)]
}

// ───────────────────────────────────────────────────────────────────────
//   Run
// ───────────────────────────────────────────────────────────────────────

console.log('Outcome pages:')
for (const [slug, opts] of Object.entries(OUTCOME_CROSSLINKS)) {
  const page = await fetchPageBySlug(slug)
  if (!page) { console.log(`  ${slug} not found, skip`); continue }
  const content = parseMaybeJson(page.content) || []
  if (hasRelatedBlock(content)) { console.log(`  ${slug} already has Related block, skip`); continue }
  const newContent = insertBeforeLastCta(content, relatedBlockForOutcome(opts))
  if (await patchPage(page.id, newContent)) console.log(`  ✓ ${slug}`)
}

console.log('\nIndustry pages:')
for (const [slug, opts] of Object.entries(INDUSTRY_CROSSLINKS)) {
  const page = await fetchPageBySlug(slug)
  if (!page) { console.log(`  ${slug} not found, skip`); continue }
  const content = parseMaybeJson(page.content) || []
  if (hasRelatedBlock(content)) { console.log(`  ${slug} already has Related block, skip`); continue }
  const newContent = insertBeforeLastCta(content, pillarUplinkBlock(opts))
  if (await patchPage(page.id, newContent)) console.log(`  ✓ ${slug}`)
}

console.log('\nPillar:')
{
  const page = await fetchPageBySlug('ai-implementation')
  if (page) {
    const content = parseMaybeJson(page.content) || []
    if (hasRelatedBlock(content)) console.log('  already has Related block, skip')
    else {
      const newContent = insertBeforeLastCta(content, pillarFurtherReadingBlock())
      if (await patchPage(page.id, newContent)) console.log('  ✓ ai-implementation')
    }
  }
}

console.log('\nArticles:')
for (const [articleId, spec] of Object.entries(ARTICLE_LINKS)) {
  const article = await fetchArticleById(articleId)
  if (!article) { console.log(`  ${spec.slug} not found, skip`); continue }
  const body = parseMaybeJson(article.body)
  if (!body || !Array.isArray(body.content)) { console.log(`  ${spec.slug} has no body content, skip`); continue }
  if (hasArticleRelatedMarker(body)) { console.log(`  ${spec.slug} already has related block, skip`); continue }
  const newBody = { ...body, content: [...body.content, ...relatedReadingNodes(spec.links)] }
  if (await patchArticle(articleId, newBody)) console.log(`  ✓ ${spec.slug}`)
}

console.log('\nDone.')
