<!-- Version: 1 | Department: seo | Updated: 2026-05-15 -->

# Funnel Mapping + Content Packages

Companion to `topic-clusters.md`. Maps every cluster page to TOFU/MOFU/BOFU and groups them into named **Content Packages** — small, deliberately sequenced article sets that take one persona through one buying journey. A package is what you'd hand someone in a single conversation. Internal linking within a package is dense; between packages it's selective.

**Legend:**
- ✓ live
- ☐ to write
- 🛠 audit needed

---

## TOFU / MOFU / BOFU at a glance

### TOFU — "What is this and should I care?"
Audience: aware of a pain, not yet aware of a solution. Searches like "automate repetitive tasks law firm", "AI adoption challenges UK".

- ✓ `/article/ai-adoption-disappointment-why-companies-fail`
- ✓ `/article/why-79-of-enterprises-are-failing-at-ai-adoption`
- ✓ `/article/51-of-code-on-github-is-ai-generated-that-should-worry-you`
- ✓ `/article/the-ai-implementation-playbook-for-service-businesses` (also MOFU)
- ✓ `/article/what-ai-implementation-means-law-firm` (also MOFU)
- ☐ "What is AI Implementation? A No-Jargon Guide for UK Businesses"
- ☐ "Should My Law Firm Use AI?"
- ☐ "How AI is Changing UK Professional Services"
- ☐ "What is RAG? (UK Edition)"

### MOFU — "Which option, and how does it work?"
Audience: aware of a category of solution, comparing approaches. Searches like "AI consultant vs agency UK", "RAG implementation cost", "Claude vs Llama for business".

- ✓ `/article/agency-workflows-automate-first`
- ✓ `/article/automate-client-intake-without-custom-software`
- ✓ `/article/replacing-manual-data-entry-with-ai-agents`
- ☐ All the comparison + technical pages listed in `topic-clusters.md` under each cluster

### BOFU — "I'm ready, who do I hire?"
Audience: ready to buy, evaluating providers. Searches like "AI implementation partner UK", "hire AI specialist UK", direct brand searches.

- ✓ `/services/ai-implementation` (pillar)
- ✓ `/services/workflow-automation`
- ✓ `/services/ai-agents`
- ✓ `/services/data-extraction`
- ✓ `/services/ai-engineering`
- ✓ `/industries/ai-for-law-firms`
- ✓ `/industries/ai-for-accountancy-firms`
- ✓ `/industries/ai-for-agencies`
- ✓ `/industries` (directory)
- ✓ `/audit` (high-intent conversion)
- ✓ `/contact`
- ☐ Case studies (`/work/<slug>`) — earliest possible

---

## Content Packages

A package = an ordered set of articles that takes one specific persona from "noticed a problem" to "booked a call". Each package has a primary BOFU destination. Articles within a package must internal-link to the next article AND to the BOFU page.

---

### Package 1 — Sarah's Law Firm Journey

**Persona:** Sarah, Law Firm Managing Partner (Manchester, 15-person commercial firm)
**BOFU destination:** `/industries/ai-for-law-firms` → `/audit` or `/contact`
**Primary keyword theme:** AI for UK law firms, document automation, intake

**Sequence:**
1. **TOFU** ☐ "Should My Law Firm Use AI?" — answers the gut-check question, frames the problem
2. **TOFU/MOFU** ✓ `/article/what-ai-implementation-means-law-firm` — defines what's actually possible
3. **MOFU** ☐ "AI Document Automation for UK Solicitors: What Works in 2026" — concrete use case
4. **MOFU** ☐ "AI Client Intake Automation for Law Firms" — second concrete use case
5. **MOFU (objection)** ☐ "AI Security & GDPR Compliance for UK Law Firms" — handles "is it secure?"
6. **MOFU/BOFU** ☐ "AI Implementation Cost for a UK Law Firm" — answers "how much?"
7. **BOFU** ✓ `/industries/ai-for-law-firms` — landing
8. **Conversion** ✓ `/audit` — free Kritano audit form

**Status:** 2 of 7 articles live (29%). Sarah currently lands on article #2 and can hit the pillar but the comparison/cost/security pages are gaps.

**Priority to ship:** 3, 6, 5 (in that order — concrete use case before objection handling before cost).

---

### Package 2 — Tom's Agency Journey

**Persona:** Tom, Agency Founder (London, 8-person digital marketing agency)
**BOFU destination:** `/industries/ai-for-agencies` → `/contact` (retainer-shaped sale)
**Primary keyword theme:** AI for UK marketing agencies, workflow automation, agency operations

**Sequence:**
1. **TOFU** ✓ `/article/agency-workflows-automate-first` — establishes the three top opportunities
2. **MOFU** ☐ "AI Reporting Automation for UK Marketing Agencies" — concrete use case 1
3. **MOFU** ☐ "AI Brief Processing: Turning a Messy Inbox into Structured Projects" — concrete use case 2
4. **MOFU (comparison)** ☐ "Zapier vs Custom AI Automation: Where Each Breaks" — handles "we tried Zapier"
5. **MOFU (comparison)** ☐ "AI Content Pipeline for Agencies: Build vs Buy" — handles "buy vs build"
6. **MOFU** ☐ "How to Offer AI Services to Your Agency's Clients" — the upsell angle
7. **BOFU** ✓ `/industries/ai-for-agencies` — landing
8. **Conversion** ✓ `/contact` (or `/audit` for those not ready)

**Status:** 1 of 7 articles live (14%). Tom is heavily under-served.

**Priority to ship:** 4, 2, 5 (Tom is technical, comparison content converts him fastest).

---

### Package 3 — David's Accountancy Journey

**Persona:** David, Practice Director (Birmingham, 30-person accountancy)
**BOFU destination:** `/industries/ai-for-accountancy-firms` → `/audit` (David wants a written report he can show partners)
**Primary keyword theme:** AI for UK accountants, onboarding automation, Xero/Sage/QuickBooks

**Sequence:**
1. **TOFU/MOFU** ✓ `/article/the-ai-implementation-playbook-for-service-businesses` — general but reaches David
2. **MOFU** ☐ "AI Client Onboarding Automation for UK Accountancy Firms" — David's #1 pain
3. **MOFU** ☐ "AI for Xero Practices: Where the Hours Actually Save" — practical, integrations-led
4. **MOFU** ☐ "MTD-Aligned AI Automation for UK Accountants" — compliance angle
5. **MOFU (comparison)** ☐ "AI vs Hiring: The Real Cost Comparison for UK Accountancy Firms" — David's gut question
6. **MOFU** ☐ "How to Get Partner Buy-In for AI at Your Accountancy Practice" — internal-selling support
7. **BOFU** ✓ `/industries/ai-for-accountancy-firms` — landing
8. **Conversion** ✓ `/audit` — David wants a PDF report

**Status:** 1 of 7 articles live (14%). Accountancy is the most under-served sector.

**Priority to ship:** 2, 5, 6 (David needs use-case → cost-comparison → internal-sell material).

---

### Package 4 — Technical Buyer Journey (CTOs, technical founders)

**Persona:** Technical decision-maker at a small UK business, possibly Tom but skewed more technical. Could be a CTO at a 30-person firm, or a founder of a tech-adjacent business.
**BOFU destination:** `/services/ai-engineering` → `/contact`
**Primary keyword theme:** RAG, LLM selection, on-premises AI, AI engineering UK

**Sequence:**
1. **TOFU** ✓ `/article/51-of-code-on-github-is-ai-generated-that-should-worry-you` — establishes brand has technical opinions
2. **TOFU/MOFU** ☐ "What is RAG? Retrieval-Augmented Generation Explained (UK Edition)" — frames the technical capability
3. **MOFU (comparison)** ☐ "How to Choose an LLM for Business Use" — framework piece
4. **MOFU (comparison)** ☐ "Claude vs Llama vs GPT for UK Business" — specific comparison
5. **MOFU (comparison)** ☐ "pgvector vs Qdrant for RAG: Which Vector Store to Pick" — implementation depth
6. **MOFU** ☐ "Running Ollama for Business: When On-Premises AI Makes Sense" — sovereignty angle
7. **MOFU** ☐ "On-Premises LLM Deployment for UK Regulated Industries" — regulatory angle
8. **BOFU** ✓ `/services/ai-engineering` — has FAQ for direct-answer extraction
9. **Conversion** ✓ `/contact`

**Status:** 1 of 8 articles live (13%). Almost entirely to write.

**Priority to ship:** 3, 2, 4 (the comparison framework piece comes first because it's the highest-value MOFU asset in the cluster).

---

### Package 5 — Evaluation Buyer Journey ("Should we hire someone like Chris?")

**Persona:** Cross-persona — anyone in BOFU, evaluating Chris vs alternatives.
**BOFU destination:** `/services/ai-implementation` → `/contact` (or audit)
**Primary keyword theme:** AI consultant vs agency, custom vs off-the-shelf, in-house hire vs partner

**Sequence:**
1. **MOFU (comparison)** ☐ "AI Consultant vs AI Agency UK: How to Choose" — the headline comparison
2. **MOFU (comparison)** ☐ "Custom AI vs Off-the-Shelf Tools: When Each Wins"
3. **MOFU (comparison)** ☐ "In-House AI Hire vs Outsourced Partner"
4. **MOFU (cost)** ☐ "AI Implementation Cost UK: What You Actually Pay"
5. **BOFU** ✓ `/services/ai-implementation` (pillar)
6. **BOFU** ✓ `/about` (E-E-A-T: solo operator credentials, Kritano-as-proof)
7. **Conversion** ✓ `/contact` or `/audit`

**Status:** 0 of 4 MOFU articles live. This is the highest-leverage package because it converts traffic from every other package.

**Priority to ship:** 1, 4 are the two most important pieces to commission first. They get cited by AI engines for "AI consultant vs agency" and "AI implementation cost UK" — both of which feed every other persona's evaluation.

---

### Package 6 — TOFU brand-awareness layer

**Persona:** Anyone in early discovery. These run as cold traffic acquirers.
**BOFU destination:** depends on persona, but every TOFU article must end with a CTA that routes to the right BOFU page.

**Sequence:**
- ✓ All four currently-live articles serve this layer (`agency-workflows-automate-first`, `ai-adoption-disappointment`, `why-79-of-enterprises-are-failing`, `51-of-code-on-github`)
- ☐ "How AI is Changing UK Professional Services" — broad-net TOFU piece
- ☐ "AI for Small Business UK: A No-Hype Reality Check" — broad-net TOFU piece
- ☐ "Automate Repetitive Tasks at a UK Law Firm" — sector-specific TOFU
- ☐ "Reduce Manual Data Entry at a UK Accountancy Practice" — sector-specific TOFU

These don't need to ship before the MOFU comparison pieces. TOFU last per the bottom-up principle.

---

## Conversion funnel: from cold traffic to call

```
                       Cold visitor
                            │
                ┌───────────┼───────────┐
                ▼           ▼           ▼
              Search    Social/LI    Referral
                │           │           │
                └─────┬─────┴─────┬─────┘
                      ▼           ▼
              Landing on a TOFU article OR an industry pillar
                            │
                            ▼
              First MOFU article (use case or comparison)
                            │
                            ▼
              Second MOFU article (cost or objection)
                            │
                            ▼
              Visits service/industry pillar (BOFU)
                            │
                ┌───────────┴───────────┐
                ▼                       ▼
            /audit                  /contact
       (low-commit conversion)  (high-commit conversion)
                │                       │
                └───────────┬───────────┘
                            ▼
                      Scoping call booked
```

**Conversion levers that already exist:**
- ✓ `/audit` form with 4 steps, conditional sector branches, low-friction
- ✓ Sticky CTA in every article (`Run a free audit` + `Book a 30-min call`)
- ✓ FAQ schema on `/services/ai-implementation` + `/services/ai-engineering` for direct-answer extraction
- ✓ Author bio + E-E-A-T on `/about`

**Levers to add:**
- ☐ FAQ block on each industry pillar (Cluster F/G/H pages need 5 Q&As each + matching FAQPage schema)
- ☐ Case studies at `/work/<slug>` (Tom + David especially are case-study driven)
- ☐ Secondary lead magnet beyond the prompt library (e.g. "AI Readiness Checklist UK", "LLM Selection Decision Tree")

---

## Decision rules for what to commission next

**Rule 1:** If a persona's BOFU page is live but they have <40% of their package shipped, write the next MOFU article in that package before anything else.
- All three personas (Sarah, Tom, David) currently fail this rule. **Priority is Package 5 (evaluation layer) + 1 article per persona package.**

**Rule 2:** If two packages share a comparison article, write it once and link from both packages.
- "AI Consultant vs AI Agency UK" sits in Package 5 but supports Packages 1, 2, 3.
- "AI Implementation Cost UK" sits in Package 5 but supports Packages 1, 2, 3.
- These are the highest-leverage MOFU pieces to ship first.

**Rule 3:** Don't write TOFU until at least 60% of MOFU is shipped.
- TOFU drives volume but converts at a fraction of MOFU. The current TOFU coverage (5 live articles) is already ahead of MOFU coverage in 4 of 6 clusters. Pause TOFU. Catch MOFU up.

**Rule 4:** New industry pillars (Cluster I) get content only when a real client engagement exists.
- Empty pillar pages with no cluster pages will rank for nothing and waste crawl budget.
