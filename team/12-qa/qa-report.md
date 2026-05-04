<!-- Version: 1 | Department: qa | Updated: 2026-05-02 -->

# QA Report — chrisgarlick.com

**Overall Status: PASS with findings**

## Issue Summary

- CRITICAL: 0
- HIGH: 2 (sitemap.xml 404 in dev; privacy/terms pages missing)
- MEDIUM: 4 (rhetorical question headings; desktop nav missing About; homepage title format; 12px label font)
- LOW: 4

## Action Items

### HIGH — Fix immediately
1. Privacy and terms pages need building (/privacy, /terms) + footer links
2. Sitemap — verify on production build (expected to work, dev-mode limitation)

### MEDIUM — Fix before launch
1. Replace rhetorical question CTA headings with declarative statements
2. Add About link to desktop nav
3. Fix homepage title to match constants and stay under 60 chars
4. Align 12px label spec between design system and checklist (design system intentionally allows it)

### LOW — Note for later
1. Add privacy link near application form (after privacy page exists)
2. Add twitter:title, twitter:description, twitter:image tags
3. Consider rephrasing "If we are a fit" to avoid "we"
4. Verify sitemap on production build
