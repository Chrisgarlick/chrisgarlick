/**
 * Build the 5 /for/ audience carousels from a single content config.
 * Run with: node scripts/build-for-carousels.mjs
 *
 * Output:  docs/trend/for-carousels/<slug>/slide-NN.html
 *          docs/trend/for-carousels/<slug>/caption.txt
 *
 * After this runs, render PNGs by `cd`ing into each folder and using the
 * Playwright loop in the trend skill (or run scripts/render-for-carousels.mjs).
 *
 * Carousel structure follows the 6-slide viral pattern from the trend skill:
 *   01 HOOK · 02 PATTERN INTERRUPT · 03 POINT 1 · 04 POINT 2 · 05 FAIRNESS CHECK · 06 CTA
 *
 * Theme alternation (rule: alternate from the previous trend; the LLM carousel
 * was light, so this batch starts with DARK):
 *   agency-starters  dark
 *   consultants      light
 *   freelancers      dark
 *   solo-operators   light
 *   tradespeople     dark
 */

import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const OUT_BASE = resolve(ROOT, 'docs/trend/for-carousels')

// ─── Theme palettes ───────────────────────────────────────────────
const themes = {
  dark: {
    bg: '#0A0A0A',
    card: '#0E0E0E',
    cardAlt: '#111111',
    border: '#1A1A1A',
    accent: '#E8D5A3',
    textPrimary: '#F0EDE8',
    textSecondary: '#C9C5BD',
    textMuted: '#8A8580',
    textDim: '#4A4845',
    grid: 'rgba(240,237,232,0.02)',
    glowOpacity: '0.04',
    accentRgba: 'rgba(232,213,163,',
  },
  light: {
    bg: '#FAF8F5',
    card: '#FFFFFF',
    cardAlt: '#FFFFFF',
    border: '#E8E4DE',
    accent: '#C4A96B',
    textPrimary: '#1A1715',
    textSecondary: '#4A4845',
    textMuted: '#6A6660',
    textDim: '#C9C5BD',
    grid: 'rgba(26,23,21,0.025)',
    glowOpacity: '0.06',
    accentRgba: 'rgba(196,169,107,',
  },
}

// ─── HTML template renderer ───────────────────────────────────────
function renderSlide(slide, theme) {
  const t = themes[theme]
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { width: 1080px; height: 1080px; overflow: hidden; }
    .container { width: 1080px; height: 1080px; position: relative; overflow: hidden; font-family: 'DM Mono', monospace; background: ${t.bg}; }
    .font-display { font-family: 'Instrument Serif', Georgia, serif; }
  </style>
</head>
<body>
  <div class="container">
    <div style="position:absolute;top:-150px;right:-150px;width:600px;height:600px;border-radius:50%;opacity:${t.glowOpacity};filter:blur(140px);background:${t.accent};pointer-events:none;"></div>
    <div style="position:absolute;inset:0;background-image:linear-gradient(${t.grid} 1px, transparent 1px),linear-gradient(90deg, ${t.grid} 1px, transparent 1px);background-size:40px 40px;pointer-events:none;"></div>

    <div style="position:relative;z-index:1;padding:90px 75px 70px;height:100%;display:flex;flex-direction:column;">
      <p style="font-weight:500;font-size:18px;letter-spacing:0.18em;text-transform:uppercase;color:${t.accent};">${slide.eyebrow}</p>
      <h1 class="font-display" style="margin-top:32px;font-size:${slide.headlineSize || 58}px;line-height:1.05;color:${t.textPrimary};font-weight:400;">${slide.headline}</h1>
      ${slide.subhead ? `<p style="font-size:19px;color:${t.textSecondary};margin-top:24px;line-height:1.55;max-width:920px;">${slide.subhead}</p>` : ''}
      ${slide.body || ''}
      ${slide.footer ? `<p style="font-size:15px;color:${t.textMuted};margin-top:auto;letter-spacing:0.04em;text-align:center;">${slide.footer}</p>` : ''}
    </div>

    <span style="position:absolute;bottom:32px;right:75px;font-weight:500;font-size:16px;letter-spacing:0.18em;text-transform:uppercase;color:${t.textDim};">chrisgarlick.com</span>
  </div>
</body>
</html>
`
}

// ─── Helper builders for body content ─────────────────────────────
function twoColumn(left, right, theme) {
  const t = themes[theme]
  return `
      <div style="margin-top:40px;display:grid;grid-template-columns:1fr 1fr;gap:24px;flex:1;">
        <div style="background:${t.card};border:1px solid ${t.border};padding:30px 28px;display:flex;flex-direction:column;">
          <p style="font-weight:500;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:${t.textMuted};">${left.label}</p>
          <div style="margin-top:22px;display:flex;flex-direction:column;gap:18px;">
            ${left.items.map(i => `<p style="font-family:'Instrument Serif',Georgia,serif;font-size:24px;line-height:1.25;color:${theme === 'dark' ? '#6A6660' : '#A09A92'};">${i}</p>`).join('')}
          </div>
        </div>
        <div style="background:${t.card};border:1px solid ${t.accent};padding:30px 28px;display:flex;flex-direction:column;">
          <p style="font-weight:500;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:${t.accent};">${right.label}</p>
          <div style="margin-top:22px;display:flex;flex-direction:column;gap:18px;">
            ${right.items.map(i => `<p style="font-family:'Instrument Serif',Georgia,serif;font-size:24px;line-height:1.25;color:${t.textPrimary};">${i}</p>`).join('')}
          </div>
        </div>
      </div>`
}

function statCard(label, big, sub, theme) {
  const t = themes[theme]
  return `
      <div style="margin-top:40px;background:${t.card};border:1px solid ${t.accent};padding:48px 40px;text-align:center;">
        <p style="font-weight:500;font-size:13px;letter-spacing:0.18em;text-transform:uppercase;color:${t.accent};">${label}</p>
        <p class="font-display" style="font-size:130px;line-height:1;color:${t.textPrimary};margin-top:20px;">${big}</p>
        <p style="font-size:17px;color:${t.textSecondary};margin-top:22px;line-height:1.5;max-width:760px;margin-left:auto;margin-right:auto;">${sub}</p>
      </div>`
}

function bulletCard(items, theme) {
  const t = themes[theme]
  return `
      <div style="margin-top:36px;background:${t.card};border:1px solid ${t.border};padding:30px 32px;">
        ${items.map((item, i) => `
          <div style="display:flex;align-items:flex-start;gap:20px;padding:18px 0;${i > 0 ? `border-top:1px solid ${t.border};` : ''}">
            <span class="font-display" style="font-size:30px;color:${t.accent};line-height:1;min-width:48px;">${String(i + 1).padStart(2, '0')}</span>
            <p style="font-family:'Instrument Serif',Georgia,serif;font-size:23px;line-height:1.3;color:${t.textPrimary};">${item}</p>
          </div>`).join('')}
      </div>`
}

function ctaCard(items, theme) {
  const t = themes[theme]
  return `
      <div style="margin-top:40px;display:flex;flex-direction:column;gap:14px;">
        ${items.map((item, i) => {
          const isPrimary = i === 0
          const borderColor = isPrimary ? t.accent : t.border
          const labelColor = isPrimary ? t.accent : t.textMuted
          const numColor = isPrimary ? t.accent : t.textMuted
          return `
        <div style="background:${t.card};border:1px solid ${borderColor};padding:22px 28px;display:flex;align-items:center;gap:20px;">
          <span class="font-display" style="font-size:32px;color:${numColor};line-height:1;width:48px;">${String(i + 1).padStart(2, '0')}</span>
          <div>
            <p style="font-weight:500;font-size:13px;letter-spacing:0.16em;text-transform:uppercase;color:${labelColor};">${item.label}</p>
            <p class="font-display" style="font-size:22px;color:${t.textPrimary};margin-top:2px;line-height:1.2;">${item.text}</p>
            ${item.note ? `<p style="font-size:13px;color:${t.textMuted};margin-top:4px;">${item.note}</p>` : ''}
          </div>
        </div>`
        }).join('')}
      </div>`
}

function fairnessCard(intro, items, footer, theme) {
  const t = themes[theme]
  return `
      <p style="font-size:18px;color:${t.textSecondary};margin-top:24px;line-height:1.55;max-width:920px;">${intro}</p>
      <div style="margin-top:28px;">
        ${items.map((item, i) => `
          <div style="display:flex;align-items:flex-start;gap:20px;padding:18px 0;border-top:1px solid ${t.border};">
            <span class="font-display" style="font-size:30px;color:${t.accent};line-height:1;min-width:36px;">&check;</span>
            <p style="font-family:'Instrument Serif',Georgia,serif;font-size:24px;line-height:1.25;color:${t.textPrimary};">${item}</p>
          </div>`).join('')}
      </div>
      <div style="margin-top:auto;background:${t.accentRgba}0.05);border:1px solid ${t.accent};padding:22px 28px;">
        <p style="font-size:18px;color:${t.textPrimary};line-height:1.45;"><span style="color:${t.accent};font-weight:500;">${footer.lead}</span> ${footer.rest}</p>
      </div>`
}

// ─── The 5 carousels ──────────────────────────────────────────────
const carousels = [
  {
    slug: 'agency-starters',
    theme: 'dark',
    audience: 'Agency starters',
    pageUrl: 'chrisgarlick.com/for/agency-starters',
    slides: [
      {
        eyebrow: '01 / The contrarian take',
        headline: `You don't need a team.<br/>You need the right stack.`,
        headlineSize: 62,
        body: statCard('UK agency cost flip', '£10k → £200', 'A five-person team in 2024 vs. one founder with an AI stack in 2026. Same deliverables. Different margin.', 'dark'),
      },
      {
        eyebrow: '02 / Pattern interrupt',
        headline: `The advice you've been<br/>given is outdated.`,
        headlineSize: 56,
        body: twoColumn(
          { label: 'What you\'re told', items: ['"You need a team to scale."', '"Hire a junior copywriter."', '"Outsource the reporting."', '"AI is for the production layer."'] },
          { label: 'What works in 2026', items: ['Solo founder + stack.', 'AI does 10 copy variants per brief.', 'Reporting auto-drafts, you check.', 'AI runs the whole production layer.'] },
          'dark'
        ),
      },
      {
        eyebrow: '03 / Point one',
        headline: `Most agencies die in the<br/>first 18 months.`,
        headlineSize: 54,
        subhead: 'Not because the work is bad. Because the operational overhead grows linearly with every client. Five clients in, the admin eats your evenings. Ten clients in, you either hire (and the margin disappears) or cap there.',
        body: `<div style="margin-top:32px;background:#0E0E0E;border:1px solid #1A1A1A;border-left:3px solid #E8D5A3;padding:28px 32px;"><p style="font-size:19px;color:#F0EDE8;line-height:1.55;"><span style="color:#E8D5A3;font-weight:500;">A small-team-with-AI-stack flips the curve.</span> Your delivery layer scales without adding headcount. Margin stays where it should: with the founder.</p></div>`,
      },
      {
        eyebrow: '04 / Point two',
        headline: `One brief.<br/>Day one client work.`,
        headlineSize: 62,
        subhead: 'What the AI stack actually replaces, ranked by leverage:',
        body: bulletCard([
          'Full client onboarding from one discovery brief',
          'Ad copy variants at scale, no copywriter',
          'Funnel pages and landing copy in three formats',
          'Monthly reporting that looks senior, in 20 mins',
          'Cold outreach personalised at scale, no setter',
        ], 'dark'),
      },
      {
        eyebrow: '05 / The honest counter',
        headline: `But sometimes you<br/><span style="color:#E8D5A3;">should</span> hire.`,
        headlineSize: 56,
        body: fairnessCard(
          'The model is not "never hire anyone." It\'s "don\'t hire until the maths obviously demands it." The signals:',
          [
            '60-hour weeks bottlenecked by bespoke client work',
            'One client is 40%+ of revenue (concentration risk)',
            'A specific repeatable task is eating 20+ hrs/week',
          ],
          { lead: 'When you hire,', rest: 'hire for the highest-leverage repeatable task. Strategy is the last thing you hire for.' },
          'dark'
        ),
      },
      {
        eyebrow: '06 / Your move',
        headline: `Get the full<br/>playbook.<br/><span style="color:#E8D5A3;">Free.</span>`,
        headlineSize: 78,
        subhead: 'The Zero-Team Agency Playbook. The stack, the prompts, the pricing maths, and the 90-day plan from first client to £10k MRR.',
        body: ctaCard([
          { label: 'Get it', text: 'chrisgarlick.com/for/agency-starters', note: 'Free PDF after a quick email.' },
          { label: 'Save', text: 'Save this for the next time someone says "you need a team to scale".' },
          { label: 'Share', text: 'Tag a solo founder who\'s thinking about hiring.' },
        ], 'dark'),
      },
    ],
    caption: `If you're building an agency in 2026, the "you need a team to scale" advice is out of date.

A five-person agency team in the UK costs roughly £10,000 a month loaded. The equivalent AI stack costs £200 to £500 a month. Same deliverables, different margin. The work itself doesn't get cheaper. The overhead does.

Most solo-founder agencies die in the first 18 months. Not because the work is bad. Because the operational overhead grows linearly with every client, and there's no margin to fund the founder. A small-team-with-AI-stack flips that curve.

Five things the stack replaces:

1. Full client onboarding from one brief
2. Ad copy variants at scale (no copywriter)
3. Funnel pages in three formats
4. Monthly reporting that looks senior
5. Cold outreach personalised at scale

But this isn't "never hire." Hire when one client is 40%+ of revenue, when a repeatable task is eating 20+ hours a week, or when you genuinely can't deliver at quality. Just don't hire before the maths demands it.

Save this for the next time someone tells you to "build a team".
Get the full Zero-Team Agency Playbook at chrisgarlick.com/for/agency-starters.
Tag a solo founder who's about to make the wrong hire.

#AgencyOwner #SoloAgency #UKAgency #AIagency #StartingAgency #ProductisedAgency #AgencyGrowth #SmallBusinessUK #ChrisGarlick #AI2026 #UKBusiness #AgencyStack #BootstrappingUK #MarketingAgency #DigitalAgency`,
  },

  {
    slug: 'consultants',
    theme: 'light',
    audience: 'Consultants',
    pageUrl: 'chrisgarlick.com/for/consultants',
    slides: [
      {
        eyebrow: '01 / The contrarian take',
        headline: `Your frameworks are<br/>worth more than your<br/>one-to-one hours.`,
        headlineSize: 56,
        body: statCard('Content from one methodology', '60+ pieces', 'Blog, LinkedIn, email, video, SEO landing pages, lead magnet. All from one good methodology doc. All in your voice.', 'light'),
      },
      {
        eyebrow: '02 / Pattern interrupt',
        headline: `Time scales linearly.<br/>Methodology scales infinitely.`,
        headlineSize: 50,
        body: twoColumn(
          { label: 'Hours-for-money trap', items: ['Your time is the product.', 'Revenue caps at your rate × hours.', 'Methodology stays in your head.', 'Same insight delivered 50 times.'] },
          { label: 'Methodology as asset', items: ['Your framework is the product.', 'Content compounds, hours don\'t.', 'Methodology earns while you sleep.', 'One insight reaches 5,000 readers.'] },
          'light'
        ),
      },
      {
        eyebrow: '03 / Point one',
        headline: `Six prompts.<br/>Six months of content.`,
        headlineSize: 58,
        subhead: 'One methodology document becomes a half-year content calendar:',
        body: bulletCard([
          '8 blog posts (one every three weeks)',
          '26 LinkedIn posts (one a weekday)',
          '8 email newsletter editions',
          '24 short-form video scripts',
          '3-5 SEO landing pages per niche',
          '1 lead magnet, refreshed mid-year',
        ], 'light'),
      },
      {
        eyebrow: '04 / Point two',
        headline: `The 80/20 split that<br/>actually works.`,
        headlineSize: 54,
        subhead: 'Automate the wrong 20% and the content sounds like a marketing agency wrote it. Get the split right and nobody can tell.',
        body: `<div style="margin-top:32px;background:#FFFFFF;border:1px solid #E8E4DE;padding:30px 32px;"><div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;"><div><p style="font-weight:500;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#C4A96B;">AI does 80%</p><p style="font-family:'Instrument Serif',Georgia,serif;font-size:21px;line-height:1.3;color:#1A1715;margin-top:14px;">First drafts. The mechanical extraction. Repurposing across formats. SEO research.</p></div><div><p style="font-weight:500;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#6A6660;">You do 20%</p><p style="font-family:'Instrument Serif',Georgia,serif;font-size:21px;line-height:1.3;color:#1A1715;margin-top:14px;">The methodology doc. The voice edit on every piece. Replies. Strategic context.</p></div></div></div>`,
      },
      {
        eyebrow: '05 / The honest counter',
        headline: `When this stops working.`,
        headlineSize: 62,
        body: fairnessCard(
          'The system breaks when:',
          [
            'Your methodology stops evolving (18 months on one framework gets repetitive)',
            'You start posting just to post. Audience disengages fast.',
            'Audience grows past what the framework actually speaks to',
          ],
          { lead: 'Better to pause', rest: 'than to coast. The compounding stops the moment the substance does.' },
          'light'
        ),
      },
      {
        eyebrow: '06 / Your move',
        headline: `The full system<br/>is on the site. <span style="color:#C4A96B;">Free.</span>`,
        headlineSize: 64,
        subhead: 'One Framework, Six Months of Content. The six extraction prompts, the cadence, the sequencing.',
        body: ctaCard([
          { label: 'Get it', text: 'chrisgarlick.com/for/consultants', note: 'Free PDF after a quick email.' },
          { label: 'Save', text: 'Save this for the next time you\'re tempted to take another one-to-one hour.' },
          { label: 'Share', text: 'Tag a consultant whose methodology never gets out of their head.' },
        ], 'light'),
      },
    ],
    caption: `Your frameworks are worth more than your one-to-one hours.

The trap most independent consultants get stuck in is selling the time, not the methodology. Time scales linearly with hours worked. Methodology scales infinitely once it's in market.

One good methodology document, 2,000 to 4,000 words covering the problem, the principles, the steps, the failure modes, produces a half-year content calendar:

· 8 blog posts
· 26 LinkedIn posts (one a weekday)
· 8 email newsletters
· 24 short-form video scripts
· 3 to 5 SEO landing pages per niche
· 1 lead magnet

That's roughly 60 to 70 distinct pieces of content from one document. Each one true, each one useful, each one referencing the same underlying framework so the audience sees the through-line.

The trick is the 80/20 split. AI does the first drafts, the mechanical extraction, the repurposing. You do the methodology document, the voice edit on every piece, the replies, the strategic context. Get the split right and nobody can tell. Get it wrong and it sounds like a marketing agency wrote it.

The system stops working when the methodology stops evolving. Eighteen months on one framework gets repetitive. Better to pause than to coast. The compounding stops the moment the substance does.

Save this for the next time you're tempted to take another one-to-one hour.
Get the full system at chrisgarlick.com/for/consultants.
Tag a consultant whose methodology never gets out of their head.

#IndependentConsultant #ConsultantLife #ConsultingBusiness #ThoughtLeadership #ContentMarketing #UKConsultant #LinkedInGrowth #PersonalBrand #ConsultingFrameworks #ProductisedConsulting #SoloConsultant #ChrisGarlick #AI2026 #UKBusiness`,
  },

  {
    slug: 'freelancers',
    theme: 'dark',
    audience: 'Freelancers',
    pageUrl: 'chrisgarlick.com/for/freelancers',
    slides: [
      {
        eyebrow: '01 / The contrarian take',
        headline: `You're losing three hours<br/>every time a brief lands.`,
        headlineSize: 54,
        body: statCard('Proposal-writing time', '2hr → 10min', 'Brief in. Personalised proposal in your voice out. Edit-not-write. Cycle time drops, win rate climbs.', 'dark'),
      },
      {
        eyebrow: '02 / Pattern interrupt',
        headline: `AI doesn't replace the craft.<br/>It replaces the overhead.`,
        headlineSize: 50,
        body: twoColumn(
          { label: 'What freelancers fear', items: ['"AI will write the design brief."', '"AI will replace what I do."', '"My clients will use AI instead."', '"My rates will collapse."'] },
          { label: 'What actually happens', items: ['AI writes the proposal admin.', 'You ship more work, faster.', 'Clients still need your judgment.', 'You take on more clients per month.'] },
          'dark'
        ),
      },
      {
        eyebrow: '03 / Point one',
        headline: `The bottleneck isn't<br/>your skill.`,
        headlineSize: 60,
        subhead: 'A senior freelancer can deliver three to five client projects a month. What stops most at two or three:',
        body: bulletCard([
          'Proposal writing on Friday nights, 2 hrs per opportunity',
          'LinkedIn that goes silent during delivery, then needs reviving cold',
          'Onboarding emails sent at midnight, inconsistent every time',
          'Lead gen that never quite happens',
          'Quote follow-ups that feel awkward, so they don\'t',
        ], 'dark'),
      },
      {
        eyebrow: '04 / Point two',
        headline: `The follow-up email<br/>nobody sends.`,
        headlineSize: 58,
        subhead: 'Day 11 after a proposal goes quiet. "Should I close this one out?" It converts more replies than the other three follow-ups combined.',
        body: `<div style="margin-top:32px;background:#0E0E0E;border:1px solid #E8D5A3;padding:30px 34px;"><p style="font-family:'Instrument Serif',Georgia,serif;font-size:24px;line-height:1.45;color:#F0EDE8;font-style:italic;">"Realised I haven't heard back. Totally fine if this isn't the right time or if you've gone in a different direction. Should I close it out, or has it just been a busy fortnight?"</p><p style="font-size:14px;color:#8A8580;margin-top:18px;letter-spacing:0.06em;">Most people don't reply because they're embarrassed about not deciding. Give them an easy way to say "still thinking" and you get a real answer fast.</p></div>`,
      },
      {
        eyebrow: '05 / The honest counter',
        headline: `When AI proposals fail.`,
        headlineSize: 62,
        body: fairnessCard(
          'Win rate drops below 30%? The cause is almost always one of these:',
          [
            'The brief was vague and you didn\'t charge for paid discovery',
            'You led with yourself instead of the situation',
            'The price was buried, not where the buyer expects it',
          ],
          { lead: 'AI doesn\'t fix bad structure.', rest: 'It just produces bad proposals faster. The template has to be right first.' },
          'dark'
        ),
      },
      {
        eyebrow: '06 / Your move',
        headline: `The full pack<br/>is on the site. <span style="color:#E8D5A3;">Free.</span>`,
        headlineSize: 64,
        subhead: 'Three proposal templates, the brief-to-proposal prompt, the four-email follow-up sequence and the onboarding kit.',
        body: ctaCard([
          { label: 'Get it', text: 'chrisgarlick.com/for/freelancers', note: 'Free PDF after a quick email.' },
          { label: 'Save', text: 'Save this for the next Friday night spent rewriting a proposal from scratch.' },
          { label: 'Share', text: 'Tag a freelancer who needs their weekends back.' },
        ], 'dark'),
      },
    ],
    caption: `You're losing three hours every time a brief lands. The fix isn't to write faster.

The honest framing: AI doesn't write your proposal. You write it once, well, in your voice. Then AI takes the brief from each new prospect and adapts the proposal to fit. The output is 80% there in ten minutes. The remaining 20% is the human read-through that makes it sound like you.

The bottleneck isn't your skill. It's everything surrounding it. A senior freelance designer, developer or copywriter can deliver three to five client projects a month. What stops most at two:

· Proposal writing on Friday nights
· LinkedIn going silent during delivery
· Onboarding emails sent at midnight, inconsistent every time
· Lead gen that never quite happens
· Quote follow-ups that feel awkward

The single highest-converting email in the pack is the day-11 follow-up: "Should I close this one out, or has it just been a busy fortnight?" Most people don't reply because they're embarrassed about not deciding. Give them an easy way to say "still thinking" and you get a real answer fast.

When proposals fail, it's almost always one of three reasons: vague brief and no paid discovery, led with yourself instead of the situation, or the price was buried. AI doesn't fix bad structure. It just produces bad proposals faster.

Save this for the next Friday night spent rewriting a proposal from scratch.
Get the full proposal pack at chrisgarlick.com/for/freelancers.
Tag a freelancer who needs their weekends back.

#Freelancer #FreelanceLife #UKFreelancer #FreelanceDesign #FreelanceCopywriter #FreelanceDeveloper #ClientWork #ProposalWriting #FreelanceTips #SelfEmployed #ChrisGarlick #AI2026 #UKBusiness #BriefToProposal`,
  },

  {
    slug: 'solo-operators',
    theme: 'light',
    audience: 'Solo operators',
    pageUrl: 'chrisgarlick.com/for/solo-operators',
    slides: [
      {
        eyebrow: '01 / The contrarian take',
        headline: `Run a one-person business<br/>in 2 hours of admin a day.`,
        headlineSize: 54,
        body: statCard('Admin time, after the stack', '~90 min', 'A day. Down from six-plus hours of fragmented admin that always pushed the compounding work to the weekend.', 'light'),
      },
      {
        eyebrow: '02 / Pattern interrupt',
        headline: `The trap isn't lack of work.<br/>It's lack of margin for the work that compounds.`,
        headlineSize: 38,
        body: twoColumn(
          { label: 'What kills solo operators', items: ['Content cadence dies in week three.', 'Review chase happens once, then never.', 'Case studies pile up unwritten.', 'Six months in, no further forward.'] },
          { label: 'What the stack does', items: ['Content auto-drafts every Monday.', 'Review request fires after every job.', 'Case studies in 15 mins per project.', 'Six months in, library that compounds.'] },
          'light'
        ),
      },
      {
        eyebrow: '03 / Point one',
        headline: `Voice note Monday morning.<br/>Seven days of content.`,
        headlineSize: 50,
        subhead: 'The highest-leverage workflow in the stack. Three minutes recording in the car. Ten minutes editing the drafts. The rest runs automatically.',
        body: bulletCard([
          'One voice memo. No structure required.',
          'AI extracts seven posts in your voice. Tips, stories, observations.',
          'You edit each in a minute or two to make it sound like you.',
          'Buffer or similar schedules them across the week.',
          'Total Monday admin: under 15 minutes.',
        ], 'light'),
      },
      {
        eyebrow: '04 / Point two',
        headline: `The review automation.<br/>Highest ROI in the pack.`,
        headlineSize: 50,
        subhead: 'Every Google review compounds your local SEO. Most solo operators ask once, then never. This fixes it forever.',
        body: `<div style="margin-top:32px;background:#FFFFFF;border:1px solid #E8E4DE;border-left:3px solid #C4A96B;padding:30px 34px;"><p style="font-size:17px;color:#1A1715;line-height:1.6;">Job done. 48 hours later, customer fills a one-question form. 4 or 5 stars → auto-sends a Google review link. 3 or below → you get an alert and call them yourself.</p><p style="font-size:17px;color:#4A4845;margin-top:14px;line-height:1.6;"><span style="color:#C4A96B;font-weight:500;">Two thirds</span> of customers leave a review if asked. Most never get asked. £0 to £5 a month to run.</p></div>`,
      },
      {
        eyebrow: '05 / The honest counter',
        headline: `What you don't automate.`,
        headlineSize: 60,
        body: fairnessCard(
          'The 80% AI / 20% you split breaks if you skip the 20%. Things to keep manual:',
          [
            'The voice editing pass on every piece of content',
            'Replies to comments, DMs, and review responses',
            'Anything touching client-confidential information',
            'The actual paid work itself (obviously)',
          ],
          { lead: 'Skip the voice pass', rest: 'and the audience clocks it within three posts. The 20% is what makes the 80% not sound like AI.' },
          'light'
        ),
      },
      {
        eyebrow: '06 / Your move',
        headline: `The full stack<br/>is on the site. <span style="color:#C4A96B;">Free.</span>`,
        headlineSize: 64,
        subhead: 'The Solo Operator AI Stack. Five workflows, the tools, the prompts, the 90-day rollout plan.',
        body: ctaCard([
          { label: 'Get it', text: 'chrisgarlick.com/for/solo-operators', note: 'Free PDF after a quick email.' },
          { label: 'Save', text: 'Save this for the next time the admin eats your evening.' },
          { label: 'Share', text: 'Tag a solo operator who\'s busier than they should be.' },
        ], 'light'),
      },
    ],
    caption: `Run a one-person business on two hours of admin a day. Not magic. Just elimination of the four or five tasks that quietly eat your week without you noticing.

The trap of a one-person business isn't lack of work. It's that the things that would compound your business never happen, because there's no margin in the day for them. The content cadence dies after week three. The review chase happens once and then never. Case studies pile up unwritten. Six months in, you're as busy as ever but no further forward.

Five workflows that run in the background:

1. Voice note Monday morning → 7 days of social posts (10 minutes total)
2. Automated review request after every job (compounds your local SEO)
3. Case study from a 5-minute client debrief (your highest-leverage marketing asset)
4. Monthly SEO blog post from a topic you already know (one a month, twelve a year)
5. Quote follow-up sequence that runs without you remembering

The review automation alone is worth the whole stack. Two thirds of customers leave a review if asked. Most never get asked. Set it up once, runs forever, every job compounds.

The 80/20 split matters. AI does the first drafts, the mechanical extraction, the scheduling. You do the voice editing pass, the replies, anything client-confidential. Skip the 20% and the audience clocks it within three posts.

Save this for the next time the admin eats your evening.
Get the full stack at chrisgarlick.com/for/solo-operators.
Tag a solo operator who's busier than they should be.

#SoloOperator #SoloPreneur #OnePersonBusiness #SmallBusinessUK #SelfEmployed #SmallBizOwner #UKSmallBusiness #SoloFounder #SmallBusinessOwner #BusinessAutomation #ChrisGarlick #AI2026 #UKBusiness #SmallBusinessTips`,
  },

  {
    slug: 'tradespeople',
    theme: 'dark',
    audience: 'Tradespeople',
    pageUrl: 'chrisgarlick.com/for/tradespeople',
    slides: [
      {
        eyebrow: '01 / The contrarian take',
        headline: `Fill next month's calendar.<br/>From your phone.`,
        headlineSize: 56,
        body: statCard('Monthly cost done right', '£15-20', 'For everything: photos, posts, reviews, follow-ups, ads. Free tier of most tools works. No marketing agency. No copywriter.', 'dark'),
      },
      {
        eyebrow: '02 / Pattern interrupt',
        headline: `Stop hiring a marketing agency<br/>you can't afford.`,
        headlineSize: 44,
        body: twoColumn(
          { label: 'What agencies sell you', items: ['£500/month retainer.', 'Generic stock photos.', '"Professional services" copy.', 'Reports nobody reads.'] },
          { label: 'What actually works', items: ['£15 in tools, max.', 'Your real before/afters.', 'You talking about real jobs.', 'Google reviews compounding.'] },
          'dark'
        ),
      },
      {
        eyebrow: '03 / Point one',
        headline: `Before/after Reels.<br/>Three minutes in the van.`,
        headlineSize: 54,
        subhead: 'CapCut is free, on your phone, has built-in before/after templates. Two photos, one transition, one line of text. Posted the same day.',
        body: bulletCard([
          'Three photos before the job: wide, close-up of problem, work area',
          'Three photos when you finish: same angles',
          'Open CapCut in the van. Pick "before/after" template. Drop in photos.',
          'One line of text: trade · area · what you did',
          'Post to Instagram and Facebook before you drive off',
        ], 'dark'),
      },
      {
        eyebrow: '04 / Point two',
        headline: `Reviews are the<br/>quiet compounding engine.`,
        headlineSize: 56,
        subhead: 'Tradespeople with 50+ Google reviews show up first in local searches. Tradespeople with 5 are buried. The asking is the bottleneck.',
        body: `<div style="margin-top:32px;background:#0E0E0E;border:1px solid #E8D5A3;padding:30px 34px;"><p style="font-size:17px;color:#F0EDE8;line-height:1.6;">Set up a simple Tally form. Customer fills it 48 hours after the job. 4 or 5 stars? It auto-sends a Google review link. 3 or below? You get an alert.</p><p style="font-size:17px;color:#C9C5BD;margin-top:14px;line-height:1.6;"><span style="color:#E8D5A3;font-weight:500;">Two thirds</span> of customers will leave a review if asked. Most never get asked. Free to set up. Compounds every job.</p></div>`,
      },
      {
        eyebrow: '05 / The honest counter',
        headline: `What NOT to do.`,
        headlineSize: 64,
        body: fairnessCard(
          'The mistakes that kill the whole system:',
          [
            'Don\'t try to be on every platform. Pick one (Instagram or Facebook).',
            'Don\'t post AI captions without reading them first',
            'Don\'t use stock photos. Your real before/afters beat any of them.',
            'Don\'t pay for ads in the first three months',
          ],
          { lead: 'Don\'t outsource any of this in the first six months.', rest: 'The reason this works is the voice. An agency post loses to a real video of you fixing a real boiler.' },
          'dark'
        ),
      },
      {
        eyebrow: '06 / Your move',
        headline: `The five tools<br/>are on the site. <span style="color:#E8D5A3;">Free.</span>`,
        headlineSize: 64,
        subhead: '5 AI Tools Every Tradesperson Should Use in 2026. The order to set them up. The total monthly cost. What to skip.',
        body: ctaCard([
          { label: 'Get it', text: 'chrisgarlick.com/for/tradespeople', note: 'Free PDF after a quick email.' },
          { label: 'Save', text: 'Save this for when next week\'s calendar looks thinner than you\'d like.' },
          { label: 'Share', text: 'Tag a mate in the trade who could use this.' },
        ], 'dark'),
      },
    ],
    caption: `Fill next month's calendar from your phone. £15 to £20 a month, total. No marketing agency. No copywriter.

The trade is the easy part. You're good at the trade. The hard part is being the marketing department, the office manager, the sales follow-up person, and the social media manager when you're already on a roof or under a sink. AI doesn't do the actual work. It does the photos, the posts, the reviews and the follow-ups that fill next month's calendar.

Five tools, free or near-free, on your phone:

1. CapCut for before/after Reels. Three minutes in the van after every job.
2. Claude or ChatGPT for captions, posts and Google review replies
3. Google Business Profile (with weekly posts). Biggest local SEO lever.
4. A Tally form for automated review requests after every job
5. Voice notes for the bits you'd type at a laptop

Reviews are the quiet compounding engine. Tradespeople with 50+ Google reviews show up first in local searches. Tradespeople with 5 are buried. Two thirds of customers will leave a review if asked. Most never get asked.

What NOT to do: don't try to be on every platform (pick one), don't post AI captions without reading them, don't use stock photos (your real before/afters beat anything), don't pay for ads in the first three months. Don't outsource any of this in the first six months. The reason it works is the voice.

Save this for when next week's calendar looks thinner than you'd like.
Get the full guide at chrisgarlick.com/for/tradespeople.
Tag a mate in the trade who could use this.

#Tradesperson #UKTrades #Plumber #Electrician #Builder #Roofer #SelfEmployed #SoleTrader #LocalBusiness #SmallBusinessUK #Checkatrade #GoogleReviews #ChrisGarlick #AI2026 #TradesMarketing`,
  },
]

// ─── Write everything out ─────────────────────────────────────────
for (const c of carousels) {
  const folder = resolve(OUT_BASE, c.slug)
  mkdirSync(folder, { recursive: true })

  c.slides.forEach((slide, i) => {
    const n = String(i + 1).padStart(2, '0')
    writeFileSync(resolve(folder, `slide-${n}.html`), renderSlide(slide, c.theme))
  })

  writeFileSync(resolve(folder, 'caption.txt'), c.caption)

  console.log(`✓ ${c.slug} (${c.theme})  ·  ${c.slides.length} slides + caption`)
}

console.log(`\nDone. Render PNGs with:\n  for d in docs/trend/for-carousels/*/; do (cd "$d" && for f in slide-*.html; do npx playwright screenshot --viewport-size="1080,1080" --full-page "file://$(pwd)/$f" "$(pwd)/\${f%.html}.png" 2>&1 | tail -1 & done; wait); done`)
