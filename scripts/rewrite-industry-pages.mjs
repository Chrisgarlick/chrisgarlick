/**
 * Phase 2 step 4: rewrite the three industry pages around problem/outcome framing,
 * with crosslinks to the relevant outcome service pages.
 *
 * Run: JWT_TOKEN=<token> bun scripts/rewrite-industry-pages.mjs
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
const doc  = (...nodes) => ({ type: 'doc', content: nodes })
const id   = () => crypto.randomUUID()

const hero        = (fields) => ({ id: id(), type: 'hero',         fields })
const textSection = (fields) => ({ id: id(), type: 'text-section', fields })
const columns     = (fields) => ({ id: id(), type: 'columns',      fields })
const cta         = (fields) => ({ id: id(), type: 'cta',          fields })

// ───────────────────────────────────────────────────────────────────────
//   LAW FIRMS
// ───────────────────────────────────────────────────────────────────────

const lawFirms = {
  id: '03642074-9a4c-4204-a808-2d2e7b957345',
  title: 'AI for Law Firms',
  slug: 'ai-for-law-firms',
  content: [
    hero({
      label: 'AI for Law Firms',
      heading: 'Automating document-heavy workflows for law firms.',
      subtext: 'Contract data extraction, first-pass document review, client intake, matter summarisation. The repetitive document and admin work that pulls fee-earners away from billable hours — built into systems that handle it in the background.',
      ctaLabel: 'Start with a free site audit',
      ctaUrl: '/tools/site-audit',
      ctaSecondaryLabel: 'Book a scoping call',
      ctaSecondaryUrl: '/contact',
    }),

    textSection({
      label: '01 — The problem',
      heading: 'Junior associates are the highest-cost data-entry operators in your firm.',
      body: doc(
        p('A typical mid-sized practice loses fee-earner hours to four predictable workflows: contract review, document drafting, client intake, and matter summarisation. The work is repetitive enough to feel wasteful, important enough that you can\'t just outsource it, and structured enough that it\'s a perfect fit for AI implementation.'),
        p('What it looks like in practice: a senior associate spending 90 minutes pulling key terms out of a contract before annotating it. A trainee retyping client details from an intake form into the practice management system, then again into the engagement letter template. A partner reviewing a bundle of NDAs that all say roughly the same thing, looking for the one that doesn\'t.'),
        p('None of this work is hard. All of it costs real money — fee-earner time at fee-earner rates, doing administrative tasks at administrative speed.'),
      ),
    }),

    textSection({
      label: '02 — What gets automated',
      heading: 'Four named workflows, in order of ROI.',
      body: doc(
        ol(
          [bold('Contract data extraction'), ' — pulling parties, dates, terms, governing law, liability caps and unusual clauses into a structured summary. The kind of one-page key-terms document associates currently produce manually. Lives in the ', link('data extraction', '/services/data-extraction'), ' lane.'],
          [bold('First-pass contract review'), ' — reading a draft against a checklist of red flags and producing a review note with quoted clauses and proposed redrafts. Reduces a 90-minute review to a 10-minute approval. Lives in the ', link('AI agents', '/services/ai-agents'), ' lane.'],
          [bold('Client intake automation'), ' — the chain from initial enquiry to matter open. Acknowledgement reply, conflict check, ID collection, engagement letter, matter setup. Eight steps becomes two manual touchpoints. Lives in the ', link('workflow automation', '/services/workflow-automation'), ' lane.'],
          [bold('Matter summarisation'), ' — turning a folder of correspondence into a structured chronology, key issues and outstanding actions. A matter you haven\'t looked at in six months can be re-grasped in five minutes instead of 45.'],
        ),
        p('The audit ranks these by what\'s actually costing your firm the most — usually intake and contract review come out on top.'),
      ),
    }),

    textSection({
      label: '03 — How it works',
      heading: 'AI drafts, humans approve, the matter file is never autonomous.',
      body: doc(
        p('Every system I build for a legal practice follows the same rule: ', bold('AI produces drafts, a fee-earner approves what goes out'), '. The model never sends an email, files a document, or makes a substantive legal judgement unsupervised. What it removes is the reading, the data entry, and the boilerplate drafting — not the lawyer.'),
        p('The architecture is the same across builds: a structured input (form, email, document upload) flows into a Claude-powered pipeline that classifies, extracts, summarises or drafts as needed. The output is structured — sections you expect, clauses quoted in full, ambiguity flagged rather than guessed — and lands in the practice management system or back in the fee-earner\'s inbox for review.'),
        p('Source data stays inside your existing infrastructure. The AI processes what it needs, nothing more. Everything is logged.'),
      ),
    }),

    columns({
      label: '04 — Technical stack',
      heading: 'Stack designed for firms with real compliance obligations.',
      column1Heading: 'Claude API',
      column1Body: 'Anthropic\'s Claude for the language work. Sonnet for review notes and drafting, Haiku for cheap classification and routing. UK/EU regions available, prompt and response logging on by default.',
      column2Heading: 'Integrations with your PMS',
      column2Body: 'Built to slot into Clio, Leap, iManage, NetDocuments, Microsoft 365 — whatever you already run. Data stays in your systems; the automation reads and writes via API or supervised processes.',
      column3Heading: 'Audit trail + access scoping',
      column3Body: 'Every action is logged. Every system is scoped to specific data flows, not the whole estate. Documented in the system architecture before any building starts — useful for SRA, GDPR and ICO conversations.',
    }),

    textSection({
      label: '05 — Result',
      heading: 'The shape of a finished build.',
      body: doc(
        p('A worked example: a 12-fee-earner commercial firm with a manual client intake. Before: eight steps from enquiry to matter open, three hours of someone\'s week, lead-to-reply averaging 24–48 hours, two leads a quarter dropped because nobody followed up. After: two manual touchpoints, 30 minutes a week, lead-to-reply 90 minutes, zero drops in the first quarter.'),
        p('Another: a contract review pipeline. Before: 90 minutes per contract review for an associate, partners receiving an annotated PDF on day two. After: 10-minute approval of a structured review note, partners receiving it the same morning. Stack: Claude Sonnet, Node.js, integration with iManage. Build time: 4 weeks.'),
        p('Numbers vary by firm. Shape doesn\'t.'),
      ),
    }),

    textSection({
      label: '06 — Is this right for your practice?',
      heading: 'Who AI implementation is — and isn\'t — for in legal.',
      body: doc(
        p(bold('A good fit if:')),
        ul(
          'You have at least one workflow that runs 10+ times a month (intake, contract review, matter summarisation).',
          'Fee-earners are spending visible chunks of time on tasks that don\'t require their judgement.',
          'You\'re comfortable with the AI drafting outputs that a fee-earner reviews before they ship.',
          'Your firm has 5–50 fee-earners — the sweet spot where the pain is real but the build stays proportionate.',
        ),
        p(bold('Probably not the right move yet if:')),
        ul(
          'You\'re a sole practitioner — the volume usually doesn\'t justify the build cost.',
          'You\'re a Magic Circle / Silver Circle firm — your scale needs a different conversation (enterprise procurement, multi-office rollout).',
          'You\'re looking for the AI to make legal decisions unsupervised. That\'s not what this is.',
        ),
      ),
    }),

    cta({
      heading: 'Tell me the workflow eating your fee-earners\' weeks.',
      body: 'Thirty-minute scoping call. Bring the workflow, the volume, and roughly what it costs you in fee-earner time. I\'ll tell you whether AI implementation is the right answer, what it would take to build, and what it would cost.',
      ctaLabel: 'Book a scoping call',
      ctaUrl: '/contact',
    }),
  ],
  seo: {
    metaTitle:         'AI for Law Firms — Automate Contract Review, Intake, Drafting',
    metaDescription:   'AI implementation for UK law firms: contract data extraction, first-pass review, client intake automation, matter summarisation. Built to slot into Clio, iManage, Microsoft 365.',
    ogTitle:           'AI for Law Firms — Document-Heavy Workflow Automation',
    ogDescription:     'Custom AI systems for contract review, intake, and matter summarisation. Built around your PMS. Fee-earner time back in the day.',
    ogType:            'website',
    focusKeyword:      'ai for law firms',
    secondaryKeywords: 'ai for law firms uk, ai automation for law firms, automating legal document review, ai contract review, law firm intake automation, ai for solicitors, claude api for legal, ai for legal practice, automate engagement letters, sra compliant ai',
    robotsIndex:       'index',
    robotsFollow:      'follow',
    twitterCard:       'summary_large_image',
  },
}

// ───────────────────────────────────────────────────────────────────────
//   ACCOUNTANCY
// ───────────────────────────────────────────────────────────────────────

const accountancy = {
  id: '33609fe5-5152-45fe-839f-c8b0784f4115',
  title: 'AI for Accountancy Firms',
  slug: 'ai-for-accountancy-firms',
  content: [
    hero({
      label: 'AI for Accountancy Firms',
      heading: 'Reducing manual processing for accountancy practices.',
      subtext: 'Statement and receipt parsing, monthly reporting packs, client onboarding, narrative drafting. The repetitive processing that consumes practice hours — done by systems that read, structure, and draft, so partners can review instead of type.',
      ctaLabel: 'Start with a free site audit',
      ctaUrl: '/tools/site-audit',
      ctaSecondaryLabel: 'Book a scoping call',
      ctaSecondaryUrl: '/contact',
    }),

    textSection({
      label: '01 — The problem',
      heading: 'You bill for analysis. Your team spends most of the month on data entry.',
      body: doc(
        p('Most accountancy practices know exactly where their time goes — and most of it isn\'t to the work that justifies the fees. Bank statements typed in by hand. Receipts categorised manually. Monthly reports assembled from spreadsheets at the end of every cycle. Onboarding packs reconstructed from templates that were last updated three years ago.'),
        p('The pain compounds because the volume is high. A small practice with 80 monthly clients is processing thousands of transactions a month. A larger one with 300+ is running multiple staff almost full-time on data assembly. None of this is the work the partners are paid for; all of it has to happen before that work can.'),
        p('It\'s exactly the shape of problem AI implementation handles well — repeatable, document-heavy, structured outputs.'),
      ),
    }),

    textSection({
      label: '02 — What gets automated',
      heading: 'Four workflows worth building first.',
      body: doc(
        ol(
          [bold('Statement and receipt parsing'), ' — pulling structured data from bank statements, supplier invoices, and expense receipts. Maps to the chart of accounts. Categorises by rules the practice already has. Lives in the ', link('data extraction', '/services/data-extraction'), ' lane.'],
          [bold('Monthly reporting packs'), ' — automated assembly of the client-facing pack from the source data. Numbers from the bookkeeping system, narrative drafted by AI against your house style, partner reviews and signs off. Lives in the ', link('workflow automation', '/services/workflow-automation'), ' lane.'],
          [bold('Client onboarding'), ' — engagement letter generation, AML/KYC document collection via secure portal, matter setup in your practice tool, kick-off email. The 1–3 weeks of admin between "they signed" and "we start" collapses to days.'],
          [bold('Narrative drafting'), ' — for management accounts, year-end pack commentary, advisory notes. AI drafts in your firm\'s voice from the underlying numbers; partner adds judgement on top.'],
        ),
        p('The audit ranks these — reporting and intake usually deliver the highest ROI in the first month.'),
      ),
    }),

    textSection({
      label: '03 — How it works',
      heading: 'Partners review the output. The AI does the typing.',
      body: doc(
        p('Every accountancy build I do keeps the partner in the approval loop for anything client-facing. The AI is doing the work the practice would have done by hand: extracting numbers, structuring tables, drafting narrative, generating documents. The partner reads, edits where needed, signs off.'),
        p('Source data stays in your existing systems — Xero, QuickBooks, Sage, FreeAgent, whatever the practice uses. The automation reads via API, processes in a scoped environment, and writes the output back into the tools you already use. No "AI accounting platform" that wants to replace your stack.'),
        p('Audit trails are first-class. Every transaction the AI categorises, every figure it pulls, every paragraph it drafts is logged with the source. When HMRC asks, you have a paper trail.'),
      ),
    }),

    columns({
      label: '04 — Technical stack',
      heading: 'Built to integrate, not to replace.',
      column1Heading: 'Claude API',
      column1Body: 'Claude Sonnet for narrative drafting and complex parsing. Claude Haiku for transaction categorisation and high-volume classification — cheap enough to run on every transaction in your books.',
      column2Heading: 'Integrations',
      column2Body: 'Direct connections to Xero, QuickBooks, Sage, FreeAgent, and Microsoft 365 or Google Workspace. The automation reads the source data and writes back outputs — it doesn\'t become a new system to learn.',
      column3Heading: 'Document parsing',
      column3Body: 'For PDFs, scanned statements and receipts: a combination of native parsing and Claude\'s vision for the hard cases. Structured output every time, with confidence scores for human review.',
    }),

    textSection({
      label: '05 — Result',
      heading: 'What it looks like running.',
      body: doc(
        p('A 12-person mid-tier practice with ~150 monthly bookkeeping clients. Before: 16 hours a week of staff time on statement parsing across the team, monthly reporting taking 90 minutes per client, advisory notes lagging two weeks behind month-end. After: 4 hours a week on parsing (only the exceptions), reporting at 8 minutes per client, advisory notes ready within five working days of month-end. Build time: 6 weeks. Stack: Claude API, Node.js, Xero API, custom PDF pipeline.'),
        p('Another: client onboarding for a tax-advisory firm. Before: 7-day lag from engagement signed to first work, AML documents emailed back and forth across three days. After: 2-day lag, AML collection via secure portal, engagement letter and matter setup automated. Build time: 3 weeks.'),
        p('Numbers vary by practice and software stack. The savings repeat.'),
      ),
    }),

    textSection({
      label: '06 — Is this right for your practice?',
      heading: 'Where AI fits and where it doesn\'t.',
      body: doc(
        p(bold('A good fit if:')),
        ul(
          'You have at least 50 monthly clients on a recurring schedule (bookkeeping, payroll, management accounts).',
          'Your team is spending visible time on data entry rather than advisory work.',
          'You already use one of the standard cloud platforms (Xero, QuickBooks, Sage) — integration is straightforward.',
          'You\'re comfortable with AI-drafted outputs that partners review before they ship.',
        ),
        p(bold('Probably not yet if:')),
        ul(
          'You\'re a sole practitioner with a small client base — the build cost outweighs the saving.',
          'You\'re running 100% on desktop software with no API access — the integration path becomes the project.',
          'You\'re looking for the AI to make tax or audit judgements unsupervised. Not what this is.',
        ),
      ),
    }),

    cta({
      heading: 'Where is your practice losing hours to data entry?',
      body: 'Thirty-minute scoping call. Bring the workflow that\'s costing you the most staff time. I\'ll tell you whether AI implementation is the right answer, what it would take to build, and what it would cost.',
      ctaLabel: 'Book a scoping call',
      ctaUrl: '/contact',
    }),
  ],
  seo: {
    metaTitle:         'AI for Accountancy Firms — Automate Reporting, Intake & Parsing',
    metaDescription:   'AI implementation for UK accountancy practices: statement parsing, monthly reporting, client onboarding, narrative drafting. Built around Xero, QuickBooks, Sage and FreeAgent.',
    ogTitle:           'AI for Accountancy Firms — Reduce Manual Processing',
    ogDescription:     'Custom AI systems for statement parsing, monthly reports, onboarding, narrative drafting. Integrates with your existing cloud accounting stack.',
    ogType:            'website',
    focusKeyword:      'ai for accountancy firms',
    secondaryKeywords: 'ai for accountants uk, automating accounting workflows, ai statement parsing, ai bookkeeping automation, monthly reporting automation, ai for accounting practices, xero ai integration, quickbooks ai integration, ai client onboarding accountants',
    robotsIndex:       'index',
    robotsFollow:      'follow',
    twitterCard:       'summary_large_image',
  },
}

// ───────────────────────────────────────────────────────────────────────
//   AGENCIES
// ───────────────────────────────────────────────────────────────────────

const agencies = {
  id: '37bc3d20-6719-4b93-9f49-460655d65447',
  title: 'AI for Agencies',
  slug: 'ai-for-agencies',
  content: [
    hero({
      label: 'AI for Agencies',
      heading: 'Replacing repetitive delivery tasks for agencies.',
      subtext: 'Brief processing, weekly status reports, client communication, competitor research, content production pipelines. The work that fills the delivery team\'s week — automated into systems that handle the volume so account leads can focus on the work that justifies retainers.',
      ctaLabel: 'Start with a free site audit',
      ctaUrl: '/tools/site-audit',
      ctaSecondaryLabel: 'Book a scoping call',
      ctaSecondaryUrl: '/contact',
    }),

    textSection({
      label: '01 — The problem',
      heading: 'Your delivery margin is being eaten by tasks nobody on the team should be doing.',
      body: doc(
        p('Every agency I\'ve worked with has the same pattern: the work that fees are billed against is interesting, scoped, and well-priced. The work that fills the rest of the week is a long tail of admin — status reports for clients who barely read them, brief processing, competitor monitoring, repetitive content production, internal reporting for the partners. None of it bills. All of it is non-optional.'),
        p('It\'s the work that quietly grows as accounts grow. A new £8k/month retainer adds two hours of standing admin a week. Three new accounts is half a day. You can\'t hire your way out of it — the cost lands directly on margin — but you also can\'t stop doing it.'),
        p('This is the work AI implementation is best at: documented, repeatable, structured outputs that humans can review faster than they can author from scratch.'),
      ),
    }),

    textSection({
      label: '02 — What gets automated',
      heading: 'Four workflows in the agency stack.',
      body: doc(
        ol(
          [bold('Weekly client reporting'), ' — data pulled from your project tool, GA/Plausible, ad platforms and any CRM, narrative drafted in your house voice, partner reviews and ships. Lives in the ', link('workflow automation', '/services/workflow-automation'), ' lane.'],
          [bold('Brief processing'), ' — turning client emails, calls and Loom recordings into structured project briefs the delivery team can actually work from. Standard structure every time. Lives in the ', link('AI agents', '/services/ai-agents'), ' lane.'],
          [bold('Competitor research'), ' — automated pipelines that pull competitor messaging, content drops, pricing changes and ad creative on a schedule. Useful for client decks, useful for your own positioning. Lives in the ', link('data extraction', '/services/data-extraction'), ' lane.'],
          [bold('Content production'), ' — turning a single brief into the asset family (long-form, social variants, newsletter, image-prompt for the designer). AI drafts, account lead approves.'],
        ),
        p('The audit ranks these against your specific accounts. Reporting usually wins on first-build ROI.'),
      ),
    }),

    textSection({
      label: '03 — How it works',
      heading: 'Account leads stay in the loop. The drafting work goes elsewhere.',
      body: doc(
        p('Every system I build for an agency keeps the account lead approving anything that goes to a client. AI handles the assembly, the drafting, the data pulling — the parts of the job that should never be a senior\'s time. What ships to the client is still your work; what feeds into it stops being.'),
        p('Each workflow integrates with the project tool you already use — Notion, ClickUp, Asana, Linear, Monday, Airtable. Data comes from your existing reporting (GA4, Plausible, ad platforms, CRMs), drafts land in the project tool or directly in the account lead\'s inbox for approval. No new platform to teach the team.'),
        p('Versioning is first-class. Every draft the AI produces is logged. When a client questions a number or a phrasing, you can trace it.'),
      ),
    }),

    columns({
      label: '04 — Technical stack',
      heading: 'Picks for agency delivery shops.',
      column1Heading: 'Claude API',
      column1Body: 'Claude Sonnet for client-facing drafting (reports, briefs, narrative); Claude Haiku for the routing, classification and competitor-scan triage. The cost split keeps high-volume processes cheap.',
      column2Heading: 'Project tool integrations',
      column2Body: 'Direct connections to Notion, ClickUp, Asana, Linear, Airtable. Plus reporting integrations: GA4, Plausible, Meta and Google ad APIs. Outputs land where your team already works.',
      column3Heading: 'Web scraping where needed',
      column3Body: 'For competitor research and content monitoring: Playwright-based scrapers, scheduled and supervised. Politely, respecting robots.txt, with rate limits — built to last, not break next month.',
    }),

    textSection({
      label: '05 — Result',
      heading: 'What this looks like in production.',
      body: doc(
        p('A 14-person digital agency with 12 monthly retainer clients. Before: Fridays consumed by status report assembly across the team — roughly 6 senior hours weekly. After: reports drafted automatically Thursday night from the project tool plus analytics, account leads spending 15 minutes each Friday morning reviewing and personalising before ship. Build time: 4 weeks. Stack: Claude API, ClickUp API, GA4 API, Node.js.'),
        p('Another: a brief-processing pipeline for an SEO agency. Before: 2 hours of senior strategist time per new project translating client emails and discovery calls into a brief the delivery team could use. After: 20 minutes — Claude drafts from the transcript and email chain, strategist sharpens the angles. Build time: 3 weeks.'),
        p('Numbers vary by agency shape and stack. The pattern repeats: senior time off the admin and back onto the strategy.'),
      ),
    }),

    textSection({
      label: '06 — Is this right for your agency?',
      heading: 'Where it pays off and where it doesn\'t.',
      body: doc(
        p(bold('A good fit if:')),
        ul(
          'You have 5+ monthly retainer clients (the volume justifies the build).',
          'Your team is spending visible chunks of senior time on assembly work — reports, briefs, recurring content.',
          'You already use one of the standard project tools (Notion, ClickUp, Asana, Linear, Airtable).',
          'You\'re comfortable with AI drafting outputs that account leads review before they ship to clients.',
        ),
        p(bold('Probably not yet if:')),
        ul(
          'You\'re a solo freelancer — the volume usually doesn\'t justify the build cost.',
          'Your work is 90% creative judgement (creative direction, brand identity from scratch). The AI lift is smaller.',
          'You\'re looking for AI to do client-facing work end-to-end without senior review. That\'s not what this is.',
        ),
      ),
    }),

    cta({
      heading: 'Which admin task is eating your team\'s week?',
      body: 'Thirty-minute scoping call. Bring the workflow and roughly what it costs in senior hours. I\'ll tell you whether AI implementation is the right answer, what it would take to build, and what it would cost.',
      ctaLabel: 'Book a scoping call',
      ctaUrl: '/contact',
    }),
  ],
  seo: {
    metaTitle:         'AI for Agencies — Automate Reporting, Briefs & Research',
    metaDescription:   'AI implementation for UK creative, digital and SEO agencies: weekly reporting, brief processing, competitor research, content production. Integrates with Notion, ClickUp, Asana.',
    ogTitle:           'AI for Agencies — Replace Repetitive Delivery Tasks',
    ogDescription:     'Custom AI systems for client reporting, brief processing, competitor monitoring and content production. Built around your project tool stack.',
    ogType:            'website',
    focusKeyword:      'ai for agencies',
    secondaryKeywords: 'ai automation for agencies, automating agency workflows, ai client reporting, ai brief processing, ai competitor research, agency operations automation, ai content production, claude api for agencies, ai for digital agencies, ai for creative agencies',
    robotsIndex:       'index',
    robotsFollow:      'follow',
    twitterCard:       'summary_large_image',
  },
}

// ── Upsert ──────────────────────────────────────────────────────────────
async function patchPage(page) {
  const r = await fetch(`${BASE}/page/${page.id}`, {
    method: 'PATCH',
    headers: auth,
    body: JSON.stringify({ content: page.content, seo: page.seo, title: page.title }),
  })
  const bodyText = await r.text()
  if (r.ok) {
    console.log(`Updated: ${page.title} (${page.slug}) — ${page.content.length} blocks`)
  } else {
    console.error(`PATCH failed for ${page.slug}:`, r.status, bodyText.slice(0, 200))
  }
}

for (const page of [lawFirms, accountancy, agencies]) {
  await patchPage(page)
}
