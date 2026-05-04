<!-- Version: 1 | Department: product | Updated: 2026-05-02 -->

# Product Requirements Document — chrisgarlick.com

## Problem Statement

Chris Garlick is an AI workflow partner with proprietary tools (Kritano CMS, AI-integrated delivery) but no portfolio site that generates inbound leads. He needs a site that positions him as a sector-specific operator, showcases process proof instead of social proof, and runs on his own CMS as living evidence of his capabilities.

## Goals

| Goal | OKR Reference |
|------|---------------|
| Launch fully functional site on Kritano CMS | O1: KR1 |
| Publish 2 case studies + 2 blog posts at launch | O1: KR2, KR3 |
| Generate inbound applications through /apply | O2: KR3 |
| Establish credibility via process proof and AEO content | O3: KR3 |
| Pass Kritano's own audit | O1: KR5 |

## Non-Goals

- No client hub or portal
- No newsletter or email capture
- No light mode or theme toggle
- No /team product page (AI delivery stays private)
- No paid ads integration
- No /tools page in V1 (homepage teaser only)

## Functional Requirements

### FR-01: Navigation
Sticky nav: CG monogram (left), Work/Blog links (right), Apply pill button. Blur background on scroll. Mobile hamburger. Footer: name, title, location, nav links, "Built on Kritano CMS".

### FR-02: Home Page
9 sections: Hero, What I Do (3 columns), Offer Cards (2 cards with pricing), Proof Strip (marquee from CMS), Selected Work (case study cards from CMS), Tools Teaser, About Teaser, Blog Preview (3 latest articles from CMS), CTA.

### FR-03: Work Index (/work)
Case study cards from caseStudy collection. Category filters: All/Legal/Accountancy/Agency/Internal. Client-side filtering. Empty state per filter.

### FR-04: Case Study (/work/[slug])
Category + date, title, result (accent), stats row (duration/tier/result), rich text body, prev/next navigation, CTA to /apply.

### FR-05: Blog Index (/blog)
Editorial list grouped by year. Date + title per row. Sorted by publishedAt desc. No cards, no thumbnails.

### FR-06: Blog Post (/blog/[slug])
Date + read time, title, excerpt (italic), body with proper heading hierarchy, tags, contextual CTA box, back to blog link. Article JSON-LD.

### FR-07: About (/about)
Label, heading, 4 paragraphs, external links, CTA. Person JSON-LD.

### FR-08: Apply (/apply)
Form: name*, email*, business name*, industry*, employees* (radio group), revenue* (radio group), bottleneck* (textarea), referral (optional). POST to /api/apply. Success: inline message. Error: inline with email fallback. No redirect.

### FR-09: Form API (/api/apply)
Hono route. Validates required fields. If RESEND_API_KEY exists: sends notification to chris@chrisgarlick.com + confirmation to applicant. If not: console.log fallback. Returns { success: true/false }.

### FR-10: SEO
Unique titles/meta descriptions. Canonical tags. Sitemap.xml. robots.txt (allow all, disallow /api/). Open Graph tags. JSON-LD per page type.

## Non-Functional Requirements

- Lighthouse Performance: 90+ mobile
- LCP < 2.5s, CLS < 0.1
- Page weight < 500KB
- WCAG 2.1 AA
- Chrome, Firefox, Safari, Edge (latest 2 versions)

## Data Requirements

Collections: page (exists), article (exists), caseStudy (new), proofMetric (new). See constants.md for full schemas.

## Integration Requirements

- Resend: email on form submission (with fallback)
- Plausible: analytics (V1.1)

## Edge Cases

| Scenario | Behaviour |
|----------|-----------|
| Empty blog | "Posts coming soon." message |
| Empty work | "Case studies coming soon." Homepage section hidden |
| Form API failure | Inline error with email fallback |
| 404 | Custom styled page with nav link |
| No proof metrics | Section hidden |
| JS disabled | Content visible (SSG). Form shows noscript email fallback |
