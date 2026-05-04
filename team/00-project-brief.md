<!-- Version: 1 | Department: manager | Updated: 2026-05-02 -->

# Project Brief — chrisgarlick.com

## Goal
Build a portfolio website for Chris Garlick that positions him as a software developer who builds systems for professional services (legal, accountancy) and agencies. The site must generate inbound leads from service business owners who want software that replaces manual work in their operations.

## Core Constraint
**The site runs on Kritano CMS** — Chris's own open-source CMS (https://github.com/Kritano/Kritano-cms). This is non-negotiable. The site dogfoods the product. The tech stack is Astro (frontend theme), Hono (API), Bun (runtime), Postgres + Redis (data).

## What Makes This Different
This isn't a consultant's brochure or a generic portfolio. It's a software developer's calling card — someone who builds the tools, runs the tools, and delivers with them. No team. No outsourcing. No off-the-shelf automations dressed up as custom work. The site itself, running on his own CMS, is the proof.

## Target Audience
- Service business owners (law firms, accountancies) with 10–50 employees
- Agency operators (marketing, web, SEO) looking to integrate AI into their ops
- Founders who know they need to automate but don't know where to start

## Site Structure (must-haves for V1)
- `/` — Home (hero, what I do, offer cards, proof strip, selected work, tools teaser, about teaser, blog preview, CTA)
- `/work` — Case study index with category filters
- `/work/[slug]` — Individual case study (Problem → Architecture → Outcome)
- `/blog` — Blog index (editorial list, no cards)
- `/blog/[slug]` — Individual blog post
- `/about` — Brief about page
- `/apply` — Application form (Resend integration, fallback until domain verified)

## Nice-to-haves (V1.1)
- `/tools` or `/how-i-work` — Methodology page
- Marquee proof strip animation
- OG image generation per page
- Plausible analytics integration

## Design Direction
- Dark editorial aesthetic — near-black backgrounds, warm off-white text
- Typography: Instrument Serif (headlines), DM Mono (body/UI)
- Accent: warm gold (#E8D5A3) — used sparingly
- No gradients, no blues, no purples. Warm neutrals only.
- Max content width: 720px reading, 1100px full-bleed
- Mobile-first. No hero images — typography does the work.
- Minimal animation: fade-up on load, subtle hover states

## Content Strategy
- No real clients yet — Kritano and the CMS are "Client Zero" case studies
- 2 blog posts at launch (sector-specific, AEO-optimised)
- /team skill (AI delivery system) stays private — frame as "AI-integrated workflow" not a product
- Pricing shown on site: Build (£5k–8k), Retainer (£3k–6k/mo)

## Technical Constraints
- Kritano CMS with custom Astro theme (not the default theme)
- Deploy on DigitalOcean (Bun + Postgres + Redis)
- Domain: chrisgarlick.com (existing site, will need redirects)
- Form: Hono API route → Resend (with fallback until Resend configured)
- Kritano CMS repo: https://github.com/Kritano/Kritano-cms

## Key Decisions Already Made
- No Next.js — Astro via Kritano
- No MDX files — all content managed through CMS admin
- Custom theme, not default theme override
- Legal/accountancy + agencies as primary sectors
- Process proof > social proof (no testimonials, show architecture + outcomes instead)

## CMS Collections Needed
- `page` (exists) — title, slug, body, status, seo
- `article` (exists) — title, slug, body, excerpt, featuredImage, publishedAt, status, seo
- `caseStudy` (new) — title, slug, body, category, result, summary, duration, tier, publishedAt, status, seo
- `proofMetric` (new) — text, sortOrder
