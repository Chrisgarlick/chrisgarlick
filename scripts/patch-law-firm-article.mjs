/**
 * Push full content + SEO to the "What AI Implementation Actually Means for a Law Firm" article.
 * Run with: JWT_TOKEN=<token> node scripts/patch-law-firm-article.mjs
 */

const JWT = process.env.JWT_TOKEN
const BASE = 'https://chrisgarlick.com/api'

if (!JWT) { console.error('Set JWT_TOKEN env var'); process.exit(1) }

// TipTap helpers
function t(text) { return { type: 'text', text } }
function bold(text) { return { type: 'text', text, marks: [{ type: 'bold' }] } }
function link(text, href) { return { type: 'text', text, marks: [{ type: 'link', attrs: { href, target: null } }] } }
function p(content) { return { type: 'paragraph', content: Array.isArray(content) ? content : [t(content)] } }
function h2(text) { return { type: 'heading', attrs: { level: 2 }, content: [t(text)] } }
function h3(text) { return { type: 'heading', attrs: { level: 3 }, content: [t(text)] } }

const body = {
  type: 'doc',
  content: [
    p([
      t('If you\'re a managing partner or practice director at a UK law firm, you\'ve probably heard the term "AI implementation" thrown around at every legal tech conference and Law Society event this year. But what does it actually mean for your firm? Not in the abstract, '),
      bold('what-AI-could-theoretically-do'),
      t(' sense - in the practical, '),
      bold('this-is-what-changes-on-Monday-morning'),
      t(' sense.'),
    ]),
    p('Because here\'s the thing: most law firms that "implement AI" end up with a chatbot nobody uses, a subscription to a legal research tool that three associates tried once, and a lingering sense that they\'ve wasted money. That\'s not AI implementation. That\'s AI tourism.'),
    p('Real AI implementation for a law firm means identifying the specific manual workflows that cost your firm the most time, then building systems that handle those workflows automatically. Let me walk you through what that looks like in practice.'),

    h2('What AI Implementation Is Not'),
    p('Before we get into what it is, let me clear up the three most common misconceptions I see when talking to law firm partners about AI:'),
    p([bold('It\'s not a chatbot on your website.'), t(' Client-facing chatbots are a customer service tool, not an operational improvement. They might help with initial enquiries, but they don\'t touch the real bottlenecks in your practice.')]),
    p([bold('It\'s not replacing lawyers.'), t(' AI implementation for law firms is about automating the administrative and repetitive work that prevents your lawyers from doing what they\'re actually trained to do. Nobody is suggesting an algorithm should advise clients on corporate restructuring.')]),
    p([bold('It\'s not a one-off software purchase.'), t(' Buying a subscription to an AI tool is not implementation. Implementation means the tool is embedded in your workflows, your team is trained on it, and someone is maintaining it as your needs change.')]),

    h2('The Three Workflows That Matter Most'),
    p('In my experience working with professional service firms, there are three workflow categories where AI implementation delivers the highest ROI for law firms. They\'re not glamorous, but they\'re where the hours go.'),

    h3('1. Document Drafting'),
    p('Your junior associates spend a significant chunk of their time on templated documents: engagement letters, NDAs, standard commercial contracts, advice letters, terms of business. The process usually looks like this: find a similar document from a previous matter, copy it, manually replace the client details, check for errors, send for review.'),
    p('AI implementation for document drafting means building a system where the associate provides the key inputs - client name, matter type, specific terms, relevant clauses - and the system produces a first draft. Not a perfect final version, but a solid starting point that saves 30-60 minutes per document.'),
    p([t('For a firm producing 20-30 standard documents per week, that\'s '), bold('10-15 hours saved weekly'), t(' - or roughly one full-time equivalent redirected to billable work.')]),

    h3('2. Client Intake and Onboarding'),
    p('At most law firms I\'ve spoken to, onboarding a new client involves 5-12 separate touchpoints: initial enquiry response, conflict check, ID verification, engagement letter, terms of business, file opening, matter setup in the practice management system. Much of this is manual, sequential, and slow.'),
    p([t('AI-powered client intake means automating the chain. A new enquiry comes in, the system pre-qualifies it, runs a conflict check against your database, collects ID documents via a secure portal, generates the engagement letter, and sets up the matter in your PMS. What currently takes '), bold('1-3 weeks'), t(' comes down to '), bold('1-3 days'), t('.')]),
    p('The business case here isn\'t just time savings - it\'s conversion rate. Every day a potential client waits for your onboarding process to complete is a day they might instruct someone else.'),

    h3('3. Compliance Document Preparation'),
    p('Whether it\'s SRA compliance, GDPR documentation, or anti-money laundering procedures, law firms spend significant time assembling compliance documents. This work is predictable, repetitive, and critically important - which makes it ideal for automation.'),
    p('An AI implementation for compliance prep means the system automatically assembles the required documents based on the matter type, pulls in the relevant data from your existing systems, and generates the output in your standard format. Your compliance team reviews and signs off instead of building from scratch.'),

    h2('How AI Implementation Actually Works'),
    p('The process I follow when implementing AI for a law firm has four phases. None of them start with buying software.'),
    p([bold('Phase 1: Workflow Audit.'), t(' I map your current operations end to end. What does your team actually do every day? Where do documents come from? Where do they go? How long does each step take? This isn\'t a theoretical exercise - it\'s a detailed map of your firm\'s operational reality.')]),
    p([bold('Phase 2: Opportunity Identification.'), t(' Not every workflow is worth automating. I prioritise by three factors: time cost (how many hours per week), frequency (how often it happens), and complexity (how hard is it to automate). The highest-impact, lowest-complexity workflows go first.')]),
    p([bold('Phase 3: System Build.'), t(' I design and build the automation. This isn\'t installing an off-the-shelf tool - it\'s building software that integrates with your existing practice management system, your document management, your email. The system slots into how your firm already works.')]),
    p([bold('Phase 4: Deploy and Iterate.'), t(' The system goes live. Your team uses it. I monitor, collect feedback, and refine. Real workflows are messy - the first version is good, but the third version is great. That\'s why ongoing maintenance matters as much as the initial build.')]),

    h2('What About Security?'),
    p('This is the first question every law firm partner asks, and rightly so. You handle confidential client data. You have professional obligations. You can\'t afford a data breach.'),
    p('Here\'s how AI implementation handles security: every system is scoped to specific data flows. I don\'t build systems that access all your data - the automation is targeted at specific documents, specific workflows, specific outputs. Data handling is documented in the system architecture before any building starts.'),
    p('The system integrates with your existing infrastructure - it doesn\'t replace it. Your data stays in your document management system. Your access controls stay in place. The AI processes what it needs to process and nothing more.'),

    h2('What Does It Cost?'),
    p('AI implementation for a law firm typically involves two components: an initial build and an ongoing retainer.'),
    p('The build covers the audit, system design, development, testing, and deployment. This is a fixed-fee engagement - you know the cost before work starts, and it doesn\'t change.'),
    p([t('The retainer covers ongoing monitoring, maintenance, updates, and improvements. Law firms don\'t have internal teams to maintain custom software, and software that nobody maintains is software that stops working. The retainer ensures your investment keeps delivering. '), link('Get in touch', '/contact'), t(' for specific pricing based on your firm\'s needs.')]),

    h2('Is It Worth It for a Small Firm?'),
    p('In my honest opinion, AI implementation is most valuable for firms with 10-50 people. That\'s the sweet spot where:'),
    p([bold('The pain is real.'), t(' You\'re big enough that manual workflows are genuinely costing you hours and revenue.')]),
    p([bold('The solution is proportionate.'), t(' You don\'t need enterprise-grade AI infrastructure. Targeted automation of 2-3 key workflows delivers measurable ROI without transforming your entire operation.')]),
    p([bold('The investment is manageable.'), t(' A fixed-fee build is a known cost with a clear return. You\'re not signing up for a multi-year digital transformation programme.')]),
    p('For very small firms (under 5 people), the time savings may not justify the investment. For very large firms, the complexity of integrating across multiple offices and systems means a different approach is needed.'),

    h2('My Take'),
    p('AI implementation for law firms isn\'t about being on the cutting edge of technology. It\'s about removing the operational friction that prevents your lawyers from doing their best work. Document drafting, client onboarding, compliance prep - these are the workflows that eat hours every week, and they\'re exactly the kind of repetitive, structured work that automation handles well.'),
    p([t('If your firm is spending significant time on templated documents, manual onboarding, or compliance assembly, it\'s worth having a conversation about what automation could look like. I\'d be happy to walk you through the specifics for your firm - '), link('get in touch', '/contact'), t(' and we can take it from there.')]),

    h2('Frequently Asked Questions'),
    h3('What does AI implementation actually mean for a law firm?'),
    p('AI implementation for a law firm means identifying the specific manual workflows that cost your practice the most time - typically document drafting, client onboarding, and compliance prep - and building automated systems that handle those workflows. It\'s not about chatbots or replacing lawyers.'),

    h3('How long does AI implementation take for a law firm?'),
    p('The initial build typically takes 4-8 weeks, depending on complexity. This includes the workflow audit, system design, development, and deployment. Ongoing refinement happens through a monthly retainer.'),

    h3('Is AI implementation secure for law firms handling sensitive data?'),
    p('Yes. Every system is scoped to specific data flows and integrates with your existing security infrastructure. Data handling is documented before any building starts, and the system works within your existing access controls and document management.'),

    h3('How much does AI implementation cost for a law firm?'),
    p('AI implementation involves a fixed-fee initial build plus an ongoing monthly retainer for maintenance and improvements. The exact cost depends on your firm\'s specific workflows and scale. Get in touch for pricing based on your needs.'),

    h3('Do we need to change our practice management software?'),
    p('No. AI implementation systems are built to integrate with your existing tools - Clio, Leap, iManage, Microsoft 365, and others. The goal is to enhance your current setup, not replace it.'),
  ],
}

const seo = {
  metaTitle: 'What AI Implementation Actually Means for a Law Firm',
  metaDescription: 'AI implementation for law firms means automating document drafting, client intake, and compliance prep. Not chatbots. Here\'s what it actually looks like in practice.',
  focusKeyword: 'ai implementation law firms',
  secondaryKeywords: 'ai for law firms uk, ai document automation solicitors, law firm automation, ai for legal practice, law firm efficiency',
  ogType: 'article',
  twitterCard: 'summary_large_image',
  robotsIndex: 'index',
  robotsFollow: 'follow',
}

const excerpt = 'AI implementation for law firms means automating document drafting, client intake, and compliance prep - not installing chatbots. Here\'s what it actually looks like in practice.'

// First get the article ID
const getRes = await fetch(`${BASE}/article/slug/what-ai-implementation-means-law-firm`, {
  headers: { 'Authorization': `Bearer ${JWT}` },
})
const getData = await getRes.json()
const articleId = getData.data?.id

if (!articleId) {
  console.error('Could not find article:', getData)
  process.exit(1)
}

console.log(`Found article: ${articleId}`)

// PATCH with content
const patchRes = await fetch(`${BASE}/article/${articleId}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${JWT}` },
  body: JSON.stringify({ body, seo, excerpt }),
})
const patchData = await patchRes.json()
console.log(`PATCH: ${patchRes.status}`)
console.log(`Title: ${patchData.data?.title}`)
console.log(`SEO: ${patchData.data?.seo?.metaTitle}`)
console.log(`Body blocks: ${patchData.data?.body?.content?.length}`)
console.log(`Excerpt: ${patchData.data?.excerpt?.slice(0, 60)}...`)

if (!patchRes.ok) {
  console.error('PATCH failed:', patchData)
}
