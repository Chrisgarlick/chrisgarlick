<!-- Version: 1 | Department: seo | Updated: 2026-05-02 -->

# Technical SEO Requirements

## robots.txt

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: https://chrisgarlick.com/sitemap.xml
```

## sitemap.xml

- Auto-generated at build time (@astrojs/sitemap)
- Include: /, /about, /work, /work/[slug], /blog, /blog/[slug], /apply
- Exclude: /admin/*, /api/*
- Set `<lastmod>` from CMS publishedAt/updatedAt
- Priority: homepage 1.0, /work and /blog 0.8, posts/cases 0.7, /about and /apply 0.6

## Schema Markup (JSON-LD)

### Homepage — ProfessionalService

```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Chris Garlick",
  "description": "AI Workflow Partner for professional services and agencies.",
  "url": "https://chrisgarlick.com",
  "founder": {
    "@type": "Person",
    "name": "Chris Garlick",
    "jobTitle": "AI Workflow Partner",
    "url": "https://chrisgarlick.com/about"
  },
  "areaServed": { "@type": "Country", "name": "United Kingdom" },
  "serviceType": ["AI Implementation", "AI Workflow Automation"],
  "priceRange": "£5,000 - £8,000",
  "sameAs": [
    "https://www.linkedin.com/in/chrisgarlick",
    "https://github.com/Kritano"
  ]
}
```

### Blog Posts — Article

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{{title}}",
  "description": "{{excerpt}}",
  "author": { "@type": "Person", "name": "Chris Garlick", "url": "https://chrisgarlick.com/about" },
  "publisher": { "@type": "Person", "name": "Chris Garlick" },
  "datePublished": "{{publishedAt}}",
  "dateModified": "{{updatedAt}}",
  "mainEntityOfPage": { "@type": "WebPage", "@id": "https://chrisgarlick.com/blog/{{slug}}" }
}
```

### Case Studies — CreativeWork

```json
{
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "{{title}}",
  "description": "{{summary}}",
  "author": { "@type": "Person", "name": "Chris Garlick" },
  "datePublished": "{{publishedAt}}"
}
```

### About — Person

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Chris Garlick",
  "jobTitle": "AI Workflow Partner",
  "url": "https://chrisgarlick.com/about",
  "knowsAbout": ["Artificial Intelligence", "Workflow Automation", "Legal Technology", "Accounting Technology"],
  "sameAs": ["https://www.linkedin.com/in/chrisgarlick", "https://github.com/Kritano"]
}
```

### FAQ Pages — FAQPage

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much does AI implementation cost for a law firm?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A typical AI implementation project costs £5,000-£8,000 for the initial build, with optional maintenance at £3,000-£6,000 per month."
      }
    }
  ]
}
```

## Core Web Vitals Targets

| Metric | Target |
|--------|--------|
| LCP | < 1.5s |
| INP | < 100ms |
| CLS | < 0.05 |
| TTFB | < 200ms |
| FCP | < 1.0s |

## Open Graph / Twitter Cards

Every page:
```html
<meta property="og:title" content="{{title}}" />
<meta property="og:description" content="{{meta description}}" />
<meta property="og:url" content="https://chrisgarlick.com{{path}}" />
<meta property="og:type" content="website" />
<meta property="og:image" content="https://chrisgarlick.com/og/{{slug}}.png" />
<meta property="og:locale" content="en_GB" />
<meta property="og:site_name" content="Chris Garlick" />
<meta name="twitter:card" content="summary_large_image" />
```

Blog posts additionally: `article:published_time`, `article:author`

## Canonical URLs

- Every page: `<link rel="canonical" href="https://chrisgarlick.com{{path}}" />`
- No trailing slash convention — enforce with redirects
- Category filter URLs on /work: canonical points to /work (not filtered URL)
