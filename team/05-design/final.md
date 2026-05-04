<!-- Version: 1 | Department: design | Updated: 2026-05-02 -->

# Design — Final Output

## Executive Summary

The design system is a dark editorial aesthetic with precise, implementable specifications. Every value is exact — hex codes, pixel values, font weights, CSS properties. Software can build the entire UI from this document without asking a question.

The palette uses warm neutrals only: near-black backgrounds (#0A0A0A, #111111, #1A1A1A), warm off-white text (#F0EDE8), and a single gold accent (#E8D5A3). No blues, purples, gradients, or stock photography. Typography is the signature: Instrument Serif for headlines (editorial authority), DM Mono for body (technical precision). Maximum border radius is 4px — only pill CTAs use full rounding.

UI specs cover all V1 pages with layout descriptions, component breakdowns, responsive behaviour, empty/error/loading states, and accessibility notes. The design prioritises density and typography over imagery and decoration.

## Key Decisions

- text-tertiary (#4A4845) fails WCAG AA at body sizes — restricted to decorative use only (24px+ numerals)
- destructive (#C0392B) passes AA only at large text — always paired with icon or text label
- 12px label token is the single exception to 14px minimum (uppercase increases effective size)
- Tailwind CSS 4 @theme block provides all overrides — no tailwind.config.js needed
- Marquee is CSS-only animation, no JS library
- Radio group renders as selectable bordered boxes, not native radio buttons
- Mobile nav: hamburger → off-canvas drawer from right

## Dependencies & Handoffs

**For Software:** Read design-system.md before writing any CSS. The Tailwind @theme block is ready to paste. Use the component definitions for all interactive elements. Check the UI specs for responsive breakpoints and empty states.

**For Content:** Typography hierarchy defines visual hierarchy — H2 (serif) for major sections, H3 (serif) for sub-sections, H4 (mono, uppercase) for labels.

Full design system, UI specs, and asset list are in their respective files in team/05-design/.
