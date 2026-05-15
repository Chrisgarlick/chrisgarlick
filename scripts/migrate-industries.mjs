/**
 * Industries refactor migration.
 *
 *   1. Updates internal /services/ai-for-X links to /industries/ai-for-X on the
 *      four pages that reference them (ai-agents, data-extraction, services,
 *      workflow-automation).
 *   2. Creates the new industries landing page (slug: industries) with
 *      brand-voiced content.
 *
 * Idempotent. Re-running won't double-write or break existing data.
 *
 * Run: JWT_TOKEN=<token> bun scripts/migrate-industries.mjs
 */

const JWT = process.env.JWT_TOKEN
const BASE = process.env.CMS_API_BASE || 'https://chrisgarlick.com/api'
if (!JWT) { console.error('Set JWT_TOKEN'); process.exit(1) }
const auth = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${JWT}` }

const PAGES_WITH_LINKS = [
  'ai-agents',
  'data-extraction',
  'services',
  'workflow-automation',
]

const INDUSTRIES_SLUG = 'industries'

// ── helpers ─────────────────────────────────────────────────────────────────
const parse = (x) => typeof x === 'string' ? JSON.parse(x) : x

function rewriteContent(content) {
  const s = JSON.stringify(content)
  const rewritten = s.replaceAll('/services/ai-for-', '/industries/ai-for-')
  return JSON.parse(rewritten)
}

async function getPageBySlug(slug) {
  const res = await fetch(`${BASE}/page?where%5Bslug%5D=${slug}`, { headers: auth })
  if (!res.ok) throw new Error(`Fetch ${slug} failed: HTTP ${res.status}`)
  const json = await res.json()
  return (json.data || []).find((p) => p.slug === slug) || null
}

// ── step 1: rewrite internal links on the four pages ──────────────────────
console.log('Step 1: rewriting internal /services/ai-for-X links to /industries/ai-for-X')

for (const slug of PAGES_WITH_LINKS) {
  const page = await getPageBySlug(slug)
  if (!page) { console.log(`  ${slug} — not found, skip`); continue }

  const content = parse(page.content)
  const before = JSON.stringify(content)
  if (!before.includes('/services/ai-for-')) {
    console.log(`  ${slug} — already migrated, skip`)
    continue
  }

  const rewritten = rewriteContent(content)
  const res = await fetch(`${BASE}/page/${page.id}`, {
    method: 'PATCH',
    headers: auth,
    body: JSON.stringify({ content: rewritten }),
  })
  if (res.ok) console.log(`  ✓ ${slug}`)
  else {
    const err = await res.text().catch(() => '')
    console.error(`  ✗ ${slug} — HTTP ${res.status}: ${err.slice(0, 200)}`)
  }
}

// ── step 2: create the industries landing page ────────────────────────────
console.log('\nStep 2: creating /industries landing page')

const existing = await getPageBySlug(INDUSTRIES_SLUG)
if (existing) {
  console.log(`  industries page already exists (${existing.id}) — skipping create`)
  console.log('  (edit it via /admin/page if you want to change content)')
} else {
  const content = [
    {
      type: 'hero',
      fields: {
        label: 'Industries',
        heading: 'Vertical AI implementation. Built for how your sector actually works.',
        subtext: 'Off-the-shelf AI tools assume your work is generic. It isn\'t. Law firms read contracts, accountants reconcile statements, agencies juggle briefs. Different bottlenecks, different tools, different rules. I build for the specific shape of your day.',
        ctaLabel: 'Start with a free site audit',
        ctaUrl: '/tools/site-audit',
        ctaSecondaryLabel: 'Book a scoping call',
        ctaSecondaryUrl: '/contact',
      },
    },
    {
      type: 'text-section',
      fields: {
        label: 'Why this exists',
        heading: 'Most AI advice is industry-blind. That\'s where it fails.',
        body: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: 'Generic AI tools promise to summarise emails, draft replies, extract data. In the abstract, that sounds useful. In practice, the rules are sector-specific. A summary fine for a marketing email is wrong for a contract clause. An extraction pipeline that handles invoices won\'t touch a court bundle.' },
              ],
            },
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: 'The work I do starts with how your industry actually operates. What gets read, what gets produced, what gets reviewed, what gets billed. The AI is the easy part. Knowing where to point it is the work.' },
              ],
            },
          ],
        },
      },
    },
    {
      type: 'text-section',
      fields: {
        label: 'Sector 01',
        heading: 'AI for Law Firms',
        ctaLabel: 'See AI for Law Firms →',
        ctaUrl: '/industries/ai-for-law-firms',
        body: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: 'Solicitors, conveyancers, family practices and boutique commercial firms. Document-heavy work, regulated record-keeping, matter management on Clio, Actionstep or Insight. I build extraction pipelines for contracts and disclosure bundles, intake automations that capture client details once, and review assistants that flag risk against your house style.' },
              ],
            },
          ],
        },
      },
    },
    {
      type: 'text-section',
      fields: {
        label: 'Sector 02',
        heading: 'AI for Accountancy Firms',
        ctaLabel: 'See AI for Accountancy →',
        ctaUrl: '/industries/ai-for-accountancy-firms',
        body: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: 'Small and mid-sized practices running on Xero, QuickBooks, FreeAgent or Sage. The hours bleed in two places. Client onboarding, gathering ID, prior-year accounts, scope letters. And statement processing, bank reconciliation, receipt classification, expense matching. I build pipelines that read the documents, extract the structured fields, and write clean data straight into your ledger.' },
              ],
            },
          ],
        },
      },
    },
    {
      type: 'text-section',
      fields: {
        label: 'Sector 03',
        heading: 'AI for Agencies',
        ctaLabel: 'See AI for Agencies →',
        ctaUrl: '/industries/ai-for-agencies',
        body: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: 'Marketing, design and content agencies with five to fifty staff. The shape is always the same. Briefs arrive in seven different formats. Status updates eat the project managers. Client reporting eats the seniors. I build brief processors that turn an inbox into structured project briefs, status assistants that draft updates from your project tooling, and reporting pipelines that pull GA4, Search Console and ad platforms into one client deck.' },
              ],
            },
          ],
        },
      },
    },
    {
      type: 'text-section',
      fields: {
        label: 'Working in a different sector?',
        heading: 'The methodology travels. The detail doesn\'t.',
        body: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: 'These three industries are the ones I\'ve built the most for, so the pages exist. The pattern is the same across professional services. Map the workflow, find where the human time leaks, decide whether extraction, workflow or agent shape fixes it.' },
              ],
            },
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: 'If you\'re in finance, legal services, surveying, insurance, or any other sector running on documents and approvals, the audit will tell us quickly whether there\'s a build worth doing.' },
              ],
            },
          ],
        },
      },
    },
    {
      type: 'cta',
      fields: {
        heading: 'Not sure where to start?',
        body: 'The free site audit takes 30 seconds. Tell me what your week looks like and I\'ll send back a written assessment of which workflows would benefit most from automation.',
        ctaLabel: 'Run a free site audit',
        ctaUrl: '/tools/site-audit',
      },
    },
  ]

  const seo = {
    metaTitle: 'AI Implementation by Industry | Chris Garlick',
    metaDescription: 'Vertical-specific AI builds for law firms, accountancy practices and agencies. Solo developer, UK-based, fixed pricing. Pick your industry to see what gets automated.',
    focusKeyword: 'AI implementation by industry',
    secondaryKeywords: 'vertical AI, AI for professional services, AI for UK businesses, sector-specific AI',
    ogType: 'website',
    ogTitle: 'AI Implementation by Industry',
    ogDescription: 'Vertical-specific AI builds for law firms, accountancy and agencies.',
  }

  const res = await fetch(`${BASE}/page`, {
    method: 'POST',
    headers: auth,
    body: JSON.stringify({
      title: 'Industries',
      slug: INDUSTRIES_SLUG,
      status: 'published',
      content,
      seo,
    }),
  })
  if (res.ok) {
    const created = await res.json()
    const newId = created.data?.id
    console.log(`  ✓ created industries page (${newId})`)
    // Kritano ignores status on create; explicit publish endpoint is required.
    const pub = await fetch(`${BASE}/page/${newId}/publish`, { method: 'POST', headers: auth })
    if (pub.ok) console.log('  ✓ published')
    else console.error(`  ✗ publish failed — HTTP ${pub.status}`)
  } else {
    const err = await res.text().catch(() => '')
    console.error(`  ✗ create failed — HTTP ${res.status}: ${err.slice(0, 400)}`)
  }
}

console.log('\nDone.')
