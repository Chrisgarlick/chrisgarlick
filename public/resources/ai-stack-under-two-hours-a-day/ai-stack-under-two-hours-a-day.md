---
title: The Solo Operator AI Stack
subtitle: Running a one-person business in under two hours of admin a day
author: Chris Garlick
date: 2026-05-28
document_type: brief
---

# The Solo Operator AI Stack

The exact tools, workflows, and weekly cadence I use with one-person businesses. By the end of week four you should be running everything outside of paid client work in under two hours a day.

The honest version of what this is: it's not magic. It's the elimination of the four or five tasks that quietly eat your week without you noticing. Voice-note-to-content. Review chasing. Case study writing. Monthly SEO. Quote follow-ups. These don't take any single big block of time. They take 15 minutes here, 30 minutes there, plus the mental tax of "I should be doing that." Cumulatively they cost six to ten hours a week.

You're not going to outwork the trap. You're going to set up systems that do the work in the background.

---

## What you'll have running by week four

| System | Time you spend now | Time after the stack |
|---|---|---|
| Weekly social content | 2-3 hrs (when it happens at all) | 10 mins a Monday |
| Review requests | 5 mins per client, often skipped | Zero, fully automated |
| Case studies | 2-3 hrs per project, usually never | 15 mins per project |
| Monthly blog post | Never | 30 mins, once a month |
| Quote follow-ups | 10 mins per quote, often skipped | Zero, fully automated |
| Inbox triage | 30-45 mins a day | 10 mins a day |

Total admin time after the stack: roughly 90 minutes a day. The other six hours go back to paid work or to your evenings.

---

## The stack (with tool categories, not lock-in)

I'm listing categories rather than specific tools because the specific tools change every six months. The category is what matters.

| Category | What it does | Example tools (2026) |
|---|---|---|
| LLM assistant | The brain — drafts content, replies, summaries | Claude Sonnet 4.6, GPT-5.5 |
| Voice transcription | Voice notes become text fast | OtterAI, Whisper (self-hosted), Apple Voice Memos with transcript |
| Scheduling | Auto-publishes social content | Buffer, Hootsuite, native scheduling |
| Form-to-action | Form fills trigger sequences | Tally, Typeform, Fillout |
| Email automation | Sequences, follow-ups, review chasing | Loops, MailerLite, Sender |
| CRM-lite | Where leads live (don't over-build this) | Notion, Airtable, a single Google Sheet |

Total monthly cost done right: £30 to £80 in tool subscriptions. Done wrong (every category at the top tier): £200+. Start at the bottom of every category. Upgrade only when you hit a limit.

---

## Workflow 1: Voice-note to a week of content

The single highest-leverage workflow in the pack. One voice note on a Monday morning produces seven days of social posts. Spend ten minutes recording, ten minutes editing the drafts, the rest is automatic.

### Setup (one-off, 20 mins)

1. Pick a single platform you'll post to (Instagram, LinkedIn, or X — not all three at first).
2. Pick a posting cadence (one a day is plenty for most operators).
3. Set up a scheduling tool with the platform connected.
4. Build the system prompt below.

### Weekly loop (10 mins)

Every Monday, open Voice Memos. Talk for three to five minutes about whatever you're thinking about that week. The job you just finished. The thing a client said. The bit of your trade you find interesting. Don't structure it. Just talk.

Run the transcript through this prompt:

```
You are a content strategist for a solo operator in [your trade / business].
The voice note below is the operator thinking out loud about their week.

Turn it into 7 social media posts for [Instagram / LinkedIn / X], one per
day. Each post should:

- Open with a specific hook in the first line
- Be 60 to 150 words
- Pull from a specific thing the operator actually said in the voice note
  — never invent stories or claims
- End with either a clear takeaway, a specific question to the reader,
  or a soft call to action (book, follow, save)
- Sound like the operator wrote it. Direct, no buzzwords, no "leverage".
  UK English.

Mix the angles across the 7:
- 2 specific tips or how-tos
- 2 stories from real work
- 1 contrarian observation
- 1 question to the audience
- 1 short, punchy one-liner

Voice note transcript:
[paste transcript]
```

Edit each post in roughly 1 minute. Schedule. Done for the week.

---

## Workflow 2: Automated review requests

The review request is the single highest-ROI automation. Every Google review compounds your local SEO. Most solo operators ask once and then never. This fixes it forever.

### Setup (one-off, 30 mins)

1. Create a form (Tally, Typeform) titled "Job complete — final check."
2. The form has three questions: "How did everything go?" (five-star scale), "Anything we should know about?" (open text), "Email" (auto-filled if possible).
3. Connect the form to an email automation. Two branches:
   - **4 or 5 stars** → send the review-request email with a direct Google review link
   - **3 or below** → send an internal alert to YOU, no automated reply
4. Trigger the form to send to every client 48 hours after job completion. Either send the link in your "job done" email, or build it into your invoice/payment flow.

### Email copy for the 4-5 star branch

```
Subject: One quick favour, [First Name]

Hi [First Name],

Really glad to hear it went well — thanks for the kind feedback.

If you've got 60 seconds, leaving a Google review would help a lot.
It's the single biggest thing that brings me new work from people in
your area.

Link: [Google review link]

Thanks again,
[You]
```

That email is what compounds. Every job that ends in a review makes the next ten jobs easier to find.

---

## Workflow 3: Case study from a five-minute client debrief

The case study is the asset that closes future clients. You should have one per project. Most solo operators have zero because writing them is the kind of "important not urgent" work that never happens.

### Setup (one-off, 15 mins)

Build a simple debrief script. Five questions:

1. What was the situation before we started?
2. What did we actually do?
3. What was the result, in numbers if possible?
4. What was the moment that mattered most?
5. Anything you'd want a future client like you to know?

### Per-project loop (15 mins)

When the project wraps, hop on a 5-minute Zoom or phone call with the client. Ask the five questions. Record it (with permission).

Run the transcript through this prompt:

```
You are writing a case study for a solo operator's website. The transcript
below is a 5-minute debrief with a recent client.

Produce a case study of 600 to 900 words structured as:

1. The client (one sentence on who they are, anonymised if needed)
2. The situation before (their words, lightly tidied)
3. The work (what was actually done — not jargon)
4. The result (specific numbers or outcomes, never softened)
5. The client's own words (one direct quote, pulled from the transcript)
6. What this means for similar clients (one paragraph)

Voice rules: direct, no marketing language, UK English. Read like a human
wrote it, not a marketing agency.

Debrief transcript:
[paste transcript]
```

Edit in ten minutes, publish that night, schedule a social post linking to it the next day.

---

## Workflow 4: Monthly SEO blog post

One blog post a month, from your own expertise. After a year, that's twelve indexable pages targeting specific search terms in your area. Compounding traffic.

### Setup (one-off, 30 mins)

List ten questions clients actually ask you in the first call. Real ones, not assumed ones. These are your first ten blog post topics. They're already buyer-intent keywords.

### Monthly loop (30 mins)

Pick the next question on the list. Talk through it as a voice note for two to three minutes. Run this prompt:

```
You are writing a blog post for a solo [trade / business] in the UK.

The post answers this question that real clients ask: "[question]"

The voice note below is the operator answering it in their own words.

Turn it into a 700 to 1,000 word blog post that:

- Opens with a one-paragraph answer (so the post answers the search intent
  even if the reader doesn't scroll)
- Then expands into the detail — 3 to 5 H2 sections covering nuance,
  examples, the common mistakes
- Closes with one specific call to action

SEO: include the exact question in the H1. Use natural variations of the
keyword through the H2s. UK English. No fluff opening like "in today's
world".

Voice note:
[paste transcript]
```

Edit in fifteen minutes. Schedule for publishing. Done for the month.

---

## Workflow 5: Quote follow-ups

Every quote you send needs three follow-ups if it goes quiet. Most solo operators send zero. This automation gets you to three without any thought.

### Setup (one-off, 20 mins)

When you send a quote, log it (Notion, Airtable, Sheet) with date sent and client email. Set up an automation that sends a follow-up email at day 3, day 7, and day 14. Day 14 is the "closing the loop" email that gets more replies than the first two combined.

The day-14 email:

```
Subject: Closing this one out, [First Name]?

Hi [First Name],

Closing this one out on my side so I can free up the slot. If timing
shifts in a few weeks, just reply to this thread — I keep quotes warm
for 60 days.

Best,
[You]
```

Most operators are surprised how many "actually yes please" replies come back from that one email.

---

## The two-hour day

If you've set up the five workflows above, your typical Monday-to-Friday day looks like:

- **First 30 mins of the day:** triage inbox, reply to anything that needs you, mark anything that doesn't for the AI to draft.
- **Mid-morning, 10 mins:** post scheduled. Voice note recording on a Monday only.
- **End of day, 20 mins:** quotes sent today logged, automations confirmed firing, anything client-confidential checked manually.

Total daily admin: roughly 60 mins. Plus 30 mins of "stuff that came up" buffer. Two hours.

Once a month: 30 mins on the SEO blog post. 15 mins per finished project on the case study.

Everything else — content cadence, review chasing, follow-ups, social scheduling — runs without you.

---

## The first 90 days

**Days 1-7.** Set up workflow 2 (review requests). Quickest win, biggest compounding effect.

**Days 8-21.** Set up workflow 1 (voice note to content). Run it for two weeks to find a voice that works.

**Days 22-45.** Set up workflow 3 (case studies). Catch every project that wraps in this period and turn each into a case study.

**Days 46-60.** Set up workflow 5 (quote follow-ups). Even if you only have a handful of quotes out, the automation costs nothing to run.

**Days 61-90.** Set up workflow 4 (monthly blog). Ship the first post. Then the second. After that it's a rhythm.

By day 90, the stack is running. By day 180, you'll wonder how you ever ran the business without it.

---

## Next step

Want a read on which workflow would give you the biggest week-one return for your specific business? [Book a free 30-minute call](https://chrisgarlick.com/contact). I'll look at how you work now and tell you which one to set up first. No pitch.
