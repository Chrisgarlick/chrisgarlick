<!-- Version: 1 | Department: product | Updated: 2026-05-02 -->

# Product — Final Output

## Executive Summary

The PRD defines a 7-page portfolio site on Kritano CMS with a clear scope: homepage with 9 sections, case study index with category filters, blog with editorial list, about page, and application form with Resend integration. Non-goals are explicit — no client hub, no newsletter, no light mode, no /team product page.

The product serves two users: visitors (Sarah/law, Tom/agency, David/accountancy personas) who browse and apply, and Chris (admin) who manages content via the CMS. Every feature has testable acceptance criteria. The roadmap separates V1 must-haves from V1.1 polish and V2+ expansion.

## Key Decisions

- Email field added to apply form (required for confirmation email to applicant — original spec omitted it)
- Form API has console.log fallback when Resend isn't configured
- Empty state handling: sections hide gracefully when no CMS content exists
- JS disabled: content visible via SSG, form shows noscript email fallback
- Category filter on /work is client-side (no page reload)
- No /tools page in V1 — homepage teaser only

## Dependencies & Handoffs

**For Design:** PRD defines all pages and sections. Use it to spec every screen and state.

**For Software:** PRD + constants.md are the implementation spec. Every requirement is testable. Edge cases and error states are defined. CMS collection schemas are ready for cms.config.ts.

**For Content:** 2 case studies + 2 blog posts needed at launch. Blog posts must follow AEO structure. Case studies must follow Problem → Architecture → Outcome format.

Full PRD, user stories, roadmap, and constants are in team/03-product/.
