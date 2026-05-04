# Content & SEO Audit — chrisgarlick.com

**Date:** 3 May 2026
**Auditor:** Content Department
**Scope:** All pages, components, meta tags, structured data, messaging alignment

---

## Executive Summary

The site is well-built structurally but has **three strategic problems** and **several SEO gaps** that need fixing before launch:

1. **Stale positioning language** — multiple pages still say "AI Workflow Partner" despite the rebrand to "Software Developer"
2. **Pricing visibility is a filter, not a problem** — keep it, but reframe it
3. **Sector specificity can be softened** without losing focus

Plus: missing meta tags, inconsistent heading hierarchy, and copy that doesn't match the updated brand voice in several places.

---

## The Three Strategic Questions

### 1. Should pricing be shown?

**Yes. Keep it.**

The pricing (£5-8k build, £3-6k/mo retainer) is a deliberate filter. It tells Sarah (law firm partner with £2.5M revenue) "this is serious and scoped" while telling the £500 Zapier freelancer buyer "this isn't for you." That's the point.

**But reframe how it appears.** Right now the offer cards present pricing as the headline. The price should be secondary to what you get. The headline should be the outcome.

**Current:**
```
THE BUILD
£5,000 – £8,000
Fixed fee · 2–4 weeks
```

**Recommended:**
```
THE BUILD
Fixed-fee project · 2–4 weeks
From £5,000
```

Moving "from £5,000" to a supporting position makes the commitment (fixed fee, 2-4 weeks) the headline. The price is there — transparent — but not the first thing a nervous buyer reads. "From" also signals flexibility.

For the retainer, same approach:
```
THE RETAINER
Monthly engagement · Ongoing
From £3,000/month
```

### 2. Should sectors be specified?

**Yes, but soften the framing.**

Naming sectors (legal, accountancy, agency) gives you credibility with those audiences. "I work with service businesses" is generic. "I've built systems for law firms and accountancies" is specific. Specificity builds trust.

**But don't make it exclusive.** The current copy says "3 sectors: legal, accountancy, agency" in the proof strip and "law firms, accountancies, and agencies" throughout. This reads as a closed list.

**Fix:** Change "3 sectors" to something that signals these are examples, not limits:

**Current proof strip metric:** "3 sectors: legal, accountancy, agency"
**Recommended:** "Sector focus: legal, accountancy, agency — and service businesses ready to move"

**Current about teaser body:** "I build software for service businesses — law firms, accountancies, and agencies."
**Recommended:** "I build software for service businesses. Most of my work is with law firms, accountancies, and agencies — but if your operations have manual bottlenecks, we should talk."

This keeps the sector credibility while leaving the door open.

### 3. Homepage H1 is too long

**Current H1:** "I build software that replaces manual work. Some of it uses AI. All of it ships."

This is 78 characters and three sentences. As an H1 rendered at display size, it's overwhelming. The copy is good — it just shouldn't all be in the H1.

**Recommended:**

H1: **"I build software that replaces manual work."**
Subtext (not H1): "Some of it uses AI. All of it ships."

This gives you a tight, scannable H1 (46 characters) with the qualifier below it at a smaller size. The meaning is identical. The visual weight drops significantly.

---

## Page-by-Page Audit

### Homepage (`/`)

**SEO issues:**
- Meta title: "Chris Garlick — AI Workflow Partner" → **still says AI Workflow Partner**. Change to: "Chris Garlick — Software Developer | Audit. Build. Maintain."
- Meta description references "AI systems" → Change to: "I build software that replaces manual work for service businesses. Fixed-fee projects from £5k. Proprietary tooling. UK-based."
- JSON-LD schema has `jobTitle: "AI Workflow Partner"` → Change to "Software Developer"
- JSON-LD has `priceRange: "£5,000 - £8,000"` — this is fine, keep it

**Copy issues:**
- Hero label says "Software Developer" ✓ (correct)
- CTA section: "If you want to know whether AI can cut real time from your operations, apply." → **Still AI-centric.** Change to: "If your operations have bottlenecks that software could fix, apply."
- Proof strip metric "3 sectors: legal, accountancy, agency" → soften as noted above

**Heading hierarchy:** The hero H1 is correct. Below that, check that section headings are H2, not H1. The "What I Do" columns heading should be H2. Each column heading (Audit, Build, Maintain) should be H3.

**Missing:** No `<meta name="author">` tag. Add: `<meta name="author" content="Chris Garlick">`

---

### About (`/about`)

**SEO issues:**
- Meta title: "About Chris Garlick — AI Workflow Partner, UK" → Change to: "About Chris Garlick — Software Developer, UK"
- Meta description: "Solo AI operator building systems..." → Change to: "Software developer building systems for service businesses. Proprietary tools, transparent process, UK-based."
- JSON-LD Person schema has `jobTitle: "AI Workflow Partner"` → Change to "Software Developer"

**Copy:** The about page body in the team docs is already updated to the software developer positioning. Ensure the CMS content matches.

---

### Work / Case Studies (`/work`)

**SEO issues:**
- Meta title: "AI Implementation Case Studies | Chris Garlick" → Change to: "Case Studies | Chris Garlick"
- Meta description: "Real AI implementation projects..." → Change to: "Real projects for service businesses. Architecture shown. Outcomes measured. Transparent process."
- Category filters include "Legal", "Accountancy", "Agency", "Internal" — add "All" as default selected ✓ (already there)

**Copy:** Page label "Portfolio" and heading "Work" — this is fine. Clean and clear.

**Missing:** No structured data for the listing page itself. Add a CollectionPage or ItemList schema.

---

### Individual Case Study (`/work/[slug]`)

**SEO:** Dynamic — depends on CMS seoBlock data. Ensure case studies have meta titles and descriptions filled in the admin.

**Copy issue:** The stats row shows "Duration", "Engagement" (tier), "Result". The word "Engagement" is vague. Consider "Scope" or "Package" instead.

---

### Blog Listing (`/blog`)

**SEO issues:**
- Meta title: "AI Implementation Insights | Blog | Chris Garlick" → Change to: "Blog | Chris Garlick"
- Meta description: "Practical guides on AI implementation..." → Change to: "Practical guides on software, automation, and operations for service businesses. No hype."

**Copy:** Page label "Writing" and heading "Blog" — fine. The empty state "Posts coming soon." — fine.

---

### Individual Blog Post (`/blog/[slug]`)

**SEO:** Dynamic — relies on seoBlock. The auto-generated Article schema is correct.

**Copy issues:**
- Contextual CTA box: "I build AI systems like the ones described above." → **Still AI-centric.** Change to: "I build software like what's described above. Fixed pricing, transparent process."
- Bottom CTA: "AI systems that actually get used." → Change to: "Software that actually gets used."
- Bottom CTA body: "...whether AI can cut real time from your operations..." → Change to: "...whether software can cut real time from your operations..."

---

### Apply (`/apply`)

**SEO issues:**
- Meta title: "Work With Me | AI Implementation | Chris Garlick" → Change to: "Work With Me | Chris Garlick"
- Meta description: "Apply to work with Chris Garlick. AI implementation for law firms..." → Change to: "Apply to work with Chris Garlick. Software that replaces manual work. Fixed pricing from £5k."

**Copy:** The apply page body copy is clean and on-brand. "No sales calls. No discovery sessions. Just a direct response." — this is perfect.

**Form:** The industry field placeholder says "Legal, Accountancy, Agency..." → Change to "e.g. Legal, Accountancy, Agency, Property..." — adding one extra sector signals openness.

---

### Footer Component

**Critical issue:** Footer says "AI Workflow Partner · UK" → **Change to "Software Developer · UK"**

---

### Navigation

**No issues.** Clean, minimal, correct.

---

### CTASection Component (reusable)

**Copy issue:** Default heading "If you want to know whether AI can cut real time from your operations, apply." → Change to: "If your operations have manual bottlenecks, let's see if software can fix them."

Default body is fine.

---

### 404 Page

**No issues.** Dry, functional, on-brand.

---

### Privacy & Terms

**No issues.** Well-written, UK GDPR compliant, appropriate tone.

---

## SEO Checklist

| Item | Status | Action |
|------|--------|--------|
| Meta titles unique per page | ⚠️ | Update stale "AI" references |
| Meta descriptions unique per page | ⚠️ | Update stale "AI" references |
| H1 per page (single) | ✓ | OK |
| Canonical URLs | ✓ | SEO component handles this |
| Open Graph tags | ✓ | SEO component handles this |
| Twitter Card tags | ✓ | SEO component handles this |
| JSON-LD structured data | ⚠️ | Update jobTitle references |
| robots.txt | ✓ | New route added |
| Sitemap.xml | ✓ | Auto-generated |
| Image alt text | ⚠️ | Hero images need alt from CMS |
| Image lazy loading | ✓ | Fixed in theme components |
| `lang` attribute | ✓ | `en-GB` |
| Viewport meta | ✓ | Present |
| Author meta | ✗ | Add `<meta name="author">` |
| Preconnect for fonts | ✓ | Present |
| Focus keywords per page | ✗ | Add via seoBlock in admin |

---

## Content Contradictions with New Positioning

Every instance of "AI Workflow Partner", "AI systems", "AI implementation" that hasn't been updated to the software developer framing:

| Location | Current | Should be |
|----------|---------|-----------|
| Homepage meta title | "AI Workflow Partner" | "Software Developer" |
| About meta title | "AI Workflow Partner, UK" | "Software Developer, UK" |
| About JSON-LD jobTitle | "AI Workflow Partner" | "Software Developer" |
| Homepage JSON-LD jobTitle | "AI Workflow Partner" | "Software Developer" |
| Work meta title | "AI Implementation Case Studies" | "Case Studies" |
| Blog meta title | "AI Implementation Insights" | "Blog" |
| Apply meta title | "AI Implementation" | Remove |
| Apply meta description | "AI implementation for..." | "Software that replaces..." |
| Blog CTA box | "I build AI systems" | "I build software" |
| Blog bottom CTA | "AI systems that actually get used" | "Software that actually gets used" |
| Blog bottom CTA body | "whether AI can cut real time" | "whether software can cut real time" |
| CTASection default | "whether AI can cut real time" | "whether software can fix them" |
| Footer tagline | "AI Workflow Partner · UK" | "Software Developer · UK" |

---

## Priority Actions

### Must fix before launch:
1. Update all "AI Workflow Partner" references to "Software Developer" (13 instances listed above)
2. Shorten H1 — split into H1 + subtext
3. Update footer tagline
4. Reframe offer card pricing (outcome first, price secondary)

### Should fix before launch:
5. Soften sector specificity language
6. Add `<meta name="author">` to SEO component
7. Fill in seoBlock data for all CMS pages (meta titles, descriptions, focus keywords)
8. Update form industry placeholder

### Nice to have:
9. Add CollectionPage schema to /work listing
10. Add FAQ schema to future pillar blog posts
11. OG images per page (currently generates path but files don't exist)

---

*Content audit complete. All changes are copy-level — no structural or design changes needed.*
