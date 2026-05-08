/**
 * Create the AI Implementation Playbook pillar blog post as a DRAFT.
 * Run: JWT_TOKEN=<token> node scripts/create-pillar-article.mjs
 */

const JWT = process.env.JWT_TOKEN
const BASE = 'https://chrisgarlick.com/api'
if (!JWT) { console.error('Set JWT_TOKEN'); process.exit(1) }

const t = (text) => ({ type: 'text', text })
const bold = (text) => ({ type: 'text', text, marks: [{ type: 'bold' }] })
const italic = (text) => ({ type: 'text', text, marks: [{ type: 'italic' }] })
const link = (text, href) => ({ type: 'text', text, marks: [{ type: 'link', attrs: { href, target: null } }] })
const p = (content) => ({ type: 'paragraph', content: Array.isArray(content) ? content : [t(content)] })
const h2 = (text) => ({ type: 'heading', attrs: { level: 2 }, content: [t(text)] })
const h3 = (text) => ({ type: 'heading', attrs: { level: 3 }, content: [t(text)] })
const li = (content) => ({ type: 'listItem', content: [p(content)] })
const ul = (...items) => ({ type: 'bulletList', content: items.map(i => li(i)) })
const ol = (...items) => ({ type: 'orderedList', content: items.map(i => li(i)) })

const body = { type: 'doc', content: [

  // ─── INTRO ───
  p([
    t('Have you been told your business needs AI but nobody can explain what that actually means in practice? You\'re not alone. I talk to business owners every week who\'ve sat through the pitch decks, read the blog posts about "digital transformation," and come away with the same question: '),
    italic('what would this actually look like on a Monday morning?'),
  ]),
  p([
    t('This guide is the answer. Not the theoretical, what-AI-could-do answer - the practical, here\'s-how-it-works-for-businesses-like-yours answer. I\'ve written it for owners and operators of professional service firms - '),
    link('law firms', '/services/ai-for-law-firms'),
    t(', '),
    link('agencies', '/services/ai-for-agencies'),
    t(', and '),
    link('accountancy practices', '/services/ai-for-accountancy-firms'),
    t(' - because those are the businesses I work with every day. But the principles apply to any service business where people spend too much time on repetitive work.'),
  ]),
  p('I\'ll cover what AI implementation actually is, what it costs, how long it takes, what can go wrong, and how to do it properly. No jargon. No hype. Just a straightforward playbook you can follow.'),

  // ─── WHAT IS AI IMPLEMENTATION ───
  h2('What AI Implementation Actually Means'),
  p([
    t('AI implementation is the process of identifying manual, repetitive workflows in your business and building software systems that handle them automatically. Some of those systems use artificial intelligence - natural language processing, document understanding, classification models. Others use straightforward automation that doesn\'t need AI at all. The goal isn\'t to use AI for the sake of it. The goal is to '),
    bold('eliminate the manual work that costs you the most time and money'),
    t('.'),
  ]),
  p('Here\'s what AI implementation is not:'),
  ul(
    [bold('It\'s not buying a chatbot.'), t(' Chatbots are a customer service tool, not an operational improvement. They don\'t touch the real bottlenecks in your business.')],
    [bold('It\'s not subscribing to ChatGPT.'), t(' Giving your team access to a language model is useful, but it\'s not implementation. Implementation means the system is embedded in your workflows and runs without someone manually copying and pasting prompts.')],
    [bold('It\'s not a one-off project.'), t(' Real implementation means ongoing maintenance, monitoring, and improvement. Software that nobody maintains is software that stops working.')],
  ),
  p([
    t('A good way to think about it: AI implementation is to your business operations what an accountant is to your finances. You '),
    italic('could'),
    t(' do it all yourself, but the specialist gets it done faster, more accurately, and frees you up to focus on what you\'re actually good at.'),
  ]),

  // ─── WHY MOST FAIL ───
  h2('Why Most AI Implementations Fail'),
  p([
    link('79% of enterprises face significant challenges adopting AI', '/article/why-79-of-enterprises-are-failing-at-ai-adoption'),
    t(', despite record levels of investment. The reasons are consistent and predictable:'),
  ]),

  h3('1. Starting with the technology instead of the problem'),
  p('The most common mistake is buying an AI tool and then looking for something to do with it. That\'s backwards. Effective implementation starts with a specific question: what manual work is costing your business the most time? The technology choice comes last, not first.'),

  h3('2. Trying to automate everything at once'),
  p([
    t('Ambitious rollouts fail. Pick one workflow. Automate it properly. Measure the results. Then expand. I\'ve seen businesses try to "transform their operations with AI" in a single quarter and end up with nothing working properly. The ones that succeed start with '),
    link('one high-impact workflow', '/article/agency-workflows-automate-first'),
    t(' and build from there.'),
  ]),

  h3('3. No ongoing maintenance'),
  p('Software degrades. APIs change. Business processes evolve. Team members leave and new ones join. If nobody is maintaining your AI systems, they\'ll start producing errors within months. This is why the retainer model exists - it\'s not a subscription trap, it\'s the difference between a system that works on day one and a system that still works on day 365.'),

  h3('4. Buying off-the-shelf when you need custom'),
  p('Generic automation tools like Zapier and Make are brilliant for simple trigger-action workflows. But they break at scale, they can\'t handle complex business logic, and nobody notices when they fail silently. If your workflow involves conditional logic, multiple data sources, or anything that needs to handle edge cases gracefully, you need something purpose-built.'),

  // ─── THE PLAYBOOK ───
  h2('The AI Implementation Playbook: Step by Step'),
  p([
    t('This is the process I follow with every client. It\'s not revolutionary - it\'s just methodical. And that\'s the point. The businesses that get AI right don\'t do anything magical. They just follow a '),
    link('disciplined process', '/services/ai-implementation'),
    t('.'),
  ]),

  h3('Step 1: Audit your workflows'),
  p('Before anything gets built, you need a clear picture of how your business actually operates. Not how you think it operates - how it actually operates. This means mapping every step of your key workflows:'),
  ul(
    'Where does the work come from? (email, form, phone, portal)',
    'What does each person do with it? (read, classify, copy, draft, send, file)',
    'How long does each step take?',
    'Where do things get stuck or delayed?',
    'What gets done repeatedly with minor variations?',
  ),
  p('This audit typically takes 1-2 weeks and involves conversations with the people who actually do the work. The output is a workflow map that shows exactly where time is being lost and where automation will have the biggest impact.'),

  h3('Step 2: Prioritise by impact'),
  p('Not every manual workflow is worth automating. Some are too infrequent to justify the investment. Others are too complex to automate reliably. The sweet spot is workflows that score high on three criteria:'),
  ol(
    [bold('Frequency'), t(' - How often does this happen? Daily tasks beat monthly tasks.')],
    [bold('Time cost'), t(' - How many hours does this consume per week across the team?')],
    [bold('Predictability'), t(' - Does this workflow follow a consistent pattern, or is every instance unique?')],
  ),
  p([
    t('For a '),
    link('law firm', '/services/ai-for-law-firms'),
    t(', the highest-impact workflows are usually '),
    link('document drafting', '/article/what-ai-implementation-means-law-firm'),
    t(' (engagement letters, NDAs, standard contracts), client intake (onboarding new clients), and compliance document preparation.'),
  ]),
  p([
    t('For an '),
    link('agency', '/services/ai-for-agencies'),
    t(', it\'s typically client reporting (the monthly report grind), content production pipelines, and client onboarding.'),
  ]),
  p([
    t('For an '),
    link('accountancy practice', '/services/ai-for-accountancy-firms'),
    t(', it\'s client onboarding (the 12-touchpoint nightmare), compliance document preparation, and data entry from source documents.'),
  ]),

  h3('Step 3: Design the system'),
  p('Once you know what to automate, you design how. This is where technical decisions get made:'),
  ul(
    'What data does the system need access to?',
    'Which existing tools does it need to integrate with? (practice management, CRM, email, file storage)',
    'Where does AI add value vs straightforward automation?',
    'What happens when the system encounters something unexpected?',
    'Who reviews the output before it reaches clients?',
  ),
  p('The design phase produces an architecture document - a clear diagram showing what gets built, how the pieces connect, and what the data flows look like. You see this before any code gets written.'),

  h3('Step 4: Build'),
  p('The build phase is where the software gets written, tested, and deployed. For a typical single-workflow automation, this takes 4-8 weeks. The timeline depends on complexity:'),
  ul(
    [bold('Simple'), t(' (4 weeks): Single data source, one output format, limited decision logic. Example: automated report generation from one analytics platform.')],
    [bold('Medium'), t(' (6 weeks): Multiple data sources, conditional logic, multiple output types. Example: client onboarding workflow with ID verification, conflict checks, and document generation.')],
    [bold('Complex'), t(' (8+ weeks): Cross-system integration, AI-powered document understanding, multiple stakeholders. Example: compliance document assembly with automated data extraction from source materials.')],
  ),

  h3('Step 5: Deploy and iterate'),
  p('The system goes live with your team. This is where reality meets design - and reality always wins. Expect the first version to handle 80% of cases well. The remaining 20% is what the iteration phase is for.'),
  p('The monthly retainer covers this ongoing refinement: monitoring for errors, handling edge cases that emerge, updating integrations when platforms change their APIs, and extending the system as your processes evolve. Think of it as the difference between buying a car and having a mechanic on retainer. The car runs fine on day one. It\'s month six where the maintenance matters.'),

  // ─── WHAT IT COSTS ───
  h2('What AI Implementation Costs'),
  p('This is the question everyone wants answered and most providers dodge. Here\'s the honest answer.'),
  p([
    t('AI implementation for a service business typically involves two components: an '),
    bold('initial build'),
    t(' and an '),
    bold('ongoing retainer'),
    t('.'),
  ]),
  p([
    bold('The build'),
    t(' covers the audit, system design, development, testing, and deployment. This is a fixed-fee engagement - the cost is agreed before work starts and doesn\'t change. For a single-workflow automation, the build typically falls in the range of a few thousand pounds. The exact figure depends on complexity, integration requirements, and how many systems need to talk to each other.'),
  ]),
  p([
    bold('The retainer'),
    t(' covers ongoing monitoring, maintenance, updates, and improvements. This is a monthly fee that keeps the system running and improving. It covers things like: fixing issues when a third-party API changes, adding handling for edge cases that emerge in real use, extending the system when you want to automate the next workflow, and regular performance reporting so you can see the ROI.'),
  ]),
  p([
    link('Get in touch', '/contact'),
    t(' for specific pricing based on your business needs. I\'ll give you a clear number before any work starts.'),
  ]),

  h3('What affects the cost?'),
  ul(
    [bold('Number of integrations'), t(' - connecting to one system is simpler than connecting to five')],
    [bold('Data complexity'), t(' - structured data (forms, spreadsheets) is easier than unstructured data (emails, PDFs, handwritten notes)')],
    [bold('Compliance requirements'), t(' - regulated industries need additional security controls, audit trails, and documentation')],
    [bold('Volume'), t(' - a system that processes 10 documents per day is simpler than one handling 500')],
  ),

  // ─── ROI ───
  h2('How to Measure AI Implementation ROI'),
  p('The return on AI implementation comes from three sources:'),

  h3('1. Direct time savings'),
  p('This is the easiest to measure. If a workflow that took 5 hours per week now takes 30 minutes, that\'s 4.5 hours saved. Multiply by the hourly cost of the person doing it, multiply by 52 weeks, and you have your annual saving. For most professional service firms, a single workflow automation saves 10-25 hours per week across the team.'),

  h3('2. Error reduction'),
  p('Manual processes produce errors. Typos in contracts. Missed steps in onboarding. Wrong data in reports. Each error costs time to fix, and some cost client relationships. Automated systems make mistakes too, but they make them consistently - which means you can find and fix them once, and the fix applies everywhere.'),

  h3('3. Capacity creation'),
  p('This is the big one, and the hardest to measure upfront. When your team spends less time on repetitive work, they have more time for the work that actually generates revenue: client advisory, business development, strategic thinking. You\'re not just saving time - you\'re creating capacity for growth without adding headcount.'),

  p([
    t('For reference, '),
    link('92% of early AI adopters report positive returns', '/article/why-79-of-enterprises-are-failing-at-ai-adoption'),
    t(', earning roughly $1.49 for every $1 invested. The businesses that fail to see ROI are almost always the ones that skipped the audit step and automated the wrong things.'),
  ]),

  // ─── COMMON MISTAKES ───
  h2('The 7 Most Common AI Implementation Mistakes'),
  p('I\'ve seen these patterns play out across dozens of projects. Avoid them and you\'re already ahead of most.'),
  ol(
    [bold('Automating a broken process.'), t(' If your workflow is inefficient before automation, you\'ll just get faster inefficiency. Fix the process first, then automate it.')],
    [bold('Not involving the people who do the work.'), t(' The audit must include conversations with the team members who actually perform the workflow. Their manager\'s version of "how it works" is rarely accurate.')],
    [bold('Choosing the AI tool before defining the problem.'), t(' "We need ChatGPT" is not a brief. "We need to reduce client onboarding from 3 weeks to 3 days" is a brief.')],
    [bold('Expecting perfection on day one.'), t(' The first version handles 80% of cases. The iteration phase handles the rest. If you wait for perfection before deploying, you\'ll wait forever.')],
    [bold('No human review step.'), t(' AI outputs should be reviewed by a human before they reach clients. Always. The review step is what makes the system trustworthy.')],
    [bold('Skipping the business case.'), t(' If you can\'t calculate the expected ROI before building, you don\'t understand the problem well enough. Go back to the audit.')],
    [bold('Treating it as a one-off project.'), t(' Implementation is ongoing. Monthly maintenance isn\'t optional - it\'s what prevents your investment from degrading.')],
  ),

  // ─── CHOOSING A PARTNER ───
  h2('How to Choose an AI Implementation Partner'),
  p('If you\'re evaluating providers, here\'s what to look for and what to avoid.'),

  h3('Green flags'),
  ul(
    [bold('They start with your workflows, not their technology.'), t(' If the first conversation is about your operations, that\'s a good sign. If it\'s about their AI platform, that\'s a bad sign.')],
    [bold('They show you architecture before you commit.'), t(' You should see exactly what gets built and how the pieces connect before any money changes hands.')],
    [bold('Fixed pricing.'), t(' Open-ended day rates mean the provider benefits from scope creep. Fixed fees mean they benefit from efficiency.')],
    [bold('They offer ongoing maintenance.'), t(' A provider who builds and disappears is a provider who doesn\'t stand behind their work.')],
    [bold('Sector-specific experience.'), t(' AI implementation for a law firm is different from AI implementation for a retail business. Your provider should understand your industry\'s workflows and compliance requirements.')],
  ),

  h3('Red flags'),
  ul(
    'They promise results before understanding your business',
    'They can\'t explain what they\'ll build in plain English',
    'They rely on off-the-shelf tools rebranded as "custom solutions"',
    'No ongoing support or maintenance option',
    'No references or case studies from similar businesses',
  ),

  // ─── BUILD VS BUY ───
  h2('Build vs Buy: When Custom AI Wins'),
  p('Not every business needs custom AI implementation. Here\'s a straightforward framework:'),
  p([
    bold('Use off-the-shelf tools'),
    t(' when your workflow is simple and standard. If you need to send an email when a form is submitted, or post to Slack when a deal closes, Zapier or Make will do the job perfectly. Don\'t over-engineer simple problems.'),
  ]),
  p([
    bold('Build custom'),
    t(' when your workflow involves conditional logic that off-the-shelf tools can\'t handle, multiple data sources that need to be coordinated, AI processing (document understanding, classification, generation), compliance requirements that demand audit trails and access controls, or scale that breaks the pricing model of no-code tools.'),
  ]),
  p('Most professional service firms hit the custom threshold quickly because their workflows involve sensitive client data, regulatory compliance, and integration with specialist software (practice management systems, accounting platforms) that generic automation tools don\'t support well.'),

  // ─── GETTING STARTED ───
  h2('Getting Started: What to Do This Week'),
  p('If you\'ve read this far and you\'re thinking about AI implementation for your business, here are three things you can do right now:'),
  ol(
    [bold('Pick your most painful workflow.'), t(' What does your team spend the most time on that feels repetitive and predictable? That\'s your starting point.')],
    [bold('Map it on paper.'), t(' Write down every step: where does the work come from, what happens to it, where does it go, how long does each step take? You\'ll be surprised how many steps there are.')],
    [bold('Calculate the cost.'), t(' Multiply the hours spent per week by the hourly cost of the people doing it. That\'s your baseline. Any automation that costs less than the annual figure is worth exploring.')],
  ),

  // ─── MY TAKE ───
  h2('My Take'),
  p('In my honest opinion, AI implementation is not nearly as complicated as the industry makes it sound. The businesses that get it right don\'t have bigger budgets or better technology. They have a clearer understanding of where they\'re losing time, and they work with someone who builds systems methodically rather than chasing the latest AI trend.'),
  p('The gap between businesses that are using AI effectively and those that aren\'t is widening every quarter. But the fix is genuinely straightforward: start with the workflow, not the technology. Build one thing properly. Measure the results. Then expand.'),
  p([
    t('If you\'re looking at your own operations and wondering where AI implementation could make a real difference, I\'d be happy to have that conversation. '),
    link('Drop me a message', '/contact'),
    t(' and we can go from there.'),
  ]),

  // ─── FAQ ───
  h2('Frequently Asked Questions'),

  h3('What is AI implementation for a small business?'),
  p('AI implementation for a small business means identifying the manual, repetitive workflows that cost you the most time - like document drafting, client onboarding, or data entry - and building automated systems to handle them. It\'s not about chatbots or replacing staff. It\'s about eliminating the repetitive work so your team can focus on higher-value tasks.'),

  h3('How long does AI implementation take?'),
  p('A single workflow automation typically takes 4-8 weeks from audit to deployment. The timeline depends on complexity: simple automations (one data source, one output) take around 4 weeks, while complex multi-system integrations take 8 or more. The monthly retainer then covers ongoing refinement and maintenance.'),

  h3('What does AI implementation cost in the UK?'),
  p('AI implementation involves a fixed-fee initial build plus a monthly retainer for maintenance. The build cost depends on complexity, number of integrations, and compliance requirements. Get in touch for specific pricing based on your business needs - the exact figure is always agreed before work starts.'),

  h3('Is AI implementation worth it for professional services?'),
  p('Yes, if done properly. 92% of early AI adopters report positive returns. For professional service firms specifically, a single workflow automation typically saves 10-25 hours per week. The key is starting with the right workflow - high frequency, high time cost, predictable pattern.'),

  h3('How do I choose an AI implementation partner?'),
  p('Look for fixed pricing, sector-specific experience, ongoing maintenance included, and a process that starts with understanding your workflows before proposing technology. Avoid providers who lead with their platform, promise results before understanding your business, or don\'t offer post-build support.'),

  h3('What\'s the difference between AI implementation and buying AI tools?'),
  p('Buying an AI tool is like buying gym equipment. AI implementation is like hiring a personal trainer who designs a programme around your goals, teaches you proper form, and adjusts the programme as you progress. The tool is a component. The implementation is what makes it work.'),

] }

const seo = {
  metaTitle: 'AI Implementation for Service Businesses: The Complete UK Playbook',
  metaDescription: 'The complete guide to AI implementation for professional service firms. What it costs, how long it takes, what goes wrong, and how to do it properly.',
  focusKeyword: 'ai implementation for small business uk',
  secondaryKeywords: 'ai implementation, ai implementation cost uk, ai implementation partner, how to implement ai, ai for professional services',
  ogType: 'article',
  twitterCard: 'summary_large_image',
  robotsIndex: 'index',
  robotsFollow: 'follow',
}

const excerpt = 'The complete guide to AI implementation for professional service firms. What it costs, how long it takes, what goes wrong, and how to do it properly. No jargon, no hype.'

// Create as DRAFT
const res = await fetch(`${BASE}/article`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${JWT}` },
  body: JSON.stringify({
    title: 'The AI Implementation Playbook for Service Businesses',
    slug: 'ai-implementation-playbook',
    body,
    seo,
    excerpt,
  }),
})

const result = await res.json()
console.log(`Status: ${res.status}`)
console.log(`ID: ${result.data?.id}`)
console.log(`Title: ${result.data?.title}`)
console.log(`Slug: ${result.data?.slug}`)
console.log(`Status: ${result.data?.status}`)
console.log(`Body blocks: ${result.data?.body?.content?.length}`)
console.log(`SEO: ${result.data?.seo?.metaTitle}`)

if (!res.ok) console.error('Error:', result)
else console.log('\nArticle created as DRAFT. Publish from CMS admin when ready.')
