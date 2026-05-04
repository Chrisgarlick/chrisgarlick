# QA Checklist

Everything in this file must be tested by QA. Each department appends its
items as it completes. QA tests every line — no exceptions.

---

## Strategy

- [ ] Hero headline communicates "AI systems for businesses" — not "AI consultant" or "AI developer"
- [ ] The phrase "AI Workflow Partner" or equivalent appears in the hero label or meta title
- [ ] No use of the words "consultant", "consultancy", or "agency" in self-description anywhere on the site
- [ ] The term "Scalar" does not appear anywhere on the public site
- [ ] "Solo operator" framing is present on About page — no implication of a team of humans
- [ ] "Built on Kritano CMS" appears in the footer or a visible location
- [ ] Pricing is visible on the homepage: Build £5k-8k and Retainer £3k-6k/mo
- [ ] Legal sector is referenced in at least one case study and one blog post
- [ ] Agency sector is referenced in at least one case study or blog post
- [ ] Case study format follows Problem > Architecture > Outcome structure
- [ ] No jargon that only developers would understand in client-facing copy
- [ ] Apply form does NOT include a budget field
- [ ] At least one mention of proprietary tooling (Kritano) on the homepage
- [ ] Process proof elements visible in case studies (architecture diagrams, quantified outcomes)
- [ ] No testimonials or fake social proof
- [ ] CTA uses "Apply to work together" consistently (not "Contact us")
- [ ] Apply page sets expectation: "2 working days" response time
- [ ] No stock photography anywhere on the site
- [ ] Meta title on homepage: "Chris Garlick — AI Implementation Partner" or close variant
- [ ] JSON-LD Person schema on /about includes "AI Implementation Partner" as jobTitle
- [ ] Blog posts answer the core question within the first 150 words

## Marketing

- [ ] No instance of "we" or "our" on any public page — must be "I" / "my"
- [ ] No instance of "clients" or "customers" — prospects addressed as "you"
- [ ] No banned words: synergy, leverage (verb), unlock, empower, transform, journey, ecosystem, disruption, game-changer, next-level, cutting-edge
- [ ] No rhetorical questions used as section headings
- [ ] No exclamation marks on any page
- [ ] All prices shown as fixed fees (£5k-8k, £3k-6k/mo), not day rates
- [ ] Background colour is #0A0A0A on all pages
- [ ] No blue, purple, or green colours anywhere
- [ ] No gradients used anywhere
- [ ] Accent colour (#E8D5A3) used only for CTAs, key metrics, CG monogram, links
- [ ] Headlines use Instrument Serif, body uses DM Mono — no other fonts loaded
- [ ] No rounded corners larger than 4px
- [ ] Content max-width 720px for reading, 1100px for full-bleed
- [ ] Mobile layout functional at 375px width
- [ ] CG monogram in accent gold, top-left nav
- [ ] Instrument Serif loads correctly
- [ ] DM Mono loads correctly
- [ ] No font size below 14px
- [ ] Body text line-height between 1.7 and 1.8
- [ ] "Kritano" always capitalised
- [ ] "Kritano CMS" always two words (never just "CMS")
- [ ] Chris's title consistently "AI Workflow Partner" across nav, footer, meta, structured data
- [ ] Form submission on /apply shows inline confirmation message
- [ ] 404 page styled and on-brand

## SEO

- [ ] Every page has unique `<title>` under 60 chars
- [ ] Every page has unique `<meta name="description">` under 155 chars
- [ ] Every page has `<link rel="canonical">` with correct absolute URL
- [ ] No duplicate title tags across pages
- [ ] No duplicate meta descriptions across pages
- [ ] OG tags (og:title, og:description, og:url, og:image, og:type) on every page
- [ ] Twitter Card tags on every page
- [ ] og:locale set to en_GB
- [ ] Every page has exactly one H1 tag
- [ ] Heading hierarchy sequential (no skipping H1 to H3)
- [ ] Homepage has ProfessionalService JSON-LD
- [ ] Blog posts have Article JSON-LD
- [ ] Case studies have CreativeWork JSON-LD
- [ ] About page has Person JSON-LD with jobTitle "AI Workflow Partner"
- [ ] All JSON-LD validates without errors
- [ ] robots.txt accessible at /robots.txt with correct directives
- [ ] sitemap.xml accessible at /sitemap.xml listing all public pages
- [ ] AI bot user agents allowed in robots.txt (GPTBot, ClaudeBot, PerplexityBot)
- [ ] 404 page returns proper 404 HTTP status code
- [ ] All internal links return 200 status codes
- [ ] Images have alt attributes
- [ ] Fonts preloaded to prevent CLS
- [ ] LCP < 1.5s on mobile
- [ ] Total page weight < 500KB
- [ ] Every blog post has Key Takeaways section near top
- [ ] Every blog post shows author name with link to /about
- [ ] Every blog post links to /apply
- [ ] Every blog post links to at least one case study
- [ ] FAQ sections use proper heading structure

## Content

- [ ] All copy uses first person ("I"), never "we"
- [ ] No banned words anywhere on the site (synergy, leverage, unlock, empower, transform, journey, ecosystem, disruption, game-changer, next-level, cutting-edge)
- [ ] No rhetorical questions as headlines
- [ ] No exclamation marks on any page
- [ ] British English spelling throughout (colour, optimise, analyse)
- [ ] Chris's title is "AI Workflow Partner" — not consultant, developer, freelancer
- [ ] "Kritano" always capitalised, "Kritano CMS" always two words
- [ ] Pricing matches constants: Build £5,000–£8,000, Retainer £3,000–£6,000/mo
- [ ] Response time stated as "2 working days" wherever it appears
- [ ] About page is 300 words or fewer
- [ ] Apply success message confirms 2 working day response time
- [ ] Apply error message includes fallback email chris@chrisgarlick.com
- [ ] Blog posts answer core question within first 150 words
- [ ] Blog posts have Key Takeaways near top
- [ ] Blog posts have FAQ sections
- [ ] Blog posts link to /apply and at least one case study
- [ ] Footer includes "Built on Kritano CMS"

## Legal

- [ ] Privacy policy accessible at a permanent URL
- [ ] Terms of service accessible at a permanent URL
- [ ] Both linked from site footer
- [ ] Privacy policy link near the application form
- [ ] "Last updated" date visible on both legal pages
- [ ] Contact email correct and clickable on both pages
- [ ] Form submits over HTTPS only
- [ ] No cookies set on any page (verify in DevTools)
- [ ] No third-party tracking scripts loaded
- [ ] No cookie banner present (correct — none needed)
- [ ] All form fields have visible labels
- [ ] Page language set to en-GB in html tag
