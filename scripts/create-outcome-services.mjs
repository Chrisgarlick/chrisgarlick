/**
 * Phase 2: create the two new outcome service pages
 *   - /services/workflow-automation
 *   - /services/ai-agents
 *
 * Run: JWT_TOKEN=<token> bun scripts/create-outcome-services.mjs
 *
 * Idempotent — if a page with the slug exists, its content+seo are PATCHed instead of duplicated.
 */

const JWT = process.env.JWT_TOKEN
const BASE = process.env.CMS_API_BASE || 'https://chrisgarlick.com/api'
if (!JWT) { console.error('Set JWT_TOKEN'); process.exit(1) }
const auth = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${JWT}` }

// ── TipTap helpers ─────────────────────────────────────────────────────
const t    = (text) => ({ type: 'text', text })
const bold = (text) => ({ type: 'text', text, marks: [{ type: 'bold' }] })
const link = (text, href) => ({ type: 'text', text, marks: [{ type: 'link', attrs: { href, target: null } }] })
const p    = (...parts) => ({ type: 'paragraph', content: parts.flatMap(part => Array.isArray(part) ? part : [typeof part === 'string' ? t(part) : part]) })
const ul   = (...items) => ({ type: 'bulletList', content: items.map(line => ({ type: 'listItem', content: [Array.isArray(line) ? p(...line) : p(line)] })) })
const doc  = (...nodes) => ({ type: 'doc', content: nodes })
const id   = () => crypto.randomUUID()

// ── Block builders ─────────────────────────────────────────────────────
const hero = (fields) => ({ id: id(), type: 'hero', fields })
const textSection = (fields) => ({ id: id(), type: 'text-section', fields })
const columns = (fields) => ({ id: id(), type: 'columns', fields })
const cta = (fields) => ({ id: id(), type: 'cta', fields })

// ───────────────────────────────────────────────────────────────────────
//   Page 1: /services/workflow-automation
// ───────────────────────────────────────────────────────────────────────

const workflowAutomation = {
  title: 'Workflow Automation',
  slug: 'workflow-automation',
  status: 'draft',
  content: [
    hero({
      label: 'Workflow Automation',
      heading: 'Stop doing the same task thirty times a week.',
      subtext: 'Repetitive multi-step workflows — client intake, invoice approvals, monthly reporting, document drafting — are the cheapest things to automate and the highest ROI. I build the systems that take them off your team\'s plate for good.',
      ctaLabel: 'Start with a free site audit',
      ctaUrl: '/tools/site-audit',
      ctaSecondaryLabel: 'Book a scoping call',
      ctaSecondaryUrl: '/contact',
    }),

    textSection({
      label: '01 — The problem',
      heading: 'If your team is doing it more than ten times a month, automation is probably the answer.',
      body: doc(
        p('Every business has them: the workflows that run on autopilot in everyone\'s head, not in any system. Client intake. The monthly client report. The invoice that needs three approvers before it goes to AP. The proposal that gets rebuilt from scratch every Wednesday.'),
        p('Each individual step is small. The cost is in the joins between them — the email that sits unanswered for two days, the spreadsheet someone forgot to update, the document that bounces between three drafts because the template was last refreshed in 2023.'),
        p('Off-the-shelf tools rarely fit because the workflow is yours. Generic CRMs assume one shape. Generic automation tools assume another. What you actually need is a pipeline built for the way your team works, integrated with the systems you already use.'),
      ),
    }),

    textSection({
      label: '02 — What I build',
      heading: 'A custom pipeline that does the same job, the same way, every time.',
      body: doc(
        p('Most workflows fit a pattern: capture an input, classify it, route it down a path, take an action. The art is in getting each step right for ', bold('your'), ' workflow, not a generic one.'),
        p('A typical build looks like this:'),
        ul(
          [bold('Capture'), ' — every incoming signal (form, email, API call, file drop) lands in one place within seconds, with a structured record created automatically.'],
          [bold('Classify'), ' — the AI reads it, categorises it against criteria you\'ve specified, and writes its judgement back to the record. A human reviews the classification, not the raw input.'],
          [bold('Route'), ' — the classified record goes down one of several paths. Each path is a small, named set of rules — not a sprawling logic tree.'],
          [bold('Action'), ' — the system drafts whatever needs drafting (reply, document, notification), and a human approves it before it ships. The bottleneck collapses; the quality control stays.'],
        ),
        p('What you get at the end is not a tool subscription you have to learn. It\'s a system that runs in the background, that your team uses without noticing, that you own.'),
      ),
    }),

    columns({
      label: '03 — What\'s under the hood',
      heading: 'Technical stack, no black boxes.',
      column1Heading: 'Claude API',
      column1Body: 'Anthropic\'s Claude does the language work — drafting, classifying, summarising. Sonnet for high-quality output, Haiku for cheap orchestration. Structured outputs let the AI integrate cleanly with the rest of the pipeline.',
      column2Heading: 'Node.js / TypeScript',
      column2Body: 'The backbone is plain Node — easy to read, easy to maintain, no proprietary platform lock-in. Workflows are version-controlled in your repo or mine, not buried inside someone else\'s tool. You can hire any developer to extend it.',
      column3Heading: 'Zapier or Make',
      column3Body: 'For glue between SaaS tools — calendars, CRMs, email, finance systems — I use the no-code automation layer that suits your team. Custom code only where it genuinely pays off. Most workflows use both.',
    }),

    textSection({
      label: '04 — What ships',
      heading: 'The shape of a finished automation.',
      body: doc(
        p('A worked example: a small professional-services firm doing ten new client enquiries a week. The current intake process involves eight manual steps — initial reply, qualification, calendar booking, discovery call notes, proposal drafting, engagement letter, matter setup, kickoff. Two days of someone\'s week, every week.'),
        p('After the build, the same intake runs with two manual touchpoints: a human reads and clicks send on the AI-drafted reply, and a human edits the proposal before it goes out. The other six steps run in the background. ', bold('Total active time per lead: under two minutes. Lead-to-reply: under ninety minutes instead of twenty-four hours.')),
        p('The numbers vary by workflow and by firm. The shape doesn\'t. Wherever there\'s a repeatable process being done by hand, the same compression is achievable.'),
      ),
    }),

    textSection({
      label: '05 — Is this right for you?',
      heading: 'Who workflow automation is — and isn\'t — for.',
      body: doc(
        p(bold('A good fit if:')),
        ul(
          'You have a workflow that runs at least ten times a month.',
          'The current process is documented, or documentable in an afternoon.',
          'You have a system of record (CRM, spreadsheet, practice-management tool) the automation can read from and write to.',
          'You\'re comfortable with the AI drafting outputs that a human reviews before they ship.',
        ),
        p(bold('Probably not the right move if:')),
        ul(
          'You\'re trying to automate sales prospecting (different problem, different stack).',
          'You need RPA to control someone else\'s UI — that\'s a different category of build.',
          'The workflow involves regulated decisions that genuinely require partner-level human judgement at every step.',
          'You don\'t yet have a clear sense of which workflow you\'d start with.',
        ),
        p('That last one is fixable. ', link('Run the free site audit', '/tools/site-audit'), ' and tell me the manual task you\'d most like gone — we can use that as the starting point.'),
      ),
    }),

    cta({
      heading: 'Tell me the workflow you\'d most like gone.',
      body: 'Thirty-minute scoping call. I\'ll walk you through what\'s worth automating, what isn\'t, and what a build would actually look like. No pitch — if I can\'t help, I\'ll say so.',
      ctaLabel: 'Book a scoping call',
      ctaUrl: '/contact',
    }),
  ],
  seo: {
    metaTitle:         'Workflow Automation with AI for UK Businesses',
    metaDescription:   'I build custom AI-powered pipelines that replace manual multi-step workflows — intake, invoicing, reporting, document drafting. Direct execution, no agency overhead.',
    ogTitle:           'Workflow Automation — Replace Your Most Repetitive Tasks',
    ogDescription:     'Custom AI pipelines that compress eight-step manual workflows into two-step automated ones. UK-based, one-person delivery.',
    ogType:            'website',
    focusKeyword:      'automating business workflows with ai',
    secondaryKeywords: 'workflow automation uk, ai workflow automation, automate client intake, automate invoice processing, automate monthly reporting, ai document drafting, business process automation with ai, custom ai pipelines, no-code workflow automation alternatives',
    robotsIndex:       'index',
    robotsFollow:      'follow',
    twitterCard:       'summary_large_image',
  },
}

// ───────────────────────────────────────────────────────────────────────
//   Page 2: /services/ai-agents
// ───────────────────────────────────────────────────────────────────────

const aiAgents = {
  title: 'Custom AI Agents',
  slug: 'ai-agents',
  status: 'draft',
  content: [
    hero({
      label: 'Custom AI Agents',
      heading: 'For the tasks that need judgement, not just execution.',
      subtext: 'Lead research. Email triage. Document review. Meeting summarisation. Tasks that demand reading, thinking, and writing — not just moving data from A to B. I build the agents that handle them, with the human kept on the hook for what goes out.',
      ctaLabel: 'Start with a free site audit',
      ctaUrl: '/tools/site-audit',
      ctaSecondaryLabel: 'Book a scoping call',
      ctaSecondaryUrl: '/contact',
    }),

    textSection({
      label: '01 — The problem',
      heading: 'Some work is too unstructured for a workflow tool, too repetitive to do by hand.',
      body: doc(
        p('Reviewing a contract for red flags. Researching a prospect before a discovery call. Triaging a hundred inbound emails into urgent / standard / noise. Summarising a sixty-minute meeting transcript into decisions and actions.'),
        p('None of these fits a rigid workflow. The output depends on what\'s in the input — and the input is different every time. Traditional automation breaks on the irregularity. But the task itself is repetitive enough that doing it by hand, over and over, is a waste of the most expensive hours in your business.'),
        p('This is what AI agents are actually for. Not "an algorithm that decides things." A system that reads, applies a clear set of instructions, and produces a draft for a human to review.'),
      ),
    }),

    textSection({
      label: '02 — What I build',
      heading: 'An agent that does the thinking, with you doing the deciding.',
      body: doc(
        p('Every agent I build follows the same skeleton, scaled to the task:'),
        ul(
          [bold('Role'), ' — who the agent is and what it\'s authorised to do. "A senior commercial solicitor reviewing a software licence." "A research analyst preparing a one-page brief on a prospect."'],
          [bold('Context'), ' — what it has access to. The document, the transcript, the CRM record, the latest news search. Scoped narrowly, never given the whole estate.'],
          [bold('Constraints'), ' — what it can\'t do. No facts not in the source. No promises about outcomes. Flag ambiguity rather than guess.'],
          [bold('Output shape'), ' — the exact format the result lands in. A review note with three sections. A bulleted brief. A one-paragraph summary. Predictable enough that downstream systems and humans can consume it.'],
        ),
        p('The agent never ships output unsupervised. The point is to remove the reading, thinking and first-draft work — not the decision. The decision stays with you.'),
      ),
    }),

    columns({
      label: '03 — What\'s under the hood',
      heading: 'Stack designed for cost, control, and predictability.',
      column1Heading: 'Claude (Haiku + Sonnet)',
      column1Body: 'Two tiers: Claude Haiku handles orchestration, routing and cheap classification at fraction-of-a-penny cost. Claude Sonnet handles the final-output thinking. Splitting the work this way keeps the bill down without sacrificing quality.',
      column2Heading: 'Custom skill layers',
      column2Body: 'Each agent gets a small, focused set of tools — search the CRM, query the calendar, draft an email, write to a file. Skills are versioned, documented, and inspectable. No mystery about what the agent can and can\'t reach.',
      column3Heading: 'Observability built in',
      column3Body: 'Every agent run is logged: prompt, response, tokens, latency, outcome. When something goes wrong (and it will), you can see exactly what happened. No black boxes, no "the AI decided" answers.',
    }),

    textSection({
      label: '04 — What ships',
      heading: 'Where agents earn their keep.',
      body: doc(
        p('Four use cases that recur:'),
        ul(
          [bold('Lead research'), ' — an agent that reads a prospect\'s website, LinkedIn, recent news, and a few internal notes, then produces a one-page brief before every discovery call. What was a 20-minute pre-call scramble becomes a 30-second read.'],
          [bold('Email triage'), ' — an agent that classifies every inbound email by urgency and category, drafts suggested replies for the urgent ones, and surfaces the noise so it can be ignored. The inbox isn\'t empty — it\'s sorted.'],
          [bold('Document review'), ' — first-pass review of contracts, briefs, applications, against a checklist of red flags. The agent surfaces the issues; the human decides what to do about them.'],
          [bold('Meeting summarisation'), ' — transcript in, structured summary out: decisions, actions (with owners and deadlines), open questions, follow-ups. No more "did anyone take notes?"'],
        ),
        p('Each of these is a single-purpose agent. You\'re not buying a platform — you\'re commissioning the specific tool you need, scoped to do its one job extremely well.'),
      ),
    }),

    textSection({
      label: '05 — Is this right for you?',
      heading: 'Where agents fit, and where they don\'t.',
      body: doc(
        p(bold('A good fit if:')),
        ul(
          'You have a recurring task that requires reading and judgement, not just execution.',
          'You can specify the criteria for what "good output" looks like (a checklist, a template, an example).',
          'You\'re happy to keep a human reviewing the agent\'s output before it ships externally.',
          'The cost of doing the task manually is currently real (hours per week, or quality slipping under load).',
        ),
        p(bold('Probably not the right move if:')),
        ul(
          'The task is too varied to specify any rules around it (creative work, nuanced strategy).',
          'You\'re looking for the agent to make the final decision, not draft it for a human to approve.',
          'The volume is so low that the build cost outweighs the time saved.',
        ),
      ),
    }),

    cta({
      heading: 'Got a task in mind?',
      body: 'Thirty-minute call. Bring the task, the criteria, and an example of good output. I\'ll tell you whether an agent is the right shape of solution, what it would cost, and how long it would take.',
      ctaLabel: 'Book a scoping call',
      ctaUrl: '/contact',
    }),
  ],
  seo: {
    metaTitle:         'Custom AI Agents for Business Tasks — UK',
    metaDescription:   'I build single-purpose AI agents for lead research, email triage, document review and meeting summarisation. Claude API, custom skills, human-in-the-loop.',
    ogTitle:           'Custom AI Agents — Build the Specific Tool You Need',
    ogDescription:     'Single-purpose AI agents that handle reading-and-thinking tasks: research briefs, email triage, document review, meeting summaries. Human-reviewed output.',
    ogType:            'website',
    focusKeyword:      'custom ai agents for business',
    secondaryKeywords: 'ai agents uk, custom ai agent development, lead research agent, email triage ai, document review ai, meeting summarisation ai, claude api agent build, business ai agent',
    robotsIndex:       'index',
    robotsFollow:      'follow',
    twitterCard:       'summary_large_image',
  },
}

// ── Upsert ──────────────────────────────────────────────────────────────
async function findBySlug(slug) {
  const r = await fetch(`${BASE}/page/slug/${slug}`, { headers: auth })
  if (r.status === 404 || !r.ok) return null
  return (await r.json()).data || null
}

async function upsertPage(page) {
  const existing = await findBySlug(page.slug)
  if (existing) {
    const patch = { content: page.content, seo: page.seo, title: page.title }
    const r = await fetch(`${BASE}/page/${existing.id}`, { method: 'PATCH', headers: auth, body: JSON.stringify(patch) })
    if (r.ok) console.log(`Updated: ${page.title} (${existing.id})`)
    else console.error(`PATCH failed for ${page.slug}:`, r.status, await r.text())
    return existing.id
  }
  const r = await fetch(`${BASE}/page`, { method: 'POST', headers: auth, body: JSON.stringify(page) })
  const result = await r.json()
  if (!r.ok) { console.error(`Create failed for ${page.slug}:`, result); return null }
  console.log(`Created (draft): ${page.title} (${result.data.id})`)
  return result.data.id
}

const ids = []
for (const page of [workflowAutomation, aiAgents]) {
  const pid = await upsertPage(page)
  if (pid) ids.push({ slug: page.slug, id: pid })
}

console.log('\nReview & publish in /admin:')
for (const { slug, id } of ids) {
  console.log(`  /admin/page/${id}    → preview at /services/${slug} once published & built`)
}
