# CLAUDE.md — Chris Garlick portfolio

Instructions for Claude when working on this codebase. Read once per session.

## Brand voice rules (apply to ALL written content)

These are non-negotiable. They are what makes the copy read as human-written rather than AI-generated. The bar is: a reader should not be able to spot AI output from the writing alone.

### No em-dashes. Ever.

- Do not use the em-dash character (`—`, U+2014).
- Do not use the HTML entity `&mdash;` (it renders as literal text in TipTap content).
- Do not use double-hyphen substitutes (`--`).

Em-dashes are the single most reliable LLM tell in 2026. They are how Claude writes when nobody is editing.

**Replace em-dashes with:**

| Original use | Replacement |
|---|---|
| Aside / parenthetical | Comma, or wrap in parens, or split into a new sentence |
| Strong pause for emphasis | Full stop and a new sentence |
| Range / span | The word "to" (e.g. "2 to 6 weeks", not "2–6 weeks") |
| List item separator | Comma, semicolon, or restructure as a proper list |

**Example rewrites:**

- ❌ "Engagements start at £500 — a few focused hours to remove a single bottleneck."
- ✓ "Engagements start at £500. A few focused hours to remove a single bottleneck."

- ❌ "Larger builds — multi-step agent systems, custom integrations, ongoing retainers — scale up from there."
- ✓ "Larger builds (multi-step agent systems, custom integrations, ongoing retainers) scale up from there."

- ❌ "Most builds take 2–6 weeks."
- ✓ "Most builds take 2 to 6 weeks."

### No HTML entities in TipTap content

TipTap stores text literally and Kritano's renderer double-escapes ampersands. Use the actual Unicode character or restructure to avoid the need:

| Don't | Do |
|---|---|
| `&mdash;` | (rewrite, per above) |
| `&rsquo;` | `'` (curly apostrophe) — or just `'` |
| `&amp;` | `&` |
| `&hellip;` | `…` (U+2026) — though prefer not using ellipses at all |

### Voice & phrasing

From the pivot brand brief (`pivot.md` §1.2):

- **Direct and technical**, not consultancy-vague.
- **Confident, not arrogant.** "I build this" is fine. "I'm an industry leader in this" is not.
- **Specific over generic.** Always name the technology, the metric, the outcome. "Claude Sonnet" beats "an AI model". "10 hours a week saved" beats "significant efficiency gains".
- **No corporate filler.** Avoid: "leverage", "synergy", "end-to-end solutions", "best-in-class", "transformative", "robust", "seamless", "cutting-edge", "thought leadership", "stakeholders".
- **Active voice over passive.** "I build the pipeline" not "The pipeline is built".
- **Short sentences carry weight.** Vary length but lean shorter. A 12-word sentence followed by a 4-word sentence reads more human than two 20-word sentences.

### Punctuation tells

- Avoid ellipses for dramatic effect. They read as AI hedging.
- Avoid Oxford-comma overcorrection ("a, b, and c, and d") — UK English prefers no Oxford comma.
- Use British spelling: colour, organisation, optimise, behaviour, programme.
- Curly quotes are fine where they render (TipTap usually handles them).

## Architecture quick-ref

- Astro static-output site backed by Kritano CMS (Postgres + admin SPA)
- API server in `server.ts` (Hono on Bun) — custom routes for `/api/forms/send`, `/api/tools/audit`, `/api/diagnostic`, `/api/resources/*`
- Typeset (separate service at `typeset.chrisgarlick.com`) renders markdown to PDF/DOCX
- Content lives in CMS, never hardcoded in templates beyond layout

## Common pitfalls

- **Don't `bun run build` on the box** — OOMs because Vite tries to rebuild the admin too. Use `bunx astro build` for frontend-only deploys.
- **JWTs expire in 60 minutes.** For batch CMS updates, mint a fresh JWT immediately before running.
- **API-key auth 500s on PATCH** (Kritano issue #3d). Always use a fresh JWT for writes.
- **Kritano API returns snake_case** even when fields are declared camelCase in `cms.config.ts`. Reads need snake_case access.
- **Static pages need a rebuild** after any CMS content change to surface on the live site.
- **URLs use `/article/<slug>`, not `/blog/<slug>`.** The live Kritano CMS routes every published post under `/article/`. The SEO planning docs in `team/18-seo/` (`keyword-strategy.md`, `topic-clusters.md`, etc.) reference `/blog/<slug>` URLs for historical reasons, but those paths do not resolve on the live site. When writing any live-facing content (trend outputs, blog frontmatter footers, social copy, visuals, video, CTAs), translate every `/blog/<slug>` from the SEO docs into `/article/<slug>`. External source URLs that happen to contain `/blog/` (e.g. `whitehat-seo.co.uk/blog/...`) are unaffected; this rule applies only to internal chrisgarlick.com links.

## Files of note

- `pivot.md` — current strategic direction (May 2026 pivot to vertical AI implementation)
- `kritano-issues.md` — running log of Kritano CMS bugs and DX issues
- `resources_plan.md` — gated resources roadmap
- `gated_resources_integration_guide.md` — handoff doc for porting the resources system into another project
