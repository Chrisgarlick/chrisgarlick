---
title: The Prompt Library for Professional Services
subtitle: Copy-paste prompts for law firms, accountancies and agencies
author: Chris Garlick
date: 2026-05-12
document_type: brief
---

# The Prompt Library for Professional Services

A working set of copy-paste prompts for law firms, accountancies and agencies.
Every prompt has been used in real client work. Adapt the bracketed
variables to your situation.

**Inside this document**

*Client communication*

- First-touch reply to an inbound enquiry
- Status update to a client mid-matter
- Difficult-message draft

*Document and drafting*

- First-pass document review
- Extract key terms from a contract
- Convert handwritten notes to a structured file note

*Internal operations*

- Weekly team standup digest
- Triage an inbox
- Turn a Loom or transcript into action items
- Draft a proposal section from a discovery call

A four-part framework for adapting any prompt to your firm comes first.

---

## How to adapt a prompt

Every prompt in this library follows the same structure. If a prompt isn't
giving you what you want, it's almost always because one of these four
pieces is missing.

1. **Role.** Tell the model who it is. "You are a senior commercial
   solicitor reviewing a software licence agreement." Specificity matters.
2. **Context.** Give it the material to work with, the document, the
   transcript, the data. Paste it in full. Do not summarise for the
   model; that's its job.
3. **Constraints.** State the rules. Length, format, tone, what to
   include, what to exclude, what to never assume. These are the lines
   the model would otherwise cross.
4. **Examples.** If the output has a specific shape, show one good
   example. One example beats three paragraphs of description.

The prompts below are templates. They will not be perfect on the first
run for your firm. Iterate.

---

## Client communication

### 1. First-touch reply to an inbound enquiry

```
You are a senior client manager at a UK [law firm / accountancy / agency].
A prospective client has sent the email below. Draft a reply that:

- Acknowledges their specific situation (do not paraphrase generically)
- Asks two clarifying questions that would meaningfully change our
  approach or quote
- Proposes a 20-minute discovery call, offering two specific time slots
  in the next three working days
- Signs off in a warm but professional tone

Do not promise outcomes, costs or timelines. Do not use the phrase
"I hope this email finds you well."

Inbound email:
[PASTE EMAIL HERE]

My availability for the call:
[LIST 2-3 SLOTS]
```

### 2. Status update to a client mid-matter

```
You are [NAME], the lead [solicitor / accountant / account manager] on
this matter. Write a status update email to the client covering:

- What has happened since the last update (use the bullet list below)
- What is outstanding and who is doing what next
- Any decisions the client needs to make, with a deadline
- Any costs incurred or anticipated

Keep it under 250 words. No legal jargon unless unavoidable. Use plain
English. End with a clear next step.

Updates since last contact:
[BULLET LIST]

Client's name:
[NAME]
```

### 3. Difficult-message draft

```
You are an experienced [partner / director] writing to a long-standing
client about [bad news: missed deadline / fee increase / declining the
matter]. Draft the email.

Rules:
- Take responsibility where appropriate without inviting liability
- State the facts clearly in the second paragraph, not buried
- Offer a concrete remedy or next step
- No apologies that contradict our position
- Maintain the relationship, this client matters

Situation:
[DESCRIBE]
```

---

## Document and drafting

### 4. First-pass document review

```
You are reviewing the document below on behalf of [CLIENT NAME]. Their
position is [BUYER / SELLER / LANDLORD / TENANT / EMPLOYER / EMPLOYEE].

Produce a review note with three sections:

1. RED FLAGS, clauses that are unusual, one-sided against my client, or
   commercially unacceptable. Quote the clause and explain.
2. AMBER, clauses that need negotiation but are not deal-breakers.
3. GREEN, confirm the standard protections that are present.

For each red flag, propose redrafted wording. Do not invent facts not in
the document. If something is unclear, say so explicitly rather than
guessing.

Document:
[PASTE]
```

### 5. Extract key terms from a contract

```
Read the contract below and produce a one-page key terms summary with
these fields, in this order:

- Parties
- Effective date
- Term and renewal
- Termination rights (each party)
- Payment terms
- Limitation of liability
- Indemnities
- Governing law and jurisdiction
- Notice provisions
- Anything unusual

Quote the relevant clause number alongside each field. If a field is not
covered in the contract, say "not addressed" rather than inferring.

Contract:
[PASTE]
```

### 6. Convert handwritten or messy notes to a structured file note

```
Below are my rough notes from a meeting with [CLIENT NAME] on [DATE].
Rewrite them as a formal file note suitable for the matter file.

Structure:
- Attendees
- Date and time
- Purpose
- Discussion (chronological, third person, past tense)
- Decisions
- Actions (who, what, by when)
- Follow-up required

Do not add facts that are not in my notes. If something is ambiguous,
flag it in square brackets.

Notes:
[PASTE]
```

---

## Internal operations

### 7. Weekly team standup digest

```
Below are the individual updates from each team member this week. Produce
a single team digest with:

- Three lines on what shipped this week
- Three lines on what's in progress and any blockers
- Anything the partners / leadership need to know
- One client risk or opportunity to surface

Keep the total under 200 words. Tone: dry, factual, no jargon. Do not
embellish. If an update is thin, that's fine, leave it thin.

Updates:
[PASTE]
```

### 8. Triage an inbox

```
Below is a list of the last [N] emails I received. For each email,
categorise as:

- URGENT, needs a reply today
- CLIENT, client work, reply within 24h
- INTERNAL, internal team, reply when convenient
- FYI, read only, no action
- DELETE, newsletters, sales, noise

For everything tagged URGENT or CLIENT, draft a one-sentence suggested
response. Do not actually send anything.

Emails:
[PASTE, sender, subject, first 200 chars of body for each]
```

### 9. Turn a Loom or transcript into action items

```
Below is the transcript of a meeting. Extract:

- Decisions made (with who decided)
- Action items (with owner and deadline if mentioned, otherwise "TBC")
- Open questions
- Anything I should follow up on personally as [ROLE]

Ignore small talk. If a decision is implied rather than stated, flag it
as "implied" so I can confirm.

Transcript:
[PASTE]
```

### 10. Draft a proposal section from a discovery call

```
Below is the transcript of a discovery call with [PROSPECT NAME] of
[COMPANY]. Draft the "Understanding of your situation" section of the
proposal, the part that proves we listened.

Rules:
- Use the prospect's own language where they were specific. Quote them
  directly in one or two places.
- Mirror back the three problems they prioritised, in their order.
- Do not propose solutions in this section. That comes later.
- 250-350 words.

Transcript:
[PASTE]
```

---

## Where to go from here

This starter library covers ten of the most common professional services
use cases. The full library, sixty-plus prompts including client
reporting, billing narratives, knowledge management and proposal
writing, is shipping shortly.

If there's a workflow you want covered next, reply to the email this came
with. The most-requested ones get written first.

---

*Chris Garlick, chrisgarlick.com*
