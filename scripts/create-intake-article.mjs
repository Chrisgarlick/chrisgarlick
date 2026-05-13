/**
 * Create the Phase 1 article: "How to Automate Client Intake Without Custom Software"
 * Run with: JWT_TOKEN=<token> bun scripts/create-intake-article.mjs
 *
 * Idempotent: if an article with this slug exists, it's PATCHed instead of duplicated.
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
const h2   = (text) => ({ type: 'heading', attrs: { level: 2 }, content: [t(text)] })
const h3   = (text) => ({ type: 'heading', attrs: { level: 3 }, content: [t(text)] })
const li   = (...parts) => ({ type: 'listItem', content: [p(...parts)] })
const ul   = (...items) => ({ type: 'bulletList', content: items })
const ol   = (...items) => ({ type: 'orderedList', content: items, attrs: { start: 1 } })
const hr   = () => ({ type: 'horizontalRule' })

const body = {
  type: 'doc',
  content: [
    // Lede
    p('Every business has a client intake. The form on the website. The reply email. The discovery call. The proposal. The contract. The invoice. The kickoff. Most companies treat each step as a separate manual job — and lose hours every week to the joins between them.'),
    p('The instinct is to fix this with custom software. It is almost always wrong. Custom intake systems take weeks to scope, longer to build, and most of them solve 60% of a problem before the team stops using them. Here is what to do instead.'),

    // TL;DR
    p(bold('TL;DR')),
    ul(
      li('Custom software is the wrong first move for 80% of intake problems.'),
      li('Three off-the-shelf tools — an AI model, an automation layer, and a single source of truth — replicate most intake workflows.'),
      li('Build it in an afternoon. Run it for a fortnight. Then decide whether you still need custom.'),
    ),

    // Section 1
    h2('What "client intake" actually means'),
    p('Intake is everything that happens between ', bold('a stranger expressing interest'), ' and ', bold('a client paying their first invoice'), '. For a service business that usually looks like:'),
    ol(
      li('Initial enquiry arrives (form, email, DM, referral).'),
      li('Acknowledge it within the hour.'),
      li('Qualify the lead — is this even something we do?'),
      li('Schedule a discovery call.'),
      li('Send a recap and proposal.'),
      li('Send the engagement letter or contract.'),
      li('Open the matter in your system of record.'),
      li('Kick off the work.'),
    ),
    p('Eight steps. Most teams handle each one by hand. The problem is rarely that any single step is hard — it is that the ', bold('joins'), ' between them leak. A lead waits 36 hours for a reply. A proposal sits in someone\'s drafts. An engagement letter gets generated from a template that was last updated two years ago. The actual work starts a week later than it should have.'),

    // Section 2
    h2('Why custom software is usually the wrong first move'),
    p('Building a custom intake system means you have to make every decision upfront: what fields to capture, what statuses to track, who gets which notifications, what happens when something breaks. You make those decisions before you know how the workflow actually feels in practice. By the time you ship, you have ossified a process that was already going to change.'),
    p('Custom also forces you to maintain it. The form gains a field. A tool gets renamed. A vendor changes their API. Suddenly you have an internal product to manage that does not bill clients.'),
    p('There is a faster path: assemble three tools you already understand, let the AI do the language work, and let the automation layer do the moving-data work. You can stand the whole thing up in an afternoon and tear it down on a Friday afternoon if you do not like it. Custom is the right answer eventually for some firms. It is rarely the right answer this month.'),

    // Section 3
    h2('The stack: three tools, in this order'),
    p('The intake stack I reach for first is intentionally boring. Every part of it is something a non-technical operator can run on their own.'),

    h3('1. An AI model for the language work'),
    p('Claude or ChatGPT. Either is fine. You use it to draft the acknowledgement reply, to extract structured data from messy emails, to qualify the lead against a checklist, and to generate the first draft of the proposal. The model never sends anything itself — it just produces text a human reviews and clicks send on. ', bold('That review step is doing real work'), ' — it is the quality control that keeps a human on the hook for what goes out.'),

    h3('2. An automation layer for the moving-data work'),
    p('Zapier or Make. The job here is to take a form submission and fan it out: copy the lead into your spreadsheet, send a Slack ping to you, draft the reply in your email client, create a calendar holding-slot. None of these steps are intelligent. They are plumbing. The automation layer does plumbing well and cheaply.'),

    h3('3. A single source of truth'),
    p('A Google Sheet, an Airtable base, or a Notion database. One row per lead. Every status change goes here first. Every other tool reads from or writes to this row. The discipline is: ', bold('if it is not in the spreadsheet, it does not exist'), '. This sounds reductive — it is exactly the reductiveness you need. The intake is in trouble when the truth is spread across four inboxes.'),

    // Section 4
    h2('The four functions every intake automation has'),
    p('Whatever specific tools you use, every working intake system does the same four things. Get the four functions right and the tools barely matter.'),

    h3('Capture'),
    p('Every enquiry — form, email, DM, referral — lands in the same place within five minutes of arriving. The single source of truth gets a new row. The automation layer is the thing that makes this happen without anyone touching anything.'),

    h3('Classify'),
    p('Every captured enquiry gets categorised — fit / not fit, priority high / medium / low, sector A / B / C. The AI model does this on first read, against criteria you have written down. The classification is reviewed by a human before any action is taken, but the human starts from a draft, not from scratch.'),

    h3('Route'),
    p('Classified leads go down different paths. High-priority fits get a personal reply within the hour. Medium-priority fits get a templated reply with a calendar link. Not-fits get a polite decline with a referral if you have one. Routing is a small set of if-this-then-that rules that lives in your automation layer.'),

    h3('Action'),
    p('The first thing the lead actually feels: a reply that acknowledges what they said and proposes a next step. The AI drafts it, you read it, you send it. The clock from enquiry-to-reply collapses from days to hours, and the reply is specific enough that it does not feel like a templated dismissal.'),

    // Section 5
    h2('A worked example: 8 manual steps into 2'),
    p('Take a small professional-services firm doing roughly 10 new enquiries a week. The current intake process is the eight steps above, each one manual, each one prone to dropping balls. Here is how I would compress it.'),
    p(bold('Before: 8 manual steps, ~3 hours of someone\'s week, lead-to-reply averaging 24 hours.')),
    p(bold('After: 2 manual steps, ~30 minutes of someone\'s week, lead-to-reply averaging 90 minutes.')),
    p('The transformation:'),
    ul(
      li(bold('Capture'), ' (automated). Website form posts to Zapier. Zapier writes the lead to the Airtable base and pings Slack.'),
      li(bold('Classify'), ' (automated draft + human approval). Zapier sends the enquiry body to Claude with a classification prompt — fit/not-fit, sector, priority. Claude writes its judgement to the Airtable row. A human spot-checks the classification in their daily 5-minute review.'),
      li(bold('Route'), ' (automated). Airtable status field changes from "new" to one of three lanes. Each lane triggers a different Zapier path.'),
      li(bold('Action'), ' (manual: send only). For the high-priority lane, Zapier drafts a personal reply in the inbox using Claude\'s output. A human reads it, edits one line, and clicks send. Total time per lead: 90 seconds.'),
      li(bold('Schedule'), ' (automated). The reply contains a Cal.com or Calendly link with the right meeting type. The lead self-books. No back-and-forth.'),
      li(bold('Recap & proposal'), ' (automated draft). After the discovery call, the transcript goes to Claude with a proposal-drafting prompt. Claude produces a first draft tailored to the call. A human edits it before sending.'),
      li(bold('Engagement letter'), ' (automated). Triggered when the proposal is accepted. Claude produces the letter from a template using the Airtable row.'),
      li(bold('Matter open'), ' (automated). Zapier creates the matter in the practice-management system from the Airtable row.'),
    ),
    p('The two manual steps that remain — reading the AI-drafted reply and editing the proposal — are the ones that should stay manual. They are the quality controls that keep the output sounding like you, not like a chatbot.'),

    // Section 6
    h2('What you will know after a week of running this'),
    p('The reason I push for two weeks of running the assembled stack before doing anything custom is that the system tells you things you cannot predict. After two weeks you will know:'),
    ul(
      li('Which of the four functions is actually broken. It is rarely all of them.'),
      li('Which step the AI is reliable at and which step it still gets wrong.'),
      li('What the actual volume looks like — not what you thought it was.'),
      li('Where you genuinely need a custom system and where the spreadsheet is fine forever.'),
    ),
    p('Now you can scope custom software, if you still need it, against real data. That is when custom becomes the right answer.'),

    // Section 7
    h2('What to do this week'),
    ol(
      li('Write down your current intake as a list of steps. Be specific — not "we follow up", but "the partner replies via Outlook within 48 hours, usually".'),
      li('For each step, mark it as ', bold('automatable now'), ' (an AI model or an automation layer can handle it), ', bold('automatable with effort'), ' (worth scoping), or ', bold('manual forever'), ' (judgement, relationship, or compliance).'),
      li('Start with one automatable-now step. The acknowledgement reply is usually the cheapest win.'),
      li('Run it for a fortnight. Measure two things: lead-to-reply time, and lead-to-kickoff time.'),
      li('Decide what to automate next based on what you learned.'),
    ),

    // CTA
    hr(),
    p('Want a free audit that surfaces the specific intake step costing you the most time? ', link('Run a free site audit', '/tools/site-audit'), ' — I will send you a report within 24 hours covering where AI can save you real hours, including the one workflow I would build first.'),
    p('Or browse the ', link('services overview', '/services'), ' if you want to see the kinds of automations I build for clients.'),
  ],
}

const article = {
  title: 'How to Automate Client Intake Without Custom Software',
  slug: 'automate-client-intake-without-custom-software',
  body,
  excerpt: 'Custom software is the wrong first move for 80% of client-intake problems. Here is the three-tool stack that replaces most of it — and the two weeks of data that tells you whether you actually need custom.',
  status: 'draft',
  publishedAt: null,
  seo: {
    metaTitle:         'How to Automate Client Intake Without Custom Software',
    metaDescription:   'A practical three-tool stack — AI model, automation layer, single source of truth — that compresses 8 manual intake steps into 2 without any custom build.',
    ogTitle:           'Automate Client Intake Without Custom Software',
    ogDescription:     'The three-tool stack I use to compress an 8-step manual client intake into 2 — in an afternoon, no developer needed.',
    ogType:            'article',
    focusKeyword:      'automating client intake',
    secondaryKeywords: 'client intake automation, automate client onboarding, ai for client intake, intake workflow automation, no-code client intake, automate enquiry response, ai client qualification, automate proposal drafting',
    robotsIndex:       'index',
    robotsFollow:      'follow',
    twitterCard:       'summary_large_image',
  },
}

// ── Idempotent upsert ──────────────────────────────────────────────────
async function findBySlug(slug) {
  const r = await fetch(`${BASE}/article/slug/${slug}`, { headers: auth })
  if (r.status === 404) return null
  if (!r.ok) return null
  return (await r.json()).data || null
}

const existing = await findBySlug(article.slug)
if (existing) {
  const patch = { body: article.body, excerpt: article.excerpt, seo: article.seo }
  const r = await fetch(`${BASE}/article/${existing.id}`, { method: 'PATCH', headers: auth, body: JSON.stringify(patch) })
  if (r.ok) console.log(`Updated existing article: ${article.title} (${existing.id})`)
  else console.error(`PATCH failed:`, r.status, await r.text())
} else {
  const r = await fetch(`${BASE}/article`, { method: 'POST', headers: auth, body: JSON.stringify(article) })
  const result = await r.json()
  if (!r.ok) { console.error(`Create failed:`, result); process.exit(1) }
  console.log(`Created article (draft): ${article.title} (${result.data.id})`)
  console.log(`Review in /admin/article/${result.data.id} before publishing.`)
}
