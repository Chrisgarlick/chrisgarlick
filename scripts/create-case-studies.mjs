/**
 * Create case studies for the /work page.
 * Run: JWT_TOKEN=<token> node scripts/create-case-studies.mjs
 */

const JWT = process.env.JWT_TOKEN
const BASE = 'https://chrisgarlick.com/api'
if (!JWT) { console.error('Set JWT_TOKEN'); process.exit(1) }

const t = (text) => ({ type: 'text', text })
const bold = (text) => ({ type: 'text', text, marks: [{ type: 'bold' }] })
const link = (text, href) => ({ type: 'text', text, marks: [{ type: 'link', attrs: { href, target: null } }] })
const p = (content) => ({ type: 'paragraph', content: Array.isArray(content) ? content : [t(content)] })
const h2 = (text) => ({ type: 'heading', attrs: { level: 2 }, content: [t(text)] } )
const h3 = (text) => ({ type: 'heading', attrs: { level: 3 }, content: [t(text)] })

async function createCaseStudy(data) {
  const res = await fetch(`${BASE}/caseStudy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${JWT}` },
    body: JSON.stringify(data),
  })
  const result = await res.json()
  if (!res.ok) { console.error(`FAIL: ${data.title}`, result); return }
  const id = result.data.id
  console.log(`Created: ${data.title} (${id})`)

  // Publish
  const pub = await fetch(`${BASE}/caseStudy/${id}/publish`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${JWT}` },
  })
  console.log(`  ${pub.ok ? 'Published' : 'Publish failed'}`)
}

// ─── Case Study 1: How One Developer Delivers Like a Team ───

await createCaseStudy({
  title: 'How One Developer Delivers Like a Full Team',
  slug: 'ai-integrated-delivery-how-one-operator-delivers-like-a-team',
  category: 'Internal',
  result: 'Full-stack delivery from a solo operator',
  summary: 'How proprietary AI tooling lets one developer handle strategy, design, development, content, SEO, and QA - delivering what would normally require a 6-8 person team.',
  duration: 'Ongoing',
  tier: 'Build + Retainer',
  body: { type: 'doc', content: [
    h2('The Challenge'),
    p('Professional service firms need more than just code. A real engagement requires strategy, system design, frontend and backend development, content, SEO, quality assurance, and ongoing operations. Traditionally, that means hiring an agency with 6-8 specialists - or accepting that a solo developer can only cover part of the picture.'),
    p('The question I set out to solve: can one developer, with the right infrastructure, deliver the full scope of what a team normally produces?'),

    h2('The Approach'),
    p([
      t('I built a proprietary AI-integrated delivery system that extends my capabilities across every discipline a project needs. It\'s not one tool - it\'s an orchestrated set of purpose-built systems, each handling a specific part of the delivery process.')
    ]),

    h3('What the system covers'),
    p([bold('Strategy and positioning.'), t(' Before any code gets written, the system helps me analyse the competitive landscape, define positioning, and build detailed audience personas. Every project starts with a clear understanding of who it\'s for and why it matters.')]),
    p([bold('Product and architecture.'), t(' Feature specifications, user stories, technical architecture - the system produces structured documentation that keeps the build focused on what matters. No scope creep. No building features nobody asked for.')]),
    p([bold('Design.'), t(' Visual identity, design systems, component specifications. The system generates brand-consistent design decisions based on the strategy - so the visual language matches the positioning, not just whatever looks nice.')]),
    p([bold('Software engineering.'), t(' This is still where I spend most of my time. The system handles scaffolding, repetitive patterns, and test generation. I focus on the architecture decisions, complex logic, and integration work that actually requires human judgement.')]),
    p([bold('Content and SEO.'), t(' Website copy, blog content, keyword strategy, topic clusters, on-page optimisation. The system produces content in a consistent brand voice and structures it for search visibility from day one.')]),
    p([bold('Quality assurance.'), t(' Automated testing, accessibility audits, performance checks, design compliance verification. The system catches issues before they reach production - and before they reach clients.')]),

    h2('How It Works in Practice'),
    p('Each project follows the same discipline: strategy first, then product definition, then design, then build, then content, then QA. The system enforces this sequence - you can\'t skip steps or build before the strategy is defined.'),
    p('The key is that each stage produces structured artifacts that the next stage consumes. The design system references the brand strategy. The software reads the design system. The content follows the SEO strategy. Everything is connected, not siloed.'),
    p('This isn\'t about AI replacing human work. It\'s about AI handling the 60% of each discipline that\'s systematic and predictable, so I can focus the remaining 40% on the decisions that actually require experience and judgement.'),

    h2('The Result'),
    p([t('A single developer delivering the output of a multi-person team - not by cutting corners, but by using purpose-built tooling that handles the systematic work. Every project ships with strategy, design, software, content, and QA. Not as afterthoughts - as integrated parts of a single delivery process.')]),
    p('The site you\'re reading right now was built this way. The CMS, the design system, the content, the SEO - all produced through this integrated approach.'),

    h2('Why This Matters for Clients'),
    p([bold('No handoff gaps.'), t(' When one person coordinates everything with integrated tooling, nothing falls between the cracks. The design matches the strategy. The code matches the design. The content matches the SEO plan.')]),
    p([bold('Faster delivery.'), t(' No meetings between departments. No waiting for another team\'s availability. No miscommunication between designers and developers. One person, one process, one output.')]),
    p([bold('Consistency.'), t(' Every deliverable comes from the same system with the same standards. There\'s no variation between a "good" designer and a "less good" one. The quality bar is built into the tooling.')]),
    p([bold('Lower cost.'), t(' You\'re not paying for an account manager, a project manager, a strategist, two developers, a designer, and a copywriter. You\'re paying for one developer with infrastructure that multiplies output.')]),

    p([t('This is how I work on every engagement. If you want to see what this approach could do for your business, '), link('get in touch', '/contact'), t('.')]),
  ] },
  seo: {
    metaTitle: 'How One Developer Delivers Like a Full Team | Chris Garlick',
    metaDescription: 'How proprietary AI tooling lets a solo developer deliver strategy, design, software, content, SEO, and QA - the output of a 6-8 person team.',
    focusKeyword: 'solo ai developer',
    secondaryKeywords: 'ai integrated delivery, solo operator, proprietary ai tools, one developer full team',
    ogType: 'article',
    twitterCard: 'summary_large_image',
    robotsIndex: 'index',
    robotsFollow: 'follow',
  },
})

// ─── Case Study 2: Kritano CMS ───

await createCaseStudy({
  title: 'Kritano CMS: Built from Scratch to Run Client Projects',
  slug: 'kritano-cms',
  category: 'Internal',
  result: 'Purpose-built CMS powering every project',
  summary: 'Why I built my own content management system instead of using WordPress, and how it gives clients faster sites, better SEO, and lower maintenance overhead.',
  duration: '6 months initial build',
  tier: 'Build + Retainer',
  body: { type: 'doc', content: [
    h2('The Challenge'),
    p('Every web project needs a CMS. WordPress powers 40% of the web, but it comes with baggage: plugin bloat, security vulnerabilities, performance overhead, and a maintenance burden that never ends. For the kind of projects I build - fast, secure, SEO-optimised sites for professional service firms - WordPress was holding me back more than it was helping.'),
    p('I needed a CMS that was fast by default, secure by design, built for the content structures my clients actually need, and simple enough that non-technical users could manage their own content without training.'),

    h2('The Approach'),
    p('I built Kritano CMS from the ground up. Not a fork of an existing project. Not a wrapper around a headless CMS. A purpose-built system designed specifically for the kinds of sites I deliver.'),

    h3('Architecture decisions'),
    p([bold('Static-first rendering.'), t(' Pages are pre-built at deploy time, not generated on each request. This means sub-second load times with zero server processing for visitors. No caching plugins needed. No CDN configuration. Fast by default.')]),
    p([bold('Block-based content.'), t(' Instead of a single rich text field for everything, content is structured into blocks: heroes, text sections, columns, CTAs, forms. Each block type has defined fields. This means content always looks right - there\'s no way to break the layout by pasting from Word.')]),
    p([bold('Built-in SEO.'), t(' Every page and article has structured SEO fields: meta title, description, focus keyword, secondary keywords, OG image, robots directives. Not a plugin that might conflict with something else. Built into the core.')]),
    p([bold('API-first.'), t(' Every piece of content is accessible via a REST API. This means content can be consumed by the website, by automation scripts, by mobile apps - whatever the project needs. The CMS is the single source of truth.')]),

    h2('What Clients Get'),
    p([bold('Speed.'), t(' Kritano-powered sites consistently score 95+ on Google PageSpeed Insights. Not because of optimisation tricks - because the architecture is fast by default. Static HTML, optimised images, minimal JavaScript.')]),
    p([bold('Security.'), t(' No public-facing PHP. No plugin vulnerabilities. No database exposed to the web. The admin panel is authenticated, the API is permissioned, and the public site is static files. The attack surface is minimal.')]),
    p([bold('Simplicity.'), t(' The admin interface is clean and focused. Create a page, add blocks, fill in the fields, publish. No widget areas, no shortcodes, no 47 settings panels. Clients manage their own content without needing me for every text change.')]),
    p([bold('Lower ongoing costs.'), t(' No WordPress hosting requirements. No plugin licences. No security patching. The maintenance overhead is a fraction of what a WordPress site demands.')]),

    h2('The Result'),
    p([t('The site you\'re reading runs on Kritano CMS. So does every client project I deliver. It\'s '), link('open source on GitHub', 'https://github.com/Kritano/Kritano-cms'), t(' - you can inspect the code yourself.')]),
    p('Building your own CMS sounds excessive until you realise that most of the cost and frustration in web projects comes from fighting the platform. Remove that friction and everything gets faster: development, content management, deployment, maintenance.'),
    p([t('If you want a site built on Kritano, '), link('get in touch', '/contact'), t('. Every project I deliver runs on it.')]),
  ] },
  seo: {
    metaTitle: 'Kritano CMS: Purpose-Built for Professional Service Firms',
    metaDescription: 'Why I built my own CMS instead of using WordPress, and how it delivers faster sites, better SEO, and lower maintenance for professional service firms.',
    focusKeyword: 'custom cms for business',
    secondaryKeywords: 'kritano cms, purpose built cms, wordpress alternative business, fast cms, headless cms uk',
    ogType: 'article',
    twitterCard: 'summary_large_image',
    robotsIndex: 'index',
    robotsFollow: 'follow',
  },
})

console.log('\nDone! Both case studies created and published.')
console.log('  /work/ai-integrated-delivery-how-one-operator-delivers-like-a-team')
console.log('  /work/kritano-cms')
