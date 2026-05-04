# chrisgarlick.com — Full Build Specification
## AI Operator Portfolio · Phase 3 CMS Build

---

## 1. Project Overview

### Goal
Build a personal site that positions Chris Garlick as a serious AI operator — someone who doesn't just talk about AI but has built real systems, real tools, and a real delivery infrastructure. The site should make visitors feel like they're seeing behind the curtain of someone doing the work at a level most people only tweet about.

### Primary Outcome
Inbound leads from service business owners, agency operators, and founders who see the site and think: *"I want this person working on my business."*

### Secondary Outcomes
- Establish credibility for vertical AI implementation work
- Showcase Scalar and Kritano as proprietary tools (not off-the-shelf)
- Create a platform for AEO-optimised blog content
- Leave vertical narrowing flexible — no hard vertical commitment at launch

### Tone
Sharp. Operator-focused. Zero fluff. The site should feel like it was built by someone who moves fast and knows exactly what they're doing. Not a consultant's brochure. Not a developer portfolio. Closer to a founder's calling card.

---

## 2. Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Next.js 14 (App Router) | React-native, excellent for MDX blog, ISR for CMS pages |
| Styling | Tailwind CSS + CSS variables | Fast, consistent, easy to maintain solo |
| CMS | Scalar CMS (Phase 3) | Your own stack — dogfoods the product |
| Blog | MDX via Contentlayer or next-mdx-remote | Git-based posts, fast, no external dep |
| Hosting | Vercel | Free tier, instant deploys from GitHub |
| Forms | Custom Next.js API route → Resend | You're already on Resend, keep it simple |
| Analytics | Plausible | Privacy-safe, lightweight, no cookie banner needed |
| Images | next/image + Cloudinary (optional) | Optimised delivery |
| SEO | next-seo or native metadata API | Full OG + structured data control |

### Phase Approach

**Phase 1 — Static (launch fast)**
- Next.js with hardcoded content
- MDX for blog posts
- Manual form handling via Resend
- Deploy on Vercel in days not weeks

**Phase 2 — Semi-dynamic**
- Connect Kritano API for live audit widgets
- Pull case study data from JSON/MDX files
- Add structured data markup for AEO

**Phase 3 — CMS-driven**
- Scalar CMS manages all page content, blog posts, case studies
- Brief submission and project thread system integrated
- Full admin dashboard via Scalar for content updates without touching code

---

## 3. Design Direction

### Aesthetic
**Editorial operator.** Think a well-designed technical journal crossed with a founder's notebook. Dark base with sharp typographic hierarchy. Not a typical "AI company" site with gradient orbs and purple everything. Should feel like it was designed by someone with taste who also ships code.

### Colour Palette
```css
--bg-primary: #0A0A0A;          /* Near black */
--bg-secondary: #111111;        /* Card surfaces */
--bg-tertiary: #1A1A1A;         /* Borders, dividers */
--text-primary: #F0EDE8;        /* Warm off-white */
--text-secondary: #8A8580;      /* Muted body */
--text-tertiary: #4A4845;       /* Subtle labels */
--accent: #E8D5A3;              /* Warm gold — sparingly */
--accent-hover: #F0E4BA;        /* Hover state */
--destructive: #C0392B;         /* Error states only */
```

No blues, no purples, no gradients. Warm neutrals with gold as the only accent. Feels premium, not corporate.

### Typography
```css
--font-display: 'Instrument Serif';    /* Headlines — editorial, elegant */
--font-body: 'DM Mono';               /* Body + UI — technical, precise */
--font-label: 'DM Mono';              /* Labels, nav, metadata */
```

Mix of serif headlines and mono body creates an unusual tension — editorial intelligence meets technical precision. Loads from Google Fonts.

### Layout Principles
- Max content width: 720px for reading, 1100px for full-bleed sections
- Generous vertical rhythm — let content breathe
- No hero images — typography does the work
- Subtle horizontal rules between sections (`1px solid var(--bg-tertiary)`)
- Mobile-first — most buyers will check on phone first

### Animation
Keep minimal and purposeful:
- Page load: content fades up with 60ms staggered delay per section
- Navigation: subtle underline slide on hover
- Cards: `translateY(-2px)` + shadow on hover
- No scroll-triggered animations at launch — keep performance clean

---

## 4. Site Structure

```
/                        Home
/work                    Case studies
/work/[slug]             Individual case study
/tools                   Scalar + Kritano
/blog                    Blog index
/blog/[slug]             Individual post
/about                   About Chris
/apply                   Application form
/api/apply               Form submission endpoint (Resend)
/sitemap.xml             Auto-generated
/robots.txt              Configured
```

---

## 5. Page Specifications

---

### 5.1 Home (`/`)

**Meta**
```
title: "Chris Garlick — AI Implementation Partner"
description: "I help service businesses build and run AI systems that save time, cut costs, and scale operations. Built on proprietary tooling."
```

---

#### Section: Nav
```
[CG]          Work   Blog   Apply →
```
- Logo: monogram `CG` in accent gold, small, left-aligned
- Links: right-aligned, minimal, no dropdown
- `Apply →` styled as a pill button in accent
- Sticky on scroll, background fills in with slight blur

---

#### Section: Hero
Full viewport height on desktop, auto height on mobile.

```
[small label — mono, muted]
AI Implementation Partner

[display serif, large]
I build AI systems
for businesses that
are ready to move fast.

[body mono, muted, max 60 chars]
Audit → Build → Maintain. Proprietary
tooling. Fixed-fee projects. Monthly
retainer.

[two CTAs]
→ See my work          → Apply to work together
[text link, accent]    [pill button, accent bg]
```

Subtle background: very fine grid pattern (`background-image: radial-gradient`) in `--bg-tertiary`. Nothing distracting.

---

#### Section: What I Do
Three columns, icon + heading + 2-line description.

```
[ Audit ]                  [ Build ]                  [ Maintain ]
Map your operations.       AI workflows, content      Monthly retainer.
Find what AI can do.       pipelines, automations.    Expand, report, train.
```

No icons needed — use large numerals `01 02 03` in `--text-tertiary` as visual anchors.

---

#### Section: The Offer
Two cards side by side.

**Card 1 — The Build**
```
THE BUILD
─────────────────
£5,000 – £8,000
Fixed fee · 2–4 weeks

· Operations audit
· AI workflow builds
· Team handover + documentation
· Built on Scalar + Kritano
```

**Card 2 — The Retainer**
```
THE RETAINER
─────────────────
£3,000 – £6,000 / month
Ongoing

· System maintenance
· New workflow additions
· Monthly ROI reporting
· Staff training as needed
```

`→ How the process works` text link beneath, centred.

---

#### Section: Proof Strip
Horizontal scrolling strip of metrics. Single line, mono type, separated by `·`

```
15+ hrs/week saved per client  ·  5 verticals served  ·  Built on proprietary tooling  ·  Scalar-powered delivery  ·  Kritano audit baseline  ·
```

Auto-scrolling marquee, slow, subtle. No logos needed until you have them.

---

#### Section: Selected Work
Two or three case study cards. Each card:

```
[Category label — mono, muted, small]
LEGAL · 2026

[Title — serif]
Document Automation for a
12-Person Law Firm

[Result — accent colour]
22 hrs/week recovered

[One-line summary — mono, muted]
Intake, review, and client comms
fully automated in 3 weeks.

→ Read case study
```

Cards link to `/work/[slug]`

---

#### Section: Tools
Brief, confident. Not a product pitch.

```
[small label]
Built on proprietary tooling

[two items side by side]

Scalar                          Kritano
Autonomous AI team.             Site intelligence platform.
Executes project work           Every engagement starts with
across departments.             a data-backed audit.
```

`→ Learn about the tools` link beneath.

---

#### Section: About Teaser
```
[small label]
Who's behind this

[Serif heading]
A solo operator with
a team of AI agents.

[Body — 3 sentences max]
I'm Chris Garlick. I build AI systems
for service businesses using tools I've
built myself. No large team, no
outsourcing, no off-the-shelf
automations dressed up as custom work.

→ More about me
```

---

#### Section: Blog Preview
Three most recent posts as minimal list items:

```
[date — mono, muted]     [title — serif]                          →
Apr 2026                 What AI Implementation Actually Means
Mar 2026                 The 3 Workflows Every Agency Should Automate
Feb 2026                 Why We Built Scalar Instead of Using Zapier
```

`→ All posts` link beneath.

---

#### Section: CTA
```
[Serif, large]
Ready to build something
that actually works?

[body, muted]
Tell me about your business. If we're
a fit, you'll hear back within 2 days.

[pill button — accent]
→ Apply to work together
```

---

#### Section: Footer
Minimal. Two lines.

```
Chris Garlick · AI Implementation Partner · UK

[CG]    Work · Blog · Apply      © 2026
```

---

### 5.2 Work (`/work`)

**Meta**
```
title: "Work — Chris Garlick"
description: "AI implementation case studies across legal, accountancy, agency and operational verticals."
```

Header: `Selected Work` in serif, subheading in mono.

List of case study cards (same format as homepage but full grid). Filter by vertical — simple text toggles, no JS library needed:

```
All  ·  Legal  ·  Accountancy  ·  Agency  ·  Internal
```

`Internal` category = Scalar, Kritano, your own builds. Framed as "Client Zero" — you built and ran these yourself.

---

### 5.3 Case Study (`/work/[slug]`)

**MDX-powered.** Each case study is a `.mdx` file in `/content/work/`.

**Frontmatter:**
```yaml
---
title: "Document Automation for a 12-Person Law Firm"
category: "Legal"
date: "2026-03-01"
result: "22 hrs/week recovered"
summary: "Intake, review, and client comms fully automated in 3 weeks."
duration: "3 weeks"
tier: "Build + Retainer"
published: true
---
```

**Page layout:**
```
[category · date]
[Title — serif, large]
[Result — accent, large mono]

────────────────────────────────

[Stats row — 3 columns]
Duration          Tier              Result
3 weeks           Build + Retainer  22 hrs/week

────────────────────────────────

The Challenge
[body text]

What We Built
[body text + optional code/workflow snippets]

The Result
[body text + specific numbers]

────────────────────────────────

→ Previous case study          Next case study →
```

---

### 5.4 Tools (`/tools`)

**Meta**
```
title: "Tools — Chris Garlick"
description: "The proprietary AI tooling behind every implementation: Scalar and Kritano."
```

Two full sections, one per tool.

**Scalar section:**
```
[label — mono]
Built for delivery

[Serif heading]
Scalar

[Body]
An autonomous AI team that executes
structured project work across departments.
Content, strategy, web, software — briefed
once, delivered fast.

[How it's used]
I run Scalar on behalf of clients. They brief
the outcome. I orchestrate the AI team.
They receive the output.

[Link]
→ scalar.com
```

**Kritano section:**
```
[label — mono]
Built for intelligence

[Serif heading]
Kritano

[Body]
A site intelligence platform. Every
engagement starts with a Kritano audit —
Core Web Vitals, WCAG, broken links,
and AI Visibility scoring across Claude,
GPT-4o and Perplexity.

[How it's used]
The audit is the discovery phase. It gives
clients a data-backed picture of where they
are before we build anything.

[Link]
→ kritano.com
```

---

### 5.5 Blog (`/blog`)

**Meta**
```
title: "Blog — Chris Garlick"
description: "Practical writing on AI implementation, workflow automation, and building systems for service businesses."
```

**Layout:** Clean list. No cards, no thumbnails. Editorial, not magazine.

```
[year divider — mono, muted]
2026

[post row]
Apr 28    What AI Implementation Actually Means for a Law Firm          →
Apr 12    The 3 Workflows Every Agency Should Automate First            →
Mar 30    Why We Built Scalar Instead of Using Off-the-Shelf Automation →

2025

Dec 14    How Kritano Finds the AI Gaps in Your Website                 →
```

---

### 5.6 Blog Post (`/blog/[slug]`)

**MDX-powered.** Files in `/content/blog/`.

**Frontmatter:**
```yaml
---
title: "What AI Implementation Actually Means for a Law Firm"
date: "2026-04-28"
summary: "Most law firms hear 'AI' and think chatbots. Here's what implementation actually looks like when it's done properly."
tags: ["legal", "implementation", "workflows"]
published: true
---
```

**Page layout:**
```
[date · read time — mono, muted]

[Title — serif, large]

[Summary — body, slightly muted, italic]

────────────────────────────────

[MDX content — standard prose styles]
  H2 → serif, medium
  H3 → mono, small caps
  Body → mono or sans, 18px, generous line height
  Blockquotes → left border accent, indented
  Code → monospaced, dark bg

────────────────────────────────

[Tags]

[CTA box]
Working in [tag vertical]?
I help businesses like yours implement AI properly.
→ Apply to work together

────────────────────────────────

[Back to blog]
```

**AEO requirements per post (enforced in MDX template):**
- Direct answer to core question within first 150 words
- Clear H2/H3 hierarchy (AI parsers read headings)
- Summary frontmatter field used as meta description
- Internal links to `/apply` and relevant case studies
- No filler intro — answer first, context second

---

### 5.7 About (`/about`)

**Meta**
```
title: "About — Chris Garlick"
description: "AI implementation partner based in the UK. Building proprietary tooling and autonomous delivery systems since 2023."
```

```
[label — mono]
About

[Serif heading]
I'm Chris Garlick.
I build AI systems that
actually get used.

[Body — 4 short paragraphs max]

Para 1: What you do and who for
"I work with service businesses — law firms,
accountancies, agencies — to build AI systems
that replace manual work. Not advice. Not
a strategy deck. Working systems."

Para 2: How you do it
"I run two tools I built myself: Scalar, an
autonomous AI delivery platform, and Kritano,
a site intelligence tool that audits and
benchmarks AI visibility. Every engagement
uses both."

Para 3: Background (brief)
"I've been building AI-first products since
[year]. Before that, [one sentence on
background]. I work solo but deliver at
the speed of a team."

Para 4: How to work together
"I take on a small number of clients at any
one time. If you want to know if we're a
fit, apply below."

[CTA]
→ Apply to work together

[Links — mono, muted, horizontal]
LinkedIn  ·  GitHub  ·  Scalar  ·  Kritano
```

---

### 5.8 Apply (`/apply`)

**Meta**
```
title: "Apply — Chris Garlick"
description: "Tell me about your business. I review every application personally."
```

**Intro:**
```
[Serif heading]
Let's talk about
your business.

[Body — mono, muted]
I review every application personally.
If we're a fit, you'll hear back
within 2 working days.
```

**Form fields:**
```
Your name *
Business name *
Industry / sector *
  [text input — no dropdown, keep it open]
Number of employees *
  [ Under 10 ]  [ 10–25 ]  [ 25–50 ]  [ 50+ ]
Annual revenue (approx) *
  [ Under £500k ]  [ £500k–£1M ]  [ £1M–£5M ]  [ £5M–£10M ]  [ £10M+ ]
What's your biggest operational bottleneck? *
  [textarea — 4 rows]
How did you find this site?
  [text input]
```

No budget field — don't anchor too early.

**Submission:**
- POST to `/api/apply`
- Send formatted email to Chris via Resend
- Send confirmation email to applicant
- Show inline success message: *"Thanks — I'll be in touch within 2 working days."*
- No redirect, no confetti, no over-engineered confirmation page

**API Route (`/api/apply`):**
```typescript
// app/api/apply/route.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.json();

  // Send to Chris
  await resend.emails.send({
    from: 'apply@chrisgarlick.com',
    to: 'chris@chrisgarlick.com',
    subject: `New application: ${body.businessName}`,
    html: formatApplicationEmail(body)
  });

  // Send confirmation to applicant
  await resend.emails.send({
    from: 'chris@chrisgarlick.com',
    to: body.email,
    subject: 'Application received',
    html: confirmationEmail(body)
  });

  return Response.json({ success: true });
}
```

---

## 6. Scalar CMS Integration (Phase 3)

### What Scalar CMS Manages
- Blog posts (create, edit, publish, unpublish)
- Case studies (all frontmatter fields + MDX content)
- Home page proof strip metrics (editable without deploy)
- Tools page copy (minor updates without code changes)

### Integration Architecture
```
Scalar CMS (admin)
      ↓
  Webhook on publish
      ↓
Next.js revalidation (ISR)
      ↓
  Page rebuilds in <5s
```

No full rebuilds. ISR means only the changed page regenerates. Fast and cheap on Vercel free tier.

### Content Schema (Scalar)

**Blog Post**
```
slug: string (auto from title)
title: string
date: date
summary: string (155 chars max — used as meta desc)
tags: string[]
content: rich text / MDX
published: boolean
```

**Case Study**
```
slug: string
title: string
category: enum [Legal, Accountancy, Agency, Insurance, Dental, Internal]
date: date
result: string (e.g. "22 hrs/week recovered")
summary: string
duration: string
tier: enum [Build, Build + Retainer, Retainer]
content: rich text / MDX
published: boolean
```

**Proof Strip Metrics**
```
metrics: string[] (array of strings shown in marquee)
```

---

## 7. SEO & AEO Configuration

### Technical SEO

**`/app/layout.tsx` — root metadata:**
```typescript
export const metadata: Metadata = {
  metadataBase: new URL('https://chrisgarlick.com'),
  title: {
    default: 'Chris Garlick — AI Implementation Partner',
    template: '%s | Chris Garlick'
  },
  description: 'AI implementation partner for service businesses. Audit, build, and maintain AI workflows using proprietary tooling.',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://chrisgarlick.com',
    siteName: 'Chris Garlick',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  }
}
```

**OG Image:**
Single template: dark background, `CG` monogram top left, page title in Instrument Serif, URL bottom right. Generate per-page variants using `@vercel/og` or a static set.

**Structured Data (JSON-LD):**

Person schema on `/about`:
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Chris Garlick",
  "jobTitle": "AI Implementation Partner",
  "url": "https://chrisgarlick.com",
  "sameAs": [
    "https://linkedin.com/in/[handle]",
    "https://github.com/[handle]"
  ]
}
```

Article schema on each blog post:
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "[post title]",
  "datePublished": "[date]",
  "author": {
    "@type": "Person",
    "name": "Chris Garlick"
  }
}
```

### AEO Content Rules

Every blog post must follow:
1. Answer the core question within the **first 150 words**
2. Use H2s that are **complete questions or statements** (not vague labels)
3. Include at least one **concrete example** with specific numbers
4. Add a **summary section** near the top (FAQ box or TL;DR)
5. Reference **Scalar** and **Kritano** naturally where relevant
6. Internal link to `/apply` and at least one case study

These rules are what get content cited by Claude, Perplexity, and GPT when someone asks "how do [vertical] businesses use AI."

---

## 8. GSC Migration Plan

### Pre-Launch

1. **Crawl existing site** with Screaming Frog or Kritano
   - Export all indexed URLs
   - Note any pages with GSC impressions > 0

2. **Check GSC Performance** on current property
   - Which URLs have clicks or impressions?
   - Export to CSV — keep this as reference

3. **Map redirects**
   ```
   Old URL                     →    New URL
   /projects/[slug]            →    /work
   /about                      →    /about
   /contact                    →    /apply
   /* (catch-all old paths)    →    /
   ```

4. **Build redirect config in `next.config.js`:**
   ```javascript
   async redirects() {
     return [
       {
         source: '/projects/:slug',
         destination: '/work',
         permanent: true, // 301
       },
       {
         source: '/contact',
         destination: '/apply',
         permanent: true,
       },
     ]
   }
   ```

### At Launch

5. **Submit new sitemap** via GSC → Sitemaps
   - URL: `https://chrisgarlick.com/sitemap.xml`
   - Remove any old sitemap submission

6. **Request indexing** for priority pages (in order):
   - `/`
   - `/work`
   - `/apply`
   - `/blog`
   - `/about`

7. **Verify all redirects** are returning 301 not 302

### Post-Launch Monitoring

| Week | Action |
|------|--------|
| 1 | Check Coverage report for crawl errors |
| 1 | Verify old URLs redirect correctly |
| 2 | Check new pages appearing in Index report |
| 4 | First impressions data on new pages |
| 6 | Assess if any high-traffic old URLs need dedicated redirect targets |

### robots.txt
```
User-agent: *
Allow: /

Sitemap: https://chrisgarlick.com/sitemap.xml

Disallow: /api/
Disallow: /_next/
```

---

## 9. Repository Structure

```
chrisgarlick.com/
├── app/
│   ├── layout.tsx              # Root layout, fonts, metadata
│   ├── page.tsx                # Home
│   ├── work/
│   │   ├── page.tsx            # Case study index
│   │   └── [slug]/page.tsx     # Individual case study
│   ├── tools/page.tsx
│   ├── blog/
│   │   ├── page.tsx            # Blog index
│   │   └── [slug]/page.tsx     # Individual post
│   ├── about/page.tsx
│   ├── apply/page.tsx
│   └── api/
│       └── apply/route.ts      # Form submission
├── content/
│   ├── blog/                   # .mdx blog posts
│   └── work/                   # .mdx case studies
├── components/
│   ├── Nav.tsx
│   ├── Footer.tsx
│   ├── CaseStudyCard.tsx
│   ├── BlogRow.tsx
│   ├── ApplyForm.tsx
│   └── Marquee.tsx
├── lib/
│   ├── content.ts              # MDX parsing utils
│   └── resend.ts               # Email helpers
├── public/
│   ├── og/                     # OG images
│   └── fonts/                  # Self-hosted if needed
├── styles/
│   └── globals.css             # CSS variables, base styles
├── next.config.js              # Redirects, MDX config
├── tailwind.config.js
└── .env.local                  # RESEND_API_KEY, etc.
```

---

## 10. Launch Checklist

### Content
- [ ] Hero copy — 3 variants written and chosen
- [ ] Offer section copy finalised
- [ ] 2 x case studies ready (internal builds count)
- [ ] About page written (300 words max)
- [ ] Apply page intro written
- [ ] 2 x blog posts written and ready to publish
- [ ] Tools page copy for Scalar and Kritano
- [ ] Confirmation email copy for Apply form

### Technical
- [ ] All redirects configured and tested
- [ ] New sitemap generated and submitted to GSC
- [ ] OG images created for all main pages
- [ ] JSON-LD structured data on About and blog posts
- [ ] robots.txt configured
- [ ] Canonical tags on all pages
- [ ] Core Web Vitals passing (run Kritano audit on launch)
- [ ] Plausible analytics script installed
- [ ] Resend domain verified for `chrisgarlick.com`
- [ ] Apply form tested end-to-end
- [ ] 404 page styled and on-brand

### SEO/AEO
- [ ] All page titles follow pattern: `[Page] | Chris Garlick`
- [ ] All meta descriptions under 155 characters
- [ ] All blog posts follow AEO content rules
- [ ] Internal links from blog posts to `/apply` and `/work`

### Post-Launch
- [ ] Request manual indexing on priority pages in GSC
- [ ] Share on LinkedIn (post about the rebuild, link to site)
- [ ] Schedule week 1 GSC check in calendar
- [ ] Add first 3 outreach targets to pipeline

---

*Build spec v1.0 — chrisgarlick.com*
*April 2026*