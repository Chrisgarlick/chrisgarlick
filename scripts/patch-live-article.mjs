/**
 * Patch the live article on chrisgarlick.com with body + SEO data.
 */

const JWT = process.env.JWT_TOKEN
const ARTICLE_ID = '5707eea1-2b89-428a-bee5-01f93d0e77d5'
const BASE = 'https://chrisgarlick.com/api'

// -- TipTap JSON body --
const body = {
  type: "doc",
  content: [
    p([
      t("Have you ever watched a company pour money into AI tools, hire a few consultants, launch a pilot programme - and then... nothing changes? The tools sit there. The team goes back to their old workflows. Leadership quietly stops asking about the ROI.")
    ]),
    p([
      t("If that sounds familiar, you're not alone. New data from "),
      link("Writer's 2026 Enterprise AI Adoption report", "https://writer.com/blog/enterprise-ai-adoption-2026/"),
      t(" shows that 79% of organisations face significant challenges adopting AI - a double-digit increase from 2025. This is happening despite record investment. We're talking "),
      link("$650 billion annually", "https://www.globenewswire.com/news-release/2026/05/05/3288006/0/en/AI-Investment-Activity-to-Surpass-650-Billion-Annually-as-Enterprise-Adoption-Accelerates-Toward-2026.html"),
      t(" flowing into AI infrastructure globally.")
    ]),
    p([
      t("The spending is going up. The results aren't keeping pace. And the gap between AI leaders and everyone else is widening fast.")
    ]),
    h2("The AI Adoption Gap Is Wider Than You Think"),
    p([
      t("Here's the stat that stopped me in my tracks. "),
      link("PwC's 2026 AI Performance Study", "https://www.pwc.com/gx/en/news-room/press-releases/2026/pwc-2026-ai-performance-study.html"),
      t(" surveyed 1,217 senior executives across 25 sectors and found that 74% of AI's economic value is being captured by just 20% of companies.")
    ]),
    p([
      t("Let that sink in. A fifth of businesses are taking three-quarters of the value. Everyone else is essentially paying to participate without seeing meaningful returns.")
    ]),
    p([
      t("Only "),
      link("29% of organisations report significant ROI from generative AI", "https://writer.com/blog/enterprise-ai-adoption-2026/"),
      t(", and just 23% report significant returns from AI agents. Meanwhile, 54% of C-suite executives admit that adopting AI is \"tearing their company apart.\"")
    ]),
    p([
      t("That's not a technology problem. That's an implementation problem.")
    ]),
    h2("Why Most Companies Are Getting It Wrong"),
    p([
      t("In my experience working with businesses on AI integration, the pattern is remarkably consistent. Companies that struggle with AI adoption almost always make the same mistakes.")
    ]),
    p([
      bold("They buy tools before defining workflows."),
      t(" This is the number one issue I see. A business reads about a new AI platform, signs up, hands it to a team, and expects magic. But AI doesn't fix broken processes - it accelerates them. If your workflow was messy before AI, it'll be messier and faster afterwards.")
    ]),
    p([
      bold("They skip the strategy step entirely."),
      t(" According to the PwC study, the companies winning at AI are "),
      link("1.9x more likely to deploy autonomous workflows within guardrails", "https://www.pwc.com/gx/en/news-room/press-releases/2026/pwc-2026-ai-performance-study.html"),
      t(" and 1.7x more likely to have a responsible AI governance framework. That's not coincidence - that's discipline. The majority of businesses don't have either.")
    ]),
    p([
      bold("They treat AI as a project, not a capability."),
      t(" Pilot programmes run for three months, produce a report, and then... nothing gets operationalised. The pilot never becomes production because nobody planned for what comes after the experiment.")
    ]),
    h2("What the Top 20% Do Differently"),
    p([
      t("The PwC study is particularly useful here because it doesn't just identify the problem - it identifies what separates the leaders from everyone else.")
    ]),
    p([
      bold("They focus on growth, not just efficiency."),
      t(" The top-performing companies aren't just using AI to cut costs. They're using it to create new revenue streams and pursue opportunities created by industry convergence. PwC found that "),
      link("pursuing growth opportunities from industry convergence is the single strongest factor", "https://www.pwc.com/gx/en/news-room/press-releases/2026/pwc-2026-ai-performance-study.html"),
      t(" influencing AI-driven financial performance - ahead of efficiency gains alone.")
    ]),
    p([
      bold("They invest in governance alongside technology."),
      t(" AI leaders are 1.7x more likely to have a responsible AI framework and 1.5x more likely to have a cross-functional AI governance board. This sounds like overhead, but it's actually what enables scale. Without governance, every AI deployment is a one-off experiment.")
    ]),
    p([
      bold("They start with process, not tools."),
      t(" Before buying anything, leading companies map their workflows end to end. They identify the highest-impact, most repetitive processes and build AI around those specific needs. The tool is always the last decision, not the first.")
    ]),
    h2("The Real Cost of Getting AI Wrong"),
    p([
      t("Here's what makes this urgent. The gap isn't static - it's accelerating.")
    ]),
    p([
      link("Grant Thornton's 2026 AI Impact Survey", "https://www.grantthornton.com/services/advisory-services/artificial-intelligence/2026-ai-impact-survey"),
      t(" found that 92% of early adopters now report positive returns, earning $1.49 for every $1 invested. The companies that got their implementation right early are compounding their advantage.")
    ]),
    p([
      t("Meanwhile, "),
      link("61% of senior business leaders", "https://www.grantthornton.com/services/advisory-services/artificial-intelligence/2026-ai-impact-survey"),
      t(" feel more pressure to prove ROI on their AI investments than a year ago, with 53% of investors expecting positive ROI within six months.")
    ]),
    p([
      t("The window for leisurely pilot programmes is closing. Businesses that haven't moved past experimentation are facing a real competitive disadvantage - not in theory, but in measurable financial performance.")
    ]),
    h2("What You Can Actually Do About It"),
    p([
      t("If this data resonates with your own experience, here's what I'd recommend based on what I've seen work in practice.")
    ]),
    p([
      bold("Map before you buy."),
      t(" Take your most painful, repetitive workflow and document every step. On paper or a whiteboard - it doesn't matter. Until you can describe the process clearly, no AI tool will improve it. This step costs nothing and saves thousands in misdirected tool spending.")
    ]),
    p([
      bold("Pick one process and prove ROI."),
      t(" Don't try to \"transform the business with AI.\" Pick one high-impact, high-volume process and automate it properly. Measure the before and after. That proof point is what gets buy-in for the next project - and the next.")
    ]),
    p([
      bold("Get governance in place early."),
      t(" It doesn't need to be a 50-page document. Start with three things: what data can AI access, who reviews AI outputs before they reach clients, and how you'll measure success. That's your governance framework v1.")
    ]),
    p([
      bold("Stop treating AI as a tech project."),
      t(" The companies in PwC's top 20% have cross-functional teams leading AI adoption - not just the IT department. This is a business strategy conversation, not a technology one.")
    ]),
    h2("My Take"),
    p([
      t("In my honest opinion, the AI adoption gap isn't going to close on its own. The companies getting it right are pulling further ahead, and the ones stuck in pilot mode are falling further behind. But here's the good news - the fix isn't complicated. It's not about buying better tools or hiring more data scientists. It's about starting with strategy, implementing with discipline, and measuring what actually matters.")
    ]),
    p([
      t("The 79% struggling with AI adoption aren't struggling because AI doesn't work. They're struggling because implementation without strategy is just expensive experimentation.")
    ]),
    p([
      t("If you're looking at your own AI adoption and it's not delivering the results you expected, I'd love to have a chat about what might be going wrong and how to fix it. Drop me a message - sometimes a fresh pair of eyes on the problem is all it takes.")
    ]),
    h2("Frequently Asked Questions"),
    h3("Why are so many companies failing at AI adoption?"),
    p([
      t("Most companies fail at AI adoption because they buy tools before defining workflows. 79% of enterprises face adoption challenges despite record spending, largely because they skip the strategy and process-mapping steps that determine whether AI delivers real value.")
    ]),
    h3("What percentage of companies see ROI from AI?"),
    p([
      t("Only 29% of organisations report significant ROI from generative AI. However, 92% of early adopters who implemented AI with clear strategy and governance report positive returns, earning $1.49 for every $1 invested.")
    ]),
    h3("How do successful companies implement AI differently?"),
    p([
      t("Successful AI adopters are 1.9x more likely to deploy autonomous workflows within guardrails and 1.7x more likely to have a responsible AI governance framework. They focus on revenue growth rather than just cost cutting, and they start with process mapping before selecting tools.")
    ]),
    h3("What should a business do first when adopting AI?"),
    p([
      t("Map your most repetitive, high-volume workflow end to end before buying any AI tools. Document every step, identify where human time is wasted on repetitive tasks, and then evaluate which tools address those specific pain points. Strategy first, tools second.")
    ]),
    h3("How much are companies investing in AI?"),
    p([
      t("Global AI infrastructure investment has reached $650 billion annually. However, PwC found that 74% of the economic value goes to just 20% of companies - proving that the amount spent matters far less than how it's implemented.")
    ]),
  ]
}

const seo = {
  metaTitle: "Why 79% of Enterprises Are Failing at AI Adoption",
  metaDescription: "79% of enterprises face AI adoption challenges despite record spending. Here's why most companies are stuck in pilot mode and what the top 20% do differently.",
  focusKeyword: "ai adoption challenges",
  secondaryKeywords: "enterprise AI adoption, AI implementation challenges, AI ROI, AI strategy for business, AI adoption gap",
  ogType: "article",
  twitterCard: "summary_large_image",
  robotsIndex: "index",
  robotsFollow: "follow",
}

const payload = {
  body,
  seo,
  excerpt: "79% of enterprises face AI adoption challenges despite record spending. Here's why most companies are stuck in pilot mode and what the top 20% do differently.",
}

// PATCH the article
const res = await fetch(`${BASE}/article/${ARTICLE_ID}`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${JWT}`,
  },
  body: JSON.stringify(payload),
})

const result = await res.json()
console.log(`Status: ${res.status}`)
console.log(`Title: ${result.data?.title}`)
console.log(`SEO meta title: ${result.data?.seo?.metaTitle}`)
console.log(`SEO focus keyword: ${result.data?.seo?.focusKeyword}`)
console.log(`Body blocks: ${result.data?.body?.content?.length}`)
console.log(`Excerpt: ${result.data?.excerpt?.slice(0, 80)}...`)

if (res.status !== 200) {
  console.error('Error:', JSON.stringify(result, null, 2))
}

// Now publish it
console.log('\nPublishing...')
const pubRes = await fetch(`${BASE}/article/${ARTICLE_ID}/publish`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${JWT}`,
  },
})
const pubResult = await pubRes.json()
console.log(`Publish status: ${pubRes.status}`)
console.log(`Article status: ${pubResult.data?.status}`)
console.log(`Published at: ${pubResult.data?.published_at}`)

if (pubRes.status !== 200) {
  console.error('Publish error:', JSON.stringify(pubResult, null, 2))
}

// -- Helpers --
function t(text) { return { type: "text", text } }
function bold(text) { return { type: "text", text, marks: [{ type: "bold" }] } }
function link(text, href) { return { type: "text", text, marks: [{ type: "link", attrs: { href, target: null } }] } }
function p(content) { return { type: "paragraph", content } }
function h2(text) { return { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text }] } }
function h3(text) { return { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text }] } }
