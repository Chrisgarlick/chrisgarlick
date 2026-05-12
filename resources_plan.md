# Gated Resources — Implementation Plan

Plan for a downloadable resources library on chrisgarlick.com, gated by email
capture. Source-of-truth is markdown; PDF and HTML are rendered on demand by
`typeset.chrisgarlick.com` (separate service, wired in later). DOCX is shipped
as a hand-authored static asset only for templates where editability matters
(policies, project briefs).

---

## Part 1 — Resource Catalogue (ranked, upgraded)

The 34 ideas in `gated_resources.md` collapse into ~12 stronger assets. Each is
positioned as a real deliverable a UK professional-services buyer would expect
to pay for, with a clear funnel role, the existing blog it ties to, and the
formats that make sense.

### Tier 1 — Build first (highest leverage, broadest pull)

These four are the foundation. They self-qualify prospects, quantify the value
of working with you, and remove the two biggest objections in UK professional
services (compliance and "where do I even start").

#### 1. The AI Readiness Scorecard for Professional Services
**Old idea:** #1 / #5 (AI Readiness Assessment).
**Upgrade:** Not a static PDF — an interactive scorecard at
`/resources/ai-readiness-scorecard` that produces a personalised report.
10 dimensions, 5-point scale, weighted scoring, output banded into four
maturity tiers (Curious / Exploring / Building / Scaling) with tier-specific
next steps and a CTA. The downloadable artefact is the *personalised report*,
not a blank worksheet — markdown rendered with the user's answers baked in.
**Funnel role:** Top of funnel. Single best discovery tool you can build.
**Formats:** Interactive web tool + personalised markdown/PDF report.
**Ties to blog:** `/article/the-ai-implementation-playbook-for-service-businesses`,
`/article/why-79-of-enterprises-are-failing-at-ai-adoption`.

#### 2. The AI ROI Calculator for Professional Services
**Old idea:** #11 (ROI Calculator Worksheet).
**Upgrade:** Interactive calculator. User picks a workflow (client intake,
document drafting, email triage, meeting notes, reporting), enters team size,
hourly rate, and current time spent. Outputs annual hours saved, £ saved,
payback period, and a sensitivity table. The download is the *personalised
business case* — a one-page memo they can take to a partner / FD. The killer
move: the calculator is itself the qualifier — anyone who runs it is a hot
lead.
**Funnel role:** Mid-funnel. Converts "interesting" to "we should talk."
**Formats:** Interactive web tool + personalised markdown/PDF business case.
**Ties to blog:** `/article/ai-adoption-disappointment-why-companies-fail`
(the disappointment piece is "you didn't quantify it" — this fixes that),
`/article/agency-workflows-automate-first`.

#### 3. The UK AI Compliance Pack for Professional Services
**Old idea:** #12 + #23 (Risk & Compliance Checklist + AI Policy Template).
**Upgrade:** A pack, not a single doc. Three artefacts in one download:
(a) UK-specific risk & compliance checklist (GDPR, ICO guidance on AI, SRA
guidance for solicitors, ICAEW guidance for accountants, what never to put
into a public LLM); (b) editable AI Acceptable Use Policy template (DOCX,
fillable); (c) data classification matrix (what data can go where).
This is the single highest-perceived-value asset for legal and accountancy
buyers. They cannot ship internal AI rollout without something like this and
they will pay attention to whoever gives it to them.
**Funnel role:** Top-mid funnel for legal/accountancy specifically. Hugely
shareable inside firms — gets your name in front of partners.
**Formats:** Markdown (checklist + matrix) + DOCX (editable policy).
**Ties to blog:** `/article/what-ai-implementation-means-law-firm` (direct
follow-on CTA), `/article/51-of-code-on-github-is-ai-generated-that-should-worry-you`
(risk angle).

#### 4. The 5 AI Workflows Worth Building First
**Old idea:** #13.
**Upgrade:** Make it opinionated and specific by sector. One PDF, three
variants: Law Firm Edition / Accountancy Edition / Agency Edition. Each
variant covers the same five workflows (intake, drafting, triage, reporting,
meeting notes) but with sector-specific examples, tool picks, and time-saved
benchmarks. Each workflow gets a 1-page "build sheet": problem, before/after
flow, tools, rough effort, rough cost, common pitfalls. Closes with a
build-vs-buy decision (#18 absorbed).
**Funnel role:** Mid-funnel. The "what should I actually do" answer.
**Formats:** Markdown + PDF, three sector variants.
**Ties to blog:** `/article/agency-workflows-automate-first` (this is the
expanded version for agency), `/article/the-ai-implementation-playbook-for-service-businesses`,
`/article/what-ai-implementation-means-law-firm`.

### Tier 2 — Build second (deepen and broaden)

#### 5. The Prompt Library for Professional Services
**Old idea:** #3 / #7.
**Upgrade:** Not 20 prompts — 60+, organised by job-to-be-done, with a
short rationale on each ("why this prompt is structured this way"). Three
sections: Client Communication, Document & Drafting, Internal Operations.
Each prompt is copy-paste ready with named variables in square brackets.
Add a 1-page "how to adapt prompts" intro covering role, context,
constraints, examples. This is the most shareable asset in the set.
**Funnel role:** Top funnel. Wide pull, lots of sharing.
**Formats:** Markdown + PDF.
**Ties to blog:** `/article/agency-workflows-automate-first` (drafting and
triage prompts directly serve the three workflows in that piece).

#### 6. The Document Automation Playbook
**Old idea:** #10 + #28 (Doc Automation + Client Reporting).
**Upgrade:** Combine into one playbook. Part 1: a scoring framework to
identify which documents in your business are worth automating (volume,
variability, value, risk). Part 2: three worked examples end-to-end —
client intake pack, monthly client report, contract first-pass review.
Each worked example shows the inputs, the prompt chain, the tools, and
what still needs human review.
**Funnel role:** Mid-funnel. Buyers who already know they have a document
problem land here.
**Formats:** Markdown + PDF.
**Ties to blog:** `/article/the-ai-implementation-playbook-for-service-businesses`,
`/article/what-ai-implementation-means-law-firm`.

#### 7. The AI Project Brief Template
**Old idea:** #21.
**Upgrade:** A structured DOCX template they fill in *before* a discovery
call with you. Sections: problem statement, current process, success
metrics, data inventory, constraints (compliance, budget, timeline),
stakeholders. Doubles as your qualifier — anyone who fills this in is
serious. Include a 2-page guide on how to fill it in.
**Funnel role:** Bottom funnel. This is the asset that says "you're ready
to talk to me."
**Formats:** DOCX (template) + markdown (the how-to guide).
**Ties to blog:** Surface it on services pages, not blog posts. CTA at
the end of the Compliance Pack and the 5 Workflows guide.

### Tier 3 — Build third (specialist, situational)

These are narrower but high-intent for the right buyer. Ship after Tier 1
and 2 are pulling traffic.

#### 8. The Meeting Notes Automation Guide
**Old idea:** #16. Specific, immediately useful, fast to produce.
**Ties to blog:** `/article/agency-workflows-automate-first` (workflow #3
in that piece).

#### 9. The Knowledge Base Automation Guide (RAG for SMEs)
**Old idea:** #26. How to turn internal docs into a queryable AI
knowledge base. Covers tool choice, what RAG actually is, what it costs,
what breaks. Strong for accountancies and agencies with messy SharePoint /
Drive estates.
**Ties to blog:** `/article/51-of-code-on-github-is-ai-generated-that-should-worry-you`
(adjacent — "what AI can and can't do reliably").

#### 10. The Client Onboarding Automation Blueprint
**Old idea:** #14. End-to-end walkthrough with a flowchart and tool
recommendations. Specific enough to feel like a real deliverable; ties
straight to "you could hire me to do this."
**Ties to blog:** `/article/agency-workflows-automate-first`.

#### 11. The AI Vendor Evaluation Scorecard
**Old idea:** #29. Structured comparison scorecard (capability, data
privacy, cost, support, integration). Pair with #18 build-vs-buy logic.
**Ties to blog:** `/article/why-79-of-enterprises-are-failing-at-ai-adoption`
(picking the wrong tools is a top cause).

#### 12. The 30-Day AI Adoption Plan
**Old idea:** #22. Week-by-week rollout plan for introducing one workflow.
Great for the buyer who's read everything else and wants permission to
start small.
**Ties to blog:** `/article/ai-adoption-disappointment-why-companies-fail`
(directly addresses "we tried AI and it disappointed").

### Cut / fold-in

The following originals are absorbed into the above and shouldn't be
shipped as standalone assets:

- #2 Implementation Checklist → folded into #4 (5 Workflows) as the
  pre/during/after appendix.
- #4 / #9 AI Tools Stack → folded into #11 (Vendor Scorecard) as the
  shortlist.
- #8 Non-Technical Guide → folded into the intro of #1 (Readiness
  Scorecard).
- #15 AI Audit Framework → folded into #1 (Readiness Scorecard), which is
  the audit framework operationalised.
- #17 Email Triage Playbook → covered as one of the 5 in #4.
- #18 Build vs Buy → folded into #4 and #11.
- #19 AI Glossary → folded into Tier 1 docs as a sidebar / footer
  reference. Not a standalone download.
- #20 Data Preparation Guide → folded into #9 (Knowledge Base) which is
  where data prep actually bites.
- #24 Automation Flowchart Pack → folded as diagrams inside #6 and #10.
- #25 Discovery Workshop Template → fold into #7 (Project Brief) as the
  facilitated version.
- #27 Proposal Writing Guide → too tactical and too niche; skip unless an
  agency client asks.
- #30 Delegation Framework → fold into #4 as a sidebar.
- #31 Contract Review Automation → fold into the Law Firm variant of #4.
- #32 Staff AI Training Pack → fold into #3 (Compliance Pack) as
  appendix slides.
- #33 Architecture Diagram Pack → fold into #9.
- #34 Retrospective Template → too late-stage; skip.

---

## Part 2 — Blog Integration

Each existing blog gets one or two resource CTAs inserted — one in the body
(contextual, mid-article), one at the end (primary).

| Blog post | Primary CTA (end) | Inline CTA (mid) |
|---|---|---|
| `/article/the-ai-implementation-playbook-for-service-businesses` | #4 5 Workflows (sector-relevant variant) | #1 Readiness Scorecard |
| `/article/why-79-of-enterprises-are-failing-at-ai-adoption` | #1 Readiness Scorecard | #11 Vendor Scorecard |
| `/article/51-of-code-on-github-is-ai-generated-that-should-worry-you` | #3 Compliance Pack | #9 Knowledge Base Guide |
| `/article/ai-adoption-disappointment-why-companies-fail` | #2 ROI Calculator | #12 30-Day Plan |
| `/article/what-ai-implementation-means-law-firm` | #3 Compliance Pack | #4 5 Workflows (Law variant) |
| `/article/agency-workflows-automate-first` | #4 5 Workflows (Agency variant) | #5 Prompt Library |

**Implementation pattern:** a reusable `<ResourceCallout />` Astro component
that takes `slug`, `title`, `description`, and optional `variant` (inline /
block). Inserted into article rich-text via a CMS block, or hardcoded in the
article template footer fallback. Each article has a `relatedResources`
field added to the `article` collection (array of resource slugs) to drive
this without manual edits.

**New homepage / nav surfaces:**

- Add `/resources` to the main nav under a "Free Tools & Resources"
  dropdown (already partially in place with /tools — extend it).
- Add a "Resources" block to the homepage between case studies and
  contact, mirroring the Tools section style.
- Footer: add a Resources column.

---

## Part 3 — Technical Implementation

### 3.1 Data model

Add a `resource` collection to `cms.config.ts`:

```ts
defineCollection('resource', {
  fields: {
    title:       text().required(),
    slug:        slug().from('title'),
    summary:     textarea().maxLength(300),     // shown on listing
    description: richText(),                    // shown on detail page
    sector:      select(['All', 'Legal', 'Accountancy', 'Agency']),
    tier:        select(['1', '2', '3']),       // for ordering / badges
    funnelStage: select(['TOFU', 'MOFU', 'BOFU']),
    coverImage:  media(),
    // Source of truth: markdown lives in /public/resources/<slug>/<slug>.md
    // checked into the repo. CMS doesn't store the body — it stores the
    // path. typeset.chrisgarlick.com reads the markdown on render.
    markdownPath: text().required(),            // e.g. resources/ai-readiness-scorecard/ai-readiness-scorecard.md
    // Which formats are available for this resource. Drives the download
    // selector UI. DOCX only when a hand-authored file exists.
    formats:     select(['md', 'pdf', 'html', 'docx']).multiple().default(['md', 'pdf', 'html']),
    docxPath:    text().nullable(),             // optional, only when formats includes docx
    relatedArticles: text().nullable(),         // comma-separated article slugs for cross-linking
    sortOrder:   number(),
    status:      select(['draft', 'published']).default('draft'),
    seo:         seoBlock(),
  },
}),
```

Add `relatedResources` to the existing `article` collection (comma-separated
resource slugs) so each blog post drives its CTAs from the CMS.

New tables (migration `0002_*.sql`):

```sql
-- People who submitted email for a resource. Used for re-marketing and to
-- short-circuit the gate on return visits (cookie-based, not real auth).
CREATE TABLE resource_leads (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email       text NOT NULL,
  first_name  text,
  company     text,
  sector      text,                            -- optional self-id
  source_slug text,                            -- which resource they first hit
  marketing_consent boolean NOT NULL DEFAULT false,
  ip          text,
  user_agent  text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (email)
);

-- One row per download. Lets us see which formats and which resources
-- pull, and re-issue download links if a user comes back.
CREATE TABLE resource_downloads (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id      uuid NOT NULL REFERENCES resource_leads(id) ON DELETE CASCADE,
  resource_slug text NOT NULL,
  format       text NOT NULL,                  -- md | pdf | html | docx
  ip           text,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON resource_downloads (resource_slug);
CREATE INDEX ON resource_downloads (lead_id);
```

### 3.2 Storage layout

Markdown lives in the repo so it's diffable and Cloud-CDN-cacheable:

```
public/
  resources/
    ai-readiness-scorecard/
      ai-readiness-scorecard.md           # source
      ai-readiness-scorecard.docx         # optional, only where hand-authored
      cover.webp
    uk-ai-compliance-pack/
      uk-ai-compliance-pack.md
      ai-acceptable-use-policy.docx       # the editable artefact
      data-classification-matrix.md
      cover.webp
    ...
```

### 3.3 Pages

- `/resources` — listing. Filter by sector and funnel stage. Reuses the
  Tools listing pattern (`src/pages/tools/index.astro`) for consistency.
- `/resources/[slug]` — detail page. Hero (title + summary + cover),
  rich-text description (what's inside, who it's for, table of contents),
  a single **"Get the download"** CTA. The CTA opens the email-gate
  modal. After capture, the page reveals a format-picker (md / pdf /
  html / docx).
- `/resources/[slug]/thanks` — optional standalone landing after submit,
  with the download buttons and a "while you're here, read these"
  related-articles block. Better than a modal because it's
  bookmarkable/forwardable and easy to re-issue via the magic-link email.

### 3.4 Email gate flow (no login, cookie-based return)

1. User clicks **Get the download** on `/resources/[slug]`.
2. Modal: email (required), first name (optional), company (optional),
   sector (optional select), marketing consent checkbox (GDPR — required
   under UK PECR for marketing emails, must be unticked by default; the
   download itself is delivered regardless of consent because it's a
   transactional response to a request).
3. Honeypot field `_hp` (matches existing `/api/forms/send` pattern).
4. POST `/api/resources/request` with `{ slug, email, firstName?, company?,
   sector?, marketingConsent }`.
5. Server:
   - Validate email shape.
   - Honeypot check.
   - Upsert into `resource_leads` by email (update name/company/sector if
     provided and previously null; **never** downgrade marketing consent
     from `true` to `false` without explicit action).
   - Insert a `resource_downloads` row per format the user eventually
     picks (logged when they click a format, not at email submit time).
   - Sign a short-lived (24h) HMAC token: `{ leadId, slug, exp }` →
     base64url. Send a magic-link email via Resend containing
     `https://chrisgarlick.com/resources/<slug>/thanks?t=<token>`.
   - Also set a `cg_lead` cookie (HttpOnly, 90 days) with the same
     signed token so on this device they skip the gate on future
     resources.
   - Return `{ ok: true, redirect: '/resources/<slug>/thanks?t=<token>' }`.
6. Browser navigates to thanks page, which renders the format-picker.

**Return visit gating:** on any `/resources/[slug]` page load, server-side
check for the `cg_lead` cookie. If present and HMAC-valid and not expired,
swap the **Get the download** CTA for the format-picker inline — no
modal. If expired, prompt again (same email pre-fills).

**Bot resistance:** honeypot, hCaptcha-free rate limit (5 submits per IP
per hour, same in-memory limiter pattern as `/api/tools/audit`),
disposable-domain blocklist (simple regex against `mailinator|guerrillamail|...`).

### 3.5 Format delivery

When the user clicks a format on the thanks page:

| Format | What happens |
|---|---|
| **md** | `GET /api/resources/<slug>/download?format=md&t=<token>` → server validates token, logs the download, streams the raw markdown from `public/resources/<slug>/<slug>.md` with `Content-Disposition: attachment`. |
| **pdf** | Same endpoint with `format=pdf` → server validates, logs, then makes a server-to-server POST to `https://typeset.chrisgarlick.com/api/render` with `{ markdownUrl, format: 'pdf', theme: 'chrisgarlick' }`. Streams the PDF back to the client. (Typeset endpoint not built yet — endpoint contract documented below so it can be built independently.) |
| **html** | Same endpoint with `format=html` → call typeset with `format: 'html'`. Stream back the HTML with `Content-Disposition: attachment`. |
| **docx** | Server validates, logs, streams `public/resources/<slug>/*.docx` directly. No typeset call — DOCX is hand-authored. If no DOCX exists for the resource, the format isn't shown in the picker. |

### 3.6 Typeset API contract (the thing we'll wire later)

This is what `typeset.chrisgarlick.com` needs to expose. Documenting now so
both ends can be built independently.

```
POST https://typeset.chrisgarlick.com/api/render
Authorization: Bearer <TYPESET_API_KEY>
Content-Type: application/json

{
  "markdown": "...raw markdown body...",       // OR
  "markdownUrl": "https://chrisgarlick.com/resources/<slug>/<slug>.md",
  "format": "pdf" | "html",
  "theme":  "chrisgarlick",                    // typeset-side theme name
  "metadata": {
    "title": "The AI Readiness Scorecard",
    "author": "Chris Garlick",
    "footer": "chrisgarlick.com"
  }
}

→ 200, body is the rendered file (application/pdf or text/html).
```

Caching: cache the rendered output by `(slug, format, markdownHash)` in
the CMS server's filesystem (`/tmp/typeset-cache/` or
`public/cache/resources/`) for 7 days. Most resources are static so most
requests will hit cache. Invalidate by re-deploying or by busting the
hash when the source markdown changes.

### 3.7 Components to build

- `src/components/ResourceCard.astro` — listing card. Modeled on
  `ToolCard.astro`.
- `src/components/ResourceCallout.astro` — inline CTA used inside
  articles (block + inline variants).
- `src/components/ResourceGate.astro` — the email modal. Reuses the
  existing form styling pattern from `ApplyForm.astro`.
- `src/components/FormatPicker.astro` — the four-button download chooser
  shown post-gate.
- `src/pages/resources/index.astro` — listing.
- `src/pages/resources/[slug].astro` — detail.
- `src/pages/resources/[slug]/thanks.astro` — post-submit, holds the
  format picker.

### 3.8 Server endpoints to add (in `server.ts`)

- `POST /api/resources/request` — email submit, upserts lead, sets
  cookie, sends magic-link email, returns redirect.
- `GET  /api/resources/:slug/download` — token-gated format delivery
  (md, pdf, html, docx). Logs to `resource_downloads`.
- `GET  /api/resources/leads` — admin only, paginated list of leads
  with download counts. Mirrors the existing
  `/api/tools/audit/logs` pattern (auth header required).

### 3.9 Email (Resend)

Two new transactional emails, sent via the existing Resend integration:

1. **Resource delivery email** — sent on submit. Subject: "Your download:
   <Resource Title>". Body: thank-you, magic link to thanks page, list
   of formats, link to one related article. Plain HTML, matching
   existing form-email style.
2. **Internal lead notification** — sent to `CONTACT_EMAIL` so you see
   leads land in real time. Same pattern as the existing contact form
   notification.

### 3.10 Analytics / GTM

GTM is already wired (commit d761e951). Push these events:

- `resource_view` on `/resources/[slug]` load
- `resource_gate_open` when the modal opens
- `resource_lead_submit` on successful submit (include `slug`,
  `marketingConsent`)
- `resource_download` on any format click (include `slug`, `format`)

### 3.11 Build / ship order

1. **Foundation (1 day)** — migration, `resource` collection, listing
   and detail pages, ResourceCard, no gating yet (gate behind a feature
   flag). Ship one placeholder resource end-to-end.
2. **Gate (1 day)** — email modal, `POST /api/resources/request`,
   cookie + magic-link, thanks page, format picker (md + docx only,
   pdf/html stubbed to "rendering — try again in a moment").
3. **First real resource (#1 Readiness Scorecard)** — content +
   interactive scoring tool + personalised report generator. This is
   the biggest content lift.
4. **Typeset wiring** — implement `/api/render` on typeset, wire
   PDF/HTML formats, add caching.
5. **Tier 1 content (resources #2–#4)** — ROI calculator, Compliance
   Pack (incl. DOCX), 5 Workflows (three sector variants).
6. **Blog integration** — `ResourceCallout` component, add
   `relatedResources` to articles, backfill the six existing posts.
7. **Tier 2/3 content** — ship the rest one per week.

### 3.12 Risks / decisions to settle

- **DOCX rendering vs. hand-authored.** Decision: hand-author DOCX only
  for editable templates (Compliance Pack policy, Project Brief). For
  everything else, omit DOCX — it's a worse PDF.
- **Marketing consent under PECR.** The download itself is transactional
  so it can go out without consent. Newsletter sends require ticked
  consent. Make this distinction visible in the modal copy.
- **Email verification.** Don't double-opt-in for the download — too
  much friction. Do verify before adding to a newsletter list (Tier 2
  concern, not blocking).
- **Personalised reports (#1, #2).** These produce per-user markdown
  rendered on the fly. Generate the markdown server-side from the form
  inputs, store the rendered markdown alongside the lead row
  (`personalised_markdown text` on `resource_downloads`), and pass that
  body to typeset for PDF/HTML. Don't try to template inside typeset.

---

## Open questions

- Should `/resources` be a top-level nav item, or live under a "Tools &
  Resources" dropdown alongside `/tools`? Recommend the dropdown — keeps
  the nav tight.
- Do we want a single "All resources" PDF bundle for newsletter
  subscribers? Nice retention play for later; out of scope for v1.
- Webhook from `resource_lead_submit` into a CRM? Not now — the
  `resource_leads` table is the CRM until volume justifies otherwise.
