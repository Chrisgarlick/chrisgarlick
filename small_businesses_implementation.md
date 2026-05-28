# Audience Expansion — Implementation Plan

Companion to `small_businesses.md`. Concrete sequencing for shipping all 5 `/for/` pages, their gated resources, and their IG carousels over ~7 working days.

**Strategy decisions baked in (push back if any of these are wrong):**

- Ship all 5 audiences without waiting for conversion data. Site is still growing, faster surface area expansion > selective validation.
- Static `.astro` pages, not a CMS collection. Avoids a Kritano schema migration (which has a known trap, see `kritano-issues.md` #1). Pages can be moved to a `forPage` collection later if editing-in-CMS becomes useful.
- Resources go through the existing `resource` CMS collection. Five new entries in `scripts/create-resources.mjs`.
- Carousels use the `/trend` skill via `--package <topic>` mode. Auto-alternates light/dark.
- No prospect outreach skill in v1. UK PECR/GDPR risk on cold-emailing scraped lists is real. The skill is still useful as a research tool (inbound enrichment) but not as an outbound mailer. Defer to a separate plan once the first batch of inbound from the `/for/` pages lands.
- Each `/for/` page's primary CTA is the matched gated resource. Secondary CTA is `/audit`. Neither pushes directly to `/contact`. This sidesteps the "£500 starting" pricing-anchor mismatch with lower-LTV audiences.

---

## What gets shipped

### 5 audience pages

| URL | Audience | Resource it links to | Carousel theme |
|---|---|---|---|
| `/for/agency-starters` | People building AI-enabled agencies | Zero-team agency playbook | Dark |
| `/for/consultants` | Independent consultants productising | One framework, six months of content | Light |
| `/for/freelancers` | Freelancers wanting to scale without hiring | Freelancer's AI proposal pack | Dark |
| `/for/solo-operators` | One-person businesses running on AI | My AI stack for under 2 hours a day | Light |
| `/for/tradespeople` | Trades who don't have time for marketing | 5 AI tools every tradesperson should use in 2026 | Dark |

Theme alternation follows the trend skill rule (last carousel = LLM cheat sheet = light, so next = dark, then alternating).

### 5 gated resources

Markdown source at `public/resources/<slug>/<slug>.md`. Published via extending `scripts/create-resources.mjs`. Typeset client `chris-garlick-light` for all 5 (consistent brand, the light theme renders well as a downloadable report). Funnel stage `TOFU` for all, sector `All`, tier `2`, sortOrder spaced 30-70 so they slot below the existing Prompt Library (10) and LLM Cheat Sheet (20) without re-shuffling.

### 5 IG carousels

10 slides each, generated via the `/trend --package` skill which now defaults to the viral structure. Strategy doc per carousel.

### Cross-cutting tweaks

- New `/for/` hub page (`/for/index.astro`) listing all 5 audiences.
- Nav update: add "For" link near "Industries" in main nav.
- Footer update: add `/for/` links column.
- Each `/industries/` page gets a cross-link to its matched `/for/` page (agency-starters from agencies, etc).
- Sitemap regenerates automatically on build.

---

## What is NOT in scope for this plan

- **Prospect outreach skill / cold email.** Deferred. UK GDPR/PECR exposure on scraped lists without lawful basis. Revisit as a v2 research-only tool that enriches inbound leads, not an outbound mailer.
- **Productised pricing tiers** (the £500-or-DIY problem). Flagged for a separate decision. For now the CTA strategy of "resource → audit" keeps these pages useful even without a sub-£500 offer.
- **Brand voice flex for tradespeople.** Keep the existing voice for all 5 pages in v1. The bathroom-fitter audience may not love it; we'll learn from the data and decide whether to fork tone for that page only later.
- **Email nurture sequences.** Resources land in the inbox once. No drip yet. Add later.

---

## Architectural decisions

### Page structure (`.astro` template)

Build one shared component layout — `src/components/ForPage.astro` — that takes props for headline, core message, workflows array, resource slug, and SEO block. Each `/for/<slug>.astro` is then ~20 lines of props + content. Avoids copy-pasting full page layouts and keeps edits to the layout itself trivial.

Props shape:

```ts
interface Props {
  slug: string                          // 'agency-starters' etc
  audience: string                      // 'Agency starters'
  headline: string
  subhead?: string
  coreMessage: string
  notDoing: string[]                    // section 1 bullets
  costOfInaction: string                // section 2 paragraph
  workflows: { workflow: string; saving: string; output: string }[]  // section 3 table
  resourceSlug: string                  // slug of the matched gated resource
  resourceTitle: string
  relatedIndustry?: { slug: string; label: string }  // cross-link
  seo: { title: string; description: string; keywords: string }
}
```

### Resource pattern

Each resource follows the `prompt-library-for-professional-services` pattern that's already in the CMS:

- Markdown source in `public/resources/<slug>/<slug>.md`
- Frontmatter: title, subtitle, author, date, document_type
- Body: short intro, "what's inside" list, 3 to 6 worked examples or templates, CTA back to chrisgarlick.com
- Typeset renders to PDF/HTML/markdown via `chris-garlick-light` theme
- Hand-authored DOCX optional; skip for v1, the PDF is the artefact

### Carousel pattern

Use `/trend --package <audience>` to generate. The trend skill now produces 10 slides automatically with the viral structure and alternates theme. Each carousel gets a strategy doc at `docs/trend/<YYYY-MM-DD>-<slug>/visuals/carousel-strategy.md`.

---

## Day-by-day sequence

### Day 1 — Foundation (today)

- [ ] Create `src/components/ForPage.astro` shared layout component
- [ ] Create `src/pages/for/index.astro` hub listing all 5 audiences (placeholder cards initially, no content links yet)
- [ ] Add "For" entry to `src/components/Nav.astro`
- [ ] Add `/for/` column to footer
- [ ] Extend `scripts/create-resources.mjs` skeleton with the 5 new resource entries (no markdown bodies yet, just structure, status `draft`)

**Outcome:** infrastructure is live. `/for/` resolves to a listing page. Nav has the new entry. Resource records exist as drafts (won't surface on the listing until published, which happens on the day each page ships).

### Day 2 — `/for/agency-starters` + resource + carousel

The flagship. Closest to existing positioning, lowest brand-stretch risk.

- [ ] Write `src/pages/for/agency-starters.astro` content (uses ForPage layout)
- [ ] Write resource markdown: `public/resources/zero-team-agency-playbook/zero-team-agency-playbook.md`
- [ ] Update the agency-starters entry in `create-resources.mjs` with full description + markdown body
- [ ] Mint fresh JWT, run `node scripts/create-resources.mjs` to publish
- [ ] Cross-link from `/industries/ai-for-agencies` to `/for/agency-starters` (add a single sentence + link near the bottom)
- [ ] Run `/trend --package "the zero-team agency"` to generate the 10-slide carousel (dark theme per alternation)
- [ ] `bunx astro build` and deploy

**Outcome:** first `/for/` page live. First gated resource for it on `/resources`. IG carousel ready to schedule.

### Day 3 — `/for/consultants` + resource + carousel

- [ ] Write `src/pages/for/consultants.astro`
- [ ] Write resource markdown: `public/resources/one-framework-six-months-of-content/one-framework-six-months-of-content.md`
- [ ] Update consultants entry in `create-resources.mjs`, run to publish
- [ ] Cross-link addition (none existing — consultants don't map to an existing `/industries/` page, just `/for/index` and the home page)
- [ ] Run `/trend --package "one framework six months of content"` (light theme)
- [ ] Build and deploy

### Day 4 — `/for/freelancers` + resource + carousel

- [ ] Write `src/pages/for/freelancers.astro`
- [ ] Write resource markdown: `public/resources/freelancers-ai-proposal-pack/freelancers-ai-proposal-pack.md`
- [ ] Update freelancers entry, publish
- [ ] No `/industries/` cross-link
- [ ] Run `/trend --package "freelancers ai proposal pack"` (dark)
- [ ] Build and deploy

### Day 5 — `/for/solo-operators` + resource + carousel

- [ ] Write `src/pages/for/solo-operators.astro`
- [ ] Write resource markdown: `public/resources/ai-stack-under-two-hours-a-day/ai-stack-under-two-hours-a-day.md`
- [ ] Update solo-operators entry, publish
- [ ] Run `/trend --package "ai stack for solo operators"` (light)
- [ ] Build and deploy

### Day 6 — `/for/tradespeople` + resource + carousel

The brand-voice stretcher. Keep existing voice but make sure the examples and tone land for a trades audience.

- [ ] Write `src/pages/for/tradespeople.astro` — pay attention to example specificity (Checkatrade, before/after Reels, Google review automation, not "AI workflows")
- [ ] Write resource markdown: `public/resources/5-ai-tools-tradespeople-2026/5-ai-tools-tradespeople-2026.md`
- [ ] Update tradespeople entry, publish
- [ ] Run `/trend --package "5 ai tools tradespeople 2026"` (dark)
- [ ] Build and deploy

### Day 7 — Polish + cross-links + the hub

- [ ] Fill out `/for/index.astro` with proper audience cards (now that all 5 pages exist)
- [ ] Cross-link `/industries/ai-for-law-firms` → "Solo practitioner? See `/for/solo-operators`"
- [ ] Cross-link `/industries/ai-for-accountancy-firms` → same pattern
- [ ] Add a "For your operating model" widget to the home page that shows the 5 audiences as a grid (the orthogonal-axis insight made visible)
- [ ] Sitemap rebuild (auto on `bunx astro build`)
- [ ] Update `CLAUDE.md` with a short note on the `/for/` vs `/industries/` axis distinction so future Claude sessions know
- [ ] Final build + deploy

---

## Per-page content brief (what each page must include)

This is the editable content brief. Keep close at hand when writing each page.

### `/for/agency-starters`

- Headline: *You don't need a team. You need the right stack.*
- Core: replace a five-person agency team with you + a thoughtful AI stack
- Workflows: full onboarding from one brief / AI delivery stack at £200-500/mo replacing £10k/mo team / automated reporting / cold outreach personalised at scale
- Avoid: don't lean on the Cameron England thread reference from the source doc unless you want to credit him by name. Reframe as "the small-team-with-AI-stack pattern" so the page doesn't date when that thread vanishes from feeds.
- Cross-link: `/industries/ai-for-agencies` (the established firm version)
- Resource: **Zero-team agency playbook** — first client to £10k/month

### `/for/consultants`

- Headline: *Your frameworks are worth more than one-to-one hours.*
- Core: methodology is the asset; AI turns it into content, courses, and inbound
- Workflows: one workshop → 10 content pieces / thought leadership from frameworks / video scripts from blog posts / SEO landing pages per niche
- Avoid: don't claim "passive income." It reads like a Twitter grifter. Lean on "leverage your methodology."
- Cross-link: none existing
- Resource: **One framework, six months of content**

### `/for/freelancers`

- Headline: *Take on more clients without taking on more hours.*
- Core: AI removes the overhead that stops you scaling, not the expertise
- Workflows: proposal gen from brief / LinkedIn posts from client work / ad copy variants / onboarding email automation
- Avoid: "AI does your job" framing — the audience is sensitive about this. Always position AI as removing admin, not creative work.
- Cross-link: none
- Resource: **Freelancer's AI proposal pack**

### `/for/solo-operators`

- Headline: *Running a one-person business is hard enough. AI should be doing the heavy lifting.*
- Core: client work / admin / marketing / social all on one person; AI handles the parts that never get done
- Workflows: weekly content calendar from voice note / review-request automation / case studies from 5-min debriefs / monthly SEO blog from your expertise
- Cross-link: `/industries/ai-for-law-firms` and `/industries/ai-for-accountancy-firms` (sole practice cases)
- Resource: **My exact AI stack for running a business in under 2 hours a day**

### `/for/tradespeople`

- Headline: *Your work speaks for itself. Let AI make sure the right people see it.*
- Core: phone-first, no studio, no marketing agency, AI handles posting / following up / ads from your pocket
- Workflows: before/after Reels from phone photos / Google Business autopilot / seasonal campaign copy / quote follow-ups
- Voice notes: keep examples concrete (Checkatrade, Google reviews, before/after) and avoid abstraction. No "leverage" or "implementation."
- Cross-link: none existing
- Resource: **5 AI tools every tradesperson should be using in 2026**

---

## Caveats to revisit when the plan is done

1. **Pricing tier decision.** After day 7, decide whether to add a productised "AI Starter" offer at £200 to £400/month for solo-operators and tradespeople. Without it, those two pages are content/SEO surfaces only — they won't convert direct. That's fine for v1 but worth deciding.
2. **Brand voice flex.** Revisit `/for/tradespeople` once it's been live for 30 days. If engagement is poor, fork a simpler voice for that page specifically.
3. **Outreach skill.** Plan separately. Strong candidate to build as research-enrichment for inbound leads (not outbound). 1-2 day build once the inbound flow is generating leads to enrich.
4. **CMS migration.** If you find yourself editing `/for/` page copy more than weekly, that's the signal to migrate from static `.astro` to a `forPage` CMS collection. Until then, the static pages are fine and avoid the migration risk.

---

## Files this plan will touch

```
src/components/ForPage.astro                                   NEW
src/pages/for/index.astro                                      NEW
src/pages/for/agency-starters.astro                            NEW
src/pages/for/consultants.astro                                NEW
src/pages/for/freelancers.astro                                NEW
src/pages/for/solo-operators.astro                             NEW
src/pages/for/tradespeople.astro                               NEW
src/components/Nav.astro                                       EDIT (add "For" entry)
src/layouts/Base.astro                                         EDIT (footer column)
src/pages/index.astro                                          EDIT (home-page widget)
src/pages/industries/[slug].astro                              EDIT (cross-links)
scripts/create-resources.mjs                                   EDIT (5 new entries)
public/resources/zero-team-agency-playbook/                    NEW dir + .md
public/resources/one-framework-six-months-of-content/          NEW dir + .md
public/resources/freelancers-ai-proposal-pack/                 NEW dir + .md
public/resources/ai-stack-under-two-hours-a-day/               NEW dir + .md
public/resources/5-ai-tools-tradespeople-2026/                 NEW dir + .md
docs/trend/<date>-<slug>/                                      NEW (5 trend folders, one per carousel)
CLAUDE.md                                                      EDIT (axis distinction note)
```

---

## Go signal

If this plan looks right, say "go day 1" and I'll start building the foundation: `ForPage.astro`, `/for/index.astro` hub, nav and footer updates, and the resource script scaffold. Each subsequent day, say "go day N" and I'll do that day's page + resource + carousel as a single batch.

If you want to tweak the order (e.g. put tradespeople first deliberately to test the voice question), say so before day 1.
