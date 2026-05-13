/**
 * Phase 2 steps 6: rebuild /about around one-person positioning + add pricing anchor to /contact.
 *
 * Run: JWT_TOKEN=<token> bun scripts/rebuild-about-contact.mjs
 */

const JWT = process.env.JWT_TOKEN
const BASE = process.env.CMS_API_BASE || 'https://chrisgarlick.com/api'
if (!JWT) { console.error('Set JWT_TOKEN'); process.exit(1) }
const auth = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${JWT}` }

const t    = (text) => ({ type: 'text', text })
const bold = (text) => ({ type: 'text', text, marks: [{ type: 'bold' }] })
const link = (text, href) => ({ type: 'text', text, marks: [{ type: 'link', attrs: { href, target: null } }] })
const p    = (...parts) => ({ type: 'paragraph', content: parts.flatMap(part => Array.isArray(part) ? part : [typeof part === 'string' ? t(part) : part]) })
const ul   = (...items) => ({ type: 'bulletList', content: items.map(line => ({ type: 'listItem', content: [Array.isArray(line) ? p(...line) : p(line)] })) })
const ol   = (...items) => ({ type: 'orderedList', content: items.map(line => ({ type: 'listItem', content: [Array.isArray(line) ? p(...line) : p(line)] })), attrs: { start: 1 } })
const doc  = (...nodes) => ({ type: 'doc', content: nodes })
const id   = () => crypto.randomUUID()

const hero        = (fields) => ({ id: id(), type: 'hero',         fields })
const textSection = (fields) => ({ id: id(), type: 'text-section', fields })
const columns     = (fields) => ({ id: id(), type: 'columns',      fields })
const cta         = (fields) => ({ id: id(), type: 'cta',          fields })
const richText    = (body) => ({ id: id(), type: 'rich-text',     fields: { body } })

// ───────────────────────────────────────────────────────────────────────
//   /about
// ───────────────────────────────────────────────────────────────────────

const about = {
  id: 'f25d3bdd-82ae-45c8-b01f-d6275b32337a',
  title: 'About',
  content: [
    hero({
      label: 'About',
      heading: 'One person. Direct execution. No agency in the middle.',
      subtext: 'I build the systems clients hire me to build &mdash; from audit to scoping to code to handover. No account managers, no junior handoffs, no brief-to-delivery translation loss. The work goes from me to you.',
      ctaLabel: 'Book a scoping call',
      ctaUrl: '/contact',
      ctaSecondaryLabel: 'Run a free site audit',
      ctaSecondaryUrl: '/tools/site-audit',
    }),

    textSection({
      label: 'Who I am',
      heading: 'A software developer who happens to build AI implementations.',
      body: doc(
        p('I\'m a software developer based in the UK. Most of my career has been building web platforms — Astro, Next.js, Node.js, Postgres, Redis — the kind of work where you have to ship something that holds up under real load. I started doing AI implementation work in 2023 because the API surface got good enough to be the missing piece in a lot of the systems I was already building.'),
        p('What that means for clients: when I say "I\'ll integrate this with your CRM and your accounting tool", I mean I\'ll integrate it. Not specify it for someone else. Not draw it on a slide. Build it, ship it, monitor it, fix it when it breaks.'),
      ),
    }),

    textSection({
      label: 'Why one person',
      heading: 'The one-person model is the feature, not the limitation.',
      body: doc(
        p('Most "AI consultancies" run on the same shape: senior partner sells, project manager translates, junior delivers. By the time the work lands, three people have been between you and the person who actually built it. The deliverable suffers, the timeline stretches, the bill goes up.'),
        p('When you hire me, the person scoping the work is the person doing the work. That has practical effects:'),
        ul(
          [bold('Faster decisions'), ' — if a build choice needs your input, I ask you directly. No "let me check with the team."'],
          [bold('Direct access'), ' — you can WhatsApp me a question about something the system\'s doing and I\'ll answer it the same day, in technical detail if you want it.'],
          [bold('Smaller surface area'), ' — fewer hands on the work means fewer places quality leaks. The system you get is opinionated and consistent because one person wrote it.'],
          [bold('Lower cost'), ' — no agency overhead. The price you pay reflects the work, not the org chart.'],
        ),
        p('What you don\'t get: a 24/7 support desk, multi-office presence, a "scale-up partner" with twelve specialisms. If you need those, you need an agency. For everything else, the one-person setup is faster and cleaner.'),
      ),
    }),

    textSection({
      label: 'How I work',
      heading: 'Four phases, no theatre.',
      body: doc(
        ol(
          [bold('Audit'), ' — I look at what your team actually does day-to-day. Not a workshop, not a survey. Output: a written report of the workflows worth automating, ranked by ROI.'],
          [bold('Scope'), ' — we agree the single workflow to build first. I write the spec: success criteria, stack, timeline, fixed price. You sign or you don\'t.'],
          [bold('Build'), ' — direct work, 2&ndash;6 weeks depending on complexity. You can ask me anything technical any time. No status meetings for the sake of them.'],
          [bold('Measure'), ' — once it ships, we measure. Time saved, error rate, throughput. Short retrospective. Then we decide whether there\'s a phase two.'],
        ),
        p('Pricing: engagements start at £500 for a focused bottleneck fix. Workflow automation builds with one or two integrations typically land between £2,000 and £8,000. Larger agent systems and ongoing retainers are quoted per project after scoping. ', link('Detail on pricing', '/contact'), '.'),
      ),
    }),

    columns({
      label: 'What I use',
      heading: 'Stack — no black boxes, no proprietary lock-in.',
      column1Heading: 'AI / Language',
      column1Body: 'Anthropic Claude (Sonnet for output, Haiku for orchestration). Structured outputs, prompt versioning, observability built in. UK/EU API regions where data residency matters.',
      column2Heading: 'Build',
      column2Body: 'TypeScript, Node.js, Bun. Astro and Next.js on the frontend. Postgres and Redis where state matters. Playwright for the messy real-world automation work.',
      column3Heading: 'Integrations',
      column3Body: 'Whatever your team already uses — Microsoft 365, Google Workspace, Notion, Airtable, Xero, QuickBooks, Clio, HubSpot, ClickUp, Linear. Direct API integrations, not no-code platforms.',
    }),

    cta({
      heading: 'Got a workflow in mind?',
      body: 'The fastest way to find out if I can help is a 30-minute scoping call. Bring the workflow, the volume, and the rough cost in hours. I\'ll tell you whether a build is the right answer. If it isn\'t, I\'ll say so.',
      ctaLabel: 'Book a scoping call',
      ctaUrl: '/contact',
    }),
  ],
  seo: {
    metaTitle:         'About Chris Garlick — One-Person AI Implementation Partner',
    metaDescription:   'Solo software developer building AI implementations for UK businesses. Direct execution, fixed pricing, no agency overhead. Stack: Claude API, Node.js, TypeScript.',
    ogTitle:           'About Chris Garlick — Solo AI Developer, UK',
    ogDescription:     'One person. Direct execution. No agency in the middle. AI implementation for UK businesses.',
    ogType:            'profile',
    focusKeyword:      'ai implementation developer uk',
    secondaryKeywords: 'solo ai developer, one-person ai partner, ai consultant uk, ai implementation specialist, claude api developer uk, freelance ai developer, custom ai implementation, chris garlick',
    robotsIndex:       'index',
    robotsFollow:      'follow',
    twitterCard:       'summary_large_image',
  },
}

// ───────────────────────────────────────────────────────────────────────
//   /contact — preserve the existing hero + contact-form, inject pricing anchor between them
// ───────────────────────────────────────────────────────────────────────

const CONTACT_ID = 'f61295e6-3a9e-4842-9874-3ea9af59d4aa'

const existingContact = await fetch(`${BASE}/page/${CONTACT_ID}`, { headers: auth }).then(r => r.json())
const existingContent = (() => {
  const c = existingContact.data?.content
  return typeof c === 'string' ? JSON.parse(c) : (c || [])
})()

const pricingBlock = textSection({
  label: 'Pricing',
  heading: 'How pricing works.',
  body: doc(
    p('Engagements start at ', bold('£500'), ' — a few focused hours to remove a single bottleneck. That\'s the right shape when you have a clear, small task and just want it done.'),
    p('Larger builds &mdash; multi-step agent systems, custom integrations, ongoing retainers &mdash; scale up from there and are quoted per project after the scoping call. ', bold('Pricing is always fixed before work starts'), ': no day rates, no overruns.'),
    p('Not sure which tier fits? The ', link('free site audit', '/tools/site-audit'), ' is the cleanest way to find out — it surfaces the workflows worth automating and gives us a concrete starting point for the call.'),
  ),
})

// Insert pricing block AFTER hero and BEFORE the contact form
const heroIdx = existingContent.findIndex((b) => b.type === 'hero')
const formIdx = existingContent.findIndex((b) => b.type === 'contact-form')
const newContactContent = [...existingContent]
const insertAt = heroIdx >= 0 ? heroIdx + 1 : (formIdx >= 0 ? formIdx : 0)

// If a pricing block already exists (re-run), don't duplicate it
const hasPricing = newContactContent.some((b) => b.type === 'text-section' && (b.fields?.label === 'Pricing' || b.fields?.heading === 'How pricing works.'))
if (!hasPricing) newContactContent.splice(insertAt, 0, pricingBlock)

// ── Patch both pages ───────────────────────────────────────────────────
async function patch(pageId, payload) {
  const r = await fetch(`${BASE}/page/${pageId}`, { method: 'PATCH', headers: auth, body: JSON.stringify(payload) })
  const text = await r.text()
  if (r.ok) return true
  console.error(`PATCH ${pageId} failed:`, r.status, text.slice(0, 300))
  return false
}

if (await patch(about.id, { content: about.content, seo: about.seo, title: about.title })) {
  console.log(`Updated /about — ${about.content.length} blocks`)
}

if (await patch(CONTACT_ID, { content: newContactContent })) {
  console.log(`Updated /contact — ${newContactContent.length} blocks${hasPricing ? ' (pricing block already present, skipped insert)' : ' (pricing block inserted)'}`)
}
