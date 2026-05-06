# Tools Roadmap

Free interactive tools for chrisgarlick.com. Each tool runs without LLM API calls — pure server-side logic, zero cost per request. Built on the same architecture as the Site Audit tool (form input → server route → results display).

---

## Live

### Site Audit
- **Slug:** `site-audit`
- **How it works:** Proxies to Kritano platform API, single-page scan, returns SEO/accessibility/performance scores
- **Target:** Everyone
- **Status:** Live

---

## Planned

### Contract Clause Checker
- **Slug:** `contract-checker`
- **Category:** AI
- **How it works:** Paste contract text. Server-side regex/keyword matching against a library of known risky clause patterns (indemnity, liability caps, auto-renewal, termination notice periods, non-compete, IP assignment, confidentiality, force majeure, jurisdiction). Highlights flagged clauses, explains the risk in plain English from a static lookup table. Scores the contract overall (low/medium/high risk).
- **Target:** Legal firms
- **Why:** Directly targets Tier 1 sector. Nobody offers this as a free tool. Output is genuinely valuable — not just a score but specific clause-by-clause feedback. Demonstrates exactly what a paid engagement would deliver.
- **Effort:** Medium — need to build the clause pattern library (~50-100 patterns) and the results UI

### Website Copy Auditor
- **Slug:** `copy-auditor`
- **Category:** Content
- **How it works:** Enter a URL. Server fetches the page, parses HTML, analyses the copy: word count, reading level (Flesch-Kincaid formula), CTA count and quality, heading structure (H1-H6 hierarchy), passive voice percentage, jargon density, sentence length distribution. Scores each category and gives specific recommendations from a rules engine. Shows a before/after preview for key issues.
- **Target:** Agencies
- **Why:** Different from Site Audit — this is about persuasion and messaging, not technical SEO. Agencies care about conversion copy. Great outreach weapon: "I ran your homepage through our copy auditor — here's what it found."
- **Effort:** Medium — HTML fetching/parsing, Flesch-Kincaid algorithm, word list dictionaries for jargon/passive voice

### Invoice Data Extractor
- **Slug:** `invoice-extractor`
- **Category:** AI
- **How it works:** Upload a PDF invoice. Server extracts text (pdf.js or similar), then uses regex patterns to identify common invoice fields: vendor name, invoice number, date, due date, line items (description, quantity, unit price, total), subtotal, VAT, grand total. Outputs as a clean formatted table with CSV download option.
- **Target:** Accountancy firms
- **Why:** Shows document processing capability. Accountancy firms deal with hundreds of invoices. Even a basic extractor that handles 70% of common formats is impressive as a demo.
- **Effort:** High — PDF parsing is tricky, need to handle various invoice layouts. Consider starting with a simpler text-paste version first.

### Email Tone Analyser
- **Slug:** `email-tone`
- **Category:** Content
- **How it works:** Paste email text. Server analyses: formality score (formal/neutral/casual word ratios), sentiment (positive/negative/neutral using word lists), readability (Flesch-Kincaid), flags passive aggressive phrases ("as per my last email", "going forward", "just to clarify"), weak language ("just", "maybe", "I think", "sorry to bother"), missing call to action, email length assessment. Returns a dashboard of scores with specific suggestions.
- **Target:** Everyone — professional services especially
- **Why:** Universally useful, highly shareable. Professional services send hundreds of emails daily. Low effort, high engagement.
- **Effort:** Low-Medium — mostly word list matching and scoring algorithms

### Competitor Price Scraper
- **Slug:** `price-checker`
- **Category:** AI
- **How it works:** Enter a product name (and optionally your price). Server searches Google Shopping results or a shopping API, scrapes top results, returns a comparison table: product name, store, price, link. Highlights where the user's price sits relative to competitors (cheapest, mid-range, most expensive).
- **Target:** Ecommerce businesses
- **Why:** Proves AI-powered business intelligence capability. This is the demo for the ecommerce CMS plugin idea — shows the concept works before building the full product.
- **Effort:** High — needs web scraping or a shopping API (Google Shopping API, or SerpAPI for search results). Rate limiting and caching important to avoid blocks.

### Business Jargon Translator
- **Slug:** `jargon-translator`
- **Category:** Content
- **How it works:** Paste corporate or legal text. Server runs through a dictionary of ~500+ jargon terms mapped to plain English equivalents. Shows side-by-side before/after with highlights on changed terms. Scores the original text for jargon density. Categories: legal jargon, corporate speak, marketing buzzwords, financial terms.
- **Target:** Legal firms, agencies
- **Why:** Fun, shareable, instantly useful. Legal firms especially have a jargon problem when communicating with clients. Low cost to build, high engagement.
- **Effort:** Low — dictionary lookup with highlighting. The effort is in curating a good jargon dictionary.

---

## Build Order (suggested)

1. **Email Tone Analyser** — lowest effort, broadest appeal, good for social sharing
2. **Contract Clause Checker** — medium effort, highest value for target sector (legal)
3. **Website Copy Auditor** — medium effort, strong outreach weapon for agencies
4. **Business Jargon Translator** — low effort, fun/shareable, builds the tool library
5. **Invoice Data Extractor** — high effort, save for when targeting accountancy firms
6. **Competitor Price Scraper** — high effort, save for ecommerce CMS plugin proof of concept

---

## Architecture Notes

All tools follow the same pattern established by Site Audit:

1. **CMS entry** — create tool in the `tool` collection via `/admin` or API (title, description, icon, category, SEO)
2. **Astro component** — `src/components/tools/[ToolName].astro` with form + results UI + client-side JS
3. **Server route** — `app.post('/api/tools/[slug]', ...)` in `server.ts` for server-side processing
4. **Component mapping** — add slug → component in `src/pages/tools/[slug].astro`
5. **Rebuild** — `bun run build` to generate the static page

No external API costs (except Site Audit which uses Kritano). All processing is server-side Bun/TypeScript.
