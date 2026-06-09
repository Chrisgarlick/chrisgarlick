/**
 * Append the recommended blog writing order to the "8th June Clusters" Notion page.
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

const PAGE_ID = '3790a555-e5a3-8127-9534-d578fd183a08'

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

// Block helpers
const div = () => ({ object: 'block', type: 'divider', divider: {} })
const h = (level, text) => ({
  object: 'block', type: `heading_${level}`,
  [`heading_${level}`]: { rich_text: [{ type: 'text', text: { content: text } }] },
})
const p = (rich) => ({
  object: 'block', type: 'paragraph',
  paragraph: { rich_text: Array.isArray(rich) ? rich : [{ type: 'text', text: { content: rich } }] },
})
const bullet = (text) => ({
  object: 'block', type: 'bulleted_list_item',
  bulleted_list_item: { rich_text: [{ type: 'text', text: { content: text } }] },
})
const num = (text) => ({
  object: 'block', type: 'numbered_list_item',
  numbered_list_item: { rich_text: [{ type: 'text', text: { content: text } }] },
})
const callout = (text, emoji = '\u{1F4DD}') => ({
  object: 'block', type: 'callout',
  callout: {
    icon: { type: 'emoji', emoji },
    rich_text: [{ type: 'text', text: { content: text } }],
  },
})

const t = (content, bold = false, link = null) => {
  const r = { type: 'text', text: { content } }
  if (link) r.text.link = { url: link }
  if (bold) r.annotations = { bold: true }
  return r
}

const blocks = []

blocks.push(div())
blocks.push(h(1, 'Writing order (recommended)'))

blocks.push(callout(
  'One blog per week, paired with one IG prospecting run on the matching audience. Articles 1-3 support outreach (the natural turn-2 link). Articles 4-6 build the long-term SEO compounding engine. 7+ are deeper sector pieces.',
))

blocks.push(h(2, 'Week 1: Support your live outreach'))

blocks.push(h(3, '1. 5 AI Tools Every UK Tradesperson Should Use in 2026'))
blocks.push(p([t('Cluster: K.5.1  -  Pillar: /for/tradespeople  -  URL: /blog/5-ai-tools-tradespeople-2026')]))
blocks.push(callout(
  'Matches your live IG bank (8 electricians + 4 plumbers already qualified). Listicle format = fastest to write. Pairs with the existing gated resource of the same name. The natural turn-2 link when those DMs reply.',
  '\u{1F527}',
))

blocks.push(h(3, '2. The Solo Operator AI Stack'))
blocks.push(p([t('Cluster: K.4.1  -  Pillar: /for/solo-operators  -  URL: /blog/solo-operator-ai-stack')]))
blocks.push(callout(
  'Catches the founder-led small DTC brands already in your IG bank (Bug Bakes, Northern Wood Co, Tynemouth Coffee, Harlow Collection, Waceland). Broad audience, low SERP competition, pairs with /resources/ai-stack-under-two-hours-a-day.',
  '\u{1F4BB}',
))

blocks.push(h(2, 'Week 2-3: Set up the next outreach wave'))

blocks.push(h(3, '3. The AI Proposal Pack for UK Freelancers'))
blocks.push(p([t('Cluster: K.3.1  -  Pillar: /for/freelancers  -  URL: /blog/ai-proposal-pack-freelancers')]))
blocks.push(callout(
  'The next IG run you\'ll naturally do is freelancers or coaches (Quick Wins on the /prospects help cheatsheet). The article needs to exist BEFORE that run, not after. Pairs with /resources/freelancers-ai-proposal-pack.',
  '\u{1F4DD}',
))

blocks.push(h(2, 'Week 4 onwards: Build the compounding SEO engine'))

blocks.push(h(3, '4. AI Consultant vs AI Agency UK'))
blocks.push(p([t('Cluster: A (AI Implementation pillar)  -  URL: /blog/ai-consultant-vs-agency-uk')]))
blocks.push(callout(
  'Highest AI-engine citation potential of any post in the strategy. "X vs Y" comparisons get pulled into Perplexity, ChatGPT, and Google AI Overviews disproportionately. Free brand mentions every day from each citation.',
  '\u{1F50D}',
))

blocks.push(h(3, '5. AI Implementation Cost UK'))
blocks.push(p([t('Cluster: A (AI Implementation pillar)  -  URL: /blog/ai-implementation-cost-uk')]))
blocks.push(callout(
  'Highest commercial intent in the entire keyword set. Anyone searching "AI implementation cost UK" is ready to buy - the post itself converts harder than any other.',
  '\u{1F4B0}',
))

blocks.push(h(3, '6. Zapier vs Custom AI Automation'))
blocks.push(p([t('Cluster: B (Workflow Automation)  -  URL: /blog/zapier-vs-custom-ai')]))
blocks.push(callout(
  'Another high-citation comparison. Pairs internally with the AI Reporting Automation article (live) for compounding internal-link value over 3 months.',
  '\u{1F517}',
))

blocks.push(h(2, 'Week 7+: Sector deep dives'))

blocks.push(p('These are higher-effort, sector-specific pieces. Worth writing once the cadence above is humming.'))
blocks.push(bullet('AI Document Automation for UK Solicitors (Cluster F)'))
blocks.push(bullet('AI Client Intake Automation for Law Firms (Cluster F)'))
blocks.push(bullet('AI for Xero Practices (Cluster G)'))
blocks.push(bullet('AI vs Hiring: UK Accountancy (Cluster G)'))
blocks.push(bullet('What is RAG? UK Edition (Cluster E)'))
blocks.push(bullet('How to Choose an LLM for Business Use (Cluster E)'))

blocks.push(div())
blocks.push(h(2, 'Cadence rule of thumb'))
blocks.push(p('Each week pair the blog with the matching IG outreach run, so the same conversation gets reinforced across two channels.'))

blocks.push(bullet('Week 1: write tradespeople article, run more trades or North East prospecting'))
blocks.push(bullet('Week 2: write solo operator article, run coaches or small DTC prospecting'))
blocks.push(bullet('Week 3: write freelancer article, run freelance developers/designers/SEO prospecting'))
blocks.push(bullet('Week 4: write consultant-vs-agency comparison, run consultants/agencies prospecting'))

blocks.push(div())
blocks.push(h(2, 'Decision to make first: blog vs gated resource overlap'))

blocks.push(p('The blog post and the gated resource share a name (e.g. "5 AI Tools Every Tradesperson Should Use in 2026"). Pick ONE model and stick with it for articles 1 to 3 so the pattern is consistent.'))

blocks.push(h(3, 'Option A. Blog = full content, resource = downloadable companion'))
blocks.push(p('Blog has the 5 tools written out in detail. The /resources/ download adds the prompts, templates, and setup instructions that turn reading into doing.'))
blocks.push(bullet('Higher SEO value (more content for Google to rank)'))
blocks.push(bullet('Slightly lower lead-magnet conversion (the article gives most of the value upfront)'))
blocks.push(bullet('Best fit for trades + solo operators (audience wants the answer, will value the article itself)'))

blocks.push(h(3, 'Option B. Blog = 80% teaser, resource = the actual 100%'))
blocks.push(p('Blog explains what the tools are at a high level and why they matter. The /resources/ download holds the actual implementation steps and prompts.'))
blocks.push(bullet('Lower SEO value (thinner article)'))
blocks.push(bullet('Higher lead-magnet conversion (readers NEED the resource to act)'))
blocks.push(bullet('Best fit for freelancers (the proposal pack genuinely lives in the resource)'))

blocks.push(callout(
  'Recommendation: Option A for articles 1 + 2 (trades, solo operators). Option B for article 3 (freelance proposal pack). Document the choice in each blog\'s frontmatter so future articles in the cluster follow the same pattern.',
  '\u{1F3AF}',
))

// Push in chunks of 100
for (let i = 0; i < blocks.length; i += 100) {
  await notion('PATCH', `/blocks/${PAGE_ID}/children`, { children: blocks.slice(i, i + 100) })
  console.log(`Appended batch ${Math.floor(i / 100) + 1}`)
}

console.log(`\nDone. View: https://www.notion.so/${PAGE_ID.replace(/-/g, '')}`)
