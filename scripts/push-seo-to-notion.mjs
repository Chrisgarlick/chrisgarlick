/**
 * Push the refreshed SEO artifacts to Notion under "Chrisgarlick.com → 15th May Clusters".
 *
 * Run: NOTION_API=<token> bun scripts/push-seo-to-notion.mjs
 */

const TOKEN = process.env.NOTION_API
if (!TOKEN) { console.error('Set NOTION_API'); process.exit(1) }
const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json',
}

const PARENT_PAGE_ID = '3540a555-e5a3-804d-97eb-d65e4433ccfe' // Chrisgarlick.com

// ─── helpers ───────────────────────────────────────────────────────────────
const rt = (text, opts = {}) => ({
  type: 'text',
  text: { content: text },
  annotations: {
    bold: !!opts.bold,
    italic: !!opts.italic,
    code: !!opts.code,
    strikethrough: false,
    underline: false,
    color: opts.color || 'default',
  },
})

const para = (...spans) => ({ object: 'block', type: 'paragraph', paragraph: { rich_text: spans.length ? spans : [rt('')] } })
const h1 = (text) => ({ object: 'block', type: 'heading_1', heading_1: { rich_text: [rt(text)] } })
const h2 = (text) => ({ object: 'block', type: 'heading_2', heading_2: { rich_text: [rt(text)] } })
const h3 = (text) => ({ object: 'block', type: 'heading_3', heading_3: { rich_text: [rt(text)] } })
const bullet = (...spans) => ({ object: 'block', type: 'bulleted_list_item', bulleted_list_item: { rich_text: spans } })
const todo = (text, checked = false) => ({ object: 'block', type: 'to_do', to_do: { rich_text: [rt(text)], checked } })
const divider = () => ({ object: 'block', type: 'divider', divider: {} })
const callout = (text, emoji = '📌', color = 'gray_background') => ({
  object: 'block',
  type: 'callout',
  callout: { rich_text: [rt(text)], icon: { type: 'emoji', emoji }, color },
})
const toggle = (heading, children) => ({
  object: 'block',
  type: 'toggle',
  toggle: { rich_text: [rt(heading)], children },
})
const code = (text, language = 'plain text') => ({
  object: 'block',
  type: 'code',
  code: { rich_text: [rt(text)], language },
})

// ─── Notion API helpers ───────────────────────────────────────────────────
async function createPage(title, children) {
  // Notion caps children at 100 per request, but the create-page endpoint accepts more.
  // To be safe, create the page with the first 100 then append the rest.
  const first = children.slice(0, 100)
  const rest = children.slice(100)

  const res = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      parent: { page_id: PARENT_PAGE_ID },
      properties: {
        title: { title: [{ text: { content: title } }] },
      },
      children: first,
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`createPage failed: HTTP ${res.status}: ${err}`)
  }
  const pageJson = await res.json()
  const pageId = pageJson.id
  console.log(`  ✓ created page "${title}" (${pageId})`)

  // Append the rest in batches of 100
  for (let i = 0; i < rest.length; i += 100) {
    const batch = rest.slice(i, i + 100)
    const ar = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ children: batch }),
    })
    if (!ar.ok) {
      const err = await ar.text()
      throw new Error(`append blocks failed: HTTP ${ar.status}: ${err}`)
    }
    console.log(`  ✓ appended ${batch.length} blocks (offset ${i + 100})`)
  }
  return pageId
}

// ─── Build page content ───────────────────────────────────────────────────
const today = '2026-05-15'

const blocks = []

// Overview
blocks.push(callout(
  `Refreshed SEO architecture after the May 2026 refactor. New /industries structure, new /services/ai-engineering page, planned future verticals seeded. Cross-referenced against live state on chrisgarlick.com.`,
  '🧭',
  'blue_background',
))
blocks.push(para(rt('Generated: '), rt(today, { bold: true })))
blocks.push(para(
  rt('Local source files: '),
  rt('team/18-seo/keyword-strategy.md', { code: true }),
  rt(', '),
  rt('team/18-seo/topic-clusters.md', { code: true }),
  rt(', '),
  rt('team/18-seo/funnel-and-packages.md', { code: true }),
  rt(', '),
  rt('team/18-seo/on-page-spec.md', { code: true }),
))
blocks.push(divider())

// ─── Section 1: Pillars overview ─────────────────────────────────────────
blocks.push(h1('Pillars at a glance'))

blocks.push(h2('Service pillars (outcome-based, BOFU)'))
const servicePillars = [
  ['AI Implementation', '/services/ai-implementation', 'AI implementation UK', 'Live. FAQPage schema (5 Q&As).'],
  ['Workflow Automation', '/services/workflow-automation', 'workflow automation UK', 'Live.'],
  ['Custom AI Agents', '/services/ai-agents', 'custom AI agents UK', 'Live.'],
  ['Data Extraction', '/services/data-extraction', 'AI data extraction UK', 'Live.'],
  ['AI Engineering (NEW)', '/services/ai-engineering', 'AI engineer UK', 'Live. FAQPage schema. Covers RAG, model selection, private AI, evals.'],
]
for (const [name, url, kw, notes] of servicePillars) {
  blocks.push(bullet(
    rt(name, { bold: true }),
    rt('  →  '),
    rt(url, { code: true }),
    rt('  ·  Focus: '),
    rt(kw, { italic: true }),
    rt('  ·  '),
    rt(notes),
  ))
}

blocks.push(h2('Industry pillars (sector-based, BOFU)'))
const industryPillars = [
  ['Industries directory', '/industries', 'industry-specific AI UK', 'Live. CollectionPage + ProfessionalService JSON-LD.'],
  ['AI for Law Firms', '/industries/ai-for-law-firms', 'AI for law firms UK', 'Live. Moved from /services. 301 in place.'],
  ['AI for Accountancy Firms', '/industries/ai-for-accountancy-firms', 'AI for accountants UK', 'Live. Moved from /services. 301 in place.'],
  ['AI for Agencies', '/industries/ai-for-agencies', 'AI for marketing agencies UK', 'Live. Moved from /services. 301 in place.'],
]
for (const [name, url, kw, notes] of industryPillars) {
  blocks.push(bullet(
    rt(name, { bold: true }),
    rt('  →  '),
    rt(url, { code: true }),
    rt('  ·  Focus: '),
    rt(kw, { italic: true }),
    rt('  ·  '),
    rt(notes),
  ))
}

blocks.push(h2('Future industry pillars (priority order)'))
blocks.push(para(rt('Trigger each one when a real client engagement justifies the depth. Don\'t ship empty pillar pages.', { italic: true })))
const futureIndustries = [
  ['Surveying', '/industries/ai-for-surveyors', 'RICS-regulated, document-heavy'],
  ['Insurance brokers', '/industries/ai-for-insurance-brokers', 'Claim processing, document parsing'],
  ['Recruitment agencies', '/industries/ai-for-recruitment-agencies', 'Candidate matching, intake'],
  ['Financial advisers', '/industries/ai-for-financial-advisers', 'FCA-aware, suitability docs'],
  ['Property management', '/industries/ai-for-property-management', 'Tenancy admin, compliance'],
  ['Healthcare admin', '/industries/ai-for-healthcare-admin', 'NHS-adjacent admin, no clinical'],
]
for (const [name, url, notes] of futureIndustries) {
  blocks.push(todo(`${name}  ·  ${url}  ·  ${notes}`, false))
}
blocks.push(divider())

// ─── Section 2: Topic clusters ─────────────────────────────────────────
blocks.push(h1('Topic clusters'))
blocks.push(para(
  rt('Legend: '),
  rt('✓', { bold: true, color: 'green' }),
  rt(' live  ·  '),
  rt('☐', { bold: true }),
  rt(' to write  ·  '),
  rt('🛠', { bold: true }),
  rt(' audit needed'),
))

const clusters = [
  {
    name: 'A — AI Implementation (Service Pillar)',
    pillar: '/services/ai-implementation',
    keyword: 'AI implementation UK',
    funnel: 'BOFU + MOFU',
    pages: [
      ['✓', 'The AI Implementation Playbook for Service Businesses', '/article/the-ai-implementation-playbook-for-service-businesses', 'TOFU/MOFU'],
      ['✓', 'Why 48% of Companies Say AI Adoption Has Been a Disappointment', '/article/ai-adoption-disappointment-why-companies-fail', 'TOFU'],
      ['✓', 'Why 79% of Enterprises Are Getting It Wrong', '/article/why-79-of-enterprises-are-failing-at-ai-adoption', 'TOFU'],
      ['☐', 'AI Implementation Cost UK: What You Actually Pay', '/blog/ai-implementation-cost-uk', 'MOFU/BOFU · P1'],
      ['☐', 'AI Consultant vs AI Agency UK: How to Choose', '/blog/ai-consultant-vs-agency-uk', 'MOFU comparison · P1'],
      ['☐', 'Custom AI vs Off-the-Shelf Tools: When Each Wins', '/blog/custom-ai-vs-off-the-shelf', 'MOFU comparison · P1'],
      ['☐', 'In-House AI Hire vs Outsourced Partner', '/blog/in-house-ai-vs-outsourced', 'MOFU · P2'],
      ['☐', 'What is AI Implementation? A No-Jargon Guide for UK Businesses', '/blog/what-is-ai-implementation', 'TOFU · P2'],
    ],
  },
  {
    name: 'B — Workflow Automation (Outcome)',
    pillar: '/services/workflow-automation',
    keyword: 'workflow automation UK',
    funnel: 'BOFU',
    pages: [
      ['✓', 'The 3 Workflows Every Agency Should Automate First', '/article/agency-workflows-automate-first', 'TOFU/MOFU'],
      ['✓', 'How to Automate Client Intake Without Custom Software', '/article/automate-client-intake-without-custom-software', 'MOFU'],
      ['☐', 'Zapier vs Custom AI Automation: Where Each Breaks', '/blog/zapier-vs-custom-ai', 'MOFU comparison · P1'],
      ['☐', 'How to Map a Workflow Before You Automate It', '/blog/how-to-map-a-workflow', 'TOFU/MOFU · P2'],
      ['☐', 'Workflow Automation Cost UK: What Each Tier Buys', '/blog/workflow-automation-cost-uk', 'MOFU/BOFU · P2'],
    ],
  },
  {
    name: 'C — AI Agents (Outcome)',
    pillar: '/services/ai-agents',
    keyword: 'custom AI agents UK',
    funnel: 'BOFU',
    pages: [
      ['✓', 'Replacing Manual Data Entry with AI Agents', '/article/replacing-manual-data-entry-with-ai-agents', 'MOFU'],
      ['☐', 'Custom AI Agent vs Off-the-Shelf Chatbot', '/blog/custom-ai-agent-vs-chatbot', 'MOFU comparison · P1'],
      ['☐', 'When AI Agents Make Sense (And When They Don\'t)', '/blog/when-ai-agents-make-sense', 'MOFU · P2'],
      ['☐', 'AI Agents for Lead Research: A UK Walkthrough', '/blog/ai-agents-for-lead-research', 'MOFU · P2'],
      ['☐', 'AI Agent Architecture: Single-Step vs Multi-Step', '/blog/ai-agent-architecture', 'Technical · P3'],
    ],
  },
  {
    name: 'D — Data Extraction (Outcome)',
    pillar: '/services/data-extraction',
    keyword: 'AI data extraction UK',
    funnel: 'BOFU',
    pages: [
      ['☐', 'Extracting Structured Data from PDFs with AI: A UK Guide', '/blog/extracting-data-from-pdfs', 'MOFU · P1'],
      ['☐', 'Bank Statement Parsing for UK Accountancy: Build vs Buy', '/blog/bank-statement-parsing-uk', 'MOFU comparison · P1'],
      ['☐', 'Contract Data Extraction for UK Solicitors', '/blog/contract-data-extraction-solicitors', 'MOFU · P1'],
      ['☐', 'Invoice Extraction vs Manual Entry: The Real Cost', '/blog/invoice-extraction-vs-manual-entry', 'MOFU · P2'],
    ],
  },
  {
    name: 'E — AI Engineering (Technical depth, NEW)',
    pillar: '/services/ai-engineering',
    keyword: 'AI engineer UK',
    funnel: 'MOFU + BOFU',
    pages: [
      ['☐', 'What is RAG? Retrieval-Augmented Generation Explained (UK Edition)', '/blog/what-is-rag', 'TOFU/MOFU · P1'],
      ['☐', 'pgvector vs Qdrant for RAG: Which Vector Store to Pick', '/blog/pgvector-vs-qdrant', 'MOFU technical · P1'],
      ['☐', 'How to Choose an LLM for Business Use', '/blog/how-to-choose-an-llm', 'MOFU comparison · P1'],
      ['☐', 'Claude vs Llama vs GPT for UK Business', '/blog/claude-vs-llama-vs-gpt', 'MOFU comparison · P1'],
      ['☐', 'Running Ollama for Business: When On-Premises AI Makes Sense', '/blog/ollama-for-business', 'MOFU · P2'],
      ['☐', 'On-Premises LLM Deployment for UK Regulated Industries', '/blog/on-premises-llm-uk', 'MOFU · P2'],
      ['✓', '51% of Code on GitHub is AI-Generated', '/article/51-of-code-on-github-is-ai-generated-that-should-worry-you', 'TOFU (partially related)'],
      ['☐', 'LLM Evals for Production: A Practical Setup', '/blog/llm-evals-for-business', 'MOFU technical · P2'],
      ['☐', 'AI Observability: What to Log and Why', '/blog/ai-observability-production', 'MOFU technical · P2'],
      ['☐', 'Chaining vs Single-Prompt: When to Break a Workflow into Steps', '/blog/ai-chaining-vs-single-prompt', 'MOFU technical · P3'],
    ],
  },
  {
    name: 'F — AI for Law Firms (Industry)',
    pillar: '/industries/ai-for-law-firms',
    keyword: 'AI for law firms UK',
    funnel: 'BOFU + MOFU',
    pages: [
      ['✓', 'What AI Implementation Actually Means for a Law Firm', '/article/what-ai-implementation-means-law-firm', 'TOFU/MOFU'],
      ['☐', 'AI Document Automation for UK Solicitors: What Works in 2026', '/blog/ai-document-automation-solicitors', 'MOFU · P1'],
      ['☐', 'AI Client Intake Automation for Law Firms', '/blog/ai-client-intake-law-firms', 'MOFU · P1'],
      ['☐', 'AI Security & GDPR Compliance for UK Law Firms', '/blog/ai-security-gdpr-law-firms', 'MOFU objection · P1'],
      ['☐', 'AI Implementation Cost for a UK Law Firm', '/blog/ai-implementation-cost-law-firm', 'MOFU/BOFU · P1'],
      ['☐', 'AI for SRA-Regulated Firms: What Stays Inside the Firm', '/blog/ai-for-sra-regulated-firms', 'MOFU · P2'],
      ['☐', 'Conveyancing Automation: Where AI Actually Helps', '/blog/conveyancing-automation-ai', 'MOFU · P2'],
      ['☐', 'Should My Law Firm Use AI?', '/blog/should-my-law-firm-use-ai', 'TOFU · P2'],
    ],
  },
  {
    name: 'G — AI for Accountancy Firms (Industry)',
    pillar: '/industries/ai-for-accountancy-firms',
    keyword: 'AI for accountants UK',
    funnel: 'BOFU + MOFU',
    pages: [
      ['☐', 'AI Client Onboarding Automation for UK Accountancy Firms', '/blog/ai-onboarding-accountancy', 'MOFU · P1'],
      ['☐', 'AI for Xero Practices: Where the Hours Actually Save', '/blog/ai-for-xero-practices', 'MOFU · P1'],
      ['☐', 'AI for QuickBooks Practices: A Practical UK Guide', '/blog/ai-for-quickbooks-practices', 'MOFU · P1'],
      ['☐', 'AI for Sage Practices: Bookkeeping + Reporting Automation', '/blog/ai-for-sage-practices', 'MOFU · P1'],
      ['☐', 'MTD-Aligned AI Automation for UK Accountants', '/blog/mtd-ai-automation', 'MOFU · P1'],
      ['☐', 'AI for Compliance Document Preparation', '/blog/ai-compliance-documents-accountancy', 'MOFU · P2'],
      ['☐', 'AI vs Hiring: The Real Cost Comparison for UK Accountancy Firms', '/blog/ai-vs-hiring-accountancy', 'MOFU comparison · P1'],
      ['☐', 'How to Get Partner Buy-In for AI at Your Accountancy Practice', '/blog/partner-buy-in-ai-accountancy', 'MOFU · P2'],
    ],
  },
  {
    name: 'H — AI for Marketing Agencies (Industry)',
    pillar: '/industries/ai-for-agencies',
    keyword: 'AI for marketing agencies UK',
    funnel: 'BOFU + MOFU',
    pages: [
      ['✓', 'The 3 Workflows Every Agency Should Automate First', '/article/agency-workflows-automate-first', 'Also in Cluster B'],
      ['☐', 'AI Reporting Automation for UK Marketing Agencies', '/blog/ai-reporting-automation-agencies', 'MOFU · P1'],
      ['☐', 'AI Brief Processing: Turning a Messy Inbox into Structured Projects', '/blog/ai-brief-processing-agencies', 'MOFU · P1'],
      ['☐', 'AI Content Pipeline for Agencies: Build vs Buy', '/blog/ai-content-pipeline-agencies', 'MOFU comparison · P1'],
      ['☐', 'AI Competitor Research Automation for Agencies', '/blog/ai-competitor-research-automation', 'MOFU · P2'],
      ['☐', 'How to Offer AI Services to Your Agency\'s Clients', '/blog/offer-ai-services-agency-clients', 'MOFU · P2'],
    ],
  },
]

for (const c of clusters) {
  const children = []
  children.push(para(
    rt('Pillar: ', { bold: true }),
    rt(c.pillar, { code: true }),
    rt('   ·   Focus keyword: ', { bold: true }),
    rt(c.keyword, { italic: true }),
    rt('   ·   Funnel: ', { bold: true }),
    rt(c.funnel),
  ))
  for (const [status, title, url, meta] of c.pages) {
    const checked = status === '✓'
    children.push(todo(`${title}  →  ${url}  ·  ${meta}`, checked))
  }
  blocks.push(toggle(`Cluster ${c.name}`, children))
}

blocks.push(divider())

// ─── Section 3: Content Packages ─────────────────────────────────────────
blocks.push(h1('Content Packages (TOFU → MOFU → BOFU)'))
blocks.push(callout(
  'A package = a sequenced journey for one persona to one BOFU destination. Internal linking within a package is dense; between packages it\'s selective.',
  '📦',
  'orange_background',
))

const packages = [
  {
    name: 'Package 1 — Sarah\'s Law Firm Journey',
    persona: 'Sarah, Law Firm Managing Partner (Manchester, 15-person commercial firm)',
    bofu: '/industries/ai-for-law-firms → /audit',
    status: '2 of 7 articles live (29%)',
    priority: 'Ship in this order: 3, 6, 5',
    steps: [
      ['☐', 'TOFU', 'Should My Law Firm Use AI?'],
      ['✓', 'TOFU/MOFU', 'What AI Implementation Actually Means for a Law Firm'],
      ['☐', 'MOFU', 'AI Document Automation for UK Solicitors'],
      ['☐', 'MOFU', 'AI Client Intake Automation for Law Firms'],
      ['☐', 'MOFU objection', 'AI Security & GDPR Compliance for UK Law Firms'],
      ['☐', 'MOFU/BOFU', 'AI Implementation Cost for a UK Law Firm'],
      ['✓', 'BOFU', '/industries/ai-for-law-firms'],
      ['✓', 'Conversion', '/audit'],
    ],
  },
  {
    name: 'Package 2 — Tom\'s Agency Journey',
    persona: 'Tom, Agency Founder (London, 8-person digital marketing agency)',
    bofu: '/industries/ai-for-agencies → /contact',
    status: '1 of 7 articles live (14%)',
    priority: 'Ship in this order: 4, 2, 5',
    steps: [
      ['✓', 'TOFU', 'The 3 Workflows Every Agency Should Automate First'],
      ['☐', 'MOFU', 'AI Reporting Automation for UK Marketing Agencies'],
      ['☐', 'MOFU', 'AI Brief Processing: Turning a Messy Inbox into Structured Projects'],
      ['☐', 'MOFU comparison', 'Zapier vs Custom AI Automation'],
      ['☐', 'MOFU comparison', 'AI Content Pipeline for Agencies: Build vs Buy'],
      ['☐', 'MOFU', 'How to Offer AI Services to Your Agency\'s Clients'],
      ['✓', 'BOFU', '/industries/ai-for-agencies'],
      ['✓', 'Conversion', '/contact'],
    ],
  },
  {
    name: 'Package 3 — David\'s Accountancy Journey',
    persona: 'David, Practice Director (Birmingham, 30-person accountancy)',
    bofu: '/industries/ai-for-accountancy-firms → /audit',
    status: '1 of 7 articles live (14%)',
    priority: 'Ship in this order: 2, 5, 6',
    steps: [
      ['✓', 'TOFU/MOFU', 'The AI Implementation Playbook for Service Businesses'],
      ['☐', 'MOFU', 'AI Client Onboarding Automation for UK Accountancy Firms'],
      ['☐', 'MOFU', 'AI for Xero Practices: Where the Hours Actually Save'],
      ['☐', 'MOFU', 'MTD-Aligned AI Automation for UK Accountants'],
      ['☐', 'MOFU comparison', 'AI vs Hiring: The Real Cost Comparison for UK Accountancy'],
      ['☐', 'MOFU', 'How to Get Partner Buy-In for AI at Your Accountancy Practice'],
      ['✓', 'BOFU', '/industries/ai-for-accountancy-firms'],
      ['✓', 'Conversion', '/audit'],
    ],
  },
  {
    name: 'Package 4 — Technical Buyer Journey (CTOs, technical founders)',
    persona: 'Technical decision-maker at a UK business; CTO or technical founder',
    bofu: '/services/ai-engineering → /contact',
    status: '1 of 8 articles live (13%)',
    priority: 'Ship in this order: 3, 2, 4',
    steps: [
      ['✓', 'TOFU', '51% of Code on GitHub is AI-Generated'],
      ['☐', 'TOFU/MOFU', 'What is RAG? (UK Edition)'],
      ['☐', 'MOFU comparison', 'How to Choose an LLM for Business Use'],
      ['☐', 'MOFU comparison', 'Claude vs Llama vs GPT for UK Business'],
      ['☐', 'MOFU comparison', 'pgvector vs Qdrant for RAG'],
      ['☐', 'MOFU', 'Running Ollama for Business'],
      ['☐', 'MOFU', 'On-Premises LLM Deployment for UK Regulated Industries'],
      ['✓', 'BOFU', '/services/ai-engineering'],
      ['✓', 'Conversion', '/contact'],
    ],
  },
  {
    name: 'Package 5 — Evaluation Buyer Journey (cross-persona, highest leverage)',
    persona: 'Anyone in BOFU evaluating Chris vs alternatives',
    bofu: '/services/ai-implementation → /contact',
    status: '0 of 4 MOFU articles live',
    priority: 'Ship 1 and 4 first — they get cited by AI engines and feed every other package',
    steps: [
      ['☐', 'MOFU comparison', 'AI Consultant vs AI Agency UK: How to Choose'],
      ['☐', 'MOFU comparison', 'Custom AI vs Off-the-Shelf Tools'],
      ['☐', 'MOFU comparison', 'In-House AI Hire vs Outsourced Partner'],
      ['☐', 'MOFU cost', 'AI Implementation Cost UK: What You Actually Pay'],
      ['✓', 'BOFU', '/services/ai-implementation'],
      ['✓', 'BOFU', '/about (E-E-A-T)'],
      ['✓', 'Conversion', '/contact or /audit'],
    ],
  },
  {
    name: 'Package 6 — TOFU brand-awareness layer',
    persona: 'Anyone in early discovery',
    bofu: 'Routes to the right BOFU per persona',
    status: '5 articles live, well covered',
    priority: 'Hold further TOFU until MOFU is 60% complete (Rule 3)',
    steps: [
      ['✓', 'TOFU', '51% of Code on GitHub is AI-Generated'],
      ['✓', 'TOFU', 'Why 48% Say AI Adoption Has Been a Disappointment'],
      ['✓', 'TOFU', 'Why 79% of Enterprises Are Failing'],
      ['✓', 'TOFU', 'The 3 Workflows Every Agency Should Automate First'],
      ['✓', 'TOFU', 'The AI Implementation Playbook for Service Businesses'],
      ['☐', 'TOFU', 'How AI is Changing UK Professional Services'],
      ['☐', 'TOFU', 'AI for Small Business UK: A No-Hype Reality Check'],
    ],
  },
]

for (const p of packages) {
  const children = []
  children.push(para(rt('Persona: ', { bold: true }), rt(p.persona)))
  children.push(para(rt('BOFU destination: ', { bold: true }), rt(p.bofu, { code: true })))
  children.push(para(rt('Status: ', { bold: true }), rt(p.status)))
  children.push(para(rt('Priority: ', { bold: true }), rt(p.priority, { italic: true })))
  children.push(h3('Sequence'))
  for (const [status, stage, title] of p.steps) {
    const checked = status === '✓'
    children.push(todo(`[${stage}] ${title}`, checked))
  }
  blocks.push(toggle(p.name, children))
}

blocks.push(divider())

// ─── Section 4: Decision rules ─────────────────────────────────────────
blocks.push(h1('Decision rules for what to write next'))
const rules = [
  ['Rule 1', 'If a persona\'s BOFU page is live but they have <40% of their package shipped, write the next MOFU article in that package before anything else. All three personas currently fail this rule.'],
  ['Rule 2', 'If two packages share a comparison article, write it once and link from both. "AI Consultant vs AI Agency UK" and "AI Implementation Cost UK" both serve Packages 1, 2, 3 — highest-leverage first.'],
  ['Rule 3', 'Don\'t write TOFU until at least 60% of MOFU is shipped. Current TOFU coverage is already ahead of MOFU in 4 of 6 clusters. Pause TOFU.'],
  ['Rule 4', 'New industry pillars (Cluster I) get content only when a real client engagement exists. Empty pillar pages with no cluster pages rank for nothing and waste crawl budget.'],
]
for (const [n, text] of rules) {
  blocks.push(bullet(rt(n + ': ', { bold: true }), rt(text)))
}

blocks.push(divider())

// ─── Section 5: 90-day priority list ─────────────────────────────────────
blocks.push(h1('90-day P1 priority list'))
blocks.push(para(rt('Write these 10 articles before anything else:', { italic: true })))
const p1List = [
  'AI Implementation Cost UK',
  'AI Consultant vs AI Agency UK',
  'Zapier vs Custom AI Automation',
  'What is RAG? UK Edition',
  'How to Choose an LLM for Business Use',
  'AI Document Automation for UK Solicitors',
  'AI Client Intake Automation for Law Firms',
  'AI Reporting Automation for UK Agencies',
  'AI for Xero Practices',
  'AI vs Hiring: UK Accountancy',
]
for (const t of p1List) blocks.push(todo(t, false))

blocks.push(divider())

// ─── Section 6: Open tasks (system + content) ─────────────────────────────
blocks.push(h1('Open tasks (system + content gaps)'))
blocks.push(h3('System / template'))
const systemTasks = [
  'Add "Common questions" CMS block to each industry pillar (Law, Accountancy, Agencies)',
  'Add FAQPage JSON-LD per industry pillar in src/pages/industries/[slug].astro',
  'Sweep all live articles for stale /services/ai-for-X references (rewrite to /industries/)',
  'Generate path-specific OG images for /industries, /industries/<slug>, /services/ai-engineering',
  'Submit /industries and /services/ai-engineering via Google Search Console "Request indexing"',
]
for (const t of systemTasks) blocks.push(todo(t, false))

blocks.push(h3('Conversion levers'))
const conversionTasks = [
  'Second lead magnet beyond the prompt library: "AI Readiness Checklist UK"',
  'Third lead magnet: "LLM Selection Decision Tree"',
  'First 3 case studies on /work/<slug> once client engagements close',
]
for (const t of conversionTasks) blocks.push(todo(t, false))

blocks.push(divider())
blocks.push(para(rt('End of doc. Local source files in '), rt('team/18-seo/', { code: true })))

// ─── Push ────────────────────────────────────────────────────────────────
console.log(`Pushing ${blocks.length} blocks to Notion under "Chrisgarlick.com → 15th May Clusters"...`)
await createPage('15th May Clusters', blocks)
console.log('\nDone.')
