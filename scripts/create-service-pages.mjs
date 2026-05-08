/**
 * Create service pages in the live CMS via API.
 * Run with: JWT_TOKEN=<token> node scripts/create-service-pages.mjs
 */

const JWT = process.env.JWT_TOKEN
const BASE = 'https://chrisgarlick.com/api'

if (!JWT) { console.error('Set JWT_TOKEN env var'); process.exit(1) }

async function createPage(data) {
  const res = await fetch(`${BASE}/page`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${JWT}` },
    body: JSON.stringify(data),
  })
  const result = await res.json()
  if (!res.ok) { console.error(`FAIL creating ${data.title}:`, result); return null }

  const id = result.data.id
  console.log(`Created: ${data.title} (${id})`)

  // Publish
  const pubRes = await fetch(`${BASE}/page/${id}/publish`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${JWT}` },
  })
  if (pubRes.ok) console.log(`  Published`)
  else console.error(`  Publish failed`)

  return id
}

// TipTap helpers
function t(text) { return { type: 'text', text } }
function bold(text) { return { type: 'text', text, marks: [{ type: 'bold' }] } }
function link(text, href) { return { type: 'text', text, marks: [{ type: 'link', attrs: { href, target: null } }] } }
function p(content) { return { type: 'paragraph', content: Array.isArray(content) ? content : [t(content)] } }
function h2(text) { return { type: 'heading', attrs: { level: 2 }, content: [t(text)] } }
function h3(text) { return { type: 'heading', attrs: { level: 3 }, content: [t(text)] } }
function li(text) { return { type: 'listItem', content: [p(text)] } }
function ul(...items) { return { type: 'bulletList', content: items.map(i => li(i)) } }

function richBody(...nodes) {
  return { type: 'doc', content: nodes }
}

// ─── 1. Services Index ──────────────────────────────────────────

await createPage({
  title: 'Services',
  slug: 'services',
  content: [
    {
      id: crypto.randomUUID(),
      type: 'hero',
      fields: {
        label: 'AI Implementation',
        heading: 'AI systems that replace manual work.',
        subtext: 'I work with law firms, agencies, and accountancy practices to build software that automates repetitive workflows. Audit first. Then build. Then maintain.',
        ctaLabel: 'Get in touch',
        ctaUrl: '/contact',
      }
    },
    {
      id: crypto.randomUUID(),
      type: 'columns',
      fields: {
        label: 'Sectors',
        heading: 'Who I work with',
        column1Heading: 'Law Firms',
        column1Body: 'Document drafting automation, client intake workflows, compliance document preparation. Systems that free up fee-earning hours without adding headcount.',
        column2Heading: 'Agencies',
        column2Body: 'Client reporting pipelines, content production workflows, onboarding automation. Purpose-built systems that replace the Zapier flows that keep breaking.',
        column3Heading: 'Accountancy Firms',
        column3Body: 'Client onboarding automation, compliance document prep, data entry elimination. Cut a 3-week onboarding process down to 3 days.',
      }
    },
    {
      id: crypto.randomUUID(),
      type: 'text-section',
      fields: {
        label: 'How it works',
        heading: 'Audit. Build. Maintain.',
        body: richBody(
          p([bold('Audit.'), t(' I map your current workflows end to end, identify the highest-impact manual processes, and show you exactly what can be automated and what the ROI looks like. No charge for the initial conversation.')]),
          p([bold('Build.'), t(' I design and build custom software that replaces those manual workflows. Not off-the-shelf tools reconfigured - purpose-built systems using AI where it makes sense and straightforward code where it doesn\'t.')]),
          p([bold('Maintain.'), t(' Software that nobody maintains is software that stops working. I stay on a monthly retainer to monitor, update, and improve your systems as your business evolves.')]),
        ),
        ctaLabel: '→ See how it works for law firms',
        ctaUrl: '/services/ai-for-law-firms',
      }
    },
    {
      id: crypto.randomUUID(),
      type: 'cta',
      fields: {
        heading: 'If your operations have manual bottlenecks, let\'s talk.',
        body: 'Tell me what your team spends too much time on. I\'ll tell you what can be automated and what it would take.',
        ctaLabel: 'Get in touch',
        ctaUrl: '/contact',
      }
    },
  ],
  seo: {
    metaTitle: 'AI Services for Professional Service Firms | Chris Garlick',
    metaDescription: 'Custom AI systems for law firms, agencies, and accountancy practices. I audit your workflows, build automation, and maintain it monthly. UK-based solo developer.',
    focusKeyword: 'ai systems for professional services',
    secondaryKeywords: 'ai implementation uk, ai workflow automation, ai for law firms, ai for agencies',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    robotsIndex: 'index',
    robotsFollow: 'follow',
  },
})

// ─── 2. AI Implementation ───────────────────────────────────────

await createPage({
  title: 'AI Implementation',
  slug: 'ai-implementation',
  content: [
    {
      id: crypto.randomUUID(),
      type: 'hero',
      fields: {
        label: 'AI Implementation Partner',
        heading: 'AI implementation that starts with your workflows, not a sales pitch.',
        subtext: 'Most AI projects fail because they start with the technology. I start with your operations - what your team actually does all day - and build systems that replace the manual parts.',
        ctaLabel: 'Get in touch',
        ctaUrl: '/contact',
      }
    },
    {
      id: crypto.randomUUID(),
      type: 'text-section',
      fields: {
        label: 'The problem',
        heading: 'Why most AI implementations fail',
        body: richBody(
          p('79% of enterprises face significant challenges adopting AI. The reason is almost always the same: they buy tools before defining workflows. They automate broken processes and get faster broken processes.'),
          p('AI implementation isn\'t about finding the right chatbot or the right LLM. It\'s about understanding which manual workflows in your business are costing you the most time, then building targeted systems that replace those specific bottlenecks.'),
          p('That\'s what I do. No generic "AI strategy" decks. No off-the-shelf tools rebranded. Purpose-built systems for the workflows that actually matter to your business.'),
        ),
      }
    },
    {
      id: crypto.randomUUID(),
      type: 'text-section',
      fields: {
        label: 'The process',
        heading: 'How AI implementation works',
        body: richBody(
          h3('1. Audit your workflows'),
          p('I map your current operations end to end. What does your team spend time on? Where are the repetitive tasks? Where do things get stuck? This is the foundation - if you skip this step, you build the wrong thing.'),
          h3('2. Identify the highest-impact opportunities'),
          p('Not every manual process is worth automating. I prioritise by impact: how much time does this save, how often does it happen, and how much does the current approach cost you? You get a clear recommendation with expected ROI before any building starts.'),
          h3('3. Build the system'),
          p('I design and build custom software that replaces the manual workflows we identified. AI where it adds value - document generation, data extraction, classification - and straightforward automation where it doesn\'t. No unnecessary complexity.'),
          h3('4. Deploy and iterate'),
          p('The system goes live with your team. I monitor it, gather feedback, and refine. Real workflows are messy - the first version is never perfect. That\'s why I stay on a monthly retainer to keep improving it.'),
        ),
      }
    },
    {
      id: crypto.randomUUID(),
      type: 'columns',
      fields: {
        heading: 'What AI implementation looks like in practice',
        column1Heading: 'Document automation',
        column1Body: 'Drafting contracts, proposals, reports, and compliance documents using templates and AI. Your team provides the inputs, the system produces the output.',
        column2Heading: 'Workflow automation',
        column2Body: 'Client onboarding, reporting pipelines, data entry, approval chains. The repetitive multi-step processes that eat up hours every week.',
        column3Heading: 'Data processing',
        column3Body: 'Extracting information from documents, classifying enquiries, reconciling data between systems. Tasks that are tedious for humans but straightforward for AI.',
      }
    },
    {
      id: crypto.randomUUID(),
      type: 'text-section',
      fields: {
        label: 'FAQ',
        heading: 'Common questions about AI implementation',
        body: richBody(
          h3('How long does AI implementation take?'),
          p('The initial build takes 4-8 weeks depending on complexity. You\'ll have a working system in production, not a prototype or a proof of concept. The monthly retainer then keeps it running and improving.'),
          h3('Do I need to change my existing software?'),
          p('No. I build systems that integrate with what you already use - your practice management software, your CRM, your email, your file storage. The goal is to slot into your existing operations, not replace everything.'),
          h3('What if AI isn\'t the right solution?'),
          p('Then I\'ll tell you. Not every problem needs AI. Sometimes a well-designed automation without any AI is faster, cheaper, and more reliable. The audit identifies what approach actually fits - I don\'t sell AI for the sake of it.'),
          h3('How is this different from hiring an agency?'),
          p('Agencies layer margin on top of off-the-shelf tools and assign junior developers to your project. I built the tools myself, I do the work myself, and I maintain the system myself. No middlemen, no handoffs, no surprises.'),
        ),
      }
    },
    {
      id: crypto.randomUUID(),
      type: 'cta',
      fields: {
        heading: 'Ready to see what AI can actually do for your business?',
        body: 'Tell me about your operations. I\'ll tell you what\'s worth automating and what it would take.',
        ctaLabel: 'Get in touch',
        ctaUrl: '/contact',
      }
    },
  ],
  seo: {
    metaTitle: 'AI Implementation Partner UK | Custom Systems, Not Chatbots',
    metaDescription: 'AI implementation for professional service firms. I audit your workflows, build custom systems, and maintain them monthly. No off-the-shelf tools. UK-based.',
    focusKeyword: 'ai implementation partner uk',
    secondaryKeywords: 'ai implementation, ai systems for business, ai workflow automation uk, hire ai specialist uk',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    robotsIndex: 'index',
    robotsFollow: 'follow',
  },
})

// ─── 3. AI for Law Firms ────────────────────────────────────────

await createPage({
  title: 'AI for Law Firms',
  slug: 'ai-for-law-firms',
  content: [
    {
      id: crypto.randomUUID(),
      type: 'hero',
      fields: {
        label: 'AI for Law Firms',
        heading: 'Your associates spend 40% of their time on templated documents. That\'s the first thing to fix.',
        subtext: 'AI systems for UK law firms that automate document drafting, client intake, and compliance prep - without touching your sensitive data infrastructure.',
        ctaLabel: 'Get in touch',
        ctaUrl: '/contact',
      }
    },
    {
      id: crypto.randomUUID(),
      type: 'text-section',
      fields: {
        label: 'The problem',
        heading: 'What law firms get wrong about AI',
        body: richBody(
          p('Most law firms hear "AI" and think chatbots or legal research tools. But the biggest time savings aren\'t in those areas. They\'re in the repetitive operational work that your fee earners do every day: drafting standard documents, onboarding new clients, preparing compliance materials.'),
          p('These are the workflows where AI implementation delivers measurable ROI. Not because the technology is revolutionary, but because the manual process is so time-consuming that even modest automation saves hundreds of hours per year.'),
        ),
      }
    },
    {
      id: crypto.randomUUID(),
      type: 'columns',
      fields: {
        heading: 'What I build for law firms',
        column1Heading: 'Document drafting',
        column1Body: 'Automated first drafts of engagement letters, NDAs, standard contracts, and advice letters. Your lawyers review and refine instead of starting from scratch every time.',
        column2Heading: 'Client intake',
        column2Body: 'From first enquiry to engagement letter in days, not weeks. Automated forms, conflict checks, ID verification, and document collection in a single workflow.',
        column3Heading: 'Compliance prep',
        column3Body: 'Automated assembly of compliance documents, regulatory filing preparation, and audit trail generation. Less manual copying, fewer errors, faster turnaround.',
      }
    },
    {
      id: crypto.randomUUID(),
      type: 'text-section',
      fields: {
        label: 'How it works',
        heading: 'The process for law firms',
        body: richBody(
          p([bold('Audit.'), t(' I map your current workflows: how documents get drafted, how clients get onboarded, where time gets lost. This takes 1-2 weeks and costs nothing beyond your team\'s time in a few conversations.')]),
          p([bold('Build.'), t(' Based on the audit, I build custom software that slots into your existing tech stack - Clio, Leap, iManage, Microsoft 365, whatever you use. The system integrates, it doesn\'t replace.')]),
          p([bold('Maintain.'), t(' Monthly retainer covers monitoring, updates, and improvements. When regulations change or your workflows evolve, the system evolves with them.')]),
        ),
      }
    },
    {
      id: crypto.randomUUID(),
      type: 'text-section',
      fields: {
        label: 'FAQ',
        heading: 'Questions law firms ask',
        body: richBody(
          h3('Is this secure? We handle sensitive client data.'),
          p('Every system is scoped to specific data flows. I don\'t build systems that access all your data - automations are targeted at specific documents, specific workflows, specific outputs. Data handling is documented in the architecture before any building starts.'),
          h3('Does this comply with SRA requirements?'),
          p('Yes. The systems are designed with regulatory requirements in mind. Audit trails, access controls, and data handling procedures are built in from the start, not bolted on afterwards.'),
          h3('Do we need to change our practice management software?'),
          p('No. I build systems that integrate with Clio, Leap, iManage, and other common legal tech. The goal is to enhance your existing setup, not replace it.'),
          h3('What kind of ROI can we expect?'),
          p('It depends on your firm\'s specific workflows, but law firms typically see 15-25 hours saved per week on document drafting alone. Client intake automation often cuts onboarding time from weeks to days.'),
        ),
      }
    },
    {
      id: crypto.randomUUID(),
      type: 'cta',
      fields: {
        heading: 'Want to see what automation could save your firm?',
        body: 'Tell me about your biggest operational bottleneck. I\'ll tell you whether AI is the right solution and what it would take to build.',
        ctaLabel: 'Get in touch',
        ctaUrl: '/contact',
      }
    },
  ],
  seo: {
    metaTitle: 'AI for Law Firms UK | Document Automation & Client Intake',
    metaDescription: 'AI systems for UK law firms: document drafting automation, client intake workflows, compliance prep. Integrates with Clio, Leap, iManage. Solo developer, fixed fee.',
    focusKeyword: 'ai consultant for law firms uk',
    secondaryKeywords: 'ai for law firms, ai document automation law firms, ai for small law firms uk, legal ai uk',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    robotsIndex: 'index',
    robotsFollow: 'follow',
  },
})

// ─── 4. AI for Agencies ─────────────────────────────────────────

await createPage({
  title: 'AI for Agencies',
  slug: 'ai-for-agencies',
  content: [
    {
      id: crypto.randomUUID(),
      type: 'hero',
      fields: {
        label: 'AI for Agencies',
        heading: 'You\'ve tried Zapier. It breaks. Nobody maintains it. Here\'s what works instead.',
        subtext: 'Purpose-built AI workflow automation for marketing and digital agencies. Reporting, content pipelines, and onboarding that actually scale.',
        ctaLabel: 'Get in touch',
        ctaUrl: '/contact',
      }
    },
    {
      id: crypto.randomUUID(),
      type: 'text-section',
      fields: {
        label: 'The problem',
        heading: 'Why agency automations break',
        body: richBody(
          p('You built a Zapier flow to automate client reporting. It worked for two months. Then a field changed in Google Analytics, or a client added a new campaign, and the whole thing broke. Nobody noticed until the client asked where their report was.'),
          p('Off-the-shelf automation tools are designed for simple, predictable workflows. Agency workflows aren\'t simple or predictable. Clients change. Platforms update. Scope creeps. You need systems that handle the messiness, not tools that break when something unexpected happens.'),
        ),
      }
    },
    {
      id: crypto.randomUUID(),
      type: 'columns',
      fields: {
        heading: 'What I build for agencies',
        column1Heading: 'Client reporting',
        column1Body: 'Automated report generation that pulls from Google Analytics, ad platforms, CRM, and social. Formatted, branded, and delivered - without 2 days of manual work per client per month.',
        column2Heading: 'Content pipelines',
        column2Body: 'AI-powered content production workflows: research, drafting, review, scheduling. Scale your content output without scaling your headcount.',
        column3Heading: 'Client onboarding',
        column3Body: 'From signed proposal to fully set up in hours, not weeks. Automated account creation, brief collection, access provisioning, and kickoff scheduling.',
      }
    },
    {
      id: crypto.randomUUID(),
      type: 'text-section',
      fields: {
        label: 'Why this is different',
        heading: 'Purpose-built, not duct-taped',
        body: richBody(
          p([t('I built my own CMS and the '), link('site you\'re reading runs on it', '/about'), t('. I\'m not reselling someone else\'s software or configuring a no-code tool. These are custom systems built specifically for your agency\'s workflows.')]),
          p('The retainer model means I stay and iterate. When a platform changes its API, I fix the integration. When you add a new service, I extend the system. This isn\'t a handoff - it\'s an ongoing partnership.'),
        ),
      }
    },
    {
      id: crypto.randomUUID(),
      type: 'text-section',
      fields: {
        label: 'FAQ',
        heading: 'Questions agencies ask',
        body: richBody(
          h3('Can you really deliver at agency scale as a solo developer?'),
          p('Purpose-built tooling and smart use of AI means one developer with the right infrastructure delivers faster than a traditional team. I use AI where it makes sense and write code where it doesn\'t. The consistency is the advantage - no juniors learning on your project.'),
          h3('What platforms do you integrate with?'),
          p('Google Analytics, Google Ads, Meta Ads, LinkedIn Ads, HubSpot, Salesforce, Notion, Slack, and most major marketing platforms. If it has an API, I can connect it.'),
          h3('How long until we see results?'),
          p('The first automated workflow is typically live within 4-6 weeks. Reporting automation often shows ROI in the first month - that\'s 2 days per client per month that your team gets back.'),
          h3('Can we offer this to our clients as a service?'),
          p('Yes. Several agencies I work with white-label the AI systems I build and offer them as an upsell to their own clients. We can discuss how to structure that.'),
        ),
      }
    },
    {
      id: crypto.randomUUID(),
      type: 'cta',
      fields: {
        heading: 'Your team is maxed out. Your automations keep breaking.',
        body: 'Tell me which workflows are eating the most time. I\'ll show you what purpose-built automation looks like.',
        ctaLabel: 'Get in touch',
        ctaUrl: '/contact',
      }
    },
  ],
  seo: {
    metaTitle: 'AI Workflow Automation for Agencies | Reporting, Content, Onboarding',
    metaDescription: 'AI automation for marketing agencies: client reporting in minutes, content pipelines that scale, onboarding that runs itself. No Zapier. Purpose-built systems.',
    focusKeyword: 'ai workflow automation for agencies',
    secondaryKeywords: 'ai for agencies, agency automation, ai reporting automation agencies, marketing agency ai automation',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    robotsIndex: 'index',
    robotsFollow: 'follow',
  },
})

// ─── 5. AI for Accountancy Firms ────────────────────────────────

await createPage({
  title: 'AI for Accountancy Firms',
  slug: 'ai-for-accountancy-firms',
  content: [
    {
      id: crypto.randomUUID(),
      type: 'hero',
      fields: {
        label: 'AI for Accountancy Firms',
        heading: 'Your onboarding takes 3 weeks and 12 touchpoints. AI can make it 3 days and 3.',
        subtext: 'AI automation for UK accountancy practices: client onboarding, compliance document preparation, and data entry elimination.',
        ctaLabel: 'Get in touch',
        ctaUrl: '/contact',
      }
    },
    {
      id: crypto.randomUUID(),
      type: 'text-section',
      fields: {
        label: 'The problem',
        heading: 'Where accountancy firms lose time',
        body: richBody(
          p('Your staff spend hours on manual data entry that should be automated. Onboarding a new client involves 12+ touchpoints across email, post, and phone. Compliance deadlines create seasonal crunches that burn out your team every year.'),
          p('The firms that are pulling ahead aren\'t doing it with better accountants. They\'re doing it with better systems. AI implementation for accountancy practices means automating the operational work that prevents your team from focusing on advisory and client relationships.'),
        ),
      }
    },
    {
      id: crypto.randomUUID(),
      type: 'columns',
      fields: {
        heading: 'What I build for accountancy firms',
        column1Heading: 'Client onboarding',
        column1Body: 'From first contact to engagement letter in days: automated forms, ID verification, document collection, engagement letter generation, and AML checks in a single streamlined workflow.',
        column2Heading: 'Compliance preparation',
        column2Body: 'Automated assembly of compliance documents, filing preparation, and audit trail generation. Less manual copying between systems, fewer errors, faster turnaround before deadlines.',
        column3Heading: 'Data processing',
        column3Body: 'AI-powered data extraction from receipts, invoices, and bank statements. Automated reconciliation and classification that eliminates hours of manual data entry.',
      }
    },
    {
      id: crypto.randomUUID(),
      type: 'text-section',
      fields: {
        label: 'For partners',
        heading: 'How to get buy-in for AI at your practice',
        body: richBody(
          p('I understand that adopting new technology at an accountancy practice requires partner consensus. That\'s why the process starts with an audit - a clear report showing exactly where time is being lost, what can be automated, and what the expected return looks like.'),
          p('You\'ll have a document you can present to the other partners that shows specific workflows, specific time savings, and specific costs. No vague promises about "digital transformation" - just numbers that make the business case obvious.'),
        ),
      }
    },
    {
      id: crypto.randomUUID(),
      type: 'text-section',
      fields: {
        label: 'FAQ',
        heading: 'Questions accountancy firms ask',
        body: richBody(
          h3('How does this comply with GDPR and professional standards?'),
          p('Every system is designed with data protection built in from the start. Data flows are documented, access is controlled, and audit trails are maintained. I work within the regulatory framework, not around it.'),
          h3('Does this integrate with Xero and Sage?'),
          p('Yes. I build systems that connect to Xero, Sage, QuickBooks, and other common accountancy software. The goal is to enhance your existing tools, not replace them.'),
          h3('What does the phased approach look like?'),
          p('Start with the audit - this is low commitment and shows you exactly what\'s possible. If the numbers make sense, we scope a build for the highest-impact workflow first. Expand to additional workflows once you\'ve seen the results.'),
          h3('How do we measure ROI?'),
          p('Monthly reporting shows exactly what the system handled: documents generated, clients onboarded, hours saved. Your partners will have full visibility into what the system is doing and the value it\'s delivering.'),
        ),
      }
    },
    {
      id: crypto.randomUUID(),
      type: 'cta',
      fields: {
        heading: 'Want to see what your firm\'s operations look like after automation?',
        body: 'Tell me about your biggest operational bottleneck. I\'ll show you what\'s possible before you spend a penny.',
        ctaLabel: 'Get in touch',
        ctaUrl: '/contact',
      }
    },
  ],
  seo: {
    metaTitle: 'AI for Accountancy Firms UK | Onboarding & Compliance Automation',
    metaDescription: 'AI automation for UK accountancy practices: client onboarding in days not weeks, compliance document prep, data entry elimination. Integrates with Xero and Sage.',
    focusKeyword: 'ai automation for accountancy firms',
    secondaryKeywords: 'ai for accountancy firms uk, ai for accountancy practice uk, ai client onboarding automation, accountancy automation',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    robotsIndex: 'index',
    robotsFollow: 'follow',
  },
})

console.log('\nDone! All 5 service pages created and published.')
console.log('URLs:')
console.log('  /services')
console.log('  /services/ai-implementation')
console.log('  /services/ai-for-law-firms')
console.log('  /services/ai-for-agencies')
console.log('  /services/ai-for-accountancy-firms')
