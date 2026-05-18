<!-- Version: 2 | Department: seo | Updated: 2026-05-15 -->

# On-Page SEO Spec

Refreshed to reflect the live site after the May 2026 refactor. Each spec corresponds to either a static Astro route or a Kritano CMS-managed page. For CMS pages, the seo fields are set on the page document and consumed by `src/components/SEO.astro` + the corresponding Astro route template. For Astro-static pages, the SEO is set inline in the route file.

**Note on routing:** Industry pages live at `/industries/<slug>` (not `/services/<slug>`). The old `/services/ai-for-*` URLs 301 to their `/industries/` equivalents via Kritano-managed nginx redirects. Apply is now `/contact`.

---

## Homepage `/`

- **Title:** "AI Implementation Partner for UK Professional Services | Chris Garlick"
- **Meta description:** Custom AI systems for UK law firms, accountancy practices and agencies. Solo developer, fixed pricing from £500. Audit, build, maintain. Free site audit available.
- **H1:** Already set per home content (CMS hero)
- **Focus keyword:** AI implementation partner UK
- **Internal links:** → /services (pillar), /industries (directory), /work, /audit, /article

## Services pillar `/services`

- **Title:** "AI Services for UK Businesses, Workflow Automation, Agents, Engineering | Chris Garlick"
- **Meta description:** Custom AI services for UK businesses. Workflow automation, custom AI agents, data extraction, AI engineering. Fixed pricing, solo developer.
- **Focus keyword:** AI services UK
- **Internal links:** → all 5 service pages, /industries directory

## Outcome services (under `/services/<slug>`)

Each has its own seo fields in CMS; here are the targets:

| Page | Focus keyword | Notes |
|------|--------------|-------|
| `/services/ai-implementation` | AI implementation UK | Pillar page. Has FAQPage schema (5 Q&As). |
| `/services/workflow-automation` | workflow automation UK | |
| `/services/ai-agents` | custom AI agents UK | |
| `/services/data-extraction` | AI data extraction UK | |
| `/services/ai-engineering` | AI engineer UK | NEW. Has FAQPage schema (5 Q&As). Mentions Claude, GPT, Llama, Mistral, Qwen, Gemma, Ollama, vLLM, pgvector, Qdrant. |

## Industries landing `/industries`

- **Title:** "Industry-Specific AI Implementation UK | Chris Garlick" (set ✓)
- **Meta description:** Vertical AI implementation for UK law firms, accountancy practices and creative agencies. Contract extraction, statement parsing, brief processing. Solo developer, fixed pricing, free site audit. (set ✓)
- **Focus keyword:** industry-specific AI UK (set ✓)
- **JSON-LD:** CollectionPage + ProfessionalService (set ✓ in template)
- **Internal links:** → all 3 live industry pillars + each card links via columns block (set ✓)

## Industry pillars `/industries/<slug>`

Each has its own seo fields in CMS; targets:

| Page | Focus keyword | Notes |
|------|--------------|-------|
| `/industries/ai-for-law-firms` | AI for law firms UK | Has detailed UK areaServed JSON-LD via template. Secondary keywords include London, Manchester, Birmingham, Edinburgh. |
| `/industries/ai-for-accountancy-firms` | AI for accountants UK | MTD, ICAEW, Xero, QuickBooks, Sage, FreeAgent in secondary keywords. |
| `/industries/ai-for-agencies` | AI for marketing agencies UK | London, Manchester, Bristol; creative + digital + content agency variants. |

**Required for each industry pillar (not yet done):**
- ☐ Add a "Common questions" text-section block with 5 Q&As to each industry pillar
- ☐ Add matching FAQPage JSON-LD in `src/pages/industries/[slug].astro` per page (similar to the AI Engineering pattern in services/[slug].astro)
- ☐ Add a single H2 that explicitly contains the city/region variants for hyperlocal SEO

## Article posts `/article/<slug>`

- **Title:** `[Post Title] | Chris Garlick` (under 60 chars total)
- **Meta description:** First 155 chars of CMS seo.metaDescription or excerpt fallback
- **H1:** Matches post title, includes primary keyword close to the start
- **Required content quality:**
  - First 1-2 sentences of every H2 section answer the section's question directly (for AI extraction)
  - At least one comparison/data point per article (table, percentage, named tool, named price band)
  - Sticky CTA already appended via `scripts/append-sticky-cta.mjs`
  - Author bio at footer (E-E-A-T)
- **Internal links per article:** ≥1 link to relevant service pillar, ≥1 link to relevant industry pillar, ≥1 link to /audit or /contact

## Conversion + trust pages

| Page | Title | Focus keyword | Notes |
|------|-------|--------------|-------|
| /audit | "AI Readiness Audit UK | Chris Garlick" | AI readiness audit UK | noindex on `/studio/audits` |
| /tools/site-audit | "Free Site Audit Tool | Chris Garlick" | site audit tool UK | TOFU acquirer |
| /contact | "Contact Chris Garlick" | hire AI specialist UK | |
| /about | "About Chris Garlick, UK AI Engineer" | UK AI engineer | E-E-A-T page, Person schema |
| /work | "AI Implementation Case Studies UK" | AI case studies UK | Sparse until first cases ship |
| /resources | "Free AI Resources for UK Businesses" | free AI resources UK | Lead magnets |

## URL structure rules

- Flat: `/blog/<keyword-phrase>` and `/article/<keyword-phrase>` ✓ in use
- Hyphens, lowercase ✓
- Under 5 words where possible ✓
- No trailing slashes ✓ (Astro config `trailingSlash: 'never'`)
- No date or ID in URLs ✓

## Image alt-text guidance

- Descriptive: what the image actually shows
- Include the keyword once if natural
- Don't stuff: `"AI implementation UK consultant Chris Garlick laptop office London"` is over-optimised garbage
- For diagrams, describe what the diagram represents, not "Diagram 1"
- For OG images (`/og/<path>.png`), the alt is not user-visible but include in JSON-LD where relevant

## Content quality signals (apply to every page)

- **Direct-answer opener:** Every major section answers a specific question in the first 1-2 sentences. This is what AI engines extract.
- **FAQ block on every key page:** Pillar service pages and pillar industry pages must have a "Common questions" block (5 Q&As) + matching FAQPage schema. AI implementation + AI engineering done. Industry pillars to follow.
- **Author bio with credentials:** Articles must end with author bio. Pages must link to /about.
- **Cite specifics:** "10 hours/week saved", "£500-£8,000 build", "Claude Sonnet for narrative drafting" beat generic outcomes.
- **British English everywhere:** colour, optimise, organisation, programme. CLAUDE.md enforces this.
- **No em-dashes anywhere in content.** Replace with comma, semicolon, full stop, or restructure. CLAUDE.md enforces this.

## Internal-link audit needed (post-refactor)

After the May 2026 URL move, run a sweep to ensure:
- ☐ Every blog article that mentions an industry links to `/industries/...` not `/services/...` (redirects work but direct links are cleaner)
- ☐ Every CMS-managed page that linked to `/services/ai-for-...` was rewritten to `/industries/ai-for-...` (script ran 2026-05-15 — verify)
- ☐ Footer / nav already updated ✓
- ☐ Sitemap regenerated on next build ✓ (auto via @astrojs/sitemap)
