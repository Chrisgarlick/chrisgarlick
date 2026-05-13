/**
 * Phase 3 step 1: create /services/data-extraction (third outcome service page).
 * Run: JWT_TOKEN=<token> bun scripts/create-data-extraction-page.mjs
 *
 * Idempotent — PATCHes if it already exists.
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

const dataExtraction = {
  title: 'Data Extraction',
  slug: 'data-extraction',
  status: 'draft',
  content: [
    hero({
      label: 'Data Extraction',
      heading: 'Get the data out of the PDFs, statements and web pages.',
      subtext: 'Structured information locked inside unstructured documents — contracts, bank statements, expense receipts, listings, supplier invoices. I build pipelines that read them, validate the output, and write clean data into the systems you already use.',
      ctaLabel: 'Start with a free site audit',
      ctaUrl: '/tools/site-audit',
      ctaSecondaryLabel: 'Book a scoping call',
      ctaSecondaryUrl: '/contact',
    }),

    textSection({
      label: '01 — The problem',
      heading: 'Your data is fine. It\'s just not where you can use it.',
      body: doc(
        p('Every business has data trapped inside documents nobody designed to be queried. A contract has the parties, the term, the fees and the renewal date — but they\'re prose, not fields. A bank statement has 200 transactions — but as a PDF, not a spreadsheet. A supplier portal has the pricing your team needs to monitor — but only behind a login, only on demand, only when someone remembers.'),
        p('The cost is usually invisible because the work is spread across the team in 10-minute chunks. Someone retypes invoice line items. Someone screenshots a competitor\'s listing. Someone copies key terms out of a contract into a tracking sheet. Each instance is small. Across a year, it\'s hundreds of hours of senior-ish time on data entry that should never have happened.'),
        p('What you actually need is a pipeline that reads the source, extracts the structured output, validates it, and writes it where you can use it. Cheaply, repeatedly, reliably.'),
      ),
    }),

    textSection({
      label: '02 — What gets extracted',
      heading: 'Four recurring shapes of extraction work.',
      body: doc(
        ol(
          [bold('Contract data extraction'), ' — parties, dates, terms, fees, renewal, liability caps, governing law, unusual clauses. From a PDF, into a structured record in your matter or CRM system. The clause text travels with it for audit.'],
          [bold('Statement and receipt parsing'), ' — bank statements, supplier invoices, expense receipts. Transactions categorised, mapped to your chart of accounts, with the source line referenced. Confidence scores let humans handle the exceptions, not the bulk.'],
          [bold('Web monitoring'), ' — competitor pricing, content drops, supplier portals, listing changes. Scheduled scrapers that pull on a cadence, dedupe against the last run, and surface only the diffs.'],
          [bold('Form and email parsing'), ' — turning the messy text of an enquiry email or a free-form application into the structured shape your CRM expects. Names, requirements, budgets, timelines — extracted, validated, and routed.'],
        ),
        p('Each shape uses the same pipeline architecture; the difference is the source format, the schema, and how the output is delivered.'),
      ),
    }),

    textSection({
      label: '03 — How it works',
      heading: 'Structured output, confidence scores, exceptions to humans.',
      body: doc(
        p('Every extraction pipeline I build follows the same skeleton:'),
        ul(
          [bold('Schema first'), ' — I write down exactly what the output looks like before any code runs. Field names, types, validation rules, what counts as ambiguous. The schema is the contract between the pipeline and the downstream systems.'],
          [bold('Read'), ' — depending on the source: native PDF parsing for clean documents, Claude\'s vision capability for scanned or messy PDFs, Playwright for web pages that need to be rendered, plain API calls for everything else.'],
          [bold('Extract'), ' — Claude with structured output mode. The model is constrained to return JSON matching the schema. Where it\'s genuinely uncertain, it returns ', bold('null'), ' rather than guessing, and the field is flagged for review.'],
          [bold('Validate'), ' — domain rules run on the output. Dates have to be real dates. Totals have to add up. References have to exist. Failures get tagged, not silently dropped.'],
          [bold('Route'), ' — clean output writes to your system of record. Flagged output lands in a review queue with the source document side-by-side. A human resolves; the system learns from the correction.'],
        ),
        p('What you ', bold('don\'t'), ' get: an AI that\'s confidently wrong without you knowing. The pipeline tells you exactly what it was unsure about and why.'),
      ),
    }),

    columns({
      label: '04 — Technical stack',
      heading: 'Stack built for accuracy, audit, and cost.',
      column1Heading: 'Claude API + structured output',
      column1Body: 'Claude Sonnet for the harder extraction work (contracts, nuanced documents). Haiku for high-volume, well-shaped sources (transaction parsing, web monitoring). Structured-output mode constrains the model to your schema.',
      column2Heading: 'Playwright for the web',
      column2Body: 'For sources behind logins, dynamic rendering, or hostile to scraping: Playwright running headless Chromium, on a schedule, with rate-limited polite crawling. Built to last, not to break on the next platform update.',
      column3Heading: 'Postgres + your CRM',
      column3Body: 'Structured output lands in a Postgres staging layer with full lineage (which document, which run, which prompt version). From there into the CRM, practice tool, or accounting system you actually use day-to-day.',
    }),

    textSection({
      label: '05 — Result',
      heading: 'What this looks like in practice.',
      body: doc(
        p('A contract data-extraction pipeline for a law firm: 200 historic NDAs run through to produce a structured database of parties, terms and unusual clauses. From "we have a folder of PDFs" to "we can search and filter our contract estate" in three weeks. Stack: Claude Sonnet, Node.js, Postgres, integration with iManage.'),
        p('A receipt-parsing pipeline for an accountancy practice: 1,200 transactions a month across 80 clients, parsed from PDFs and image uploads, categorised against each client\'s chart of accounts, dropped into Xero. From 16 hours of staff time a week to 4 hours of exception handling. Build time: 5 weeks.'),
        p('A competitor-monitoring pipeline for an agency: weekly scrape of 14 competitor sites, diffed against the last run, summarised into a Friday brief. The strategist gets the changes that matter, ignores the noise. Build time: 2 weeks.'),
      ),
    }),

    textSection({
      label: '06 — Is this right for you?',
      heading: 'Where extraction fits and where it doesn\'t.',
      body: doc(
        p(bold('A good fit if:')),
        ul(
          'You have a recurring extraction task — at least 50 documents a month, or a few high-value documents where accuracy matters.',
          'The output shape is roughly definable — even if the input is messy, you know what fields you need at the end.',
          'You have somewhere structured for the output to land (a database, a spreadsheet, a system of record).',
          'You\'re comfortable with a human review queue for the cases the AI flags as uncertain.',
        ),
        p(bold('Probably not the right move if:')),
        ul(
          'Your documents are wildly heterogeneous — every one has a different shape and you can\'t define a target schema.',
          'You\'re extracting from sources behind aggressive anti-bot protection (some sites genuinely cannot be scraped reliably).',
          'The volume is so low that doing it by hand is cheaper than the build.',
          'Accuracy needs to be 100% with no human review at all — that\'s a different category of problem and rarely solvable with current AI.',
        ),
      ),
    }),

    cta({
      heading: 'Got data trapped somewhere?',
      body: 'Thirty-minute scoping call. Bring an example of the source documents and roughly what you want to do with the output. I\'ll tell you whether an extraction pipeline is the right answer, what it would cost, and how long it would take.',
      ctaLabel: 'Book a scoping call',
      ctaUrl: '/contact',
    }),
  ],
  seo: {
    metaTitle:         'AI Data Extraction Pipelines — PDFs, Statements, Web',
    metaDescription:   'I build AI-powered data extraction pipelines: contract data, bank statements, receipts, web monitoring. Structured output, confidence scores, integration with your existing systems.',
    ogTitle:           'AI Data Extraction — Get the Data Out of the Documents',
    ogDescription:     'Custom AI pipelines for extracting structured data from PDFs, statements, web pages and forms. Built with Claude API, Playwright and Postgres.',
    ogType:            'website',
    focusKeyword:      'ai for document processing and data extraction',
    secondaryKeywords: 'ai data extraction uk, ai pdf extraction, contract data extraction, ai statement parsing, ai receipt parsing, web scraping pipelines, structured output ai, claude api data extraction, ai document processing',
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

const existing = await findBySlug(dataExtraction.slug)
if (existing) {
  const r = await fetch(`${BASE}/page/${existing.id}`, {
    method: 'PATCH',
    headers: auth,
    body: JSON.stringify({ content: dataExtraction.content, seo: dataExtraction.seo, title: dataExtraction.title }),
  })
  if (r.ok) console.log(`Updated: ${dataExtraction.title} (${existing.id})`)
  else console.error(`PATCH failed:`, r.status, await r.text())
} else {
  const r = await fetch(`${BASE}/page`, { method: 'POST', headers: auth, body: JSON.stringify(dataExtraction) })
  const result = await r.json()
  if (!r.ok) { console.error(`Create failed:`, result); process.exit(1) }
  console.log(`Created (draft): ${dataExtraction.title} (${result.data.id})`)
  console.log(`Review in /admin/page/${result.data.id} before publishing.`)
}
