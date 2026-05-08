<!-- Version: 2 | Department: seo | Updated: 2026-05-08 -->

# SEO & CTR Implementation Plan - chrisgarlick.com

Full audit and implementation plan. Covers technical SEO, on-page optimisation, content architecture, CTR maximisation, AI/AEO visibility, and off-page strategy.

---

## Current State Audit

### What Exists (14 pages in sitemap)

| Page | Title Tag | Meta Description | Schema | Issues |
|------|-----------|-----------------|--------|--------|
| `/` | Chris Garlick - AI Workflow Partner | "Software developer building systems for service businesses. Fixed-fee projects. UK-based." | WebSite + ProfessionalService | Title doesn't contain money keywords. Description is flat - no hook. |
| `/about` | About Chris Garlick - AI Workflow Partner, UK | **MISSING** | Person | No meta description at all. Massive CTR loss. |
| `/work` | Case Studies - AI Integration Projects | "Real AI integration projects for service businesses." | CollectionPage | Empty page - "coming soon". Indexed empty page = negative signal. |
| `/tools` | Free Tools - Site Audit, SEO & Performance | "Free tools to audit your website health, SEO, accessibility and performance." | None | Only 1 tool live. Other categories say "No tools in this category yet". |
| `/tools/site-audit` | Unknown | Unknown | Unknown | Not audited but exists |
| `/contact` | Contact Chris Garlick - AI Integration for Business | Good description | ContactPage | Decent. Form fields are well structured for lead qualification. |
| `/article` | Unknown | Unknown | Unknown | Blog index |
| 5x `/article/*` | Varies | Varies | Article | SEO fields now populated. OG images just fixed. |
| `/privacy` | Unknown | Unknown | None | Low priority |
| `/terms` | Unknown | Unknown | None | Low priority |

### Critical Problems

1. **Google barely knows you exist.** A `site:chrisgarlick.com` search returns 1 result from 2020 (old site). The new site has near-zero indexing. This means the sitemap hasn't been submitted, or Google hasn't crawled the new pages yet.

2. **No services pages.** The site has zero pages targeting the money keywords ("ai implementation partner uk", "ai consultant for law firms uk", etc.). Blog posts drive awareness but service pages close deals. This is the single biggest SEO gap.

3. **No pricing page.** "AI implementation cost" keywords are P1 targets. There's no page answering this question. Competitors who answer it will capture that traffic.

4. **Empty case studies page.** `/work` is indexed but empty. An indexed empty page tells Google this site has thin content.

5. **Missing meta descriptions.** The about page has no meta description. Google will auto-generate one, which is almost always worse for CTR.

6. **Homepage title misses money keywords.** "Chris Garlick - AI Workflow Partner" doesn't contain any searchable terms. Nobody searches for "Chris Garlick" yet.

7. **No FAQPage schema on blog posts.** The blog posts have FAQ sections but no corresponding schema markup. This means no FAQ rich results in SERPs.

8. **Thin internal linking.** 14 pages with minimal cross-linking. Google can't build topical authority signals from this structure.

---

## Phase 1: Fix the Foundation (Week 1-2)

### 1.1 Google Search Console & Indexing

**Action:** Submit sitemap and request indexing for all pages.

- Register/verify `chrisgarlick.com` in Google Search Console
- Submit `sitemap-index.xml`
- Manually request indexing for each of the 14 pages using the URL Inspection tool
- Set up Bing Webmaster Tools and submit there too
- Monitor the Coverage report daily for the first 2 weeks

**Why this is P0:** Nothing else matters until Google knows the site exists.

### 1.2 Fix Missing Meta Descriptions

Every page needs a hand-crafted meta description optimised for CTR. Current fixes needed:

| Page | Current | New Meta Description |
|------|---------|---------------------|
| `/` | "Software developer building systems for service businesses. Fixed-fee projects. UK-based." | "I audit your operations, build AI systems that replace manual work, and maintain them monthly. Fixed pricing from £5k. UK-based solo developer." |
| `/about` | **MISSING** | "Solo AI developer building workflow automation for law firms, agencies, and accountancy practices. Proprietary tools, fixed pricing, no juniors." |
| `/work` | "Real AI integration projects for service businesses." | "AI integration case studies: document automation for law firms, reporting pipelines for agencies, and onboarding systems for accountancy practices." |
| `/article` | Unknown | "Practical articles on AI implementation for professional service firms. No hype - just what works, what doesn't, and what it actually costs." |

**CTR principles for meta descriptions:**
- Lead with a benefit or outcome, not a feature
- Include a number where possible (pricing, stats, timeframes)
- End with differentiation ("solo developer", "fixed pricing", "UK-based")
- Never exceed 155 characters
- Match the search intent - if someone's searching for cost info, mention pricing

### 1.3 Fix Homepage Title Tag

**Current:** "Chris Garlick - AI Workflow Partner"
**New:** "AI Implementation Partner UK - Audit, Build, Maintain | Chris Garlick"

This captures the P1 money keyword "ai implementation partner uk" while retaining brand.

### 1.4 Add FAQPage Schema to Blog Posts

The blog posts already have FAQ sections. Add FAQPage JSON-LD schema to every article that has an FAQ section. This enables FAQ rich results in SERPs which dramatically increase CTR by expanding the listing to 2-3x the normal size.

**Implementation:** Update `[slug].astro` to detect FAQ headings in the body and auto-generate FAQPage JSON-LD.

### 1.5 Noindex the Empty Work Page

Until case studies exist, add `<meta name="robots" content="noindex, follow">` to `/work`. An indexed empty page hurts more than it helps. Remove the noindex once case studies are published.

---

## Phase 2: Build the Money Pages (Week 2-4)

These are the highest-ROI pages to build. They target commercial-intent keywords where someone is ready to buy or evaluate. **This is where the site is completely empty and competitors are capturing all the traffic.**

### 2.1 Services Landing Pages

Create 4 new pages. These are NOT blog posts - they're landing pages with clear CTAs, structured for conversion, and targeting BOFU keywords.

#### Page: `/services/ai-implementation`
- **Target keyword:** "ai implementation partner uk" (P1 money keyword)
- **Title tag:** "AI Implementation Partner UK - Fixed-Fee Projects | Chris Garlick"
- **Meta description:** "AI implementation for professional service firms. I audit your workflows, build custom systems, and maintain them monthly. Fixed pricing from £5k."
- **H1:** "AI Implementation for Service Businesses"
- **Content:** What AI implementation actually means (not chatbots), the audit-build-maintain process, who it's for, what it costs, how long it takes, FAQ section
- **Schema:** Service + FAQPage
- **Internal links from:** Homepage, about, every blog post, contact
- **CTR hook:** Include pricing in meta description - searchers for implementation partners want to know cost immediately

#### Page: `/services/ai-for-law-firms`
- **Target keyword:** "ai consultant for law firms uk" (P1 money keyword)
- **Title tag:** "AI for Law Firms UK - Document Automation & Client Intake | Chris Garlick"
- **Meta description:** "AI systems for UK law firms: document drafting automation, client intake workflows, compliance prep. Fixed fee from £5k. No ongoing licence costs."
- **H1:** "AI Systems for Law Firms"
- **Content:** Specific legal workflows that benefit from AI (document drafting, client intake, compliance), how it works with Clio/Leap/PMS, GDPR and SRA compliance, pricing, FAQ
- **Schema:** Service + FAQPage
- **Internal links from:** Homepage, blog cluster 1 pages, about
- **CTR hook:** Name the specific workflows - "document automation", "client intake" - searchers want specificity

#### Page: `/services/ai-for-agencies`
- **Target keyword:** "ai workflow automation for agencies" (P1 money keyword)
- **Title tag:** "AI Workflow Automation for Agencies - Reporting, Content, Onboarding"
- **Meta description:** "AI automation for marketing agencies: client reporting in minutes, content pipelines that scale, onboarding that runs itself. Fixed pricing. No Zapier."
- **H1:** "AI Workflow Automation for Agencies"
- **Content:** The 3 killer workflows (reporting, content, onboarding), why Zapier/Make break at scale, what custom systems look like, pricing, FAQ
- **Schema:** Service + FAQPage
- **Internal links from:** Homepage, blog cluster 2 pages, about

#### Page: `/services/ai-for-accountancy-firms`
- **Target keyword:** "ai automation for accountancy firms" (P1 money keyword)
- **Title tag:** "AI for Accountancy Firms UK - Onboarding & Compliance Automation"
- **Meta description:** "AI automation for UK accountancy practices: client onboarding in 3 days (not 3 weeks), compliance document prep, data entry elimination. Fixed pricing."
- **H1:** "AI for Accountancy Firms"
- **Content:** Onboarding automation, compliance document prep, data entry reduction, how it integrates with Xero/Sage, partner buy-in materials, pricing, FAQ
- **Schema:** Service + FAQPage
- **Internal links from:** Homepage, blog cluster 3 pages, about

### 2.2 Pricing/Investment Page

#### Page: `/pricing`
- **Target keyword:** "ai implementation cost uk" (P1 MOFU keyword)
- **Title tag:** "AI Implementation Pricing UK - Fixed-Fee Projects from £5k"
- **Meta description:** "Transparent AI implementation pricing. Build: £5k-8k fixed fee. Retainer: £3k-6k/month. No day rates, no scope creep, no surprises. See what's included."
- **H1:** "Investment"
- **Content:** Build tier (what's included, timeline, price), Retainer tier (what's included, price), what's NOT included, comparison table, FAQ on costs
- **Schema:** Offer + FAQPage
- **CTR hook:** Price in the title tag. This is the #1 CTR driver for cost-related queries. Most competitors hide pricing - showing it is a massive differentiator.

### 2.3 Services Index Page

#### Page: `/services`
- **Target keyword:** "ai systems for professional services" (P1)
- **Title tag:** "AI Services for Professional Service Firms | Chris Garlick"
- **Meta description:** "Custom AI systems for law firms, agencies, and accountancy practices. Audit, build, maintain. Fixed pricing, solo developer, UK-based."
- **Content:** Overview of the three sectors served, cards linking to each sector page, proof metrics, CTA
- **Schema:** Service (aggregate)

---

## Phase 3: CTR Maximisation (Week 3-5)

CTR isn't just about rankings - a position 3 result with 8% CTR outperforms a position 1 result with 3% CTR in terms of traffic quality signals, and Google notices.

### 3.1 Title Tag Formulas for Maximum CTR

**Blog posts - use power formats:**

| Format | Example | When to use |
|--------|---------|-------------|
| Number + Outcome | "Why 79% of Enterprises Are Failing at AI Adoption" | Data-driven posts |
| How to + Specific Result | "How to Implement AI in a Law Firm (Without the £50k Consultancy)" | How-to guides |
| X vs Y + Resolution | "AI Consultant vs Agency: Which Is Right for Your Law Firm?" | Comparison posts |
| Question + Promise | "What Does AI Implementation Actually Cost? Real Numbers." | Cost/evaluation queries |
| Warning + Solution | "Your Zapier Automations Will Break. Here's What to Build Instead." | Problem-aware audience |

**Key rules:**
- Primary keyword in the first 30 characters
- Never exceed 60 characters (Google truncates at ~60)
- Include a number, bracket, or parenthetical where possible - these increase CTR by 20-30%
- Use the current year in titles where relevant ("2026 Guide")

### 3.2 Rich Results Strategy

| Schema Type | Pages | Rich Result |
|-------------|-------|-------------|
| FAQPage | All service pages + blog posts with FAQ sections | Expandable FAQ dropdowns in SERP - takes 2-4x space |
| HowTo | How-to blog posts | Step-by-step expandable in SERP |
| Article | All blog posts | Author, date, breadcrumbs in SERP |
| ProfessionalService | Homepage | Knowledge panel potential |
| Service | Service pages | Service details in SERP |
| Offer | Pricing page | Price display in SERP |
| Person | About page | Already implemented |

**Priority:** FAQPage schema has the highest CTR impact of any structured data. Implement it on every page that has Q&A content.

### 3.3 OG Image Strategy for Social CTR

Every page needs a branded OG image. Current state: only the latest blog post has one. The rest default to a non-existent static file path.

**Implementation:**
- Generate OG images for all service pages using the draw skill (wide format, 1920x1080)
- Upload to CMS media and link via the featured image field (same pattern we just implemented)
- For blog posts: generate an OG image for every post at publish time

**Why this matters:** When someone shares a link on LinkedIn, X, or Slack, the OG image is the first thing people see. A branded, professional image vs a broken image or generic placeholder is the difference between clicks and scroll-past.

### 3.4 Breadcrumb Schema

Add BreadcrumbList JSON-LD to every page. This displays breadcrumb trails in SERPs:

```
chrisgarlick.com > Services > AI for Law Firms
chrisgarlick.com > Articles > Why 79% Are Failing...
```

This increases CTR by making the result look more structured and trustworthy. Implementation is straightforward - generate based on the URL path.

---

## Phase 4: Content Architecture Expansion (Week 4-8)

### 4.1 New Topic Cluster: AI Implementation (Cross-Sector)

This is a net-new cluster targeting the broader "AI implementation" search space that isn't sector-specific.

**Pillar:** "The AI Implementation Playbook for Service Businesses"
- URL: `/article/ai-implementation-playbook`
- Target: "ai implementation for small business uk"
- 3,000 words

**Cluster pages:**
1. "What Does an AI Implementation Partner Actually Do?" - `/article/what-ai-implementation-partner-does` (TOFU)
2. "AI Implementation Cost UK: Real Numbers for 2026" - `/article/ai-implementation-cost-uk` (MOFU/BOFU)
3. "AI Consultant vs AI Agency: An Honest Comparison" - `/article/ai-consultant-vs-agency` (MOFU comparison)
4. "Build vs Buy AI Systems: When Custom Wins" - `/article/build-vs-buy-ai-systems` (MOFU comparison)
5. "AI vs Hiring Staff: The Real Cost Comparison" - `/article/ai-vs-hiring-staff` (MOFU comparison)
6. "How to Run Your First AI Audit" - `/article/how-to-run-ai-audit` (MOFU)
7. "AI Retainer Services: What They Are and Who Needs One" - `/article/ai-retainer-services-uk` (BOFU)

### 4.2 Comparison Content (MOFU Goldmine)

These are the most underserved keywords in your space. Almost nobody is writing genuine comparison content for AI implementation services. Each of these should be a blog post:

1. **"AI Consultant vs AI Agency UK"** - `/article/ai-consultant-vs-agency-uk`
   - This is the #1 evaluation query for your audience
   - Be genuinely balanced but position the solo operator model as the third option they didn't know existed

2. **"Zapier vs Custom AI Systems"** - `/article/zapier-vs-custom-ai-systems`
   - Tom persona's exact pain point
   - Already in topic clusters but hasn't been written yet

3. **"In-House AI Hire vs Outsourced AI Partner"** - `/article/hire-ai-developer-vs-partner`
   - David persona evaluates this exact trade-off
   - Lead with the cost comparison (salary + benefits + management overhead vs fixed fee)

4. **"AI Implementation Cost UK: What to Actually Budget"** - `/article/ai-implementation-cost-uk`
   - This is a P1 keyword with almost no good content ranking for it
   - Be specific: "Build tier: £5k-8k. Retainer: £3k-6k/month. Here's what each includes."
   - Pricing transparency is your competitive advantage - use it

5. **"Off-the-Shelf AI vs Custom AI Systems"** - `/article/off-the-shelf-vs-custom-ai`
   - Positions Chris against tool vendors (Harvey, generic chatbots) without naming them

### 4.3 Content Production Calendar

**Blog post targets:**
- Weeks 1-4: 1 new service page per week (the money pages from Phase 2)
- Weeks 5-8: 1 comparison post per week (the MOFU goldmine)
- Weeks 9-12: Pillar pages for each cluster (requires cluster pages to exist first)
- Ongoing: 1 trend post per week (via /trend skill) for freshness signals + social traffic

**Internal linking rules:**
- Every new blog post must link to at least 1 service page
- Every service page must link to 2-3 relevant blog posts
- Every blog post must link to 1-2 other blog posts in the same cluster
- Homepage must link to all service pages and latest 3 blog posts

---

## Phase 5: Technical SEO Hardening (Week 3-6)

### 5.1 Core Web Vitals

The site is Astro SSG (static generation) which is already optimal for CWV. Verify:
- LCP < 2.5s (test with PageSpeed Insights)
- INP < 200ms (should be trivial for a static site)
- CLS < 0.1 (check for layout shifts from font loading or async content)

### 5.2 Robots.txt

Ensure `robots.txt` allows crawling of all public pages and blocks admin:

```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: https://chrisgarlick.com/sitemap-index.xml
```

### 5.3 Canonical URLs

Every page should have `<link rel="canonical" href="...">`. The SEO component already handles this - verify it's working correctly on all pages.

### 5.4 Image Optimisation

- All images served as WebP (CMS already converts on upload)
- Add `width` and `height` attributes to prevent CLS
- Lazy-load below-fold images
- Descriptive alt text on all images (not just "image" or empty)

### 5.5 Structured Data Expansion

**Current:** WebSite, ProfessionalService, Person, Article, ContactPage, CollectionPage
**Missing:** FAQPage, HowTo, Offer, BreadcrumbList, Service

Add to the build:
- FAQPage schema auto-generated from H3 questions in blog posts
- BreadcrumbList on all pages
- Service schema on service pages
- Offer schema on pricing page

### 5.6 XML Sitemap Enhancements

Current sitemap is basic. Enhance with:
- `<lastmod>` timestamps on all pages (Astro can pull from `updated_at`)
- `<changefreq>` hints (weekly for blog, monthly for service pages)
- Separate sitemaps for articles vs pages if the site grows past 50 pages

---

## Phase 6: AI & Answer Engine Optimisation (Ongoing)

### 6.1 Concise Answer Pattern

Every H2 section on every page should follow this pattern:

```
## What does AI implementation cost for a law firm?

AI implementation for a UK law firm typically costs £5,000-8,000 for the initial build
and £3,000-6,000/month for ongoing maintenance. [Then expand with detail, nuance, caveats...]
```

The first 1-2 sentences must directly answer the section heading in under 50 words. This is what AI engines extract verbatim. If the section starts with background context or a rhetorical question, AI engines skip it.

### 6.2 Entity Building

For AI engines to cite you, you need to be a recognised entity:

1. **Google Business Profile** - Set up if not already done (even for a sole trader)
2. **LinkedIn profile** - Keep active with consistent "AI implementation" positioning
3. **GitHub profile** - Kritano CMS is open source - this is a strong signal
4. **Consistent NAP** - Name, Address, Phone consistent across all platforms
5. **Author schema** - Already on about page, ensure blog posts link back

### 6.3 Topical Authority through Depth

AI engines prefer sites that cover a topic comprehensively. The topic cluster architecture is the foundation:

- 3 sector clusters (law, agencies, accountancy) x 5-6 pages each = 15-18 pages of deep coverage
- 1 cross-sector cluster (AI implementation) x 7 pages = 7 more pages
- Each cluster has a pillar page that links everything together

When all clusters are built out, chrisgarlick.com will have 30-40 interconnected pages covering AI implementation for professional services. This depth is what gets cited by Perplexity, ChatGPT, and Google AI Overviews.

---

## Phase 7: Off-Page Strategy (Ongoing)

### 7.1 Linkable Assets

Create content specifically designed to earn backlinks:

1. **"The State of AI Adoption in UK Professional Services" (annual report)**
   - Original research/data compilation
   - Journalists and bloggers link to data sources
   - Use trend scanning to compile real stats monthly, publish annually

2. **Free Site Audit Tool**
   - Already exists at `/tools/site-audit`
   - Make it embeddable/shareable ("Audit your own site" badges for partners)
   - Create an "AI Readiness Score" version specifically for professional services

3. **AI Implementation Cost Calculator**
   - Interactive tool: answer 5 questions, get an estimated cost range
   - Targets "AI implementation cost" keywords
   - Highly shareable and linkable

### 7.2 Digital PR Angles

Pitch data-driven stories to:
- **Legal tech publications:** Legal Technology Today, The Law Society Gazette, LegalIT Insider
- **Accountancy publications:** Accountancy Age, AccountingWeb
- **Marketing/agency publications:** The Drum, Marketing Week, Econsultancy
- **General tech:** TechCrunch (UK), Wired UK, The Register

**Story angles:**
- "79% of enterprises fail at AI adoption - here's why professional services are different"
- "The solo AI operator model: why one developer with proprietary tools outperforms agencies"
- "AI implementation costs: the real numbers agencies and consultancies don't publish"

### 7.3 Reddit Karma Building

Already producing Reddit comments via /trend. Continue building presence in:
- r/ExperiencedDevs, r/CTO, r/LawFirm, r/Accounting
- Goal: become a recognised helpful voice, not a marketer
- After 200+ karma: start posting original content with links to blog posts

### 7.4 LinkedIn Content Engine

The /trend skill produces LinkedIn posts. Maintain 2-3 posts/week covering:
- AI implementation insights (positions as practitioner)
- Data from reports (positions as informed)
- Client wins/case studies when available (positions as proven)

---

## Implementation Priority Matrix

| Priority | Action | Impact | Effort | Timeline |
|----------|--------|--------|--------|----------|
| **P0** | Submit sitemap to GSC + Bing | Critical | 30 min | Today |
| **P0** | Fix all missing meta descriptions | High | 1 hour | Today |
| **P0** | Fix homepage title tag | High | 5 min | Today |
| **P1** | Build `/services/ai-implementation` | Very High | 1 day | Week 1 |
| **P1** | Build `/services/ai-for-law-firms` | Very High | 1 day | Week 1 |
| **P1** | Build `/services/ai-for-agencies` | Very High | 1 day | Week 2 |
| **P1** | Build `/services/ai-for-accountancy-firms` | Very High | 1 day | Week 2 |
| **P1** | Build `/pricing` | Very High | 1 day | Week 2 |
| **P1** | Add FAQPage schema to all FAQ content | High | 2 hours | Week 2 |
| **P1** | Noindex empty `/work` page | Medium | 5 min | Today |
| **P2** | Add BreadcrumbList schema sitewide | Medium | 2 hours | Week 3 |
| **P2** | Generate OG images for all pages | Medium | 1 day | Week 3 |
| **P2** | Write comparison blog posts (5x) | High | 1/week | Weeks 4-8 |
| **P2** | Build out pillar pages (3x) | High | 1/week | Weeks 8-10 |
| **P2** | Add Service schema to service pages | Medium | 1 hour | Week 3 |
| **P3** | Build AI Readiness Score tool | High | 3-5 days | Month 2 |
| **P3** | Build AI cost calculator tool | High | 2-3 days | Month 2 |
| **P3** | Digital PR outreach | Medium | Ongoing | Month 2+ |
| **P3** | Complete all cluster pages (15-18) | Very High | Ongoing | Months 2-4 |

---

## New Page Architecture (Target State)

After implementation, the site structure should be:

```
chrisgarlick.com/
├── / (homepage)
├── /services (services index)
│   ├── /services/ai-implementation (cross-sector)
│   ├── /services/ai-for-law-firms (Sarah persona)
│   ├── /services/ai-for-agencies (Tom persona)
│   └── /services/ai-for-accountancy-firms (David persona)
├── /pricing (investment/pricing page)
├── /work (case studies - unindex until populated)
├── /tools
│   ├── /tools/site-audit
│   ├── /tools/ai-readiness-score (future)
│   └── /tools/ai-cost-calculator (future)
├── /article (blog index)
│   ├── Cluster 1: AI for Law Firms (6 pages)
│   ├── Cluster 2: AI for Agencies (5 pages)
│   ├── Cluster 3: AI for Accountancy Firms (5 pages)
│   ├── Cluster 4: AI Implementation (7 pages - new)
│   └── Trend posts (ongoing, weekly)
├── /about
├── /contact
├── /privacy
└── /terms
```

**Current page count:** 14
**Target page count:** 45-50 (over 3-4 months)

---

## CTR Benchmarks to Track

| Metric | Current (estimate) | 3-Month Target | 6-Month Target |
|--------|-------------------|----------------|----------------|
| Avg CTR (all pages) | Unknown (no GSC data) | 4-6% | 8-12% |
| Impressions/month | ~0 (not indexed) | 500-1,000 | 3,000-5,000 |
| Clicks/month | ~0 | 30-60 | 200-400 |
| Rich results | 0 | 5-10 pages with FAQ rich results | All service + blog pages |
| Pages indexed | ~1 | 20+ | 40+ |

---

## Quick Reference: SEO Fields for Every New Page

Every page published must have these fields completed in the CMS:

```
SEO:
  metaTitle: [Under 60 chars, keyword near front]
  metaDescription: [Under 155 chars, benefit-led, includes CTA]
  focusKeyword: [Primary keyword this page targets]
  secondaryKeywords: [3-5 related terms, comma-separated]
  ogType: article (for blog) or website (for pages)
  twitterCard: summary_large_image
  robotsIndex: index
  robotsFollow: follow

Featured Image:
  [Upload 1920x1080 OG image via CMS media]
```

---

## What to Do Right Now (Today)

1. Submit sitemap to Google Search Console
2. Fix homepage title tag
3. Fix all missing meta descriptions
4. Noindex `/work` page
5. Start writing `/services/ai-implementation` - this is the single highest-value page that doesn't exist yet
