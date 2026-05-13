/**
 * Phase 2 step 3: expand /services/ai-implementation to a full pillar page.
 *
 * Run: JWT_TOKEN=<token> bun scripts/rebuild-pillar.mjs
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
const ol   = (...items) => ({ type: 'orderedList', content: items.map(line => ({ type: 'listItem', content: [Array.isArray(line) ? p(...line) : p(line)] })), attrs: { start: 1 } })
const h3   = (text) => ({ type: 'heading', attrs: { level: 3 }, content: [t(text)] })
const doc  = (...nodes) => ({ type: 'doc', content: nodes })
const id   = () => crypto.randomUUID()

const hero        = (fields) => ({ id: id(), type: 'hero',         fields })
const textSection = (fields) => ({ id: id(), type: 'text-section', fields })
const columns     = (fields) => ({ id: id(), type: 'columns',      fields })
const cta         = (fields) => ({ id: id(), type: 'cta',          fields })

const content = [
  hero({
    label: 'AI Implementation',
    heading: 'AI implementation that actually replaces manual work.',
    subtext: 'Not chatbots, not ChatGPT Plus, not a consulting deck. Custom AI systems that run quietly in the background and take repetitive work off your team\'s plate for good. One person, direct execution, fixed pricing.',
    ctaLabel: 'Start with a free site audit',
    ctaUrl: '/tools/site-audit',
    ctaSecondaryLabel: 'Book a scoping call',
    ctaSecondaryUrl: '/contact',
  }),

  textSection({
    label: '01 — What it is',
    heading: 'What AI implementation actually means.',
    body: doc(
      p('Half the businesses I talk to have already "tried AI." They mean one of three things:'),
      ul(
        'They subscribed to ChatGPT Plus and a couple of people use it for emails.',
        'They bought a vendor chatbot that nobody on the team trusts.',
        'They sat through a consultancy workshop that produced a slide deck and a quote.',
      ),
      p('None of those is implementation. ', bold('Implementation is the moment when a workflow that used to be done by hand is now done by a system you own.'), ' The team isn\'t prompted to use AI — they don\'t see it. The work just happens differently. Reports arrive. Replies get drafted. Documents get reviewed. The system runs.'),
      p('That\'s the line. Buying a tool is procurement. Setting up a chatbot is marketing. Implementation is engineering — and that\'s what I do.'),
    ),
  }),

  textSection({
    label: '02 — How it works',
    heading: 'Four phases, no theatre.',
    body: doc(
      ol(
        [bold('Audit'), ' — I look at how your team actually works. The systems, the workflows, the bottlenecks. Not a survey, not a workshop — a direct look at what\'s happening day-to-day. Output: a short written report listing the workflows worth automating, ranked by ROI.'],
        [bold('Identify'), ' — we agree on the single workflow to build first. The criteria: high frequency, high cost in current hours, documentable rules, the right shape for AI. Most firms have two or three obvious candidates. We pick one.'],
        [bold('Build'), ' — I build it. Direct work, no project managers, no junior handoffs. Two to six weeks depending on integrations and scope. Fixed-fee from the scope onwards — you know the price before work starts.'],
        [bold('Measure'), ' — once it ships, we measure. Time saved, error rate, throughput. The numbers go into a short retrospective. If the build needs to grow, we scope phase two. If it\'s done, we move on.'],
      ),
    ),
  }),

  textSection({
    label: '03 — What you get',
    heading: 'A system you own, not a tool you rent.',
    body: doc(
      p('At the end of an implementation, you have:'),
      ul(
        [bold('Working software'), ' — running in production, integrated with your existing systems, used by your team daily.'],
        [bold('Documentation'), ' — what it does, how it does it, where the boundaries are, what to do when something breaks.'],
        [bold('Source code'), ' — owned by you. No black-box vendor lock-in. Any developer can read it, extend it, replace it. If we part ways, you still have a system.'],
        [bold('Metrics'), ' — measured before and after, in a one-page retrospective.'],
        [bold('A maintenance path'), ' — optional monthly retainer for monitoring, updates, and small extensions. Or pick it up yourself.'],
      ),
      p('What you ', bold('don\'t'), ' get: a slide deck, a roadmap document, a recommendation to "explore further." If the answer to your problem is "do nothing" or "buy an off-the-shelf tool", I\'ll tell you that during the scoping call and you won\'t pay for a build.'),
    ),
  }),

  textSection({
    label: '04 — Three lanes',
    heading: 'The shapes implementation comes in.',
    body: doc(
      p('Three categories cover almost every build I take on. The audit decides which lane your workflow lives in:'),
      ul(
        [link('Workflow automation', '/services/workflow-automation'), ' — repeatable multi-step processes. Client intake, invoicing, reporting, document drafting. Compress eight manual steps into two.'],
        [link('Custom AI agents', '/services/ai-agents'), ' — tasks that need reading and thinking, not just execution. Lead research, email triage, document review, meeting summarisation.'],
        [link('Data extraction', '/services/data-extraction'), ' — pulling structured data out of unstructured documents. Contracts, statements, web pages, forms.'],
      ),
      p('Most builds fit cleanly into one of the three. Some span two — a workflow that uses an agent as one of its steps, for example. The audit and scoping call clarifies which shape your problem is.'),
    ),
  }),

  textSection({
    label: '05 — Examples',
    heading: 'What this looks like when it ships.',
    body: doc(
      p('A small professional-services firm with a manual client intake. Before the build: eight steps, three hours of someone\'s week, lead-to-reply averaging 24 hours, two leads a month dropped because nobody followed up. After: two manual steps, 30 minutes a week, lead-to-reply 90 minutes, zero drops. Build time: 3 weeks. Stack: Claude API, Node.js, Zapier, Airtable.'),
      p('An accountancy firm assembling monthly client reports. Before: two hours per client per month, three errors a month requiring re-issue, partners spending review time on data-entry checking instead of analysis. After: 8 minutes per client, AI-drafted commentary with partner approval, zero re-issues in the first quarter post-launch. Build time: 4 weeks. Stack: Claude API, Node.js, custom PDF parser, the firm\'s existing reporting tool.'),
      p('Numbers vary, shape repeats. Most workflows compress 60–90% on time, with quality controls staying intact because humans approve every output that leaves the building.'),
    ),
  }),

  textSection({
    label: '06 — Common questions',
    heading: 'What people actually want to know.',
    body: doc(
      h3('How long does an AI implementation project take?'),
      p('Most builds run two to six weeks of focused work, with another two weeks of measure-and-iterate after go-live. The audit and scoping happen in week one. The actual build typically takes one to four weeks depending on integrations and scope. Longer builds — multi-agent systems, complex integrations — are scoped explicitly during the scoping call.'),
      h3('What does AI implementation cost?'),
      p('Engagements start at £500 — a focused fix for a single bottleneck, a few hours of work. Workflow automation builds with one or two integrations typically land between £2,000 and £8,000. Larger agent systems, custom integrations and ongoing retainers are quoted per project after scoping. Pricing is fixed before the build starts — no day rates, no overruns.'),
      h3('Do I need existing technical infrastructure?'),
      p('No. Most builds work with the systems you already use — Google Workspace or Microsoft 365, your CRM (Clio, HubSpot, Notion, Airtable, whatever), your accounting tool, your inbox. The point is to slot into how you already work, not to force a migration. If something genuinely is missing, I\'ll flag it during the audit before we agree to a build.'),
      h3('What if I don\'t know which workflow to automate first?'),
      p('That\'s what the free site audit is for. Run it, tell me which manual task is eating your week, and we\'ll talk through it on a 30-minute call. The first build is always the one with the clearest ROI — and the audit\'s job is to surface that.'),
      h3('Do you work with non-UK businesses?'),
      p('Yes, but the bias is UK. Time-zone overlap matters when you\'re working with one person. Most clients are in the UK; some are in EU and US East Coast. Pacific time-zone clients are harder — the daily overlap is too narrow for a focused build.'),
    ),
  }),

  cta({
    heading: 'Ready to see what implementation looks like for your team?',
    body: 'The scoping call is 30 minutes. You bring the workflow you\'d most like gone. I tell you what shape of build solves it, what it costs, and how long it would take. If I can\'t help, I\'ll point you somewhere that can.',
    ctaLabel: 'Book a scoping call',
    ctaUrl: '/contact',
  }),
]

const seo = {
  metaTitle:         'AI Implementation Partner UK — Custom Systems, Fixed Pricing',
  metaDescription:   'AI implementation for UK businesses: custom systems that replace manual work, fixed pricing from £500. Direct execution by one person — no agency, no consulting decks.',
  ogTitle:           'AI Implementation — A System You Own, Not a Tool You Rent',
  ogDescription:     'Custom AI implementation: workflow automation, custom agents, data extraction. Fixed pricing, direct execution, one person. UK-based.',
  ogType:            'website',
  focusKeyword:      'ai implementation',
  secondaryKeywords: 'ai implementation uk, ai implementation partner, ai implementation services, custom ai implementation, ai implementation cost, how long does ai implementation take, ai implementation for small business, vertical ai implementation, ai consultant uk, ai developer uk',
  robotsIndex:       'index',
  robotsFollow:      'follow',
  twitterCard:       'summary_large_image',
}

const PAGE_ID = '87cbd84e-b8dc-4f61-b024-d919b545bfbc'
const r = await fetch(`${BASE}/page/${PAGE_ID}`, {
  method: 'PATCH',
  headers: auth,
  body: JSON.stringify({ content, seo, title: 'AI Implementation' }),
})
const body = await r.text()
if (r.ok) {
  console.log(`Updated /services/ai-implementation pillar (${PAGE_ID}) — ${content.length} blocks`)
} else {
  console.error(`PATCH failed:`, r.status, body)
  process.exit(1)
}
