# Search Strategy — IG Prospect Discovery

This is the query playbook used by the `/prospects` skill. The job is to discover businesses of a given type in a given location, prioritising businesses likely to be active on Instagram.

## Universal queries (run for every prospect type)

Replace `{type}` and `{location}` with the parsed values. Run 3 to 4 of these.

1. `"{type}" "{location}"`
2. `"{type}" "{location}" instagram`
3. `best {type} {location}`
4. `top {type} {location} 2026`
5. `{type} {location} directory`
6. `{type} near {location}`

## Type-specific extras

Pick 2 to 4 of these depending on what `{type}` resolves to.

### Agencies (marketing, digital, web design, creative)

- `site:clutch.co {type} {location}`
- `site:thedrum.com {location} agency`
- `"creative agency" {location} instagram`
- `"design studio" {location}`
- `independent agency {location}`

### Coaches & consultants

- `"business coach" {location} instagram`
- `"{specialism} coach" {location}`  (life, mindset, executive, leadership)
- `"consultant" {location} "instagram.com"`

### Freelancers

- `"freelance {specialism}" {location}`  (developer, designer, SEO, copywriter)
- `site:peopleperhour.com {specialism} {location}`
- `independent {specialism} {location}`
- `"available for projects" {location} {specialism}`

### Professional services (solicitors, accountants, architects, financial advisors)

- `"{type} firm" {location}`
- `"{type} practice" {location}`
- `site:yell.com {type} {location}`
- `top {type} {location} review`

### Local / trades (dentists, builders, plumbers, electricians, estate agents)

- `site:yell.com {type} {location}`
- `"{type}" {location} reviews`
- `local {type} {location} website`
- `recommended {type} {location}`

### Ecommerce (Shopify, WooCommerce, fashion, beauty, homeware, food)

- `"{niche}" online shop {location}`
- `"{niche}" Shopify store {location}`
- `independent {niche} brand {location}`
- `British {niche} brand instagram`
- `small {niche} business {location}`

## Directory pages worth fetching

When a directory or listicle page shows up in results, fetch the full page with WebFetch. These usually yield 10 to 50 extra domains each.

- Yell.com — UK-wide, every sector
- Google Maps results (the local pack)
- Clutch.co — agencies
- The Drum — agencies, UK marketing
- Bark.com — local services
- Peopleperhour — freelancers
- The Manifest, DesignRush, GoodFirms — agencies
- Industry-specific directories (e.g. RICS for surveyors, Solicitors Regulation Authority for law firms, ICAEW for accountants)

## What to skip

Drop these from candidate lists before checking:

- Social media URLs (instagram.com, facebook.com, linkedin.com, tiktok.com — except when the IG URL IS the only signal of an otherwise unknown business)
- Marketplaces: amazon, ebay, etsy, notonthehighstreet
- Directory homepages (yell.com root, clutch.co root) — the directory itself isn't a prospect
- Generic platforms (wordpress.com, wix.com, squarespace.com root domains)
- Government & regulator domains (.gov.uk, .org.uk regulators)
- Wikipedia, Quora, Reddit threads (use as discovery but not as prospects)

## When the type is unknown / unusual

If the user passes a phrase you don't recognise (e.g. "vegan bakeries", "yoga studios", "boutique gyms"):

1. Use the universal queries with the phrase verbatim
2. Pick the closest type-specific extras (a vegan bakery is closest to ecommerce + local; a yoga studio is closest to local + coaches)
3. Run one extra query: `"{phrase}" {location} site:instagram.com` — direct IG discovery

## Output

Append discovered domains to `docs/prospects/<type-slug>-<location-slug>-<YYYY-MM-DD>/raw-domains.txt`, one per line, lowercase, no `www.` prefix, root domain only.
