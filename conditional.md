# AI Readiness Audit — Full Build Specification
## Conditional Intake Form + Claude Skill + Typst PDF Delivery Pipeline

*Version 1.0 — May 2026*

---

## Overview

A lead generation and qualification system that delivers a bespoke AI readiness audit PDF to prospective clients. The prospect fills in a conditional intake form tailored to their sector, their submission is enriched with their Kritano site audit and Companies House data, and a Claude skill assembles a structured audit document rendered via Typst — delivered to the prospect within 24 hours.

**The audit serves three purposes simultaneously:**
1. Qualifies the prospect (reveals budget, pain, readiness)
2. Delivers genuine value (specific, actionable, priced)
3. Positions Chris as the obvious person to build it

**The deliberate design constraint:** Output describes *what* to build and *why*, not *how* to build it. Credible and specific enough to be compelling. Not a build guide.

---

## Part 1: System Architecture

```
Prospect fills in conditional intake form (/audit)
    │
    ▼
Form submission stored + email notification sent to Chris
    │
    ▼
Automated enrichment pipeline (triggered on submission)
    ├── Kritano site audit pull (their website URL)
    └── Companies House API pull (company name → officer + profile data)
    │
    ▼
Chris reviews enrichment data, approves for generation
(Optional: add manual notes before generation)
    │
    ▼
Claude Skill: AI Readiness Audit Generator
    ├── Input: form data + site audit + CH data + manual notes
    └── Output: structured JSON audit content
    │
    ▼
Typst renderer
    └── JSON → formatted PDF
    │
    ▼
Chris reviews PDF (5–10 min)
    │
    ▼
PDF delivered to prospect via email (Resend)
    └── Follow-up sequence triggered (T+48h, T+5d)
```

**Key design decision:** Chris reviews and approves before generation, and reviews the PDF before sending. This is not a fully automated self-serve tool — it's a human-in-the-loop system that scales effort, not replaces it. The review step is also the qualification filter.

---

## Part 2: Intake Form — `/audit`

### 2.1 Page Design

- Dedicated page, no global navigation (same principle as `/start`)
- Multi-step form — one concept per screen, not one long scroll
- Progress indicator ("Step 2 of 4")
- Conditional fields rendered client-side (React state or Alpine.js)
- Form submission via POST to Node/Express API endpoint
- Thank you screen on completion: *"Your audit is being prepared. You'll receive it within 24 hours."*

### 2.2 Form Steps

---

**Step 1 — About Your Business**

| Field | Type | Required |
|-------|------|----------|
| Your name | Text | Yes |
| Email address | Email | Yes |
| Company name | Text | Yes |
| Company website | URL | Yes |
| How did you find me? | Select: LinkedIn / Google / Referral / Other | No |

---

**Step 2 — Your Sector**
*(Drives all conditional logic in Step 3)*

| Field | Type | Required |
|-------|------|----------|
| What best describes your business? | Select (see options below) | Yes |

Options:
- Law firm / solicitors
- Accountancy practice
- Creative / marketing agency
- Consultancy
- Recruitment agency
- Architecture / engineering
- Other professional services

---

**Step 3 — Sector-Specific Questions**
*(Fields shown conditionally based on Step 2 selection)*

**If: Law firm / solicitors**

| Field | Type |
|-------|------|
| What case management software do you use? | Text (e.g. Clio, Osprey, LEAP, none) |
| Roughly how many new matters do you open per month? | Select: < 10 / 10–30 / 30–60 / 60+ |
| How do new client enquiries currently arrive? | Multi-select: Phone / Email / Web form / Referral / Walk-in |
| Where does your team spend the most manual time? | Multi-select: Client intake / Document drafting / Document review / Billing / Reporting / Compliance |
| Do you currently use any AI or automation tools? | Select: Yes / No / Not sure |
| If yes, which ones? | Text (conditional on above) |

---

**If: Accountancy practice**

| Field | Type |
|-------|------|
| What accounting software do you use? | Text (e.g. Xero, QuickBooks, Sage, FreeAgent) |
| How does client data typically arrive? | Multi-select: Email attachments / Client portal / Post / Bank feed / Spreadsheets |
| Roughly how many active clients do you manage? | Select: < 25 / 25–100 / 100–250 / 250+ |
| Where does your team spend the most manual time? | Multi-select: Data entry / Reconciliation / Report generation / Client onboarding / VAT returns / Chasing clients |
| Do you currently use any AI or automation tools? | Select: Yes / No / Not sure |
| If yes, which ones? | Text (conditional on above) |

---

**If: Creative / marketing agency**

| Field | Type |
|-------|------|
| What project management tool do you use? | Text (e.g. Asana, Monday, Notion, ClickUp, none) |
| How do client briefs typically arrive? | Multi-select: Email / Brief form / Call / Slack / Meeting |
| Roughly how many active client accounts do you run? | Select: 1–5 / 5–15 / 15–30 / 30+ |
| Where does your team spend the most manual time? | Multi-select: Brief processing / Content creation / Reporting / Client communication / Invoicing / Research |
| Do you currently produce regular client reports? | Select: Yes, manually / Yes, semi-automated / No |
| Do you currently use any AI or automation tools? | Select: Yes / No / Not sure |
| If yes, which ones? | Text (conditional on above) |

---

**If: Consultancy**

| Field | Type |
|-------|------|
| What type of consultancy? | Text (e.g. management, HR, IT, strategy) |
| How do new engagements typically start? | Multi-select: RFP / Referral / Direct outreach / Inbound / Tender |
| Where does your team spend the most manual time? | Multi-select: Proposal writing / Research / Report generation / Client communication / Billing / Data analysis |
| Do you produce client deliverables regularly? | Select: Yes — weekly / Yes — monthly / Yes — per project / No |
| Do you currently use any AI or automation tools? | Select: Yes / No / Not sure |
| If yes, which ones? | Text (conditional on above) |

---

**If: Recruitment agency**

| Field | Type |
|-------|------|
| What ATS (applicant tracking system) do you use? | Text (e.g. Bullhorn, Vincere, none) |
| Roughly how many roles are you working at any time? | Select: < 10 / 10–30 / 30–60 / 60+ |
| Where does your team spend the most manual time? | Multi-select: CV screening / Candidate outreach / Job posting / Client reporting / Interview scheduling / Reference checks |
| Do you currently use any AI or automation tools? | Select: Yes / No / Not sure |
| If yes, which ones? | Text (conditional on above) |

---

**If: Architecture / engineering**

| Field | Type |
|-------|------|
| What project management or CAD tooling do you use? | Text |
| Where does your team spend the most manual time? | Multi-select: Client briefing / Specification writing / Compliance documentation / Reporting / Invoicing / Tender preparation |
| Do you currently use any AI or automation tools? | Select: Yes / No / Not sure |
| If yes, which ones? | Text (conditional on above) |

---

**If: Other professional services**

| Field | Type |
|-------|------|
| Briefly describe what your business does | Textarea |
| Where does your team spend the most manual time? | Textarea |
| Do you currently use any AI or automation tools? | Select: Yes / No / Not sure |
| If yes, which ones? | Text (conditional on above) |

---

**Step 4 — Universal (All Sectors)**

| Field | Type | Required |
|-------|------|----------|
| How many people are in your team? | Select: Just me / 2–5 / 6–15 / 16–50 / 50+ | Yes |
| What is your biggest manual bottleneck right now? | Textarea (2–3 sentences) | Yes |
| What would a win look like in 6 months? | Textarea (1–2 sentences) | No |
| Have you had a budget conversation internally about AI? | Select: Yes, budget allocated / Yes, exploring / No, not yet | No |
| Anything else you'd like me to know? | Textarea | No |

---

### 2.3 Form Submission Handler

**POST `/api/audit/submit`**

```javascript
// Stores submission, triggers enrichment, notifies Chris

import { db } from '../db.js'; // Your existing DB layer
import { resend } from '../email/resend.js'; // Existing Resend wrapper
import { triggerEnrichment } from './enrichment.js';

export async function handleAuditSubmission(req, res) {
  const submission = req.body;

  // Validate required fields
  const required = ['name', 'email', 'companyName', 'website', 'sector'];
  for (const field of required) {
    if (!submission[field]) {
      return res.status(400).json({ error: `Missing required field: ${field}` });
    }
  }

  // Store submission
  const auditId = await db.auditSubmissions.create({
    ...submission,
    status: 'pending_enrichment',
    submittedAt: new Date().toISOString()
  });

  // Trigger async enrichment pipeline
  triggerEnrichment(auditId, submission).catch(console.error);

  // Notify Chris
  await resend.send({
    to: 'chris@chrisgarlick.com',
    subject: `New AI audit request: ${submission.companyName}`,
    html: `
      <h2>New audit submission</h2>
      <p><strong>Company:</strong> ${submission.companyName}</p>
      <p><strong>Name:</strong> ${submission.name}</p>
      <p><strong>Email:</strong> ${submission.email}</p>
      <p><strong>Sector:</strong> ${submission.sector}</p>
      <p><strong>Website:</strong> ${submission.website}</p>
      <p><strong>Bottleneck:</strong> ${submission.biggestBottleneck}</p>
      <br>
      <a href="https://chrisgarlick.com/admin/audits/${auditId}">
        Review in admin →
      </a>
    `
  });

  // Acknowledge to prospect
  await resend.send({
    to: submission.email,
    subject: 'Your AI readiness audit is being prepared',
    html: `
      <p>Hi ${submission.name},</p>
      <p>Thanks for submitting your audit request. I'm reviewing your details
      and will have your personalised AI readiness report over to you within
      24 hours.</p>
      <p>If you have any questions in the meantime, reply to this email.</p>
      <p>Chris</p>
    `
  });

  return res.json({ success: true, auditId });
}
```

---

## Part 3: Enrichment Pipeline

### 3.1 What Gets Pulled Automatically

On form submission, two enrichment jobs run in parallel:

**Job 1: Kritano Site Audit**
- Triggers an existing Kritano audit job against their `website` URL
- Pulls: SEO score, performance score, accessibility score, Core Web Vitals, broken links, structured data issues
- Stores results against the audit submission ID
- Estimated run time: 60–90 seconds

**Job 2: Companies House**
- Searches by company name
- Pulls: company number, SIC codes, incorporation date, registered address, active directors, company status, last accounts filed
- Stores results against the audit submission ID
- Estimated run time: 2–5 seconds

### 3.2 Enrichment Service

**`enrichment.js`**

```javascript
import axios from 'axios';
import { db } from '../db.js';

const CH_BASE = 'https://api.company-information.service.gov.uk';
const CH_AUTH = {
  auth: { username: process.env.COMPANIES_HOUSE_API_KEY, password: '' }
};

export async function triggerEnrichment(auditId, submission) {
  await db.auditSubmissions.update(auditId, { status: 'enriching' });

  const [kritanoData, chData] = await Promise.allSettled([
    runKritanoAudit(submission.website),
    runCompaniesHouseLookup(submission.companyName)
  ]);

  await db.auditSubmissions.update(auditId, {
    kritanoAudit: kritanoData.status === 'fulfilled' ? kritanoData.value : null,
    companiesHouse: chData.status === 'fulfilled' ? chData.value : null,
    status: 'ready_for_review',
    enrichedAt: new Date().toISOString()
  });
}

async function runKritanoAudit(url) {
  // Trigger your existing Kritano audit queue job
  // Returns audit scores + issues
  const job = await kritanoQueue.add({ url });
  return await job.waitForResult();
}

async function runCompaniesHouseLookup(companyName) {
  // Search for company
  const searchRes = await axios.get(`${CH_BASE}/advanced-search/companies`, {
    ...CH_AUTH,
    params: {
      company_name_includes: companyName,
      company_status: 'active',
      size: 3
    }
  });

  const companies = searchRes.data.items || [];
  if (companies.length === 0) return null;

  // Take best match (first result)
  const company = companies[0];

  // Get officers
  const officersRes = await axios.get(
    `${CH_BASE}/company/${company.company_number}/officers`,
    CH_AUTH
  );

  const directors = (officersRes.data.items || [])
    .filter(o => o.officer_role === 'director' && !o.resigned_on)
    .map(o => ({ name: o.name, appointedOn: o.appointed_on }));

  return {
    companyName: company.company_name,
    companyNumber: company.company_number,
    incorporatedOn: company.date_of_creation,
    sicCodes: company.sic_codes,
    address: company.registered_office_address,
    status: company.company_status,
    directors
  };
}
```

---

## Part 4: Admin Review Interface

A simple admin view at `/admin/audits/[id]` showing:

- Form submission data (all fields)
- Enrichment status indicator
- Kritano audit scores summary
- Companies House data summary
- A **Notes** field — Chris can add context before generation ("spoke to them on LinkedIn", "seems like a good fit for workflow automation", "budget likely £2–5k")
- Two buttons: **Generate Audit** and **Skip** (mark as not a fit)

This is where you decide whether to proceed. The enrichment data makes that decision fast — you can see their site health, how established the business is, and whether their pain points match your service offering in about 60 seconds.

---

## Part 5: Claude Skill — AI Readiness Audit Generator

### 5.1 Skill Overview

The skill takes all enrichment data plus the form submission and produces a structured JSON object representing the full audit. JSON is then passed to the Typst renderer to produce the PDF.

Using JSON as the intermediate format means:
- Clean separation between content and presentation
- Easy to adjust the template without changing the skill
- Content can be logged, versioned, and edited before rendering

### 5.2 Skill Invocation

**POST `/api/audit/generate/[auditId]`**

```javascript
import Anthropic from '@anthropic-ai/sdk';
import { db } from '../db.js';
import { renderPdf } from '../pdf/typst.js';

const client = new Anthropic();

export async function generateAudit(auditId) {
  const submission = await db.auditSubmissions.get(auditId);
  const { formData, kritanoAudit, companiesHouse, notes } = submission;

  const prompt = buildPrompt(formData, kritanoAudit, companiesHouse, notes);

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: prompt }]
  });

  const rawJson = message.content[0].text;
  const auditContent = JSON.parse(
    rawJson.replace(/```json|```/g, '').trim()
  );

  // Store generated content
  await db.auditSubmissions.update(auditId, {
    generatedContent: auditContent,
    status: 'pdf_pending'
  });

  // Render PDF
  const pdfPath = await renderPdf(auditContent, auditId);

  await db.auditSubmissions.update(auditId, {
    pdfPath,
    status: 'ready_to_send'
  });

  return { auditContent, pdfPath };
}
```

### 5.3 System Prompt

```
You are producing a professional AI readiness audit on behalf of Chris Garlick,
a UK-based AI implementation specialist. Chris reviews every audit before it is sent.

Your output must be a single valid JSON object — no preamble, no explanation,
no markdown fences. The JSON structure is defined below.

Tone: direct, specific, authoritative. Not salesy. Not vague.
Write as if you know their business well and have spotted real opportunities.
Every recommendation must be grounded in the data provided — do not invent
workflows that aren't evidenced by the form answers or enrichment data.

Pricing guidance (use these ranges per workflow — Chris will adjust before sending):
- Simple automation (form → CRM, data formatting, basic triggers): £800–£1,500
- Document generation / templating pipeline: £1,200–£2,000
- Data extraction pipeline (PDF/email → structured data): £1,500–£2,500
- Custom AI agent (research, drafting, triage): £2,000–£3,500
- Full intake to CRM pipeline with AI processing: £2,500–£4,000
- Complex multi-step workflow with integrations: £3,000–£5,000+

Monthly maintenance retainer (per workflow maintained): £150–£300/month

Always provide a "project total estimate" range at the end covering all
recommended workflows combined.

The "what to build" descriptions should be specific enough to be credible
but should NOT include implementation code, specific API calls, or step-by-step
technical instructions. Describe the system, not how to build it.
```

### 5.4 User Prompt Builder

```javascript
function buildPrompt(formData, kritanoAudit, companiesHouse, notes) {
  return `
Generate an AI readiness audit for the following business.

---

FORM SUBMISSION:
Name: ${formData.name}
Company: ${formData.companyName}
Sector: ${formData.sector}
Team size: ${formData.teamSize}
Website: ${formData.website}
Biggest bottleneck: ${formData.biggestBottleneck}
6-month win: ${formData.sixMonthWin || 'Not provided'}
Budget status: ${formData.budgetStatus || 'Not provided'}
AI tools currently used: ${formData.aiToolsCurrently || 'None'}

Sector-specific answers:
${JSON.stringify(formData.sectorFields, null, 2)}

---

KRITANO SITE AUDIT:
${kritanoAudit ? `
SEO Score: ${kritanoAudit.seoScore}/100
Performance Score: ${kritanoAudit.performanceScore}/100
Accessibility Score: ${kritanoAudit.accessibilityScore}/100
Core Web Vitals: ${JSON.stringify(kritanoAudit.coreWebVitals)}
Key issues found: ${kritanoAudit.topIssues?.join(', ') || 'None'}
` : 'Site audit not available'}

---

COMPANIES HOUSE DATA:
${companiesHouse ? `
Company: ${companiesHouse.companyName} (${companiesHouse.companyNumber})
Incorporated: ${companiesHouse.incorporatedOn}
SIC codes: ${companiesHouse.sicCodes?.join(', ')}
Directors: ${companiesHouse.directors?.map(d => d.name).join(', ')}
Status: ${companiesHouse.status}
` : 'Companies House data not available'}

---

CHRIS'S NOTES:
${notes || 'None'}

---

Produce the audit JSON now. Follow the schema exactly.
`.trim();
}
```

### 5.5 Output JSON Schema

```javascript
{
  // Cover data
  "prospect": {
    "name": "string",
    "company": "string",
    "sector": "string",
    "website": "string",
    "preparedBy": "Chris Garlick",
    "preparedDate": "string", // ISO date
    "auditRef": "string" // e.g. "CG-2026-047"
  },

  // Executive summary — 2–3 sentences
  "executiveSummary": "string",

  // Business snapshot — inferred from all data
  "businessSnapshot": {
    "description": "string", // 1 paragraph — what the business does
    "teamSize": "string",
    "established": "string", // from CH incorporation date
    "currentTooling": "string", // what they already use
    "aiMaturityLevel": "Low | Medium | High", // inferred
    "aiMaturityNotes": "string" // why that rating
  },

  // Identified workflows — 3–5 items ranked by opportunity
  "workflows": [
    {
      "rank": 1,
      "name": "string", // e.g. "Client Intake Automation"
      "currentState": "string", // how it works now
      "problem": "string", // what this costs them
      "proposedSolution": "string", // what to build — specific but not a build guide
      "automationType": "Workflow Automation | AI Agent | Data Extraction | Combined",
      "estimatedTimeSavedPerWeek": "string", // e.g. "4–6 hours"
      "complexity": "Low | Medium | High",
      "priority": "Quick win | Core build | Phase 2",
      "estimatedBuildCost": "string", // e.g. "£1,200–£1,800"
      "estimatedMonthlyCost": "string" // maintenance retainer
    }
  ],

  // Site health (from Kritano) — only if audit available
  "siteHealth": {
    "included": true,
    "seoScore": 0,
    "performanceScore": 0,
    "accessibilityScore": 0,
    "topIssues": ["string"],
    "recommendation": "string" // 1–2 sentences on site vs automation priority
  },

  // Recommended engagement
  "recommendedEngagement": {
    "phase1": {
      "description": "string", // what to build first
      "workflows": ["string"], // workflow names
      "timeline": "string", // e.g. "2–3 weeks"
      "estimatedCost": "string"
    },
    "phase2": {
      "description": "string",
      "workflows": ["string"],
      "timeline": "string",
      "estimatedCost": "string"
    },
    "totalProjectEstimate": "string", // e.g. "£4,500–£7,000"
    "monthlyRetainerEstimate": "string" // e.g. "£300–£500/month"
  },

  // Next steps — 3 items max
  "nextSteps": [
    {
      "step": 1,
      "action": "string",
      "owner": "Chris Garlick | Client | Both"
    }
  ],

  // Footer note
  "disclaimerNote": "string" // standard: estimates based on audit data, subject to scoping call
}
```

---

## Part 6: Typst PDF Template

### 6.1 Why Typst

- Programmatic layout — JSON data maps directly to document sections
- Version-controllable plain text source
- Clean, professional output without Word/LibreOffice rendering quirks
- Fast compilation
- Free and open source

### 6.2 Install & Setup

```bash
# Install Typst CLI
curl -fsSL https://typst.app/install.sh | sh

# Or via npm wrapper
npm install typst
```

### 6.3 Node.js Render Function

**`pdf/typst.js`**

```javascript
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

export async function renderPdf(auditContent, auditId) {
  const dataPath = `/tmp/audit-${auditId}.json`;
  const templatePath = path.join(process.cwd(), 'pdf/audit-template.typ');
  const outputPath = `/tmp/audit-${auditId}.pdf`;

  // Write JSON data file
  fs.writeFileSync(dataPath, JSON.stringify(auditContent, null, 2));

  // Compile Typst
  execSync(`typst compile ${templatePath} ${outputPath} --input dataPath=${dataPath}`);

  // Move to persistent storage
  const finalPath = `storage/audits/${auditId}.pdf`;
  fs.renameSync(outputPath, finalPath);
  fs.unlinkSync(dataPath);

  return finalPath;
}
```

### 6.4 Typst Template Structure

**`pdf/audit-template.typ`**

```typst
#import sys: inputs
#let data = json(inputs.dataPath)

// --- Page setup
#set page(
  paper: "a4",
  margin: (top: 2.5cm, bottom: 2.5cm, left: 2.5cm, right: 2.5cm),
  header: [
    #set text(size: 8pt, fill: rgb("#999999"))
    #h(1fr) AI Readiness Audit — #data.prospect.company
  ],
  footer: [
    #set text(size: 8pt, fill: rgb("#999999"))
    Prepared by Chris Garlick · chrisgarlick.com
    #h(1fr)
    #data.prospect.auditRef
  ]
)

// --- Typography
#set text(font: "DM Mono", size: 10pt, fill: rgb("#1a1a1a"))
#set heading(numbering: none)
#show heading.where(level: 1): it => [
  #set text(font: "Instrument Serif", size: 22pt)
  #v(0.5cm)
  #it
  #v(0.2cm)
  #line(length: 100%, stroke: rgb("#C9A84C"))
  #v(0.3cm)
]
#show heading.where(level: 2): it => [
  #set text(font: "Instrument Serif", size: 14pt)
  #v(0.4cm)
  #it
  #v(0.1cm)
]

// --- Cover page
#page[
  #v(4cm)
  #set text(font: "Instrument Serif")
  #text(size: 36pt)[AI Readiness Audit]
  #v(0.3cm)
  #text(size: 18pt, fill: rgb("#C9A84C"))[#data.prospect.company]
  #v(0.5cm)
  #line(length: 100%, stroke: rgb("#C9A84C"))
  #v(0.3cm)
  #text(size: 10pt, fill: rgb("#666666"))[
    Prepared for #data.prospect.name \
    Prepared by #data.prospect.preparedBy \
    #data.prospect.preparedDate \
    Ref: #data.prospect.auditRef
  ]
  #v(1fr)
  #text(size: 8pt, fill: rgb("#999999"))[
    This report is confidential and prepared exclusively for
    #data.prospect.company.
    Estimates are indicative and subject to a formal scoping call.
  ]
]

// --- Executive Summary
= Executive Summary

#data.executiveSummary

// --- Business Snapshot
= Business Snapshot

#grid(
  columns: (1fr, 1fr),
  gutter: 1cm,
  [
    *Sector* \
    #data.businessSnapshot.description
  ],
  [
    *AI Maturity: #data.businessSnapshot.aiMaturityLevel* \
    #data.businessSnapshot.aiMaturityNotes
  ]
)

// --- Identified Workflows
= Identified Automation Opportunities

#for workflow in data.workflows [
  == #workflow.rank. #workflow.name
  #grid(
    columns: (1fr, 1fr),
    gutter: 0.5cm,
    [
      *Current state* \
      #workflow.currentState
    ],
    [
      *The cost* \
      #workflow.problem
    ]
  )

  *What to build* \
  #workflow.proposedSolution

  #v(0.2cm)
  #grid(
    columns: (1fr, 1fr, 1fr, 1fr),
    gutter: 0.3cm,
    [*Type* \ #workflow.automationType],
    [*Time saved* \ #workflow.estimatedTimeSavedPerWeek/wk],
    [*Priority* \ #workflow.priority],
    [*Est. cost* \ #workflow.estimatedBuildCost]
  )
  #line(length: 100%, stroke: rgb("#eeeeee"))
  #v(0.3cm)
]

// --- Site Health (conditional)
#if data.siteHealth.included [
  = Website Health

  #grid(
    columns: (1fr, 1fr, 1fr),
    gutter: 0.5cm,
    [*SEO* \ #data.siteHealth.seoScore/100],
    [*Performance* \ #data.siteHealth.performanceScore/100],
    [*Accessibility* \ #data.siteHealth.accessibilityScore/100]
  )

  #v(0.2cm)
  #data.siteHealth.recommendation
]

// --- Recommended Engagement
= Recommended Engagement

== Phase 1 — #data.recommendedEngagement.phase1.timeline
#data.recommendedEngagement.phase1.description \
*Estimated cost: #data.recommendedEngagement.phase1.estimatedCost*

== Phase 2 — #data.recommendedEngagement.phase2.timeline
#data.recommendedEngagement.phase2.description \
*Estimated cost: #data.recommendedEngagement.phase2.estimatedCost*

#v(0.5cm)
#rect(
  fill: rgb("#f9f5ec"),
  stroke: rgb("#C9A84C"),
  radius: 4pt,
  inset: 1cm,
  width: 100%
)[
  #set text(font: "Instrument Serif")
  *Total project estimate: #data.recommendedEngagement.totalProjectEstimate* \
  *Monthly retainer (post-build): #data.recommendedEngagement.monthlyRetainerEstimate*
]

// --- Next Steps
= Next Steps

#for step in data.nextSteps [
  *#step.step. #step.action* \
  Owner: #step.owner
  #v(0.2cm)
]

// --- Footer disclaimer
#v(1fr)
#set text(size: 8pt, fill: rgb("#999999"))
#data.disclaimerNote
```

---

## Part 7: PDF Delivery & Follow-up

### 7.1 Send PDF

From the admin interface, Chris clicks **Send Audit**:

```javascript
// POST /api/audit/send/[auditId]

export async function sendAudit(auditId) {
  const submission = await db.auditSubmissions.get(auditId);
  const pdfBuffer = fs.readFileSync(submission.pdfPath);

  await resend.send({
    to: submission.formData.email,
    subject: `Your AI readiness audit — ${submission.formData.companyName}`,
    html: `
      <p>Hi ${submission.formData.name},</p>
      <p>Your AI readiness audit is attached. It covers:</p>
      <ul>
        <li>The manual workflows I've identified in your business</li>
        <li>What each one would look like automated</li>
        <li>Indicative build costs and timelines</li>
        <li>A recommended first engagement</li>
      </ul>
      <p>I've kept the estimates conservative — they're based on the information
      you provided and will be refined in a scoping call.</p>
      <p>Happy to walk through any of it on a 30-minute call. Reply to this
      email or book directly:
      <a href="https://chrisgarlick.com/contact">chrisgarlick.com/contact</a></p>
      <p>Chris</p>
    `,
    attachments: [
      {
        filename: `AI-Readiness-Audit-${submission.formData.companyName.replace(/\s/g, '-')}.pdf`,
        content: pdfBuffer.toString('base64'),
        encoding: 'base64'
      }
    ]
  });

  await db.auditSubmissions.update(auditId, {
    status: 'sent',
    sentAt: new Date().toISOString()
  });

  // Trigger follow-up sequence
  await scheduleFollowUps(auditId, submission);
}
```

### 7.2 Follow-up Email Sequence

```javascript
async function scheduleFollowUps(auditId, submission) {
  const email = submission.formData.email;
  const name = submission.formData.name;
  const company = submission.formData.companyName;

  // T+48h — check in
  await emailQueue.schedule({
    sendAt: Date.now() + (48 * 60 * 60 * 1000),
    to: email,
    subject: `Quick question — ${company}`,
    html: `
      <p>Hi ${name},</p>
      <p>Just checking the audit landed okay and wasn't buried by your spam filter.</p>
      <p>If you've had a chance to look through it, I'd be curious which of the
      workflows resonated most. Happy to go deeper on any of them.</p>
      <p>Chris</p>
    `
  });

  // T+5d — soft push
  await emailQueue.schedule({
    sendAt: Date.now() + (5 * 24 * 60 * 60 * 1000),
    to: email,
    subject: `Re: Your AI readiness audit`,
    html: `
      <p>Hi ${name},</p>
      <p>Following up one more time on the audit. I know these things can get
      lost in a busy inbox.</p>
      <p>If the timing isn't right, no problem — just let me know and I'll
      leave you to it. If you'd like to talk through the recommendations,
      30 minutes is usually enough to figure out whether there's a fit:
      <a href="https://chrisgarlick.com/contact">book here</a>.</p>
      <p>Chris</p>
    `
  });
}
```

---

## Part 8: Admin Interface Spec

Minimal admin at `/admin/audits` — not a full CMS, just enough to manage the pipeline.

### 8.1 Audit List View

Table columns:
- Company name
- Sector
- Submitted date
- Status (pending enrichment / ready for review / generating / ready to send / sent)
- Action button (Review / Generate / Send)

### 8.2 Audit Detail View

Sections:
- **Submission data** — all form fields displayed cleanly
- **Enrichment** — Kritano scores + Companies House summary
- **Notes** — editable free text field (saved on blur)
- **Generated content** — JSON preview (collapsible) once generated
- **PDF preview** — iframe embed once rendered
- **Actions** — Generate Audit / Regenerate / Send / Mark as not a fit

### 8.3 Status Flow

```
submitted
  → enriching
    → ready_for_review     ← Chris reviews here
      → generating
        → pdf_pending
          → ready_to_send  ← Chris reviews PDF here
            → sent
```

---

## Part 9: Website Integration

### 9.1 Where the Form Lives

Primary: `/audit` — dedicated page, no nav, single purpose
Secondary entry points:
- Homepage CTA (replace or supplement current site audit CTA)
- `/start` page — offer as alternative to site-only audit
- All service pages — CTA at bottom of each
- Post-LinkedIn DM — this is the offer in your outreach

### 9.2 CTA Copy

On service pages and homepage:
> *"Not sure where to start? Get a free AI readiness audit — I'll map your workflows, identify what's automatable, and send you a costed plan within 24 hours."*
> `[Request your free audit →]`

On `/start` (LinkedIn cold traffic):
> *"I'll audit your operations for free. 10 questions, a full costed report back within 24 hours."*
> `[Start the audit →]`

---

## Part 10: Implementation Phases

### Phase 1 — Form & Submission (Week 1–2)
- [ ] Build `/audit` multi-step conditional form (React or Alpine.js)
- [ ] Build form submission API endpoint
- [ ] Set up audit submissions table in DB
- [ ] Resend: acknowledgement email to prospect + notification to Chris
- [ ] Basic admin list view at `/admin/audits`

### Phase 2 — Enrichment (Week 2–3)
- [ ] Companies House enrichment service
- [ ] Wire Kritano audit job to enrichment pipeline
- [ ] Admin detail view with enrichment data display
- [ ] Notes field on admin detail view

### Phase 3 — Claude Skill + Typst (Week 3–4)
- [ ] Build and test Claude skill with sample submissions
- [ ] Install Typst, build PDF template
- [ ] Wire generate endpoint to skill + renderer
- [ ] PDF preview in admin
- [ ] Refine skill prompt against real outputs

### Phase 4 — Delivery + Follow-up (Week 4–5)
- [ ] PDF send endpoint with Resend attachment
- [ ] Email queue for follow-up sequence
- [ ] Send button in admin
- [ ] Status flow tracking
- [ ] End-to-end test with real submission

### Phase 5 — Polish & Launch (Week 5–6)
- [ ] Add `/audit` to nav (Free section alongside Tools)
- [ ] Update all service page CTAs to reference audit
- [ ] Update LinkedIn outbound DM template to offer audit
- [ ] Update `/start` page with audit offer
- [ ] Soft launch — 5 manual test runs before promoting

---

## Part 11: Environment Variables

```
# .env additions

COMPANIES_HOUSE_API_KEY=     # From developer.company-information.service.gov.uk
ANTHROPIC_API_KEY=           # Already in use
RESEND_API_KEY=              # Already in use
ADMIN_SECRET=                # Simple auth token for /admin routes
```

---

## Part 12: Protecting the Output

The PDF describes *what* to build and *why* — not *how* to build it. This is the deliberate protection layer.

**What the PDF includes:**
- Workflow name and current-state description
- Problem statement (time/cost framing)
- Proposed solution description (system-level, not technical)
- Automation type classification
- Estimated time saved
- Estimated cost range

**What the PDF deliberately excludes:**
- API names or specific tools
- Code, scripts, or prompts
- Step-by-step implementation instructions
- Integration specifics

A prospect who takes the PDF to Claude and says "build this" will get a generic answer. The value you add is knowing exactly which tools to use, how to integrate them with their existing stack, and having built it before. The PDF sells the outcome — the conversation sells you.

---

*Build spec compiled by Claude — May 2026*
*Stack: Node.js/Express, React, Playwright, Anthropic API (Sonnet), Typst, Resend, Companies House API*
*Ongoing cost: £0*

---

## Addendum: Revised Build Sequencing (14 May 2026)

After review, the build is being re-sequenced to **defer Kritano + Companies House enrichment** until after the core flow is functional. Manual enrichment (Chris pasting findings from a 60-second look at the prospect's website and CH search) bridges the gap until automation arrives in Phase D-E.

### Why defer

- Form + skill + PDF is the actual product. Enrichment is a multiplier — useful, but not load-bearing in V1.
- Until ~5 audits/week are flowing, manual enrichment by Chris is faster than building integrations.
- Real submissions reveal which enrichment data actually shows up in PDFs. Build automation around proven patterns, not hypothetical ones.
- Each external integration is a failure surface. Deferring them keeps the core flow testable without flaky third-party APIs.

### Schema requirements that DO need to be honoured up front

Even though enrichment is deferred, the system has to be **designed** for it from day one so adding it later is additive, not a refactor:

1. **JSON schema (Part 5.5)** — keep `siteHealth.included`, `siteHealth.*` and `companiesHouse: …` fields as defined. They just default to `included: false` / `null` for now.
2. **Typst template (Part 6.4)** — conditional rendering (`#if data.siteHealth.included [...]`) so sections collapse cleanly when enrichment data is absent. No template surgery needed when enrichment lands.
3. **Skill prompt (Part 5.3)** — write the prompt to gracefully degrade: *"If `kritanoAudit` is null, omit the site-health section entirely. If `companiesHouse` is null, infer business context from website and form data only."* Same prompt works at Phase B and at Phase E.
4. **Manual notes field on the admin review** — promote this to a first-class part of the workflow, not an afterthought. It's the human-enrichment bridge: Chris pastes in CH directors, SIC code, anything found via a quick site review. The skill consumes this exactly the same way it'll later consume automated enrichment.

### Revised phase plan

| Phase | Work | Output | Week |
|---|---|---|---|
| **A** | YAML form schema → multi-step `/audit` form → submission endpoint → admin list view | Form is taking submissions | 1-2 |
| **B** | Skill prompt + JSON output validation + Typst template + end-to-end PDF render | Audit PDFs being generated from form data + manual notes | 2-3 |
| **C** | PDF send endpoint + T+48h / T+5d follow-up sequence + Cal.com link in delivery | Full conversion loop closed | 3-4 |
| **D** | Companies House enrichment (free API, easier of the two integrations) | Business snapshot section auto-populated | 4-5 |
| **E** | Kritano enrichment (wire existing audit job) | Site-health section auto-populated; scales Chris's review time | 5-6 |

Phases A-C ship a complete, working audit pipeline. D and E are scaling moves.

### Marketing copy implications

While enrichment is manual:
- `/audit` page copy and LinkedIn DM offer must lead on **"personalised, human-reviewed audit, 24-hour turnaround"** — those are still genuine differentiators vs generic templated audits.
- **Don't** lead on "we pull your Companies House and site audit data automatically" until Phase D-E ships. Promising what isn't yet built kills trust the first time a prospect notices.

Once enrichment lands, update the marketing copy on `/audit`, the homepage CTAs, and the LinkedIn DM template to highlight the enrichment depth as a V2 capability.

### Open questions for Phase A kickoff

When the user is ready to start building, decide:
- Frontend approach: vanilla JS multi-step, Alpine.js, or React island. (Recommend vanilla — the form is shallow enough not to need a framework.)
- YAML loader: Astro content-collections vs a plain `import data from '../config/audit-form.yml'` via Vite YAML plugin.
- DB layer: extend the existing `form_submissions` table with an `audit_submissions` table that has a 1-to-1 link, or store as JSONB in `form_submissions.data` keyed under a `form_id` for the audit form (matches the pattern used by `resource-gate` and `diagnostic`).
- Skill prompt iteration: commit prompt versions to the repo so each audit logs which prompt version generated it.

*Addendum compiled by Claude — 14 May 2026*

---

## Addendum 2: GDPR / data handling (14 May 2026)

Custom form = custom data store = custom obligations under UK GDPR + DPA 2018. The Kritano form builder gives you nothing here — `form_submissions` is just a table with no UI for subject access, deletion logs, retention sweeps, or consent records. Need to build the minimum compliant stack ourselves.

### What we're collecting and the lawful basis for each

| Data | Source | Lawful basis | Notes |
|---|---|---|---|
| Name, email, company name, website, sector | Form submission | **Contract** (Art 6(1)(b)) — they're requesting a service from us | The audit delivery itself, including all follow-up emails specifically about the audit, sits on this basis |
| Sector-specific operational answers (software, team size, bottlenecks, budget) | Form submission | **Contract** (Art 6(1)(b)) | Same as above — needed to deliver the audit they requested |
| Companies House enrichment (Phase D) | UK Companies House (public register) | **Legitimate interest** (Art 6(1)(f)) | CH data is public, but combining it with private data creates a profile — must be disclosed |
| Site audit data (Phase E, via Kritano) | We crawl their site | **Contract** (Art 6(1)(b)) | They submitted the URL; crawling it to fulfil the audit is implied |
| Marketing consent | Explicit form checkbox | **Consent** (Art 6(1)(a)) | Separate from the transactional basis above. Required for newsletter sends; revocable any time |
| Skill-generated audit content | We generate via Claude | **Contract** (Art 6(1)(b)) | Anthropic acts as a sub-processor — needs disclosure in privacy notice |
| IP address, user-agent | Form submission | **Legitimate interest** (Art 6(1)(f)) | For fraud and spam protection only |

**International transfer note:** Anthropic processes prompt + response data in the US under their published DPA. Disclose in privacy notice; reference Anthropic's GDPR addendum.

### Data subject rights — what we have to support

| Right | What it means here | How we satisfy it |
|---|---|---|
| **Access** (SAR) | They ask "what do you hold on me?" — we have 30 days | Search audit_submissions by email; export the submission + enrichment + generated content + a summary of emails sent as JSON |
| **Erasure** | They ask "delete it all" — we have 30 days | Hard-delete the submission row, generated content, PDF file. Log the deletion separately for audit trail. Anonymise if financial retention applies. |
| **Rectification** | Correct inaccurate data | Edit the submission record manually |
| **Portability** | Export their data in a machine-readable format | Same JSON export as SAR satisfies this |
| **Restriction** | Pause processing without deletion | Mark submission status as `restricted`; sequencer skips restricted records |
| **Object** | Stop using their data for a specific purpose | Same as restriction for our case; for marketing, revoke consent flag |
| **Withdraw consent** | Unsubscribe from marketing | Set `marketing_consent = false`. Transactional emails still allowed under contract basis. |

### Tables — schema additions for GDPR

```sql
-- The main audit record (covers all the operational data)
CREATE TABLE audit_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_ref text NOT NULL UNIQUE,           -- e.g. CG-2026-047
  email text NOT NULL,
  data jsonb NOT NULL,                       -- form submission + enrichment + generated content
  status text NOT NULL,
  pdf_path text,
  ip_address text,
  user_agent text,
  marketing_consent boolean NOT NULL DEFAULT false,
  consent_updated_at timestamptz,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  sent_at timestamptz,
  -- soft-delete fields for the grace period
  deleted_at timestamptz,
  deletion_reason text
);
CREATE INDEX ON audit_submissions (email);
CREATE INDEX ON audit_submissions (status);
CREATE INDEX ON audit_submissions (submitted_at);

-- Permanent record of deletions (kept for regulator audit, never purged)
CREATE TABLE audit_deletion_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_ref text NOT NULL,                   -- the ref of the deleted submission
  email_hash text NOT NULL,                  -- sha256 of email — proves "we held data for this person" without storing the email itself
  deleted_at timestamptz NOT NULL DEFAULT now(),
  requested_by text,                          -- 'subject' (they asked) | 'retention' (auto) | 'admin' (Chris)
  deletion_method text NOT NULL,             -- 'hard_delete' | 'anonymised'
  fields_deleted text[]                       -- audit trail of what was wiped
);

-- Track every consent state change (regulators love this)
CREATE TABLE audit_consent_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_submission_id uuid NOT NULL REFERENCES audit_submissions(id) ON DELETE CASCADE,
  email text NOT NULL,
  consent_type text NOT NULL,                -- 'marketing'
  consent_value boolean NOT NULL,
  source text NOT NULL,                       -- 'form_submission' | 'admin_change' | 'unsubscribe_link'
  ip_address text,
  changed_at timestamptz NOT NULL DEFAULT now()
);
```

The `audit_consent_log` is the bit most one-person shops skip and the bit a regulator asks about first. If the ICO ever queries why you sent marketing email to someone, this table is your defence.

### Retention policy

Set these as the explicit defaults (codify in a daily cron job; document in privacy notice):

| State | Retention | Action at expiry |
|---|---|---|
| Submitted, never sent (abandoned or rejected) | 90 days | Hard delete + log |
| Sent, no engagement (no reply, no click) | 24 months | Hard delete + log |
| Sent, prospect converted to client | 7 years | Retained for HMRC / contract records — anonymised after 7y |
| Marketing consent withdrawn | Immediate | Marketing flag → false, prospect record retained for transactional basis until normal retention triggers |
| Explicit deletion request | Within 30 days | Hard delete + log |

Run a daily cron job that scans `audit_submissions` for records exceeding retention, hard-deletes them, and writes to `audit_deletion_log`. ~20 lines of code.

### Minimum admin tooling required at launch

Skip the SAR/delete buttons if you must, but **document the SQL commands** in `gdpr_runbook.md` so requests can be served manually within the 30-day window. Per-operation SQL:

```sql
-- Subject access — return everything we hold on an email
SELECT id, audit_ref, data, status, submitted_at, sent_at, marketing_consent
FROM audit_submissions
WHERE email = $1;

SELECT * FROM audit_consent_log WHERE email = $1 ORDER BY changed_at;

-- Right to erasure — hard delete + log
WITH deleted AS (
  DELETE FROM audit_submissions WHERE email = $1 RETURNING audit_ref, email
)
INSERT INTO audit_deletion_log (audit_ref, email_hash, requested_by, deletion_method, fields_deleted)
SELECT audit_ref, encode(sha256(email::bytea), 'hex'), 'subject', 'hard_delete',
       ARRAY['email','name','company_name','website','data','pdf_path']
FROM deleted;
-- Also: rm storage/audits/{audit_ref}.pdf for each returned ref

-- Withdraw marketing consent
UPDATE audit_submissions SET marketing_consent = false, consent_updated_at = now() WHERE email = $1;
INSERT INTO audit_consent_log (audit_submission_id, email, consent_type, consent_value, source)
SELECT id, email, 'marketing', false, 'admin_change' FROM audit_submissions WHERE email = $1;
```

A proper admin UI for these is Phase F polish — not blocking V1. The SQL works on day 1.

### Privacy notice updates required before launch

The existing `/privacy` page must be amended to disclose, at minimum:

1. **What data we collect** via the audit form (name, email, company, website, operational answers, IP/UA).
2. **Lawful basis** for each category (contract for service delivery; consent for marketing; legitimate interest for enrichment and fraud prevention).
3. **Where data comes from** beyond the form — explicitly: Companies House public register (Phase D onwards), automated website analysis (Phase E onwards).
4. **Sub-processors**: Anthropic (audit content generation, US-processed, under their DPA), Resend (transactional email delivery), the hosting infrastructure.
5. **Retention periods** as above.
6. **The data subject rights list** (access, erasure, rectification, portability, restriction, objection, withdraw consent) and how to exercise them (email + 30-day SLA).
7. **Cookie / tracking disclosure** for the audit PDF if you go the private-link route (the open-tracking pixel needs disclosure).
8. **ICO complaint right** — the standard line that they can complain to the ICO.

### Form-level UX requirements at launch

- **Link to privacy notice** above the submit button — not buried in footer-tier text. Reads "By submitting, you agree to the [privacy notice](/privacy)". The "agree" is implicit consent to the data processing for contract performance.
- **Marketing consent checkbox** — separate, unticked by default, with clear copy: *"It's OK to send me occasional updates with case studies and new resources."* This is the GDPR consent capture. Tick state writes to `audit_consent_log`.
- **No pre-ticked boxes** — pre-ticked consent is not valid consent under UK GDPR. The audit delivery itself doesn't require this checkbox (it's contract basis).
- **Unsubscribe link in every marketing email** — one-click, no login. Hits `/api/audit/consent/withdraw?t=<token>` which writes the consent_log row.

### What this means for V1 build

Adding to the Phase A scope so GDPR isn't a Phase F afterthought:

| Item | Phase | Why |
|---|---|---|
| Privacy notice updated | A (before form goes live) | Legally required at point of collection |
| Marketing consent checkbox on form | A | Captures consent at the right moment |
| `audit_submissions` table with consent + soft-delete fields | A | Schema design needs to be right from day one |
| `audit_consent_log` table | A | Trivial to add now, painful to retrofit |
| `audit_deletion_log` table | A | Same |
| Documented SQL runbook (`gdpr_runbook.md`) | A | The manual SAR/erasure path until admin UI exists |
| Retention sweep cron | C or D | Once submissions exist, the 90-day clock starts ticking on abandoned ones |
| Admin UI for delete/SAR | F (polish) | Manual SQL satisfies the legal obligation in the meantime |

### Quick reality check

For a one-person business processing perhaps tens of audits per month, the risk profile is genuinely low. The regulator's not going to crawl chrisgarlick.com looking for non-compliance. **The risk is**: a single disgruntled prospect complains to the ICO, and you get a 28-day notice asking for your records. If the consent log and deletion log exist and the privacy notice covers the bases, that complaint goes nowhere. If they don't exist, you've got a much bigger problem.

The whole stack above is maybe a day of additional work in Phase A. Worth it.

*GDPR addendum compiled by Claude — 14 May 2026*

---

## Addendum 3: Final operational posture — zero marketing, transactional only (14 May 2026)

**This addendum supersedes the marketing-related parts of Addendum 2 where they conflict.** The previous addendum was written assuming an opt-in marketing pipeline. The actual decision is **no automated marketing whatsoever** — the only email the prospect ever receives is their audit PDF. Every other touchpoint (notifications about new submissions, any "did you read it?" follow-ups) goes to Chris's personal inbox, with Chris choosing whether to reply personally.

This is the strongest possible posture under UK GDPR. Most of the complaint vectors documented in Addendum 2 vanish because they all hinged on automated marketing existing.

### The simplified architecture

```
Prospect submits /audit form
    │
    ▼
Notification email → chris@chrisgarlick.com  (Chris's inbox, never the prospect's)
    │
Chris reviews, generates audit, sends PDF
    │
    ▼
Single transactional email → prospect@example.com   ← THE ONLY automated email to the prospect, ever
    │
(If Chris wants to follow up, he does it manually from his inbox like a normal human conversation.)
```

There is no automated follow-up sequence. There is no marketing list. There is no consent dance. There is no unsubscribe link because there is nothing to unsubscribe from.

### What changes from Addendum 2

| Element from Addendum 2 | Status now |
|---|---|
| Marketing consent checkbox on form | ❌ Dropped — no marketing means no marketing consent to capture |
| `audit_consent_log` table | ❌ Dropped — nothing to log. Consent for processing is implicit by form submission (contract basis) and timestamped by `audit_submissions.submitted_at` |
| Double opt-in | ❌ Dropped (also: user thought it felt weird; agreed) |
| Suppression list (`audit_suppression`) | ❌ Dropped — nothing automated to suppress |
| Unsubscribe link in marketing email | ❌ Dropped — no marketing emails exist |
| Automated T+48h / T+5d follow-up sequence (Part 7.2 of original spec) | ❌ Dropped — replaced by manual personal follow-ups from Chris's inbox, on his own timing |
| Privacy notice "marketing section" | ❌ Dropped — privacy notice gets shorter |
| `audit_submissions.marketing_consent` column | ❌ Dropped — column not needed |

What stays from Addendum 2:

| Element | Status |
|---|---|
| Lawful basis matrix | ✓ Stays, but only contract + legitimate interest rows apply now |
| `audit_submissions` table | ✓ Stays, with the marketing-related columns dropped |
| `audit_deletion_log` table | ✓ Stays — deletion rights apply regardless of marketing |
| Retention policy | ✓ Stays — data minimisation applies regardless of marketing |
| Privacy notice (transactional sections) | ✓ Stays, simpler version |
| SAR / erasure SQL runbook | ✓ Stays |
| Self-serve delete link in the audit-delivery email | ✓ Stays — single touchpoint where this can live, more important than ever |
| Privacy-notice version field per submission | ✓ Stays |
| `outbound_email_log` table (audit deliveries only) | ✓ Stays, but only logs the single audit-delivery email per prospect |
| `/admin/gdpr` lookup tool | ✓ Stays |
| Anthropic zero-retention disclosure | ✓ Stays |
| Companies House sub-processor disclosure (Phase D onwards) | ✓ Stays |
| Documented response templates (SAR, deletion) | ✓ Stays |

### Final schema (revised)

```sql
-- Single source of truth for audit submissions. No marketing fields.
CREATE TABLE audit_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_ref text NOT NULL UNIQUE,
  email text NOT NULL,
  data jsonb NOT NULL,                       -- form submission + enrichment + generated content
  status text NOT NULL,
  pdf_path text,
  ip_address text,
  user_agent text,
  privacy_notice_version text NOT NULL,      -- e.g. '2026-05-14' — proves what they agreed to
  submitted_at timestamptz NOT NULL DEFAULT now(),
  sent_at timestamptz,
  deleted_at timestamptz,                    -- soft delete grace
  deletion_reason text
);

-- Audit trail of deletions. Permanent, never purged. Kept for regulator inquiry.
CREATE TABLE audit_deletion_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_ref text NOT NULL,
  email_hash text NOT NULL,                  -- sha256(email) — proves "we held data for X" without storing X
  deleted_at timestamptz NOT NULL DEFAULT now(),
  requested_by text NOT NULL,                -- 'subject' | 'retention' | 'admin'
  deletion_method text NOT NULL,             -- 'hard_delete' | 'anonymised'
  fields_deleted text[],
  rationale text                              -- short note, regulator-readable
);

-- Single source of truth for what we have ever sent the prospect.
CREATE TABLE outbound_email_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_submission_id uuid REFERENCES audit_submissions(id) ON DELETE SET NULL,
  to_email text NOT NULL,
  subject text NOT NULL,
  template text NOT NULL,                    -- always 'audit_delivery' in this posture
  sent_at timestamptz NOT NULL DEFAULT now(),
  resend_message_id text                      -- Resend's ID for trace lookups
);
CREATE INDEX ON outbound_email_log (to_email);
```

Three tables, no marketing complexity, all queryable by email for any inquiry.

### Final form-level UX (revised)

- **Single line above submit button:** *"By submitting, you agree to the [privacy notice](/privacy). I'll use your details only to prepare and send your audit, and to follow up about it personally."* This is the lawful-basis disclosure. No checkbox needed.
- **No marketing consent checkbox.** (It would be unticked and unused — clutter.)
- **No additional opt-ins, opt-outs, or follow-up preference fields.** The posture is: you submit, you get an audit, that's the entire automated relationship.

### Privacy notice updates (revised — shorter)

Strip the marketing sections. The notice must still disclose:

1. **What data we collect** (form fields, IP/UA, plus Companies House public data from Phase D).
2. **Lawful basis**: contract (audit delivery), legitimate interest (CH enrichment, fraud prevention).
3. **Sub-processors**: Anthropic (audit content generation, US-processed, no-training mode), Resend (audit delivery email), the hosting infrastructure.
4. **Retention**: 90 days for unsent audits, 24 months for sent-no-engagement, 7 years for converted-to-client, immediate for deletion requests.
5. **Their rights**: access, erasure, rectification, portability, restriction, objection. How to exercise: email `privacy@chrisgarlick.com`. 30-day SLA from receipt.
6. **Data controller**: Chris Garlick. Single point of contact.
7. **ICO complaint right**: the standard line.

No marketing section. No cookies section (we're not running tracking pixels). The notice becomes ~half the length it would have been.

### Updated complaint risk analysis

With this posture, the realistic complaint scenarios reduce to:

| Old scenario | Now |
|---|---|
| "You sent me marketing without consent" | Doesn't happen. No marketing exists. |
| "I unsubscribed but you kept emailing" | Doesn't happen. Nothing to unsubscribe from. |
| "I never agreed to marketing" | Doesn't happen. No marketing agreement is collected. |
| "You shared my data" | Privacy notice lists every sub-processor explicitly. Verifiable. |
| "You ignored my SAR" | Defended by the runbook, the lookup tool, and the 30-day SLA documented in privacy notice. |
| "You ignored my deletion request" | Defended by `audit_deletion_log` + the self-serve delete link in their audit delivery email. |
| "You held my data forever" | Defended by the retention sweep and the policy in the privacy notice. |
| "Chris kept emailing me personally after I asked him to stop" | This is the only real remaining vector. Mitigated by: (a) Chris is sending personal 1-to-1 correspondence, not bulk marketing, which gets very lenient treatment under the regulator's "annoyance vs harm" lens; (b) if anyone ever says stop, Chris immediately stops and notes it in `audit_submissions.deletion_reason` or a sticky note in their record. |

The last scenario is essentially unprosecutable provided Chris actually stops when asked. That's an operational discipline thing, not a software thing.

### Why this is the strongest practical posture

1. **The legal surface area is at its irreducible minimum.** You have to store form submissions to deliver an audit (no way around that under contract basis), and you have to support data subject rights (no way around that for any business). Beyond that, everything is opt-in territory that you've chosen not to enter.
2. **The single transactional email is unimpeachable.** It's the literal thing the prospect requested. ICO complaints about "I asked for the audit and they sent me the audit" don't exist.
3. **Manual personal follow-up sits in the same legal category as a salesperson replying to an inbound enquiry.** Provided you stop when asked, this is the lowest-friction form of GDPR processing imaginable.
4. **The "I want to be forgotten" path is self-serve.** Click the link in the only email I ever sent → gone. Removes friction → removes complaints.

### Operational discipline that still matters

Software-side this is now low-risk. The remaining things you need to actually DO:

- When a prospect asks to be deleted (via the link or by email), action within 30 days and write the `audit_deletion_log` row with a short rationale.
- When a prospect asks Chris to stop following up personally, stop. Note in their submission record. This is the one thing that can't be automated away.
- When the privacy notice changes, increment the version, commit the change, never edit the old version in-place.
- Once a quarter, run the retention sweep manually until it's automated (it's a single SQL DELETE).

That's it. Software has done its job; the rest is being a decent operator.

*Final-posture addendum compiled by Claude — 14 May 2026*

---

## Addendum 4: What we're actually building — Phase A build checklist (14 May 2026)

**This is the operational truth. Read this; the previous addenda are historical reasoning.**

Kritano CMS is taking on the GDPR admin tooling as an upstream feature (see `kritano-gdpr-spec.md`). That removes ~30% of our scope. Everything below is what chrisgarlick.com is actually responsible for building.

### The split

**What chrisgarlick.com builds (this project):**

- The `/audit` form and its YAML schema
- The `audit_submissions` table (consumer-managed, with workflow state + soft-delete fields)
- The `outbound_email_log` table (records the audit-delivery email)
- The submission endpoint
- The Claude skill + Typst PDF pipeline
- The audit-delivery email
- The self-serve delete endpoint `/data/delete?t=<token>`
- The privacy notice content on `/privacy`
- A short `gdpr_runbook.md` for the gap period

**What Kritano CMS builds (upstream, see `kritano-gdpr-spec.md`):**

- `/admin/gdpr` admin page
- `gdpr_deletion_log` and `gdpr_search_log` tables
- Search / export / delete admin endpoints
- Auto-discovery of forms declared via `addForm()`
- `registerGdprSource()` API for our custom audit table
- Retention sweep scheduler (v2)

### Final consumer schema (chrisgarlick.com only)

Two tables. That's it. The GDPR audit-trail tables come from Kritano's migration.

```sql
CREATE TABLE audit_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_ref text NOT NULL UNIQUE,              -- e.g. CG-2026-047
  email text NOT NULL,
  data jsonb NOT NULL,                          -- form submission + enrichment + generated content
  status text NOT NULL,                         -- 'submitted' | 'enriching' | 'ready_for_review' | 'generating' | 'pdf_pending' | 'ready_to_send' | 'sent'
  pdf_path text,
  ip_address text,
  user_agent text,
  privacy_notice_version text NOT NULL,        -- e.g. '2026-05-14' — proves what they agreed to
  submitted_at timestamptz NOT NULL DEFAULT now(),
  sent_at timestamptz,
  deleted_at timestamptz,                      -- soft delete grace
  deletion_reason text
);
CREATE INDEX ON audit_submissions (email);
CREATE INDEX ON audit_submissions (status);
CREATE INDEX ON audit_submissions (submitted_at);

CREATE TABLE outbound_email_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_submission_id uuid REFERENCES audit_submissions(id) ON DELETE SET NULL,
  to_email text NOT NULL,
  subject text NOT NULL,
  template text NOT NULL,                       -- always 'audit_delivery' in this posture
  sent_at timestamptz NOT NULL DEFAULT now(),
  resend_message_id text                        -- for trace lookups
);
CREATE INDEX ON outbound_email_log (to_email);
```

Both tables are auto-created at server boot (same pattern as `audit_logs`, `resource_leads`, `resource_downloads` in the existing `server.ts`).

### Form schema as YAML

Build-time YAML drives the form. Adding a field = editing this file + rebuild. Lives at `config/audit-form.yml`.

```yaml
version: 1
privacy_notice_version: "2026-05-14"

sectors:
  - {value: law-firm,     label: "Law firm / solicitors"}
  - {value: accountancy,  label: "Accountancy practice"}
  - {value: agency,       label: "Creative / marketing agency"}
  - {value: consultancy,  label: "Consultancy"}
  - {value: recruitment,  label: "Recruitment agency"}
  - {value: architecture, label: "Architecture / engineering"}
  - {value: other,        label: "Other professional services"}

steps:
  - id: about
    title: About your business
    fields:
      - {name: name,        type: text,   label: "Your name",        required: true}
      - {name: email,       type: email,  label: "Email",            required: true}
      - {name: companyName, type: text,   label: "Company name",     required: true}
      - {name: website,     type: url,    label: "Company website",  required: true}
      - {name: referrer,    type: select, label: "How did you find me?", options: [LinkedIn, Google, Referral, Other]}

  - id: sector
    title: Your sector
    fields:
      - {name: sector, type: select, required: true, optionsFrom: sectors}

  - id: sectorDetail
    title: A bit more about how you operate
    conditional: { on: sector }
    fieldsBySector:
      law-firm:
        - {name: caseManagementSoftware, type: text, label: "Case management software", placeholder: "e.g. Clio, Osprey, LEAP"}
        - {name: monthlyMatters, type: select, label: "New matters/month", options: ["<10","10-30","30-60","60+"]}
        - {name: enquirySources, type: multiselect, label: "How enquiries arrive", options: [Phone, Email, "Web form", Referral, "Walk-in"]}
        - {name: bottleneckAreas, type: multiselect, label: "Where time goes", options: ["Client intake","Document drafting","Document review",Billing,Reporting,Compliance]}
        - {name: usesAI, type: select, label: "Currently using AI tools?", options: [Yes, No, "Not sure"]}
        - {name: aiToolsList, type: text, label: "Which ones?", showIf: {field: usesAI, equals: Yes}}
      accountancy:
        - {name: accountingSoftware, type: text, label: "Accounting software", placeholder: "e.g. Xero, QuickBooks, Sage"}
        - {name: dataArrival, type: multiselect, label: "How client data arrives", options: ["Email attachments","Client portal",Post,"Bank feed",Spreadsheets]}
        - {name: clientCount, type: select, label: "Active clients", options: ["<25","25-100","100-250","250+"]}
        - {name: bottleneckAreas, type: multiselect, label: "Where time goes", options: ["Data entry",Reconciliation,"Report generation","Client onboarding","VAT returns","Chasing clients"]}
        - {name: usesAI, type: select, label: "Currently using AI tools?", options: [Yes, No, "Not sure"]}
        - {name: aiToolsList, type: text, label: "Which ones?", showIf: {field: usesAI, equals: Yes}}
      agency:
        - {name: projectTool, type: text, label: "Project management tool", placeholder: "e.g. Notion, ClickUp, Asana, Linear"}
        - {name: briefArrival, type: multiselect, label: "How briefs arrive", options: [Email, "Brief form", Call, Slack, Meeting]}
        - {name: accountCount, type: select, label: "Active client accounts", options: ["1-5","5-15","15-30","30+"]}
        - {name: bottleneckAreas, type: multiselect, label: "Where time goes", options: ["Brief processing","Content creation",Reporting,"Client communication",Invoicing,Research]}
        - {name: clientReporting, type: select, label: "Regular client reports?", options: ["Yes, manually","Yes, semi-automated",No]}
        - {name: usesAI, type: select, label: "Currently using AI tools?", options: [Yes, No, "Not sure"]}
        - {name: aiToolsList, type: text, label: "Which ones?", showIf: {field: usesAI, equals: Yes}}
      consultancy:
        - {name: consultancyType, type: text, label: "Type of consultancy", placeholder: "e.g. management, HR, IT, strategy"}
        - {name: engagementStart, type: multiselect, label: "How engagements start", options: [RFP, Referral, "Direct outreach", Inbound, Tender]}
        - {name: bottleneckAreas, type: multiselect, label: "Where time goes", options: ["Proposal writing", Research, "Report generation", "Client communication", Billing, "Data analysis"]}
        - {name: deliverableCadence, type: select, label: "Client deliverables", options: ["Yes — weekly","Yes — monthly","Yes — per project", No]}
        - {name: usesAI, type: select, label: "Currently using AI tools?", options: [Yes, No, "Not sure"]}
        - {name: aiToolsList, type: text, label: "Which ones?", showIf: {field: usesAI, equals: Yes}}
      recruitment:
        - {name: ats, type: text, label: "ATS used", placeholder: "e.g. Bullhorn, Vincere, none"}
        - {name: openRoles, type: select, label: "Roles open at any time", options: ["<10","10-30","30-60","60+"]}
        - {name: bottleneckAreas, type: multiselect, label: "Where time goes", options: ["CV screening","Candidate outreach","Job posting","Client reporting","Interview scheduling","Reference checks"]}
        - {name: usesAI, type: select, label: "Currently using AI tools?", options: [Yes, No, "Not sure"]}
        - {name: aiToolsList, type: text, label: "Which ones?", showIf: {field: usesAI, equals: Yes}}
      architecture:
        - {name: tooling, type: text, label: "Project management or CAD tooling"}
        - {name: bottleneckAreas, type: multiselect, label: "Where time goes", options: ["Client briefing","Specification writing","Compliance documentation",Reporting,Invoicing,"Tender preparation"]}
        - {name: usesAI, type: select, label: "Currently using AI tools?", options: [Yes, No, "Not sure"]}
        - {name: aiToolsList, type: text, label: "Which ones?", showIf: {field: usesAI, equals: Yes}}
      other:
        - {name: businessDescription, type: textarea, label: "Briefly describe what your business does"}
        - {name: bottleneckFreeform, type: textarea, label: "Where does your team spend the most manual time?"}
        - {name: usesAI, type: select, label: "Currently using AI tools?", options: [Yes, No, "Not sure"]}
        - {name: aiToolsList, type: text, label: "Which ones?", showIf: {field: usesAI, equals: Yes}}

  - id: universal
    title: Final questions
    fields:
      - {name: teamSize, type: select, required: true, label: "Team size", options: ["Just me","2-5","6-15","16-50","50+"]}
      - {name: biggestBottleneck, type: textarea, required: true, minLength: 50, label: "Your biggest manual bottleneck", help: "2 to 3 sentences"}
      - {name: budgetRange, type: select, label: "Rough budget", options: ["£500-2k","£2-5k","£5-15k","£15k+","Not sure yet"]}
      - {name: sixMonthWin, type: textarea, label: "What does a win look like in 6 months?"}
      - {name: notes, type: textarea, label: "Anything else I should know?"}
```

Server-side validation parses the same YAML at boot and builds a schema validator (JSON-Schema or Zod) — single source of truth, no drift between client and server.

### Gap-period bridge — before Kritano v1 ships

Two small things on the chrisgarlick.com side.

**1. Self-serve delete endpoint at `/data/delete?t=<token>`.**

This is a UX win regardless of Kritano's tooling and lives in `server.ts`:

- Token is HMAC-signed when the audit-delivery email is constructed. Payload: `{audit_submission_id, exp}`. Same signing helper already in `server.ts` for the resource gate.
- The endpoint validates the token, soft-deletes the row (`deleted_at = now()`), removes the PDF file from disk, returns a confirmation page that says "All your data has been removed."
- Token TTL: indefinite (no `exp` claim) — the user should always be able to delete using the link in their original email. Worth noting: an attacker with the email could trigger deletion, but the worst-case outcome is "the prospect's own data gets deleted" which is what they're allowed to do anyway.

About 50 lines of code total. Lives at `/api/data/delete` (Hono endpoint) with a small Astro confirmation page.

**2. `gdpr_runbook.md` — manual SQL for the gap.**

A short markdown file in the repo containing the SQL queries to satisfy SARs and deletion requests manually, before the Kritano `/admin/gdpr` admin UI exists. Three queries:

```sql
-- Subject access — return everything we hold on an email
SELECT * FROM audit_submissions WHERE email = $1;
SELECT * FROM outbound_email_log WHERE to_email = $1;

-- Right to erasure — hard delete + cleanup the PDF file
WITH deleted AS (
  DELETE FROM audit_submissions WHERE email = $1 RETURNING audit_ref, pdf_path
)
SELECT * FROM deleted;
-- Then for each returned pdf_path: rm storage/audits/<file>

-- Retention sweep (run quarterly until Kritano ships v2's auto-sweep)
DELETE FROM audit_submissions
WHERE status != 'sent'
  AND submitted_at < now() - interval '90 days';

DELETE FROM audit_submissions
WHERE status = 'sent'
  AND sent_at < now() - interval '24 months';
```

Archive this file once Kritano v1 (or v2) ships.

### The plug-in point — when Kritano v1 lands

Two-line change in `cms.config.ts`:

```ts
import { registerGdprSource } from '@kritano/cms/gdpr'

registerGdprSource({
  name: 'audit-submissions',
  displayName: 'AI readiness audit submission',
  table: 'audit_submissions',
  emailColumn: 'email',
  identifierColumn: 'audit_ref',
  retentionPolicyDays: 730,
  retentionFilter: "status != 'sent'",
  onDelete: async (row) => {
    if (row.pdf_path) await fs.unlink(row.pdf_path).catch(() => {})
  },
  excludeFields: ['ip_address', 'user_agent'],
})
```

After that:
- `/admin/gdpr` works for both the form-submissions side (auto-discovered) and the audit-submissions side (registered above).
- The retention sweep starts handling old submissions automatically.
- `gdpr_runbook.md` gets archived.
- The self-serve `/data/delete?t=<token>` endpoint stays — it's a UX feature, not a workaround.

### Revised Phase A build sequence

Cleanest order for the actual build:

| Step | Work | Why this order |
|---|---|---|
| 1 | `audit_submissions` + `outbound_email_log` tables (auto-created in `server.ts`) | Schema first. Everything else writes to these. |
| 2 | `config/audit-form.yml` committed | Source of truth for the form. |
| 3 | YAML loader on the frontend (Vite YAML plugin or Astro content collection) | So the form can read the YAML at build time. |
| 4 | `/audit` Astro page — multi-step form rendered from the YAML | The user-facing piece. |
| 5 | `addForm('audit-intake')` declaration in `cms.config.ts` | Submissions get the standard Kritano form-submissions audit trail. |
| 6 | `POST /api/audit/submit` endpoint in `server.ts` | Validates against the same YAML (server-side schema generation), writes to both `form_submissions` and `audit_submissions`, sends Resend notification to `chris@chrisgarlick.com`. |
| 7 | `/admin/audits` simple list page (lives in this repo, not Kritano) | The workflow admin (status, notes, generate, send) — distinct from GDPR admin which Kritano owns. |
| 8 | Privacy notice update on `/privacy` (CMS content edit, no code) | Disclosed before form goes live. |
| 9 | `gdpr_runbook.md` committed | Operational SQL for the gap period. |
| 10 | Self-serve `/data/delete?t=<token>` endpoint + Astro confirmation page | UX for prospects who want to delete themselves. |

Phase A target: 1 to 2 weeks. After this lands, Phases B/C (Claude skill + Typst + delivery) build on top of the working form.

### What we're explicitly NOT building anywhere on chrisgarlick.com

For clarity, so this doesn't get accidentally picked up:

- `/admin/gdpr` page — Kritano's
- `gdpr_deletion_log` / `gdpr_search_log` tables — Kritano's migration
- Search-by-email admin UI — Kritano's
- Retention sweep scheduler — Kritano v2's
- Auto-discovery of forms — Kritano's
- Marketing consent capture or anything resembling it — never (per Addendum 3)
- Automated T+48h / T+5d follow-up sequence — never (per Addendum 3); Chris does follow-ups manually from his inbox

*Phase A build checklist compiled by Claude — 14 May 2026*