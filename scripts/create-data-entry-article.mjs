/**
 * Phase 3 article #1: "Replacing manual data entry with AI agents — a practical guide"
 * Run: JWT_TOKEN=<token> bun scripts/create-data-entry-article.mjs
 */

const JWT = process.env.JWT_TOKEN
const BASE = process.env.CMS_API_BASE || 'https://chrisgarlick.com/api'
if (!JWT) { console.error('Set JWT_TOKEN'); process.exit(1) }
const auth = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${JWT}` }

const t    = (text) => ({ type: 'text', text })
const bold = (text) => ({ type: 'text', text, marks: [{ type: 'bold' }] })
const link = (text, href) => ({ type: 'text', text, marks: [{ type: 'link', attrs: { href, target: null } }] })
const code = (text) => ({ type: 'text', text, marks: [{ type: 'code' }] })
const p    = (...parts) => ({ type: 'paragraph', content: parts.flatMap(part => Array.isArray(part) ? part : [typeof part === 'string' ? t(part) : part]) })
const ul   = (...items) => ({ type: 'bulletList', content: items.map(line => ({ type: 'listItem', content: [Array.isArray(line) ? p(...line) : p(line)] })) })
const ol   = (...items) => ({ type: 'orderedList', content: items.map(line => ({ type: 'listItem', content: [Array.isArray(line) ? p(...line) : p(line)] })), attrs: { start: 1 } })
const h2   = (text) => ({ type: 'heading', attrs: { level: 2 }, content: [t(text)] })
const h3   = (text) => ({ type: 'heading', attrs: { level: 3 }, content: [t(text)] })
const hr   = () => ({ type: 'horizontalRule' })

const body = {
  type: 'doc',
  content: [
    p('Manual data entry is the most uniformly hated work in business. Someone retypes invoice line items into the accounting system. Someone copies key contract terms into a tracking sheet. Someone screenshots a competitor\'s pricing page once a week and pastes it into a brief. It is repetitive, it is error-prone, and almost nobody enjoys doing it.'),
    p('For most of the last decade, the answer "use AI for data entry" was a punchline. OCR was unreliable. Hand-rolled parsers broke on every new template. Vendor tools required your documents to match their training data. The math rarely worked.'),
    p(bold('That changed in 2024.'), ' The combination of vision-capable language models and structured-output mode is, quietly, the biggest practical win AI has delivered for SMEs. It is also one of the least flashy — which is probably why most businesses are still pretending it isn\'t there.'),

    p(bold('TL;DR')),
    ul(
      'Manual data entry got automatable in 2024 — vision-capable LLMs plus structured output mode is the unlock.',
      'The pattern that works: read with the model, extract to a strict schema, validate the output with code, route exceptions to a human.',
      'Volume matters. Below ~50 documents a month, doing it by hand is cheaper. Above that, the build pays back fast.',
    ),

    h2('Why "AI for data entry" used to be a joke'),
    p('Three things were broken in the pre-2024 stack:'),
    ol(
      [bold('OCR was character-level, not document-level.'), ' Traditional optical character recognition could turn pixels into text, but it had no model of what the document was. Page numbers and headers got mixed in with table cells. Numbers in the wrong column. Reading orders that worked on one bank\'s statement and failed on another\'s.'],
      [bold('Vendor parsers were template-locked.'), ' Document-AI services worked beautifully on the templates they were trained on and fell over on anything else. A new supplier with a slightly different invoice layout meant a support ticket, not a pipeline that just kept working.'],
      [bold('LLMs hallucinated freely.'), ' Early language models would happily invent a date or a total when the source was ambiguous, with full confidence and no way to tell the difference between an accurate read and a guess.'],
    ),
    p('The result was that "automating data entry with AI" usually meant signing up to a SaaS vendor whose pipeline broke on your documents, then writing custom code to handle the exceptions, then realising you would have been faster doing it by hand.'),

    h2('What changed'),
    p('Two things converged. First, ', bold('vision-capable language models'), ' — most usefully Claude\'s vision mode — read a document the way a human does: the whole thing, in context, with an understanding of tables, headers, columns, and what numbers belong to which row. The reading-order problem largely disappeared. Messy scans, handwritten annotations, multi-page PDFs with mixed layouts — all readable in one pass.'),
    p('Second, ', bold('structured-output mode'), ' — you give the model a JSON schema and it is constrained to return output matching the schema. Field types are enforced. Required fields can be enforced. Where the model is genuinely uncertain, it can return ', code('null'), ' instead of guessing. Combined, these two changes turn extraction from a "hope it works" exercise into a real engineering pipeline.'),
    p('It is not magic. The model still gets things wrong. The point is that ', bold('it gets things wrong in predictable, inspectable ways'), ' — null fields you can review, confidence scores you can threshold on, structured output you can validate with code.'),

    h2('The pattern that actually works'),
    p('Every extraction pipeline I\'ve built follows the same four-stage skeleton. Get the four stages right and the specific document type barely matters.'),

    h3('1. Schema first'),
    p('Write the JSON schema before any code runs. What fields you want, what types, what is required, what is optional, what an ambiguous case looks like. The schema is the contract between the pipeline and the rest of your business — if the schema is sloppy, everything downstream is sloppy.'),
    p('For a bank statement: account number, statement period, opening balance, closing balance, transactions (each with date, description, amount, balance). For a contract: parties, effective date, term, termination rights, fees, governing law, liability cap. The point of writing it down is that the schema forces you to be specific about what "extracted data" actually means.'),

    h3('2. Read'),
    p('Pick the right reader for the source:'),
    ul(
      [bold('Native PDF parsing'), ' (e.g. ', code('pdf-parse'), ', ', code('pdfjs'), ') for clean, machine-generated PDFs. Cheap, fast, no AI tokens consumed.'],
      [bold('Claude vision'), ' for scans, photos, messy PDFs, anything where layout matters. Pass the page as an image; the model reads the whole thing in context.'],
      [bold('Playwright'), ' for web pages — render the page, wait for content, extract the visible text and structure.'],
      [bold('API calls'), ' for sources that already expose data — your CRM, your accounting tool, your project tool. Don\'t use AI when an API will do.'],
    ),
    p('Most pipelines use more than one reader. A pipeline that parses bank statements might use native PDF parsing for the e-statements and Claude vision for the photographed paper ones — same downstream extraction, different ingest.'),

    h3('3. Extract'),
    p('Claude with structured output mode. You pass the schema, you pass the document text or image, and you get back JSON matching the schema. Two non-obvious bits matter here:'),
    ul(
      [bold('Tell the model what null means.'), ' In the prompt, instruct it explicitly that it should return ', code('null'), ' for any field where the source is genuinely ambiguous, rather than guessing. The default behaviour of even well-aligned models is to be helpful and fill in fields. You want the opposite: a model that says "I am not sure" loudly.'],
      [bold('Ask for source references.'), ' Wherever the schema includes an extracted value, add a paired ', code('source'), ' field — the literal substring or location in the source document that supports the value. This is your audit trail. It is also a sanity check: if the model produces a value but cannot point at the source, that\'s a red flag.'],
    ),

    h3('4. Validate and route'),
    p('The model\'s output is now JSON matching your schema. Run domain checks on it before it lands anywhere production-y:'),
    ul(
      'Dates parse as real dates and fall within plausible ranges.',
      'Numerical totals add up against their components.',
      'Required fields are non-null.',
      'Cross-references exist (the supplier referenced is in your supplier table; the matter referenced exists).',
    ),
    p('Anything that passes validation lands directly in the system of record. Anything that fails — null required fields, totals that don\'t add up, references that don\'t exist — goes to a human review queue with the source document attached. The pipeline\'s job is to handle the 90% cleanly so the human can focus on the 10% that actually needs judgement.'),

    h2('A worked example: supplier-invoice parsing for an accountancy practice'),
    p('A six-person bookkeeping practice was processing roughly 1,200 supplier invoices a month across their client portfolio. The work was being done by hand — a junior opens the invoice, reads it, picks out the supplier, the date, the line items, the total, the VAT, and types them into the client\'s Xero file under the right account code.'),
    p('Each invoice averaged 2–3 minutes. That\'s 40–60 hours a month across the team, on work that is genuinely just data entry.'),
    p(bold('What got built:')),
    ol(
      'Invoices arrive via the practice\'s shared inbox. A small forwarder routes them by client to a per-client folder in Google Drive.',
      'A scheduled job watches the folders. New invoices get pulled in.',
      'Each invoice runs through native PDF parsing first. Clean machine-generated PDFs (~70%) get extracted text directly. Scanned PDFs and image-based invoices fall through to Claude vision.',
      'The extracted text (or image, for the vision path) goes to Claude Sonnet with a strict schema covering supplier name, invoice date, due date, line items, VAT amounts, total, and a chart-of-accounts code suggested by matching against the client\'s historical bookings.',
      'Output is validated — totals add up, VAT calculations are plausible, the supplier exists in Xero or is flagged as a new supplier.',
      'Clean output writes directly to Xero as a draft bill, attached to the source PDF. Failures land in a review queue.',
    ),
    p(bold('Result after eight weeks of running:')),
    ul(
      '~85% of invoices process cleanly with no human touch beyond a partner approving the draft bill in Xero.',
      'The remaining ~15% land in the review queue. Most are genuinely ambiguous (handwritten amount changes on the invoice, unclear line items) and benefit from human judgement.',
      'Staff time on supplier invoices dropped from ~50 hours a month to ~10 hours a month — most of that on the review queue.',
      'Zero downstream errors picked up by the partners at month-end review.',
    ),
    p('Build time: 4 weeks. Stack: Claude Sonnet, Node.js, Xero API, Google Drive API.'),

    h2('Where this still doesn\'t work'),
    p('Honest list. Don\'t commission a build for these cases yet — you\'ll be disappointed.'),
    ul(
      [bold('Genuinely bad handwriting'), '. Doctors\' notes, decades-old archives, anything with character strokes that humans struggle with. Vision models will hallucinate confidently here.'],
      [bold('Documents with no consistent structure at all'), '. If every document is wildly different in shape and you can\'t define a target schema, extraction is the wrong tool — what you need is summarisation, which is a different pipeline.'],
      [bold('Sources behind aggressive anti-bot protection'), '. Some sites genuinely cannot be reliably scraped because they\'re actively designed not to be. Cloudflare-protected gambling odds, for instance.'],
      [bold('Hyper-low-volume tasks'), '. If you\'re processing ten documents a month, the build cost will not pay back. Manual is correct at that scale.'],
      [bold('Tasks where 100% accuracy is required with zero human review'), '. Even with confidence scores, AI extraction is not a "no human in the loop" technology. If your business genuinely can\'t tolerate a 1% error rate even with a review queue catching exceptions, the answer is "don\'t use AI for this."'],
    ),

    h2('What to do this week'),
    ol(
      'Pick one document type your team currently processes by hand. The most boring one is usually the right answer.',
      'Count the volume (per week, per month). If you\'re under ~50 a month, stop — manual is the right answer right now.',
      'Write the schema. What fields would you actually need extracted? Don\'t over-specify; start with the minimum.',
      'Pick five representative examples — clean, messy, and edge cases. These are your test set.',
      'Either: prototype it yourself with the Claude API and 50 lines of Node.js (genuinely the right shape of weekend project for a technical operator), or scope it with someone who builds these for a living.',
    ),

    hr(),
    p('Got a stack of documents that needs to be data? ', link('See how I build data extraction pipelines', '/services/data-extraction'), ' or ', link('run a free site audit', '/tools/site-audit'), ' and tell me which document is eating your team\'s week — we can take it from there.'),
  ],
}

const article = {
  title: 'Replacing Manual Data Entry with AI Agents: A Practical Guide',
  slug: 'replacing-manual-data-entry-with-ai-agents',
  body,
  excerpt: 'Manual data entry got automatable in 2024 — vision-capable LLMs plus structured-output mode is the unlock. Here\'s the four-stage pattern that actually works, and where it still doesn\'t.',
  status: 'draft',
  publishedAt: null,
  seo: {
    metaTitle:         'Replacing Manual Data Entry with AI Agents — Practical Guide',
    metaDescription:   'The four-stage pattern for AI-powered data extraction: schema first, read, extract with structured output, validate. Worked example: 50 hours a month → 10 hours.',
    ogTitle:           'AI for Data Entry — What Actually Works in 2026',
    ogDescription:     'A practical guide to replacing manual data entry with AI agents. Schema, vision, structured output, validation. Plus where it still doesn\'t work.',
    ogType:            'article',
    focusKeyword:      'ai for data entry',
    secondaryKeywords: 'replace manual data entry, ai data entry automation, ai document extraction, structured output ai, claude vision data extraction, ai invoice parsing, ai for accountants data entry, ai statement parsing, ai bookkeeping automation',
    robotsIndex:       'index',
    robotsFollow:      'follow',
    twitterCard:       'summary_large_image',
  },
}

async function findBySlug(slug) {
  const r = await fetch(`${BASE}/article/slug/${slug}`, { headers: auth })
  if (r.status === 404 || !r.ok) return null
  return (await r.json()).data || null
}

const existing = await findBySlug(article.slug)
if (existing) {
  const r = await fetch(`${BASE}/article/${existing.id}`, {
    method: 'PATCH',
    headers: auth,
    body: JSON.stringify({ body: article.body, excerpt: article.excerpt, seo: article.seo }),
  })
  if (r.ok) console.log(`Updated: ${article.title} (${existing.id})`)
  else console.error(`PATCH failed:`, r.status, await r.text())
} else {
  const r = await fetch(`${BASE}/article`, { method: 'POST', headers: auth, body: JSON.stringify(article) })
  const result = await r.json()
  if (!r.ok) { console.error(`Create failed:`, result); process.exit(1) }
  console.log(`Created (draft): ${article.title} (${result.data.id})`)
  console.log(`Review in /admin/article/${result.data.id} before publishing.`)
}
