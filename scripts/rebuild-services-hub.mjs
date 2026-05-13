/**
 * Phase 2 step 2: rebuild /services hub around outcome verticals.
 *
 * Run: JWT_TOKEN=<token> bun scripts/rebuild-services-hub.mjs
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
const ol   = (...items) => ({ type: 'orderedList', content: items.map(line => ({ type: 'listItem', content: [Array.isArray(line) ? p(...line) : p(line)] })) , attrs: { start: 1 } })
const doc  = (...nodes) => ({ type: 'doc', content: nodes })
const id   = () => crypto.randomUUID()

const hero        = (fields) => ({ id: id(), type: 'hero',         fields })
const textSection = (fields) => ({ id: id(), type: 'text-section', fields })
const columns     = (fields) => ({ id: id(), type: 'columns',      fields })
const cta         = (fields) => ({ id: id(), type: 'cta',          fields })

const content = [
  hero({
    label: 'Services',
    heading: 'AI that replaces real work, not just decks.',
    subtext: 'Three outcome lanes — workflow automation, custom AI agents, data extraction — built around what the technology can actually deliver today. Direct execution, no consultants in the middle.',
    ctaLabel: 'Start with a free site audit',
    ctaUrl: '/tools/site-audit',
    ctaSecondaryLabel: 'Book a scoping call',
    ctaSecondaryUrl: '/contact',
  }),

  textSection({
    label: 'What I do',
    heading: 'AI implementation, defined precisely.',
    body: doc(
      p('Most "AI services" sit on one end or the other: a chatbot vendor at one extreme, a consulting deck at the other. Neither solves the problem most businesses actually have, which is: ', bold('we are doing the same manual work over and over, and we want it to stop')),
      p('What I build sits in the middle — custom systems that read your inputs, do the language work, and hand a draft back to a human to approve. Three lanes, depending on the shape of the problem.'),
    ),
  }),

  textSection({
    label: 'Lane 01',
    heading: 'Workflow Automation',
    body: doc(
      p('For repetitive multi-step processes — client intake, invoice approvals, monthly reporting, document drafting. The kind of work where the steps are predictable but the joins between them leak hours. I build the pipeline that captures, classifies, routes and actions each run, with humans approving the outputs that ship externally.'),
      p('Typical compression: eight manual steps into two manual touchpoints; days of lag turned into minutes.'),
    ),
    ctaLabel: 'See how workflow automation works →',
    ctaUrl: '/services/workflow-automation',
  }),

  textSection({
    label: 'Lane 02',
    heading: 'Custom AI Agents',
    body: doc(
      p('For tasks that need reading, thinking and writing — not just moving data from A to B. Lead research before a discovery call. Email triage. Document review against a checklist. Meeting summarisation. Tasks too unstructured for a workflow tool, too repetitive to keep doing by hand.'),
      p('Each agent is single-purpose, scoped narrowly, fully observable, and always hands its output to a human to approve. The judgement stays with you; the reading and drafting comes off your plate.'),
    ),
    ctaLabel: 'See how AI agents work →',
    ctaUrl: '/services/ai-agents',
  }),

  textSection({
    label: 'Lane 03',
    heading: 'Data Extraction',
    body: doc(
      p('For data locked in PDFs, emails, forms, web pages — anywhere structured information lives inside unstructured documents. Contract data extraction, statement parsing, web monitoring, competitor pricing pipelines. The unglamorous work of getting clean, queryable data out of messy sources.'),
      p('Built with Claude\'s structured output, Node.js, and headless browser automation where required. The output lands in the system you already use.'),
    ),
    ctaLabel: 'See how data extraction works →',
    ctaUrl: '/services/data-extraction',
  }),

  textSection({
    label: 'How I work',
    heading: 'Four phases. No deck, no surprises.',
    body: doc(
      ol(
        [bold('Audit'), ' — I look at what your team actually does day-to-day, in the systems you already use. Not a workshop, not a survey — a direct look at the workflow.'],
        [bold('Scope'), ' — I write the spec. The exact workflow being automated, the success criteria, the stack, the timeline, the price. Fixed-fee from this point.'],
        [bold('Build'), ' — I build it. Direct execution: no project managers, no junior handoffs, no brief-to-delivery translation loss. You can ask me anything technical, any time.'],
        [bold('Measure'), ' — once it ships, we measure. Time saved, error rate, throughput. The numbers go into a short retrospective and an ongoing maintenance plan.'],
      ),
      p(bold('Pricing.'), ' Engagements start at £500 — that\'s a focused fix for a single bottleneck, a few hours of work. Larger builds (multi-step agent systems, custom integrations, ongoing retainers) scale from there and are quoted per project after the scoping call. The ', link('free site audit', '/tools/site-audit'), ' is the cleanest way to find out which tier fits your situation.'),
    ),
  }),

  columns({
    label: 'Working in a specific sector?',
    heading: 'Sector-specific pages — pain points, examples and crosslinks.',
    column1Heading: 'AI for Law Firms',
    column1Body: 'Document-heavy workflows: contract extraction, intake, matter summarisation. /services/ai-for-law-firms',
    column2Heading: 'AI for Accountancy',
    column2Body: 'Statement and receipt parsing, monthly reporting, client onboarding packs. /services/ai-for-accountancy-firms',
    column3Heading: 'AI for Agencies',
    column3Body: 'Brief processing, status reports, client comms, competitor research pipelines. /services/ai-for-agencies',
  }),

  cta({
    heading: 'Not sure which lane fits?',
    body: 'The free site audit is the simplest way to find out. Run it, tell me which manual task is eating your week, and we\'ll talk through what shape of build would actually solve it.',
    ctaLabel: 'Run a free site audit',
    ctaUrl: '/tools/site-audit',
  }),
]

const seo = {
  metaTitle:         'AI Implementation Services — Workflow, Agents, Data Extraction',
  metaDescription:   'Three outcome lanes for AI implementation: workflow automation, custom AI agents, and data extraction. UK-based, one-person delivery. Direct execution, no agency overhead.',
  ogTitle:           'AI Implementation Services — Three Outcome Lanes',
  ogDescription:     'Workflow automation, custom AI agents, data extraction. Direct execution. From £500 for scoped builds.',
  ogType:            'website',
  focusKeyword:      'ai implementation services',
  secondaryKeywords: 'workflow automation services, ai agent development, ai data extraction, ai implementation uk, custom ai solutions for business, ai services for small business, claude api implementation, one-person ai partner',
  robotsIndex:       'index',
  robotsFollow:      'follow',
  twitterCard:       'summary_large_image',
}

const PAGE_ID = '02d27a9a-ef5e-4028-be13-ccbd78387858'
const r = await fetch(`${BASE}/page/${PAGE_ID}`, {
  method: 'PATCH',
  headers: auth,
  body: JSON.stringify({ content, seo, title: 'Services' }),
})
const body = await r.text()
if (r.ok) {
  console.log(`Updated /services hub (${PAGE_ID}) — ${content.length} blocks`)
} else {
  console.error(`PATCH failed:`, r.status, body)
  process.exit(1)
}
