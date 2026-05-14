# ChrisGarlick.com — Full Implementation Plan

## Pivot: Vertical AI Implementation Partner for All Businesses

*Version 1.1 — May 2026*

-----

## Overview

This plan covers the full restructure of chrisgarlick.com from a finance/law AI portfolio into a conversion-optimised site for a one-person vertical AI implementation practice. It combines the Gemini Phase plan, sitemap analysis, and conversion architecture gaps into a single actionable document.

**Core positioning:** A one-person AI partner for businesses — no account managers, no bloated agency overhead, direct technical execution.

**Primary tagline:** *“I automate the repetitive tasks that stall your growth. If it can be documented, it can be automated.”*

-----

## Part 1: Brand & Messaging

### 1.1 Positioning Statement

Move away from industry verticals (law, finance) toward outcome verticals (workflow automation, AI agents, data extraction). The differentiator is not “AI for your sector” — it’s “AI built by one person who actually does the work.”

**Key messages to carry through every page:**

- One person, full execution — no handoffs, no bloat
- Technical depth that non-technical AI consultants can’t match (Astro, Next.js, custom agent architecture)
- Documented process → automated process (the core promise)
- Measurable outcomes: time saved, error rate reduction, cost per task

### 1.2 Tone & Voice

- Direct and technical, not consultancy-vague
- Confident without being arrogant
- Specific over generic — always name the technology, the metric, the outcome
- No corporate filler (“leverage synergies”, “end-to-end solutions”)

### 1.3 Visual Identity

Maintain existing dark editorial direction:

- Instrument Serif for headings
- DM Mono for code/data elements
- Warm gold accents for CTAs and highlights
- High contrast, low noise — let content breathe

-----

## Part 2: Sitemap Changes

### 2.1 Pages to Keep (Copy Updates Only)

|Page              |Action                                                              |
|------------------|--------------------------------------------------------------------|
|`/`               |Swap hero message, add tiered CTA hierarchy (see Section 3.1)       |
|`/about`          |Reframe around the one-person model as a feature, not a limitation  |
|`/contact`        |Add pricing anchor signal — rough engagement range                  |
|`/privacy`        |No change                                                           |
|`/terms`          |No change                                                           |
|`/article` (index)|Update meta description to reflect broader positioning              |
|`/tools`          |Minor copy update — position audit as universal, not sector-specific|

### 2.2 Pages to Restructure Significantly

|Page                         |Action                                                                          |
|-----------------------------|--------------------------------------------------------------------------------|
|`/services`                  |Rebuild as outcome-based conversion hub (see Section 3.3)                       |
|`/services/ai-implementation`|Promote to primary SEO landing page; full Problem → Stack → ROI treatment       |
|`/work`                      |Add third case study minimum; reframe existing two around technology and savings|
|`/resources`                 |Expand from single prompt library to multi-asset lead magnet hub                |
|`/tools/site-audit`          |Add segmentation field + 24hr automated follow-up email sequence                |

### 2.3 Pages to Rewrite (Keep URLs, Change Content)

Industry pages are worth keeping — long-tail industry keywords convert better than generic ones, and sector-specific landing pages are more persuasive for LinkedIn outbound into those sectors. The problem with the current versions is they lead with the industry label rather than the problem. Rewrite each to lead with pain, outcome, and process — the industry becomes context, not the hook.

|Page                                |New Framing                                                                                                                     |Priority  |
|------------------------------------|--------------------------------------------------------------------------------------------------------------------------------|----------|
|`/services/ai-for-law-firms`        |*“Automating document-heavy workflows for law firms”* — document review, contract extraction, client intake                     |🟡 Week 2–3|
|`/services/ai-for-accountancy-firms`|*“Reducing manual processing for accountancy practices”* — data extraction from statements, report generation, client onboarding|🟡 Week 2–3|
|`/services/ai-for-agencies`         |*“Replacing repetitive delivery tasks for agencies”* — brief processing, reporting automation, client communication workflows   |🟡 Week 2–3|

**Each rewritten industry page must:**

- Lead with a problem headline, not an industry label
- Follow the same Problem → Solution → Stack → ROI structure as outcome service pages
- Include industry-specific examples and language throughout
- Link to the relevant outcome service page(s) (e.g. law firms → `/services/data-extraction`)
- End with the standard sticky CTA

**Future industry pages to add** (as LinkedIn outbound expands into new sectors):

- `/services/ai-for-recruiters` — CV screening, candidate research, outreach automation
- `/services/ai-for-property` — listing data extraction, market research automation, report generation
- `/services/ai-for-consultancies` — proposal drafting, research pipelines, client reporting

### 2.4 Pages to Redirect (301s Only)

|From                                                 |To                                                              |Reason                           |
|-----------------------------------------------------|----------------------------------------------------------------|---------------------------------|
|`/article/what-ai-implementation-means-law-firm`     |`/article/the-ai-implementation-playbook-for-service-businesses`|Too niche; better existing target|
|`/resources/prompt-library-for-professional-services`|`/resources/ai-prompts-for-business-workflows`                  |Rename and redirect old URL      |

### 2.5 New Pages Required

|Page                                          |Priority   |Purpose                                        |
|----------------------------------------------|-----------|-----------------------------------------------|
|`/start`                                      |🔴 Immediate|Cold traffic landing page for LinkedIn outbound|
|`/services/workflow-automation`               |🔴 Immediate|New outcome service page                       |
|`/services/ai-agents`                         |🔴 Immediate|New outcome service page                       |
|`/services/data-extraction`                   |🟡 Week 2   |New outcome service page                       |
|`/diagnostic`                                 |🟡 Week 2   |Lead qualification layer                       |
|`/resources/ai-prompts-for-business-workflows`|🟡 Week 2   |Renamed prompt library + expanded scope        |
|`/resources/workflow-audit-template`          |🟠 Week 3–4 |New lead magnet                                |

-----

## Part 3: Page-by-Page Specifications

### 3.1 Homepage (`/`)

**Hero section:**

- H1: *“Vertical AI Implementation”*
- Sub-header: *“I automate the repetitive tasks that stall your growth. If it can be documented, it can be automated.”*
- Primary CTA: `Start with a free site audit →` (links to `/tools/site-audit`)
- Secondary CTA: `See how it works →` (links to `/services`)

**Tiered CTA hierarchy (replace single CTA with three-tier flow):**

1. **Cold/curious:** Free site audit (`/tools/site-audit`) — zero commitment, immediate value
1. **Warm/interested:** Book a discovery call (`/contact`) — for people who’ve read a service page
1. **Ready to buy:** View engagement options (`/services/ai-implementation`) — for people who know what they want

**New section: The one-person advantage**

- Short block (3–4 lines) explicitly calling out the no-agency-overhead model
- Frame it as a feature: faster decisions, direct access, no brief-to-delivery translation loss

**New section: What I automate**

- Three visual tiles linking to `/services/workflow-automation`, `/services/ai-agents`, `/services/data-extraction`
- Each tile: icon, one-line description, example outcome (“Client intake processed in 4 minutes, not 40”)

**New section: Results that transfer**

- Reframe existing case studies to lead with technology and savings metric, not client industry
- Format: Metric → Method → Stack
- Example: “40% reduction in manual processing / Custom AI intake pipeline / Claude API + Node.js”

**Footer CTA:**

- Sticky/consistent across all pages: *“Not sure where to start? Run a free audit of your site.”*

-----

### 3.2 About (`/about`)

**Reframe:** Stop being a portfolio page. Make it a trust and differentiation page.

**Sections to include:**

1. **Who I am** — technical background, what that means for delivery speed
1. **Why one person** — explicit positioning: you get me, not a junior, not an account manager
1. **How I work** — brief process overview (Audit → Identify → Build → Measure)
1. **What I use** — name-drop the stack (Claude API, Astro, Next.js, Node.js) to filter technically naive buyers
1. **CTA** — Book a discovery call

-----

### 3.3 Services Hub (`/services`)

**Rebuild as conversion hub, not a list page.**

**Structure:**

1. Short intro: What “AI implementation” actually means in practice
1. Three outcome lanes with clear CTAs:
- Workflow Automation → `/services/workflow-automation`
- Custom AI Agents → `/services/ai-agents`
- Data Extraction → `/services/data-extraction`
1. Pricing anchor section: *“Engagements typically start at £X for a scoped workflow project”*
1. Process overview (Audit → Scope → Build → Measure)
1. CTA: Start with a free site audit or book a call

-----

### 3.4 Service Pages (New)

Each service page follows the same structure:

```
H1: Problem statement headline
Sub-header: What this solves and for whom

Section 1: The problem (1–2 paragraphs, specific and painful)
Section 2: The solution (what you build, how it works)
Section 3: Technical stack (what tools/APIs/frameworks are used — builds authority)
Section 4: Case study or outcome (Problem → Solution → Stack → ROI)
Section 5: Is this right for you? (qualification signals — 3–4 bullet criteria)
CTA: Book a scoping call | Run a free audit first
```

**`/services/workflow-automation`**

- Target keyword: “automating business workflows with AI”
- Problem: Manual, repetitive multi-step tasks eating hours per week
- Examples: Client intake, invoice processing, approval chains, report generation
- Stack: Claude API, Node.js, Zapier/Make where appropriate, custom pipelines

**`/services/ai-agents`**

- Target keyword: “custom AI agents for business”
- Problem: Tasks that require judgement, not just execution — researching, drafting, triaging
- Examples: Lead research agents, email triage, document review, meeting summarisation
- Stack: Claude API (Haiku for orchestration, Sonnet for output), custom skill layers

**`/services/data-extraction`**

- Target keyword: “AI for document processing and data extraction”
- Problem: Data locked in PDFs, emails, forms, web pages that needs to be structured
- Examples: Contract data extraction, competitor monitoring, web scraping pipelines
- Stack: Claude API, Node.js, Playwright/Puppeteer, structured output prompting

-----

### 3.5 Industry Service Pages (Rewrite)

Industry pages follow the same structural template as outcome service pages but with sector-specific language, examples, and pain points throughout. The industry is the context — the problem and outcome are still the hook.

**Template:**

```
H1: Problem statement headline (industry-specific)
Sub-header: What this solves, for whom, with what result

Section 1: The problem — specific to this industry, quantified where possible
Section 2: What gets automated — named workflows, not generic descriptions
Section 3: How it works — technical process explained accessibly
Section 4: Stack — Claude API, Node.js, and any relevant integrations
Section 5: Case study or outcome — Problem → Solution → Stack → ROI
Section 6: Is this right for your practice? — 3–4 qualification signals
CTA: Book a scoping call | Run a free audit first
Internal links: Point to relevant outcome service pages
```

**`/services/ai-for-law-firms`**

- New H1: *“Automating document-heavy workflows for law firms”*
- Target keyword: “AI automation for law firms”, “automating legal document review”
- Pain points: Document review, contract data extraction, client intake, matter summarisation
- Example outcome: “Contract review reduced from 3 hours to 20 minutes per matter”
- Links to: `/services/data-extraction`, `/services/ai-agents`

**`/services/ai-for-accountancy-firms`**

- New H1: *“Reducing manual processing for accountancy practices”*
- Target keyword: “AI for accountants”, “automating accounting workflows”
- Pain points: Extracting data from bank statements/receipts, report generation, client onboarding packs
- Example outcome: “Month-end reporting pack generated in 8 minutes, not 2 hours”
- Links to: `/services/data-extraction`, `/services/workflow-automation`

**`/services/ai-for-agencies`**

- New H1: *“Replacing repetitive delivery tasks for agencies”*
- Target keyword: “AI automation for agencies”, “automating agency workflows”
- Pain points: Brief processing, status reporting, client communication, competitor research
- Example outcome: “Weekly client reports generated automatically from project data”
- Links to: `/services/workflow-automation`, `/services/ai-agents`

-----

### 3.6 Primary AI Implementation Page (`/services/ai-implementation`)

**Promote this to the main SEO landing page for “AI implementation” as a term.**

Expand from current state to full Problem → Stack → ROI treatment:

1. What AI implementation actually means (vs. buying ChatGPT Plus)
1. The four stages: Audit, Identify, Build, Measure
1. What you get: documented automation, not a consulting deck
1. Case study section: at least two examples with stack and metrics
1. FAQ (optimised for featured snippets):
- “How long does an AI implementation project take?”
- “What does AI implementation cost?”
- “Do I need existing technical infrastructure?”
1. CTA: Book scoping call

-----

### 3.7 Cold Traffic Landing Page (`/start`) 🔴 Priority 1

**Purpose:** Single-purpose page for LinkedIn outbound DM traffic. No nav. No distractions. One CTA.

**Structure:**

1. H1: *“Let’s find the one task that’s costing you the most time”*
1. Two-line value prop: Direct, specific, no jargon
1. Three-line “how it works”: Free audit → 24hr report → 30-min call to review
1. Social proof: One case study stat (e.g., “One agency reduced their intake process from 45 minutes to 4”)
1. Single CTA: `Run your free audit →` (links to `/tools/site-audit`)
1. Optional: Book directly if they already know what they want

**No global navigation.** Minimal footer (privacy policy link only).

-----

### 3.8 Qualification Diagnostic (`/diagnostic`) 🟡 Priority 2

**Purpose:** Filter leads before they get to a discovery call. Saves time for both sides.

**Format:** Short multi-step form (4–5 questions max). Not a quiz, not a survey — a routing tool.

**Questions:**

1. What type of business are you? *(agency / professional services / e-commerce / other)*
1. What’s the task you most want to automate? *(free text, 1–2 lines)*
1. How many hours per week does this currently take? *(< 2h / 2–10h / 10h+)*
1. Do you have any existing tech stack or tools in use? *(free text)*
1. What’s your priority right now? *(reduce time / reduce errors / scale without hiring / all three)*

**Outcome routing:**

- High fit (10h+ task, clear process) → Book discovery call CTA
- Medium fit (2–10h, some clarity) → Free audit CTA + follow-up email sequence
- Low fit (< 2h, vague) → Resource/article CTA

-----

### 3.9 Site Audit Tool (`/tools/site-audit`)

**Additions to current tool:**

1. **Segmentation field:** Add to the email capture form — *“What manual task do you wish you never had to do again?”* (free text, optional but tracked)
1. **Post-audit email sequence:**
- Immediate: PDF audit report (existing)
- T+24h: Follow-up email: *“One thing your audit didn’t cover — the time your team spends on [X]…”* → links to `/diagnostic`
- T+72h: Case study email (automate the most common pain point identified from segmentation field)
1. **Blog post footer CTA:** Standardise across all articles — every post ends with the audit tool as primary CTA

-----

### 3.10 Work / Case Studies (`/work`)

**Current state:** Two case studies. Too thin for an agency pitch.

**Required additions:**

- Add minimum one new case study within 30 days
- Reframe all existing case studies using the Problem → AI Solution → Technical Stack → Tangible ROI format
- Remove industry-specific framing; lead with the metric and the method

**Case study template:**

```
Title: [Outcome achieved] — [Method used]
Example: "4-minute intake processing — AI pipeline replacing a 45-minute manual workflow"

Problem: What was happening before (specific, quantified if possible)
Solution: What was built and how it works
Stack: Languages, APIs, frameworks used
Result: Time saved / error rate / cost reduction / team hours freed
```

**Target: 4 case studies minimum by end of Phase 2.**

-----

### 3.11 Resources (`/resources`)

**Expand from single asset to multi-asset lead magnet hub.**

**Assets to build:**

|Asset                            |URL                                           |Target audience                           |
|---------------------------------|----------------------------------------------|------------------------------------------|
|AI Prompts for Business Workflows|`/resources/ai-prompts-for-business-workflows`|Ops managers, small business owners       |
|Workflow Audit Template          |`/resources/workflow-audit-template`          |Anyone wanting to self-audit before a call|
|AI Implementation Checklist      |`/resources/ai-implementation-checklist`      |Business owners evaluating readiness      |

**Each resource page:**

- Short description of the asset and who it’s for
- Email gate (or direct download — test both)
- Follow-up email sequence pointing to `/diagnostic` or discovery call

-----

### 3.12 Contact (`/contact`)

**Add pricing anchor:** Don’t hide all pricing. Add one line:

*“Scoped workflow projects typically start at £[X]. Larger agent builds and ongoing retainers are quoted per project.”*

This pre-qualifies budget expectations and reduces ghosting after discovery calls.

-----

## Part 4: Content & SEO

### 4.1 Keyword Targets (Problem-Based)

|Keyword                             |Target page                                                |Intent          |
|------------------------------------|-----------------------------------------------------------|----------------|
|AI implementation for small business|`/services/ai-implementation`                              |Commercial      |
|Automating client intake with AI    |`/services/workflow-automation`                            |Commercial      |
|Custom AI agents for business       |`/services/ai-agents`                                      |Commercial      |
|AI for document processing          |`/services/data-extraction`                                |Commercial      |
|How to automate business workflows  |New article                                                |Informational   |
|Replacing manual data entry with AI |New article                                                |Informational   |
|Why AI implementations fail         |`/article/why-79-of-enterprises-are-failing-at-ai-adoption`|Informational   |
|Vertical AI implementation          |`/` + `/services/ai-implementation`                        |Branded/emerging|

### 4.2 Articles to Write

**Priority order:**

1. *“How to automate client intake without custom software”*
- Target: “automating client intake”
- CTA: `/services/workflow-automation` + audit tool
1. *“Replacing manual data entry with AI agents: a practical guide”*
- Target: “AI for data entry”, “replace manual data entry”
- CTA: `/services/data-extraction` + audit tool
1. *“What vertical AI implementation actually looks like for a small business”*
- Target: “AI implementation small business”
- CTA: `/diagnostic` + discovery call
1. *“Why I use Astro and Next.js — and what it means for your AI implementation”*
- Technical authority piece, differentiates from non-technical AI consultants
- CTA: `/about` + discovery call
1. *“The 3-step process I use to identify what to automate first”*
- Explains your methodology, builds trust before a call
- CTA: Free audit or `/diagnostic`

### 4.3 Article Structure Standard

All new articles follow this structure:

1. Problem headline (what the reader is experiencing)
1. TL;DR box (3-bullet summary for scanners)
1. The problem section (agitate, be specific)
1. The solution (practical, named tools and techniques)
1. Step-by-step or case example
1. What to do next (direct CTA to audit tool or discovery call)

### 4.4 Existing Articles to Update

|Article                                                     |Update needed                                                               |
|------------------------------------------------------------|----------------------------------------------------------------------------|
|`agency-workflows-automate-first`                           |Good fit for new positioning — update CTA to `/services/workflow-automation`|
|`ai-adoption-disappointment-why-companies-fail`             |Useful trust builder — ensure it links to `/diagnostic`                     |
|`the-ai-implementation-playbook-for-service-businesses`     |Strengthen as pillar piece; internal link to all three new service pages    |
|`51-of-code-on-github-is-ai-generated-that-should-worry-you`|Technical authority post — update CTA to `/about`                           |

-----

## Part 5: Lead Generation & Email

### 5.1 LinkedIn Outbound

**Entry point:** All LinkedIn DMs point to `/start` (not the homepage).

**Sequence structure:**

1. Cold DM: Reference a specific pain point relevant to their industry
1. If no reply in 4 days: Follow-up DM offering the free audit
1. If audit completed: Personalised follow-up within 24h referencing their audit result + segmentation field answer

**Offer structure for outreach:**

- Lead with: Free audit of their current site/workflow
- Follow with: Short insight from audit
- Convert with: 30-min call to discuss automation potential

### 5.2 Email Sequences

**Audit follow-up sequence (triggered on audit completion):**

- T+0: PDF audit delivered
- T+24h: *“Your audit didn’t cover everything”* — surfacing the automation angle, linking to `/diagnostic`
- T+72h: Relevant case study for their segmentation field answer
- T+7d: Soft CTA — *“Still thinking about it? Here’s how a 30-minute call works.”*

**Resource download sequence (triggered on lead magnet download):**

- T+0: Download link + one-line context
- T+48h: Related article
- T+5d: *“The task most businesses automate first”* — bridge to service pages
- T+10d: Discovery call CTA

### 5.3 Sticky CTA Standard

Every blog post, resource page, and case study ends with the same format:

```
---
Want to find out which tasks on your site are costing you the most time?
[Run a free audit →]   [Book a 30-min call →]
```

-----

## Part 6: Conversion Architecture

### 6.1 CTA Hierarchy by Traffic Temperature

|Traffic temperature|Where they come from    |Landing page                 |Primary CTA        |
|-------------------|------------------------|-----------------------------|-------------------|
|Cold               |LinkedIn DM             |`/start`                     |Free audit         |
|Cold/curious       |Organic search (article)|`/article/*`                 |Free audit (footer)|
|Warm               |SEO (service keyword)   |`/services/*`                |Discovery call     |
|Warm               |Referral                |`/` or `/about`              |Discovery call     |
|Hot                |Return visit / ready    |`/services/ai-implementation`|Book scoping call  |

### 6.2 Qualification Flow

```
Visitor lands
     │
     ▼
Cold? → /start → Audit → 24h email → /diagnostic → Discovery call
     │
Warm? → /services/* → Pricing anchor → Discovery call
     │
Hot? → /services/ai-implementation → Book scoping call
```

### 6.3 Pages That Must Have No Navigation (`/start`)

The `/start` page should have:

- No global nav
- No sidebar
- No footer links (except privacy policy)
- One CTA only

This removes all exit paths for cold traffic arriving from LinkedIn.

-----

## Part 7: Implementation Phases

### Phase 1 — Immediate (Week 1)

> Unblocks LinkedIn outbound and fixes the worst conversion gaps

- [ ] Build `/start` page (no nav, single CTA)
- [ ] Update homepage hero copy and add tiered CTA section
- [ ] Add segmentation field to `/tools/site-audit`
- [ ] Write first new article: *“How to automate client intake without custom software”*

### Phase 2 — Core Rebuild (Weeks 2–3)

> Establishes the new service architecture and SEO foundation

- [ ] Build `/services/workflow-automation`
- [ ] Build `/services/ai-agents`
- [ ] Rebuild `/services` hub page
- [ ] Expand `/services/ai-implementation` to full pillar treatment
- [ ] Rewrite `/services/ai-for-law-firms` with new framing and structure
- [ ] Rewrite `/services/ai-for-accountancy-firms` with new framing and structure
- [ ] Rewrite `/services/ai-for-agencies` with new framing and structure
- [ ] Reframe existing case studies in `/work` to new format
- [ ] Add new case study to `/work` (minimum 3 total)
- [ ] Build `/diagnostic` qualification page
- [ ] Update `/about` with one-person model positioning
- [ ] Add pricing anchor to `/contact`

### Phase 3 — Lead Gen & Content (Weeks 3–5)

> Activates the full content and email funnel

- [ ] Build `/services/data-extraction`
- [ ] Set up T+24h and T+72h audit follow-up email sequences
- [ ] Build `/resources/workflow-audit-template`
- [ ] Build `/resources/ai-implementation-checklist`
- [ ] Rename prompt library resource and set up redirect
- [ ] Write second article: *“Replacing manual data entry with AI agents”*
- [ ] Write third article: *“What vertical AI implementation actually looks like”*
- [ ] Standardise sticky CTA format across all existing articles
- [ ] Update internal linking on industry pages to point to relevant outcome service pages
- [ ] Set up 301 redirects: article and prompt library URL changes

### Phase 4 — Authority & Optimisation (Weeks 5–8)

> Technical authority content, funnel performance tuning, and sector expansion

- [ ] Write: *“Why I use Astro and Next.js…”*
- [ ] Write: *“The 3-step process I use to identify what to automate first”*
- [ ] Expand `/resources` hub to full multi-asset structure
- [ ] Add FAQ schema to `/services/ai-implementation`
- [ ] A/B test CTA copy on `/start` and `/tools/site-audit`
- [ ] Review diagnostic routing data and adjust qualification thresholds
- [ ] Add fourth case study to `/work`
- [ ] Plan next industry page based on LinkedIn outbound sector data (e.g. `/services/ai-for-recruiters`)

-----

## Part 8: Metrics to Track

### Conversion

- Audit completion rate (visits to `/tools/site-audit` → PDF sent)
- Discovery call booking rate from audit follow-up sequence
- Segmentation field completion rate
- `/diagnostic` completion rate and routing breakdown

### SEO

- Ranking progress on target keywords (monthly)
- Organic traffic to new service pages
- Article performance on problem-based keywords

### Outbound

- LinkedIn DM → `/start` click-through rate
- `/start` → audit completion rate
- Discovery call show rate from cold DM traffic

### Email

- Audit follow-up sequence open rates (T+24h, T+72h)
- Resource download → discovery call conversion rate

-----

## Appendix: Redirect Map

|From                                                 |To                                                              |Type|
|-----------------------------------------------------|----------------------------------------------------------------|----|
|`/article/what-ai-implementation-means-law-firm`     |`/article/the-ai-implementation-playbook-for-service-businesses`|301 |
|`/resources/prompt-library-for-professional-services`|`/resources/ai-prompts-for-business-workflows`                  |301 |

*Note: Industry service pages (`/services/ai-for-law-firms`, `/services/ai-for-accountancy-firms`, `/services/ai-for-agencies`) are being rewritten in place — no redirects needed.*

-----

## Part 9: Internal Linking Architecture

Internal links serve two purposes simultaneously: distributing SEO equity to the pages that need to rank, and guiding visitors deeper into the funnel based on where they are in their buying journey. Every link should do one or both.

### 9.1 Linking Principles

- **Pillar pages receive links, they rarely send them** — `/services/ai-implementation` should accumulate links from articles, case studies, and industry pages. It shouldn’t be linking out to many other pages itself.
- **Industry pages bridge to outcome pages** — a law firm visitor who’s interested enough to read to the bottom should be sent to the specific outcome page that matches their use case, not back to the services hub.
- **Articles link down the funnel, not across** — article-to-article linking dilutes momentum. Articles should link to service pages, resources, the audit tool, or the diagnostic — not to other articles.
- **The audit tool is the universal anchor** — almost every page should have a path to `/tools/site-audit`, either as the primary CTA or a secondary option.
- **Case studies link forward, not backward** — `/work` pages should link to the relevant service page and the contact/diagnostic page. They shouldn’t link back to articles.

### 9.2 Link Map by Page

**Homepage (`/`)**

- → `/services` (What I do section)
- → `/services/workflow-automation`, `/services/ai-agents`, `/services/data-extraction` (service tiles)
- → `/work` (case study teasers)
- → `/tools/site-audit` (primary CTA)
- → `/about` (secondary nav / trust section)

**About (`/about`)**

- → `/services/ai-implementation` (how I work section)
- → `/work` (proof of delivery)
- → `/contact` (primary CTA)
- → `/tools/site-audit` (secondary CTA)

**Services Hub (`/services`)**

- → `/services/ai-implementation` (featured/primary)
- → `/services/workflow-automation`
- → `/services/ai-agents`
- → `/services/data-extraction`
- → `/services/ai-for-law-firms`, `/services/ai-for-accountancy-firms`, `/services/ai-for-agencies` (secondary section: “Working in a specific sector?”)
- → `/tools/site-audit` (CTA)
- → `/diagnostic` (qualification CTA)

**`/services/ai-implementation` (pillar)**

- → `/services/workflow-automation` (inline mention of workflow use cases)
- → `/services/ai-agents` (inline mention of agent use cases)
- → `/services/data-extraction` (inline mention of data use cases)
- → `/work` (case study links)
- → `/contact` (primary CTA)
- → `/tools/site-audit` (secondary CTA)
- → `/article/the-ai-implementation-playbook-for-service-businesses` (further reading)

**`/services/workflow-automation`**

- → `/services/ai-implementation` (“part of a broader implementation?”)
- → `/services/ai-agents` (“need judgement, not just execution?”)
- → `/services/ai-for-agencies` (industry crosslink where relevant)
- → `/work` (relevant case study)
- → `/contact` (primary CTA)
- → `/tools/site-audit` (secondary CTA)

**`/services/ai-agents`**

- → `/services/ai-implementation` (pillar uplink)
- → `/services/workflow-automation` (“more of a process problem?”)
- → `/work` (relevant case study)
- → `/contact` (primary CTA)
- → `/tools/site-audit` (secondary CTA)

**`/services/data-extraction`**

- → `/services/ai-implementation` (pillar uplink)
- → `/services/ai-for-law-firms`, `/services/ai-for-accountancy-firms` (industry crosslinks — data extraction is core to both)
- → `/work` (relevant case study)
- → `/contact` (primary CTA)
- → `/tools/site-audit` (secondary CTA)

**`/services/ai-for-law-firms`**

- → `/services/data-extraction` (primary outcome crosslink — document/contract extraction)
- → `/services/ai-agents` (secondary — document review agents)
- → `/services/ai-implementation` (pillar uplink)
- → `/work` (case study if relevant)
- → `/contact` (primary CTA)
- → `/tools/site-audit` (secondary CTA)

**`/services/ai-for-accountancy-firms`**

- → `/services/data-extraction` (primary — statement/receipt extraction)
- → `/services/workflow-automation` (secondary — report generation, onboarding)
- → `/services/ai-implementation` (pillar uplink)
- → `/contact` (primary CTA)
- → `/tools/site-audit` (secondary CTA)

**`/services/ai-for-agencies`**

- → `/services/workflow-automation` (primary — reporting, brief processing)
- → `/services/ai-agents` (secondary — research and drafting agents)
- → `/services/ai-implementation` (pillar uplink)
- → `/work/ai-integrated-delivery-how-one-operator-delivers-like-a-team` (directly relevant case study)
- → `/contact` (primary CTA)
- → `/tools/site-audit` (secondary CTA)

**`/work` (case study index)**

- → `/services/ai-implementation` (generic CTA after browsing)
- → `/diagnostic` (qualification CTA)
- → `/contact` (primary CTA)

**Individual case study pages (`/work/*`)**

- → The specific service page that matches the work done
- → `/diagnostic` or `/contact` (CTA)
- → `/tools/site-audit` (secondary CTA)
- Do NOT link to other case studies (keeps attention forward)

**`/tools/site-audit`**

- → `/diagnostic` (post-audit next step — segmentation field answer routes here)
- → `/services/ai-implementation` (contextual — “wondering what implementation looks like?”)
- No other outbound links — keep focus on completing the audit

**`/diagnostic`**

- → `/contact` (high-fit routing)
- → `/tools/site-audit` (medium-fit routing)
- → Relevant resource (low-fit routing)
- No other links — single purpose page

**`/start`**

- → `/tools/site-audit` only
- No other links — no-nav, no distractions

**Articles (`/article/*`)**

Each article links to 2–3 targets maximum:

- One service page (the most relevant outcome page for the article topic)
- The audit tool (sticky footer CTA — universal)
- Optionally: one resource page if directly relevant

Article-specific crosslinks:

- `agency-workflows-automate-first` → `/services/workflow-automation`, `/services/ai-for-agencies`
- `ai-adoption-disappointment-why-companies-fail` → `/diagnostic`, `/services/ai-implementation`
- `the-ai-implementation-playbook-for-service-businesses` → `/services/ai-implementation`, `/services/workflow-automation`, `/services/ai-agents`, `/services/data-extraction`
- `why-79-of-enterprises-are-failing-at-ai-adoption` → `/diagnostic`, `/services/ai-implementation`
- `51-of-code-on-github-is-ai-generated` → `/about`, `/services/ai-implementation`
- New article (client intake) → `/services/workflow-automation`, `/tools/site-audit`
- New article (data entry) → `/services/data-extraction`, `/tools/site-audit`
- New article (vertical AI implementation) → `/services/ai-implementation`, `/diagnostic`

**Resources (`/resources/*`)**

- Each resource page → relevant service page + `/tools/site-audit`
- `/resources` index → all three resource pages + `/tools/site-audit`

### 9.3 Equity Flow Diagram

```
Homepage
    │
    ├──→ /services (hub)
    │         │
    │         ├──→ /services/ai-implementation (pillar) ←── Articles
    │         │              │                           ←── Case studies
    │         │              ├──→ /services/workflow-automation ←── Industry pages
    │         │              ├──→ /services/ai-agents         ←── Industry pages
    │         │              └──→ /services/data-extraction   ←── Industry pages
    │         │
    │         └──→ Industry pages
    │                   │
    │                   └──→ Outcome service pages (crosslinks)
    │
    ├──→ /work (case studies)
    │         └──→ Service pages (forward links only)
    │
    ├──→ /tools/site-audit ←── Every page (CTA)
    │         └──→ /diagnostic
    │
    └──→ /about
              └──→ /services/ai-implementation
                   /contact
```

### 9.4 What Not to Link

- Articles should not link to other articles (breaks funnel momentum)
- Industry pages should not link to other industry pages (confuses positioning)
- `/start` links to nothing except `/tools/site-audit`
- `/diagnostic` links only to its outcome destinations — no exploratory links
- Case study pages should not link backward to articles
- Do not create reciprocal links between two pages at the same level (e.g. workflow-automation ↔ ai-agents bidirectionally) — pick one direction based on funnel logic

### 9.5 Anchor Text Standards

Avoid generic anchor text. Every internal link should use descriptive, keyword-informed text:

|Instead of     |Use                                  |
|---------------|-------------------------------------|
|“click here”   |“see how workflow automation works”  |
|“learn more”   |“read the AI implementation playbook”|
|“our services” |“view AI agent builds”               |
|“contact us”   |“book a scoping call”                |
|“find out more”|“run a free site audit”              |

----

## Part 10: SEO 

Do a full once over of new cluster pages & pillar pages and push them to notion, please tick which ones are already live. 

-----

## Part 11: Status & Remaining Work (as of 13 May 2026)

Snapshot after the May 2026 implementation pass. Almost everything from Phases 1–3 has shipped. The remaining items are deliberately spaced out to avoid flooding Google Search Console — pushing ~30 URLs at once triggers a long "Discovered, currently not indexed" tail.

### Shipped

- **All of Phase 1**: /start page, homepage hero rewrite, audit segmentation field, first article (Automate Client Intake).
- **All of Phase 2 except case studies**: /services/workflow-automation, /services/ai-agents, /services hub rebuild, /services/ai-implementation pillar expansion, three industry page rewrites, /diagnostic, /about rebuild, /contact pricing anchor.
- **Most of Phase 3**: /services/data-extraction, "Replacing Manual Data Entry with AI Agents" article, sticky CTA standardisation on all 8 articles, industry-page → outcome-page internal linking, cross-link sweep across pillar/outcomes/industries/articles.
- **Bonus shipped beyond pivot scope**: FAQ schema on the pillar (was Phase 4), BreadcrumbList JSON-LD on every service page, OG image fallback so new pages don't 404 their social cards, em-dash sweep across all CMS content + brand voice rules in CLAUDE.md.

### Remaining work — sequenced by GSC-friendly cadence

The order below is deliberately paced. Ship one item per week (or per fortnight for the heavier ones) and let Google index each before the next lands. This is what stops the new URLs being lumped together and downranked by association.

#### 1. Article: "What vertical AI implementation actually looks like for a small business"
- **Lift**: ~1.5 hours of writing time. Same pattern as the existing articles (~1,800 words, full SEO block, sticky CTA, internal links to /services/ai-implementation + /diagnostic).
- **Target keyword**: "AI implementation small business"
- **Why it matters**: closes a content gap — the pillar talks about *what* implementation is, this article talks about *who it's for and what it feels like* at small-business scale.
- **Deploy**: single article rebuild.

#### 2. Resource: Workflow Audit Template
- **Lift**: ~half a day. Markdown content (~5–7 KB like the prompt library), CMS record with full SEO block + typeset client slug, brand styling already in place from the prompt library.
- **Shape**: a fillable template (markdown headings the user can copy and complete) that walks a reader through auditing their own workflows to identify automation candidates. Maps directly to the methodology I already pitch on /services/ai-implementation.
- **Why it matters**: gives /diagnostic a "low fit" landing destination that still feels valuable. Currently low-fit users get the prompt library, which doesn't quite fit "I'm not ready yet" intent.

#### 3. Resource: AI Implementation Checklist
- **Lift**: ~half a day. Same shape as the audit template.
- **Shape**: a tactical pre-flight checklist for someone evaluating whether they're ready to commission an implementation (data hygiene, team readiness, technical prerequisites, success-metric definition).
- **Why it matters**: targets the "evaluating readiness" intent that sits one step before "actually book a call". Strong lead magnet for medium-fit diagnostic submissions.

#### 4. Article: "The 3-step process I use to identify what to automate first"
- **Lift**: ~1.5 hours. Pattern-matches the existing methodology articles.
- **Why it matters**: methodology pieces build trust before a discovery call. Currently I have one (the playbook) — adding a second deepens the "this person has a process" signal.
- **Internal links**: /diagnostic, /tools/site-audit, /services/ai-implementation.

#### 5. Article: "Why I use Astro and Next.js — and what it means for your AI implementation"
- **Lift**: ~2 hours. More technical than the others; the audience here is the technical-buyer subset.
- **Why it matters**: differentiates from non-technical AI consultants. The kind of piece that makes a CTO Slack a partner saying "this one actually knows what they're doing."
- **Internal links**: /about, /services/ai-implementation, /services/data-extraction.

#### 6. /resources hub expansion
- **Lift**: ~30 minutes once the two new resources above exist. Just CMS records reordering + a cleaner intro on the listing page.
- **Dependencies**: must come after #2 and #3 ship.

#### 7. Audit follow-up email sequences (T+24h, T+72h)
- **Lift**: ~half a day. This is the biggest architecture piece left.
- **What needs building**:
  - Add an `email` field to the audit submit (currently captures URL + task only)
  - Store on `audit_logs` with timestamps for sequencer
  - Write or wire a sequencer (cron or queue) that polls for due sends
  - Two email templates: T+24h ("your audit didn't cover everything — the time your team spends on \[X\]") and T+72h ("case study relevant to your segmentation field answer")
  - Resend integration for actual sending (already in place for transactional)
- **Why it matters**: without it the audit is a one-shot conversion event. With it, audit submissions become a 7-day nurture funnel.
- **Worth flagging**: this is the only Phase 3/4 item that requires real engineering effort. Everything else is content.

### Deferred until data or client work exists

These can't be shipped on demand — they're gated by real-world signals.

- **Case studies — reframe existing two + add a third**: needs paying client work with measurable outcomes. Current /work pages are positioning-only and labelled INTERNAL. Revisit once a real engagement ships.
- **A/B test CTA copy on /start and /tools/site-audit**: needs traffic volume to power statistical significance. Defer until LinkedIn outbound is running and analytics show ≥100 weekly /start visits.
- **Review diagnostic routing data and adjust qualification thresholds**: needs actual diagnostic submissions to analyse. Revisit at ~50 submissions, probably 2–3 months after launch.
- **Add 4th case study to /work**: same as case studies above.
- **Plan next industry page** (recruiters / property / consultancy): pivot suggests letting LinkedIn outbound data dictate which sector earns its own page next. Revisit at ~20 outbound conversations.

### Dropped from the original plan

For the record, so they don't get accidentally picked up later:

- **Rename prompt library to `/resources/ai-prompts-for-business-workflows`** and 301-redirect — kept the existing URL on the basis that the resource is already audience-tailored to professional services and the URL is fine.
- **301 from `/article/what-ai-implementation-means-law-firm` to the playbook** — kept the law-firm article live. It ranks for sector-specific long-tail searches and the playbook article serves a different intent.

### Recommended cadence

One new asset per week is the safest cadence for SEO and for personal bandwidth. A rough four-week plan to clear the content backlog:

| Week | Ship |
|---|---|
| 1 | Article: "What vertical AI implementation actually looks like" |
| 2 | Resource: Workflow Audit Template |
| 3 | Resource: AI Implementation Checklist |
| 4 | Article: "The 3-step process I use to identify what to automate first" |

Then a fortnight gap, then:

| Week | Ship |
|---|---|
| 6 | Article: "Why I use Astro and Next.js" |
| 7 | /resources hub expansion |
| 8–10 | Email-sequence architecture (half-day build + testing + go-live) |

Total: 8–10 weeks to fully complete the pivot from this status point.

-----

*Plan compiled by Claude — May 2026*
*Based on: Gemini Phase Plan + sitemap analysis + conversion architecture review*
*v1.1: Industry pages retained and reframed rather than redirected*
*v1.2: Internal linking architecture added (Part 9)*
*v1.3: Status snapshot + remaining-work plan added (Part 11), 13 May 2026*