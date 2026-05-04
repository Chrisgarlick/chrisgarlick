# chrisgarlick.com — Build Approach

## The Big Decision: Dogfood Kritano CMS

The `vertical.md` spec was written when Kritano CMS didn't exist yet. It plans for Next.js + MDX + Contentlayer with a "Phase 3" CMS migration. That phased approach is now unnecessary — Kritano CMS is live, it works, and using it from day one is the strongest possible proof of credibility.

**Recommendation: Skip straight to what was "Phase 3". Build on Kritano CMS from the start.**

Why this matters:
- The site *is* the portfolio. If you're selling AI implementation using proprietary tools, the site should run on those tools
- "Built on Kritano CMS" in the footer is worth more than a paragraph explaining what it does
- You avoid a migration later — no throwaway work
- It proves the CMS handles a real production site, not just a demo

What this changes from the spec:
- No Next.js — the frontend is Astro (Kritano's default theme engine)
- No MDX/Contentlayer — content lives in the CMS admin, not git
- No Vercel — deploy wherever you run the CMS (VPS, Railway, Fly.io)
- Blog posts, case studies, pages all managed through `/admin`
- The Resend form integration can still work via a custom API route on the Hono server

---

## Positioning: AI Workflow Partner, Not "AI Guy"

All three external opinions converge on the same point: **don't position as a generic AI developer. Position as a sector-specific workflow partner who delivers measurable outcomes.**

The site should make one thing instantly clear: "I solve X problem for Y type of business using AI." Every page, every case study, every blog post reinforces that.

### Frame Tools as Process Proof, Not Product Demos

You don't have client testimonials yet. That's fine — but you need to replace social proof with **process proof** (Gemini's best point). For every tool or internal build:

- **Problem** it solves (in business terms, not tech terms)
- **Architecture** — a simple flowchart or schematic showing how it works
- **Outcome** — specific, quantified results even from internal use ("Reduced content production from 4 hours to 20 minutes")
- **Live demo or walkthrough** — video, Loom, or interactive embed. Don't just show screenshots.

This turns "I built a CMS" into "I built the content infrastructure that runs this site, handling X pages and Y articles with zero manual deployment."

### The /team Skill (formerly Scalar)

Don't publish this as a public tool. Instead, frame it as part of your delivery advantage: "I've integrated AI deeply into my own workflow — autonomous agents handle research, content, strategy, and QA across every engagement." This is more powerful than naming a product. It says: I practice what I sell.

---

## What Stays the Same

Almost everything in the spec that isn't about tech stack is solid:

- **Site structure** — same pages: `/`, `/work`, `/work/[slug]`, `/tools`, `/blog`, `/blog/[slug]`, `/about`, `/apply`
- **Design direction** — dark editorial aesthetic, Instrument Serif + DM Mono, warm gold accent
- **Content strategy** — same sections, same copy approach, same AEO rules
- **SEO/AEO** — structured data, OG images, sitemap, robots.txt all still apply
- **The offer** — Audit → Build → Maintain positioning, pricing cards, proof strip

---

## Revised Tech Stack

| Layer | Was (spec) | Now | Rationale |
|-------|-----------|-----|-----------|
| Framework | Next.js 14 | Astro (via Kritano) | Ships with the CMS, SSG/SSR capable |
| CMS | "Phase 3" Scalar | Kritano CMS from day one | Dogfood. It's ready. |
| Styling | Tailwind + CSS vars | Same | Astro + Tailwind works natively |
| Blog | MDX + Contentlayer | Kritano collections | Rich text editor in admin, no git-based posts |
| Hosting | Vercel | VPS / Railway / Fly.io | Need to run Bun + Postgres + Redis |
| Forms | Next.js API route + Resend | Hono API route + Resend | Same idea, different runtime |
| Analytics | Plausible | Same | Script tag in layout |
| Images | next/image + Cloudinary | Kritano media library + sharp | Built-in media handling |
| SEO | next-seo | Astro native | Astro has first-class SEO support |

---

## Sectors to Target

Pick 2–3 max. All three responses agree: go narrow, go where there's repetitive manual work, low AI maturity, and money to spend.

### Tier 1 (strongest fit for your skills + tools)

**Professional Services — Legal & Accountancy**
- Massive documentation bottlenecks, bill by the hour
- AI angles: document automation, compliance checking, client onboarding, report generation
- High transaction value per client — a single law firm engagement pays well
- The spec already has legal case study copy ready

**Agencies — Marketing / Web / SEO**
- They already sell services, so AI is an easy upsell to their own ops
- AI angles: content pipelines, reporting automation, client onboarding, internal tooling
- They understand the value proposition immediately — less convincing needed
- You can demonstrate with Kritano's audit capabilities

### Tier 2 (expand into after first wins)

**Local Service Businesses — Estate Agents / Mortgage Brokers / Recruiters**
- High volume of repetitive enquiries, follow-ups, scheduling
- AI angles: lead qualification, CRM automation, email/SMS flows
- Easier to reach (local SEO, direct outreach)

**E-commerce (Mid-Market)**
- Inventory, customer support, personalisation
- Only pursue if you build a relevant tool/demo first

### Sectors to Avoid (for now)
- Large enterprises — long sales cycles, procurement hell
- Healthcare — heavy regulation
- Anything where you can't show a quick win in 2–4 weeks

---

## Outreach Strategy

The site alone won't generate leads. Distribution matters more than design.

### 1. The Free Audit (your sharpest weapon)
Every response mentions this. Kritano already does site audits — use that as a door-opener:
- "I ran a quick AI visibility audit on your site. Here's what I found."
- Attach a real Kritano report
- No pitch, just value. The pitch comes in the follow-up

### 2. Personalised Loom Outreach (GPT's best point)
Don't cold email. Instead:
- Find a business in your target sector
- Record a 2–3 min Loom showing what you noticed and a quick AI fix
- Send it directly — LinkedIn DM or email
- This converts massively higher than text-only outreach

### 3. LinkedIn — Build in Public
- Post about what you're building (Kritano, the CMS, this site)
- Share before/after workflows with specific numbers
- Tag people in target sectors asking for opinions on features
- This isn't selling — it's market research that leads to sales

### 4. Content / Blog (AEO play)
- Write sector-specific posts: "How [Legal/Agency/etc] Businesses Can Save 10+ Hours/Week with AI"
- Follow the AEO rules from the spec — answer the question in the first 150 words
- Every post links to `/apply` and a relevant case study
- This compounds over time and attracts inbound from AI search engines

### 5. Strategic Partnerships
- Find agencies offering complementary services (web design, marketing) and offer to be their AI white-label partner
- They already have the clients; you provide the AI capability

---

## Client Hub (Not Yet)

All three responses agree: **don't build this now.**

Start with simple delivery (Notion, email, Google Drive). A client portal becomes valuable once you have 3–5 paying clients and see repeated patterns — same reports, same dashboards, same workflows.

When it does make sense, it could become:
- AI tools dashboard per client
- Monthly ROI reporting ("AI handled X this month, saving Y hours")
- Workflow status and request system

This could eventually become a productised SaaS — but that's a future problem.

---

## CMS Schema (cms.config.ts)

The spec already defines content schemas. Here's how they map to Kritano collections:

### Collections needed:

**page** (already exists)
- title, slug, body, status, seo
- Covers: Home, About, Tools, Apply

**article** (already exists)
- title, slug, body, excerpt, featuredImage, publishedAt, status, seo
- Covers: Blog posts

**caseStudy** (new)
- title, slug, body, category (select: Legal/Accountancy/Agency/Insurance/Dental/Internal), result (text), summary (textarea), duration (text), tier (select: Build/Build+Retainer/Retainer), publishedAt, status, seo
- Covers: `/work` section

**proofMetric** (new, simple)
- text (text), sortOrder (number)
- Covers: The marquee proof strip on the homepage

---

## Theme Approach

Kritano ships with a default Astro theme. Two options:

### Option A: Customise the default theme
- Override layouts and components via the theme system
- Faster to start, constrained by theme architecture
- Good if the default theme's structure roughly matches your needs

### Option B: Build a custom theme from scratch
- Full control over every template, component, and style
- The spec's design is very specific (editorial dark mode, custom typography) — unlikely to match any default
- More work upfront but no fighting the theme later

**Recommendation: Option B.** The design spec is too specific and opinionated to retrofit onto a default theme. Build a custom Astro theme that pulls content from the Kritano API. The CMS handles content; the theme handles presentation.

---

## Build Order

### Step 1: Schema
- Update `cms.config.ts` with all collections (caseStudy, proofMetric)
- Run `bun run dev` to generate migrations and types
- Seed some test content via `/admin`

### Step 2: Theme foundation
- Custom Astro theme with the design system (colours, fonts, layout)
- Global layout: Nav + Footer
- CSS variables from the spec

### Step 3: Pages (in priority order)
1. **Home** — Hero, What I Do, Offer cards, Proof strip, Selected Work, Tools teaser, About teaser, Blog preview, CTA
2. **Apply** — Form + Resend integration (keep it simple: name, business, bottleneck, size — no budget field)
3. **Work index + case study template** — Pull from caseStudy collection. Frame your own tools as "Client Zero" case studies with Problem → Architecture → Outcome format
4. **Blog index + post template** — Pull from article collection. Launch with 2–3 sector-specific posts (e.g. "What AI Implementation Actually Means for a Law Firm")
5. **Tools** — Frame Kritano as the audit/intelligence layer. Don't publish /team as a product — instead describe your AI-integrated delivery workflow
6. **About** — Keep short. Solo operator with AI agents. No fluff.

### Step 4: SEO & infrastructure
- Structured data (JSON-LD)
- OG image generation
- Sitemap + robots.txt
- Redirects from any existing site URLs
- Plausible analytics

### Step 5: Deploy
- Production server on DigitalOcean (Bun + Postgres + Redis)
- Domain DNS swapped from existing site
- SSL
- GSC: submit new sitemap, request indexing on priority pages, set up redirects from old URLs

### Step 6: Launch distribution
- Write first LinkedIn "building in public" post about the rebuild
- Run Kritano audit on 5–10 businesses in target sectors — use as personalised outreach material
- Record 2–3 Loom walkthroughs showing real audit findings for specific businesses
- Send personalised outreach (not cold email — value-first with the audit attached)

---

## Open Questions

1. **Scalar references** — The spec mentions "Scalar" throughout (autonomous AI team tool). Is this a separate product from Kritano CMS, or has the naming changed? The tools page and several copy sections reference both Scalar and Kritano as distinct tools.
This is the /team skill - I'm not sure if I want this actually published as a tool, because I don't want it public, but we can say that I have integrate AI to improve my workflows etc

2. **Hosting** — Kritano CMS needs Bun + Postgres + Redis running. Vercel won't work. Railway or Fly.io are the simplest options. Do you have a preference or existing infra?
Probably going to deploy on DO anyway

3. **Domain** — Is `chrisgarlick.com` already registered and pointed somewhere? Need to know for DNS planning.
Yep it's my own, currently has a git repo on it so i'd just need to swap it out

4. **Existing site** — The spec mentions GSC migration and redirects. Is there a current site live at this domain that has indexed pages?
Yep... 

5. **Case studies** — The spec mentions some are "internal builds" (Scalar, Kritano). Are there real client case studies ready, or will launch use internal ones only?
No real clients currently, just my own stuff. 

6. **The apply form** — Resend needs a verified domain. Is `chrisgarlick.com` already set up on Resend?
Not yet but will be

---

## What NOT to Do

- Don't build in Next.js and migrate later — that's throwaway work
- Don't use MDX files in git — the whole point of the CMS is managing content through the admin
- Don't launch with placeholder case studies that say "coming soon" — better to launch with 2 real ones (even if they're your own tools)
- Don't over-engineer the form — plain HTML form, server action, Resend email. Done.
- Don't add animations until the core site is live and content is in — polish comes last
- Don't build a client hub/portal yet — use Notion or email until you have 3–5 paying clients and see repeated patterns
- Don't go broad on sectors — pick 2 (legal/accountancy + agencies), nail those, expand later
- Don't cold email generic "I do AI" messages — use Loom walkthroughs and free Kritano audits as the opener
- Don't wait for real clients to launch — frame Kritano and your own workflow as "Client Zero" case studies with real numbers

---

## Future Features (not now)

### Open Source Claude Code Skills
Extract useful skills from the /team system and release them as standalone, free Claude Code skills on GitHub. These become:
- Lead magnets — developers discover you through the tools
- Credibility builders — open source contributions show real capability
- Community play — people using your skills talk about them, link back to you

Examples of skills that could be extracted and open-sourced:
- Site audit / SEO analysis skill
- Content generation pipeline skill
- QA / testing automation skill
- Business plan generator skill

**When to do this:** After the portfolio is live and generating conversations. Don't split focus now.

### Client Hub / Portal
Once you have 3–5 paying clients and see repeated delivery patterns, build a client-facing dashboard:
- Per-client AI tools and workflow status
- Monthly ROI reporting ("AI handled X, saved Y hours")
- Request system for new automations
- Could evolve into a productised SaaS
