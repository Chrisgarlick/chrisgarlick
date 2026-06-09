/**
 * Publish the 2026-06-08 SEO audit to Notion as "8th June Clusters".
 * Creates a page under Kritano (or the Chris Garlick anchor if accessible),
 * with the full audit content + topic-clusters update.
 */
import fs from 'fs'

if (!process.env.NOTION_API && fs.existsSync('.env')) {
  for (const line of fs.readFileSync('.env', 'utf8').split('\n')) {
    const m = line.match(/^NOTION_API=(.+)$/)
    if (m) { process.env.NOTION_API = m[1].trim(); break }
  }
}
const NOTION_API = process.env.NOTION_API
const NOTION_VERSION = '2022-06-28'
if (!NOTION_API) { console.error('No NOTION_API'); process.exit(1) }

const PAGE_TITLE = '8th June Clusters'

async function notion(method, path, payload) {
  const res = await fetch(`https://api.notion.com/v1${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${NOTION_API}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
    },
    body: payload ? JSON.stringify(payload) : undefined,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(`Notion ${res.status}: ${JSON.stringify(data)}`)
  return data
}

// Find a parent page
async function findParent() {
  for (const query of ['Chris Garlick', 'Kritano']) {
    const r = await notion('POST', '/search', {
      query,
      filter: { property: 'object', value: 'page' },
      page_size: 25,
    })
    for (const p of r.results || []) {
      for (const [, prop] of Object.entries(p.properties || {})) {
        if (prop.type === 'title') {
          const text = (prop.title || []).map((t) => t.plain_text || '').join('')
          if (text.trim().toLowerCase() === query.toLowerCase()) return { id: p.id, name: text.trim() }
        }
      }
    }
  }
  return null
}

// ----- Build blocks from the audit doc + a fresh summary block at the top -----

function p(text, color) {
  return {
    object: 'block',
    type: 'paragraph',
    paragraph: { rich_text: [{ type: 'text', text: { content: text } }], ...(color ? { color } : {}) },
  }
}
function h(level, text) {
  return {
    object: 'block',
    type: `heading_${level}`,
    [`heading_${level}`]: { rich_text: [{ type: 'text', text: { content: text } }] },
  }
}
function callout(text, emoji = '\u{1F4CA}') {
  return {
    object: 'block',
    type: 'callout',
    callout: {
      icon: { type: 'emoji', emoji },
      rich_text: [{ type: 'text', text: { content: text } }],
    },
  }
}
function divider() {
  return { object: 'block', type: 'divider', divider: {} }
}
function bullet(text) {
  return {
    object: 'block',
    type: 'bulleted_list_item',
    bulleted_list_item: { rich_text: [{ type: 'text', text: { content: text } }] },
  }
}
function code(text, lang = 'plain text') {
  return {
    object: 'block',
    type: 'code',
    code: { rich_text: [{ type: 'text', text: { content: text.slice(0, 1999) } }], language: lang },
  }
}

const blocks = []

blocks.push(callout(
  'SEO audit refresh, 8 June 2026. Adds Cluster K for the /for/ operating-model axis (agency-starters, consultants, freelancers, solo-operators, tradespeople). Three new P1 articles identified.',
))

blocks.push(divider())

blocks.push(h(1, 'Headline'))
blocks.push(p('Two axes now live: /industries/<sector> (what industry am I in) and /for/<model> (what shape of business do I run). The /for/ axis is structurally complete (5 pillars, all with own SEO, gated resources, schema) but has zero supporting cluster pages, so the pages are topical-authority orphans.'))
blocks.push(p('Adding Cluster K fixes this. 3 new P1 articles pair directly with existing gated resources and are the highest-conversion bets.'))

blocks.push(h(1, 'Cluster K (NEW): Operating-Model Axis'))

const clusterK = [
  {
    name: 'K.1 Agency Starters',
    url: '/for/agency-starters',
    keyword: 'solo agency UK / AI agency stack solo founder',
    resource: '/resources/zero-team-agency-playbook',
    articles: [
      { p: 'P1', t: 'AI Agency Stack: What a Solo Founder Actually Needs', slug: '/blog/ai-agency-stack-solo-founder' },
      { p: 'P1', t: 'First 5 Clients Without a Team', slug: '/blog/first-5-clients-solo-agency' },
      { p: 'P1', t: 'Productised vs Hourly Agency in 2026', slug: '/blog/productised-vs-hourly-agency' },
      { p: 'P2', t: 'When Should a Solo-Founder Agency Make Its First Hire?', slug: '/blog/solo-agency-first-hire' },
      { p: 'P2', t: 'AI Onboarding for Agency Clients', slug: '/blog/ai-onboarding-agency-clients' },
      { p: 'P3', t: 'From Freelancer to Agency: When and How', slug: '/blog/freelancer-to-agency-transition' },
    ],
    crossAxis: 'Cluster H (agencies)',
  },
  {
    name: 'K.2 Consultants',
    url: '/for/consultants',
    keyword: 'AI for consultants / productise consulting',
    resource: '/resources/one-framework-six-months-of-content',
    articles: [
      { p: 'P1', t: 'One Framework, Six Months of Content (The Extraction System)', slug: '/blog/one-framework-six-months-content' },
      { p: 'P1', t: 'AI Thought Leadership Without Ghostwriters', slug: '/blog/ai-thought-leadership-consultants' },
      { p: 'P1', t: 'From 1-to-1 to 1-to-Many: Scaling Consulting with AI', slug: '/blog/scale-consulting-with-ai' },
      { p: 'P2', t: 'SEO Landing Pages for Niche Consulting Practices', slug: '/blog/consulting-seo-landing-pages' },
      { p: 'P2', t: 'Repurpose a Workshop into 10 Content Pieces', slug: '/blog/repurpose-workshop-content' },
      { p: 'P3', t: 'Consulting Methodology Documentation Using AI', slug: '/blog/document-consulting-methodology' },
    ],
    crossAxis: 'Cluster H (agencies)',
  },
  {
    name: 'K.3 Freelancers',
    url: '/for/freelancers',
    keyword: 'AI for freelancers / freelancer proposal template',
    resource: '/resources/freelancers-ai-proposal-pack',
    articles: [
      { p: 'P1', t: 'The AI Proposal Pack for UK Freelancers', slug: '/blog/ai-proposal-pack-freelancers' },
      { p: 'P1', t: 'Brief-to-Proposal AI: The Prompt That Works', slug: '/blog/brief-to-proposal-ai-prompt' },
      { p: 'P1', t: 'Freelance Client Onboarding Automation', slug: '/blog/freelance-client-onboarding-ai' },
      { p: 'P2', t: 'Scaling Freelance Income Without Becoming an Agency', slug: '/blog/scale-freelance-without-agency' },
      { p: 'P2', t: 'LinkedIn for Freelancers: AI-Driven Cadence', slug: '/blog/freelance-linkedin-ai-cadence' },
      { p: 'P3', t: 'Freelance vs Productised Service: 2026 Math', slug: '/blog/freelance-vs-productised' },
    ],
    crossAxis: 'Cluster H (agencies)',
  },
  {
    name: 'K.4 Solo Operators',
    url: '/for/solo-operators',
    keyword: 'AI for solo operators UK / one person business AI',
    resource: '/resources/ai-stack-under-two-hours-a-day',
    articles: [
      { p: 'P1', t: 'The Solo Operator AI Stack: Two Hours of Admin a Day', slug: '/blog/solo-operator-ai-stack' },
      { p: 'P1', t: 'Voice Note to Week of Content (The Pipeline)', slug: '/blog/voice-note-to-content-pipeline' },
      { p: 'P1', t: 'Automated Google Review Requests for UK Small Business', slug: '/blog/automated-google-review-requests-uk' },
      { p: 'P2', t: 'Solo Business Case Studies from a 5-Min Debrief', slug: '/blog/case-studies-from-debrief' },
      { p: 'P2', t: 'Monthly SEO Blog Post in 30 Minutes', slug: '/blog/monthly-seo-post-30-minutes' },
      { p: 'P3', t: 'One-Person Business Tools Comparison: 2026', slug: '/blog/one-person-business-tools-2026' },
    ],
    crossAxis: 'Cluster F (law firms - sole practice)',
  },
  {
    name: 'K.5 Tradespeople',
    url: '/for/tradespeople',
    keyword: 'AI for tradespeople UK / AI for trades',
    resource: '/resources/5-ai-tools-tradespeople-2026',
    articles: [
      { p: 'P1', t: '5 AI Tools Every UK Tradesperson Should Use in 2026', slug: '/blog/5-ai-tools-tradespeople-2026' },
      { p: 'P1', t: 'AI for Plumbers: Marketing Without an Agency', slug: '/blog/ai-for-plumbers-uk' },
      { p: 'P1', t: 'AI for Electricians: Posts, Reviews, Follow-ups', slug: '/blog/ai-for-electricians-uk' },
      { p: 'P1', t: 'AI for Builders: Before/After Reels from Your Phone', slug: '/blog/ai-for-builders-uk' },
      { p: 'P2', t: 'Checkatrade SEO: Beyond the Profile', slug: '/blog/checkatrade-seo' },
      { p: 'P2', t: 'Google Business Profile Automation for Trades', slug: '/blog/gbp-automation-trades' },
      { p: 'P3', t: 'Seasonal Marketing Calendar for UK Trades', slug: '/blog/seasonal-marketing-trades-uk' },
    ],
    crossAxis: '(no industry partner yet)',
  },
]

for (const c of clusterK) {
  blocks.push(h(2, c.name))
  blocks.push(p(`Pillar: ${c.url}`))
  blocks.push(p(`Focus keyword: ${c.keyword}`))
  blocks.push(p(`Gated resource: ${c.resource}`))
  blocks.push(p(`Cross-axis link: ${c.crossAxis}`))
  blocks.push(h(3, 'Supporting articles (cluster pages)'))
  for (const a of c.articles) {
    blocks.push(bullet(`[${a.p}] ${a.t} -> ${a.slug}`))
  }
}

blocks.push(divider())
blocks.push(h(1, 'Cross-axis link map (must link both ways)'))
blocks.push(bullet('K.4 (solo operators) <-> F (law firms) - sole-practice'))
blocks.push(bullet('K.1 (agency starters) <-> H (agencies) - solo founder to team'))
blocks.push(bullet('K.2 (consultants) <-> H (agencies) - consultancy/agency overlap'))
blocks.push(bullet('K.3 (freelancers) <-> H (agencies) - freelancers serving agencies'))
blocks.push(bullet('K.5 (tradespeople) <-> (no industry page yet, add prop when /industries/ai-for-tradespeople is built)'))

blocks.push(divider())
blocks.push(h(1, 'Critical gaps + fixes'))

const issues = [
  ['No Cluster K in topic-clusters.md', 'Added in this audit. topic-clusters.md updated to v3.'],
  ['Zero supporting cluster pages exist for any /for/ pillar', 'Write 3 P1 articles first (K.3.1, K.4.1, K.5.1). Each pairs with an existing gated resource for max conversion. Content owns this.'],
  ['Missing relatedIndustry on 3 of 5 /for/ pages', 'Add relatedIndustry={{slug:"ai-for-agencies"}} to consultants.astro and freelancers.astro. Software owns this. 10 min.'],
  ['No FAQ section on any /for/ pillar', 'Add `faqs` prop to ForPage.astro + populate on all 5 pages with FAQPage schema. AEO opportunity lost without this. 4 hr.'],
  ['/for directory landing has no ItemList JSON-LD', 'Add alongside the existing CollectionPage in /for/index.astro. Software, 30 min.'],
  ['Lead-magnet /resources/<slug> not in keyword strategy or topic-clusters', 'Cluster J needs to add the 5 new resources. Verified live separately.'],
  ['No Operating-Model section in keyword-strategy.md', 'Added in this audit. keyword-strategy.md updated to v3.'],
]
for (const [issue, fix] of issues) {
  blocks.push(h(3, issue))
  blocks.push(p(fix))
}

blocks.push(divider())
blocks.push(h(1, 'Updated P1 content priority (13 articles)'))
blocks.push(p('Inherited from existing strategy (still P1):'))
const inheritedP1 = [
  'AI Implementation Cost UK',
  'AI Consultant vs AI Agency UK',
  'Zapier vs Custom AI Automation',
  'What is RAG? UK Edition',
  'How to Choose an LLM for Business Use',
  'AI Document Automation for UK Solicitors',
  'AI Client Intake Automation for Law Firms',
  'AI Reporting Automation for UK Agencies (LIVE: /article/ai-reporting-automation-agencies)',
  'AI for Xero Practices',
  'AI vs Hiring: UK Accountancy',
]
for (const t of inheritedP1) blocks.push(bullet(t))
blocks.push(p('NEW from Cluster K (highest-conversion bets, each pairs with existing gated resource):'))
blocks.push(bullet('The AI Proposal Pack for UK Freelancers (K.3.1)'))
blocks.push(bullet('The Solo Operator AI Stack (K.4.1)'))
blocks.push(bullet('5 AI Tools Every UK Tradesperson Should Use (K.5.1)'))

blocks.push(divider())
blocks.push(h(1, 'Implementation tracker'))

const actions = [
  ['Add Cluster K to topic-clusters.md', 'SEO', 'Done in this audit'],
  ['Add Operating-Model section to keyword-strategy.md', 'SEO', 'Done in this audit'],
  ['Add relatedIndustry to consultants.astro and freelancers.astro', 'Software', '10 min'],
  ['Add faqs prop + populate FAQ on all 5 /for/ pages', 'Content + Software', '4 hr'],
  ['Add ItemList JSON-LD to /for/index.astro', 'Software', '30 min'],
  ['Audit /resources/<slug> pages for title/meta/canonical', 'SEO + Software', '1 hr'],
  ['Write K.3.1 (Freelancer AI Proposal Pack)', 'Content', '1 day'],
  ['Write K.4.1 (Solo Operator AI Stack)', 'Content', '1 day'],
  ['Write K.5.1 (5 AI Tools for Tradespeople)', 'Content', '1 day'],
  ['Wire 3 new articles into ForPage.astro "Deep dives" block', 'Content + Software', '30 min'],
]
for (const [a, o, t] of actions) {
  blocks.push(bullet(`${a}  -  ${o}  -  ${t}`))
}

blocks.push(divider())
blocks.push(h(1, 'Full audit document'))
blocks.push(p('The complete audit lives in the repo at team/18-seo/seo-audit-2026-06-08.md. Updated strategy docs: team/18-seo/topic-clusters.md (v3) and team/18-seo/keyword-strategy.md (v3).'))

// ----- Publish -----
console.log('Looking for parent page...')
const parent = await findParent()
if (!parent) { console.error('No accessible parent in Notion'); process.exit(1) }
console.log(`Will publish under: ${parent.name} (${parent.id})`)

const first = blocks.slice(0, 100)
const rest = blocks.slice(100)

const page = await notion('POST', '/pages', {
  parent: { page_id: parent.id },
  icon: { type: 'emoji', emoji: '\u{1F4CD}' },
  properties: { title: { title: [{ text: { content: PAGE_TITLE } }] } },
  children: first,
})

if (rest.length > 0) {
  for (let i = 0; i < rest.length; i += 100) {
    await notion('PATCH', `/blocks/${page.id}/children`, { children: rest.slice(i, i + 100) })
  }
}

const clean = page.id.replace(/-/g, '')
console.log(`\nDone. View: https://www.notion.so/${clean}`)
