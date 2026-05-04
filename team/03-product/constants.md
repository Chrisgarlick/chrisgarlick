<!-- Version: 1 | Department: product | Updated: 2026-05-02 -->

# Product Constants — Single Source of Truth

## Offers

| Constant | The Build | The Retainer |
|----------|-----------|-------------|
| Name | The Build | The Retainer |
| Price min | £5,000 | £3,000/mo |
| Price max | £8,000 | £6,000/mo |
| Duration | 2–4 weeks | Ongoing |
| Type | Fixed fee | Monthly |

**Build includes:** Operations audit, AI workflow builds, Team handover + documentation, Built on proprietary tooling

**Retainer includes:** System maintenance, New workflow additions, Monthly ROI reporting, Staff training as needed

## Positioning

| Key | Value |
|-----|-------|
| Title | Chris Garlick |
| Role | AI Workflow Partner |
| One-liner | I build AI systems for service businesses using tools I built myself. |
| Tagline | Audit. Build. Maintain. |
| Response time | 2 working days |
| Site URL | https://chrisgarlick.com |
| CMS label | Built on Kritano CMS |

## CMS Collections

### caseStudy (new)
- title: string, required
- slug: string, required, unique
- body: richText
- category: select [Legal, Accountancy, Agency, Internal]
- result: string
- summary: textarea
- duration: string
- tier: select [Build, Build + Retainer, Retainer]
- publishedAt: datetime
- status: select [draft, published]
- seo: seoBlock

### proofMetric (new)
- text: string, required
- sortOrder: number, required

## Apply Form Fields

| Field | Type | Required | Options |
|-------|------|----------|---------|
| name | text | Yes | — |
| email | email | Yes | — |
| businessName | text | Yes | — |
| industry | text | Yes | — |
| employees | radio | Yes | Under 10, 10–25, 25–50, 50+ |
| revenue | radio | Yes | Under £500k, £500k–£1M, £1M–£5M, £5M–£10M, £10M+ |
| bottleneck | textarea | Yes | — |
| referral | text | No | — |

## Category Filters
All, Legal, Accountancy, Agency, Internal

## SEO Constants
- Title template: {page} — Chris Garlick
- Homepage title: Chris Garlick — AI Workflow Partner
- Meta desc max: 155 chars
- OG locale: en_GB
