# chrisgarlick.com — Audience Expansion Strategy
> Targeting sole traders, freelancers, consultants, tradespeople, and agency starters alongside existing professional services positioning.

---

## Site Structure

Pages should live under `/for/` to feel approachable rather than salesy.

| URL | Audience |
|-----|----------|
| `/for/solo-operators` | One-person businesses running on AI |
| `/for/freelancers` | Freelancers wanting to take on more without hiring |
| `/for/consultants` | Independent consultants productising their expertise |
| `/for/tradespeople` | Trades who don't have time for marketing |
| `/for/agency-starters` | People building AI-enabled agencies from scratch |

---

## Page Template (replicate across all five)

Each page follows this structure:

1. **The thing you're not doing** — name the exact pain point
2. **Why it matters** — cost of inaction in real terms
3. **How AI does it** — specific workflow, specific time saving
4. **What you get** — concrete output they can picture
5. **CTA** — free audit, discovery call, or gated resource download

---

## Page 1: `/for/solo-operators`

**Headline:** Running a one-person business is hard enough. AI should be doing the heavy lifting.

**Core message:** You're doing everything yourself — client work, admin, marketing, social. AI handles the parts you never get to.

### Workflows to feature

| Workflow | Time saving | Output |
|----------|-------------|--------|
| Weekly content calendar from one voice note | 3 hrs → 10 mins | 7 days of posts, scheduled |
| Automated review requests after every job | Set once, runs forever | More Google reviews, less chasing |
| Case studies from a 5-minute client debrief | 2 hrs → 15 mins | Published case study, SEO-ready |
| Monthly SEO blog post from a topic you know | Never done → done | Organic traffic, no writer needed |

---

## Page 2: `/for/freelancers`

**Headline:** Take on more clients without taking on more hours.

**Core message:** AI doesn't replace your expertise — it removes the overhead that stops you scaling.

### Workflows to feature

| Workflow | Time saving | Output |
|----------|-------------|--------|
| Proposal generation from a brief | 2 hrs → 10 mins | Polished, personalised proposal |
| LinkedIn posts from client work | Never done → automated | Consistent presence, more inbound |
| Ad copy variants for lead gen | Agency cost → zero | 10 tested variants, no copywriter |
| Automated onboarding emails | Manual → hands-off | Clients feel looked after from day one |

---

## Page 3: `/for/consultants`

**Headline:** Your frameworks are worth more than one-to-one hours. Here's how to leverage them.

**Core message:** The most valuable thing you own is your methodology. AI turns it into content, courses, and inbound leads while you focus on delivery.

### Workflows to feature

| Workflow | Time saving | Output |
|----------|-------------|--------|
| Turn one workshop into 10 content pieces | 1 day → 1 hr | Blog, LinkedIn, email, short-form video |
| AI-generated thought leadership from your frameworks | Never done → weekly | Authority content at volume |
| Short-form video scripts from existing blog posts | Production cost → zero | Reels/Shorts without a studio |
| SEO landing pages for each niche you serve | Months → days | Targeted organic traffic per vertical |

---

## Page 4: `/for/tradespeople`

**Headline:** Your work speaks for itself. Let AI make sure the right people see it.

**Core message:** You don't have time to post, follow up, or run ads. AI does all of that from your phone, in minutes, without sounding like a robot.

### Workflows to feature

| Workflow | Time saving | Output |
|----------|-------------|--------|
| Before/after video ads from phone photos | Agency cost → free | Scroll-stopping Reels/TikToks |
| Google Business posts on autopilot | Never done → weekly | Better local SEO, more calls |
| Seasonal campaign copy | £500/campaign → £0 | Ready-to-run ads for summer, pre-winter etc |
| Quote follow-up sequences | Manual chasing → automated | More conversions, less awkward calls |

---

## Page 5: `/for/agency-starters`

**Headline:** You don't need a team. You need the right stack.

**Core message:** The Cameron England thread had it right — you + AI can replace a five-person team. Here's exactly how to set it up.

### Workflows to feature

| Workflow | Time saving | Output |
|----------|-------------|--------|
| Full client onboarding pack from one brief | Days → 30 mins | Contracts, welcome docs, comms, all done |
| AI delivery stack replacing a 5-person team | £10k/month → £200-500/month | Ad copy, funnels, follow-ups, booking |
| Automated reporting that looks senior | 4 hrs/month → 20 mins | Client-ready reports, branded |
| Cold outreach sequences personalised at scale | VA cost → zero | Booked calls without a setter |

---

## Gated Resource Ideas (one per page, email capture)

| Page | Resource |
|------|----------|
| Solo operators | "My exact AI stack for running a business in under 2 hours a day" |
| Freelancers | "The freelancer's AI proposal pack — win more clients, write less" |
| Consultants | "How to turn one framework into 6 months of content" |
| Tradespeople | "The 5 AI tools every tradesperson should be using in 2026" |
| Agency starters | "The zero-team agency playbook — from first client to £10k/month" |

---

## Prospect Outreach — Claude Skill

### Purpose
Find and collate a list of businesses, freelancers, and tradespeople who are active online but clearly not leveraging AI in their marketing, content, or operations. Output a CSV ready for email outreach.

### Skill Prompt

Use the following as a Claude skill or system prompt for a prospecting workflow:

```
You are a prospect research assistant for Chris Garlick, an AI implementation specialist based in the UK (chrisgarlick.com).

Your job is to find and collate a list of potential prospects who would benefit from AI-assisted workflows for marketing, content, SEO, or operations. These are sole traders, freelancers, consultants, and tradespeople in the UK.

For each prospect, find:
- Business name
- Owner/contact name (if available)
- Website URL
- Email address or contact method
- What they currently do for marketing (LinkedIn presence, blog, social, ads)
- What they are clearly NOT doing (no blog, no video, no email list, no reviews)
- Which /for/ page on chrisgarlick.com is most relevant to them
- A one-line personalisation note for the outreach email

Target verticals (start with these):
- Law firms (sole practitioners, small firms)
- Independent financial advisors
- Bathroom/kitchen remodellers
- Landscapers and groundskeepers
- Physiotherapists and sports therapists
- Independent consultants (HR, strategy, operations)
- Freelance designers, developers, copywriters
- Nutritionists and personal trainers

Search methods:
- Google search: "[vertical] + [UK city]" — scan first page listings
- Google Maps listings with few or no reviews
- LinkedIn search: "freelance [role] UK" — look for sparse activity
- Directories: Checkatrade, Rated People, Bark.com, FreeIndex

Output format: CSV with columns:
Name, Business, Website, Email, Vertical, Missing, RelevantPage, PersonalisationNote
```

### Example Output Row

```
Jane Smith, JS Physio, jsphysio.co.uk, jane@jsphysio.co.uk, Physiotherapist, No blog / no video / 4 Google reviews, /for/tradespeople, "Noticed you're on Bark but no Google reviews or social presence — AI could automate both"
```

---

## Outreach Email Template

**Subject:** Quick question about your marketing, [First Name]

---

Hi [First Name],

I came across [Business Name] — [one-line personalisation, e.g. "looks like you do great work but your online presence doesn't quite reflect that yet"].

I work with small businesses and sole traders helping them use AI to handle the marketing, content, and SEO stuff that always gets pushed to the bottom of the list.

Things like:

- Turning a finished job into a Google review request automatically
- Getting a blog post or social content out without spending hours writing
- Running follow-up sequences on quotes that never got a reply

Most of my clients are running this in under an hour a week once it's set up.

If it's something you've thought about but never had time to look into, I'm happy to take a look at your setup and tell you where the quick wins are — no cost, no pitch.

Worth a quick call?

Chris
chrisgarlick.com

---

**Notes on tone:**
- No AI buzzwords in the email (don't say "leverage AI" or "AI-powered")
- Reference something specific about their business in the first line
- The offer is low-commitment — a look, not a sale
- Keep it under 150 words
- Sign off as a person, not a company

---

## Next Steps

1. Build the five `/for/` pages using the page template above
2. Create one gated resource per page (PDF or Notion export)
3. Add the Kritano free audit widget as the CTA on each page
4. Run the prospect outreach skill to build the first batch of 50 contacts
5. Send outreach in batches of 10-15, personalised per vertical
6. Track responses — which vertical converts best becomes the content focus