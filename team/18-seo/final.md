<!-- Version: 1 | Department: seo | Updated: 2026-05-02 -->

# SEO — Final Output

## Executive Summary

The SEO strategy targets UK-specific queries around AI implementation for professional services and agencies. 34 target keywords identified, prioritised bottom-up (BOFU/MOFU before TOFU). Three topic clusters built around the three target sectors: law firms, agencies, and accountancy firms — each with a pillar page and 4-6 cluster pages.

Technical SEO is straightforward given Astro's SSG architecture — the main requirements are schema markup (JSON-LD per page type), sitemap generation, robots.txt configuration (explicitly allowing AI bot crawlers), and Open Graph tags. Core Web Vitals targets are aggressive but achievable with SSG and no hero images.

The AEO strategy focuses on content structure that AI models can extract from: direct answers first, definition patterns, comparison tables, FAQ sections, and short paragraphs. Off-page strategy centres on guest posting in sector-specific UK publications (Legal Futures, AccountingWEB, The Drum) and leveraging the Kritano CMS GitHub repo as a high-trust citation source.

## Key Decisions & Recommendations

- Bottom-up priority: BOFU and MOFU keywords first, TOFU later
- Launch with 2 blog posts: 1 from law firm cluster, 1 from agency cluster
- Build pillar pages in months 2-3, not at launch
- Allow AI bot crawlers explicitly in robots.txt (GPTBot, ClaudeBot, PerplexityBot, Google-Extended)
- No trailing slash convention — enforce with redirects
- Every blog post must have: Key Takeaways block, author attribution, links to /apply and a case study
- Schema markup: ProfessionalService (homepage), Article (blog), CreativeWork (case studies), Person (about), FAQPage (pillar pages)

## Dependencies & Handoffs

**For Software:** Implement everything in technical-seo.md — robots.txt, sitemap, schema markup JSON-LD, OG tags, canonical URLs, font preloading for CLS. Read on-page-spec.md for title tags and meta descriptions per page.

**For Content:** Read keyword-strategy.md and topic-clusters.md before writing any blog posts. Each post targets a specific keyword. Follow AEO content structure rules from ai-seo.md.

**For Growth:** Read off-page-strategy.md for link building targets and digital PR angles.

## Open Questions & Risks

1. Keyword difficulty estimates are based on general assessment, not tool data — validate with Ahrefs/SEMrush if available
2. New domain authority means ranking will take time — long-tail keywords are the realistic early wins
3. AI engine citation is unpredictable — focus on creating citable content structure, not gaming specific models
