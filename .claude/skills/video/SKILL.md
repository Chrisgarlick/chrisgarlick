---
name: video
description: Generate brand-consistent animated HTML videos for Instagram Reels, TikTok, and YouTube Shorts. Creates 9:16 portrait (1080x1920) self-contained HTML files with CSS animations that loop seamlessly over 20-40 seconds.
user-invocable: true
argument-hint: [description of what to animate]
---

# Video Skill — Chris Garlick Animated Social Content

Generate 1080x1920px (9:16 portrait) animated HTML files styled to Chris Garlick's dark editorial brand language. Each file is a self-contained, loopable CSS animation lasting 20-40 seconds, designed for Instagram Reels, TikTok, and YouTube Shorts.

## Input

The user's prompt: $ARGUMENTS

## Workflow

### 1. Parse the prompt

Identify:
- The subject or concept to animate
- Any style hints (dark, light, minimal, bold, data-driven, typographic)
- Quantity override (e.g. "5 variations of..." — default is 3)
- Duration preference (default 36s, range 20–40s)
- Content type best suited (stat reveal, quote, list, before/after, data story, single statement)

### 2. Slugify the prompt

Convert the core concept to a filesystem-safe folder name:
- Lowercase
- Replace spaces and special characters with hyphens
- Strip consecutive hyphens
- Max 50 characters
- Example: "73% of websites fail accessibility" → `73-percent-websites-fail-accessibility`

### 3. Check for existing folder

If `/docs/video/<slug>/` already exists:
- Find the highest numbered file (e.g. if `3.html` exists, next is `4`)
- Continue numbering from there

If it does not exist, create it and start from `1`.

### 4. Read reference files

Read both reference files before generating:
- `brand-motion.md` — Motion-specific brand rules, timing tokens, easing functions, animation patterns
- `templates.md` — Reusable animation code snippets for common patterns

### 5. Choose content type

Select the best template based on the prompt content:

| Type | Best for | Key animation |
|------|----------|---------------|
| **Stat Reveal** | Big numbers, percentages, data points | Number scales up, supporting text fades in |
| **Quote / Insight** | Quotes, insights, thought leadership | Line-by-line text reveal |
| **List / Tips** | Tips, checklists, numbered items | Staggered item entrance |
| **Before / After** | Comparisons, score improvements | Clip-path or crossfade transition |
| **Data Story** | Multiple stats building to conclusion | Sequential reveals with score rings |
| **Single Statement** | Bold claims, hot takes, brand statements | Dramatic enter → hold → exit |

### 6. Plan the timeline

Map content to the 5-act structure:

```
[INTRO]  →  [BUILD]  →  [PEAK]  →  [RESOLVE]  →  [OUTRO/LOOP-RESET]
 0-4s        4-12s       12-24s      24-32s         32-40s
```

| Phase | Duration | Purpose | Animation Style |
|-------|----------|---------|-----------------|
| **Intro** | 0–4s | Background fades in, atmosphere appears, title enters | Fade-in, scale-up, blur-to-sharp |
| **Build** | 4–12s | Supporting content appears sequentially | Staggered reveal-up, count-up |
| **Peak** | 12–24s | Core message fully visible, key stat holds | Subtle pulse, gentle float |
| **Resolve** | 24–32s | Content begins to exit | Fade-out, scale-down, blur |
| **Outro** | 32–40s | Returns to opening state, wordmark pulses | Mirror of Intro in reverse |

Assign each content element a specific enter time, hold duration, and exit time within this structure. Use `animation-delay` to stagger entrances.

### 7. Generate variations

Create 3 files (or user-specified count). Each must be a **distinct creative interpretation** — not minor tweaks:

- **Variation 1 — Clean & Minimal**: Light background, simple animations, generous whitespace, one focal element
- **Variation 2 — Rich & Layered**: Dark background, multiple atmospheric elements, complex staggers, card-like structures
- **Variation 3 — Bold & Different**: Brand-solid background, or unexpected composition, strongest visual impact

### 8. Write files

**Default location:** `/docs/video/<slug>/N.html`.

**IMPORTANT — Output path override:** When invoked by another skill (e.g. `/trend`), the calling skill specifies where files should be saved. ONLY write to that location. Never also write to `/docs/video/` when called from `/trend` — use the trend folder exclusively. Each skill owns its own output directory.

### 9. Write caption file

Create a `captions.md` file in the same folder (`/docs/video/<slug>/captions.md`). If the file already exists, append rather than overwrite.

Structure:

```markdown
# Video Captions — [Title]

## Combined Caption (all platforms)
**Hook:** [First line — the scroll-stopping hook]
**Caption:** [Full caption, conversational Chris Garlick voice, 1-3 sentences]

---

## Instagram Reels
[Caption, max 2200 chars, front-load the hook]

### Hashtags
#AIIntegration #AICoding #SoftwareDevelopment #AITools #BuildWithAI [15-20 total]

---

## TikTok
[Caption, max 300 chars, punchy and direct]

### Hashtags
#WebAccessibility #SEO #WebDesignTips #TechTok [10-15 total]

---

## YouTube Shorts
**Title**: [max 100 chars]
**Description**: [2-3 sentences]
```

#### Caption guidelines:
- Write in Chris's brand voice - conversational, authoritative, helpful (not corporate or salesy)
- Use British English spelling (optimise, colour, favour)
- Lead with a scroll-stopping hook in the first line
- Include a soft CTA where natural (e.g. "Link in bio to scan your site")
- 15-20 hashtags on IG — mix broad (#WebDesign) and niche (#WCAG, #A11y)
- Use AI/dev hashtags relevant to the content

### 10. Output summary

After writing all files, output:
- The file paths created (including `captions.md`)
- A one-line description of each variation
- The total animation duration
- A note about how to record to MP4 (screen record or Puppeteer)

---

## HTML Template Skeleton

Every video HTML output MUST use this skeleton:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=450" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      /* Brand colours — Chris Garlick */
      --bg-primary: #0A0A0A;
      --bg-secondary: #111111;
      --bg-tertiary: #1A1A1A;
      --text-primary: #F0EDE8;
      --text-secondary: #8A8580;
      --text-tertiary: #4A4845;
      --accent: #E8D5A3;
      --accent-hover: #F0E4BA;
      --neutral-800: #222220;
      --neutral-700: #333330;
      --neutral-400: #A8A39E;
      --neutral-300: #C5C0BA;

      /* Timing — adjust per video (20-40s) */
      --video-duration: 36s;

      /* Easing */
      --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
      --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
      --ease-out: cubic-bezier(0, 0, 0.2, 1);
      --ease-gentle-in: cubic-bezier(0.4, 0, 1, 1);
    }

    html {
      width: 450px;
      height: 800px;
      overflow: hidden;
    }

    body {
      width: 1080px;
      height: 1920px;
      overflow: hidden;
      font-family: 'DM Mono', monospace;
      position: relative;
      transform: scale(0.41667);
      transform-origin: top left;
      background: var(--bg-primary);
    }

    .canvas {
      width: 1080px;
      height: 1920px;
      position: relative;
      overflow: hidden;
    }

    /* Font classes */
    .font-display { font-family: 'Instrument Serif', Georgia, serif; }
    .font-body    { font-family: 'DM Mono', monospace; }

    /* Atmospheric layer (infinite loops, always running) */
    .atmosphere {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 0;
    }

    .gradient-circle {
      position: absolute;
      border-radius: 50%;
      filter: blur(120px);
    }

    /* Content layer */
    .content {
      position: relative;
      z-index: 1;
      padding: 100px 100px 100px 100px;
      height: calc(1920px - 60px); /* minus brand reserve */
      display: flex;
      flex-direction: column;
    }

    /* Brand reserve (bottom 60px) */
    .brand-reserve {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2;
    }

    .wordmark {
      font-family: 'DM Mono', monospace;
      font-weight: 500;
      font-size: 18px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      animation: wordmark-pulse 4s ease-in-out infinite;
    }

    @keyframes wordmark-pulse {
      0%, 100% { opacity: 0.4; }
      50%      { opacity: 0.7; }
    }
  </style>
</head>
<body>
  <div class="canvas">

    <!-- Atmospheric background (always looping) -->
    <div class="atmosphere">
      <!-- Gradient circles, grid overlays, etc. -->
    </div>

    <!-- Main content (lifecycle animations) -->
    <div class="content">
      <!-- Content goes here -->
    </div>

    <!-- Brand reserve -->
    <div class="brand-reserve">
      <span class="wordmark" style="color: var(--text-tertiary);">chrisgarlick.com</span>
    </div>

  </div>
</body>
</html>
```

---

## Canvas Specification

```
┌──────────────────────────┐
│      100px top padding    │
│                           │
│  ┌────────────────────┐   │
│  │                    │   │  100px
│  │   Safe Content     │   │  side
│  │   Area             │   │  padding
│  │   880 × 1660 px    │   │
│  │                    │   │
│  │                    │   │
│  │                    │   │
│  └────────────────────┘   │
│      100px bottom pad     │
│   ┌──────────────────┐    │
│   │ Brand Reserve 60 │    │
│   └──────────────────┘    │
└──────────────────────────┘
       1080 × 1920 px
```

- **Canvas**: 1080 × 1920 px (9:16 portrait)
- **Content padding**: 100px all sides (above brand reserve)
- **Brand reserve**: 60px fixed at bottom for chrisgarlick.com wordmark
- **Safe content area**: ~880 × 1660 px
- **Centre-safe zone**: Keep critical text within inner 80% — some platforms crop edges

---

## Content Overflow — CRITICAL

The 1080×1920px canvas is a hard boundary. **Nothing may overflow or be clipped.** This is the single most common defect — treat it seriously.

### Rules

1. **ALL content uses top-down flex flow** — `flex-direction: column` inside `.content`. No absolute positioning for content elements.
2. **Always calculate total content height EXPLICITLY before writing.** Add up: top padding (100px) + all element heights + all gaps + bottom padding (100px) + brand reserve (60px). Must not exceed 1920px.
3. **Atmospheric elements and branding must be absolute-positioned** with `pointer-events: none`. They sit outside the content flow.
4. **Content that cycles**: If you have more items than can fit (e.g. 8 list items), cycle them in/out — show 4-5 at a time with staggered enter/exit.
5. **When in doubt, make things smaller.** Whitespace is better than clipping.

### Typography Scale (for 1080×1920 video canvas — larger than draw for phone readability)

| Role | Font | Size | Weight | Min Size |
|------|------|------|--------|----------|
| Hero headline | Instrument Serif | 72–96px | 400 | 72px |
| Subheading | Outfit | 42–54px | 600 | 42px |
| Body text | Outfit | 36–42px | 400 | 36px |
| Stat number | Outfit | 120–200px | 700 | 120px |
| Label/caption | Outfit | 24–30px | 500 (uppercase, tracked) | 24px |
| Mono data | JetBrains Mono | 28–36px | 400 | 28px |

**Minimum text size: 24px** — anything smaller won't read on a phone.

**Maximum body text lines visible at once**: 6–8 lines.
**Maximum list items visible at once**: 5 (cycle more by animating in/out).

---

## Loop Mechanism — CRITICAL

The seamless loop is what makes these videos social-ready. Every video MUST loop cleanly.

### How it works

1. **Frame 0 = Frame final**: The last keyframe of every animated element returns it to its `0%` keyframe state
2. **Atmospheric elements**: Run on `animation-iteration-count: infinite` with their own shorter loops (6–12s), so they're always seamless regardless of content timing
3. **Content elements**: Use a single `animation-duration` equal to `--video-duration`, with keyframes that enter, hold, and exit back to start state
4. **Loop hold**: A 0.5–1s static hold at the end (both content gone and atmosphere still moving) gives a natural "reset" moment before the next loop

### Content lifecycle keyframe pattern

Every content element follows this pattern (adjust percentages based on `--video-duration`):

```css
@keyframes lifecycle {
  0%   { opacity: 0; transform: translateY(30px); }     /* hidden — matches 100% */
  8%   { opacity: 1; transform: translateY(0); }         /* enter */
  78%  { opacity: 1; transform: translateY(0); }         /* hold */
  92%  { opacity: 0; transform: translateY(-20px); }     /* exit */
  100% { opacity: 0; transform: translateY(30px); }      /* hidden — matches 0% */
}
```

Each element uses `animation-delay` to stagger entrances across the timeline. All elements must complete their exit before `--video-duration` ends.

### Ambient animations (infinite, independent of content)

| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Gradient circle 1 | Drift + scale | 8s | ease-in-out |
| Gradient circle 2 | Counter-drift + opacity pulse | 10s | ease-in-out |
| Grid overlay | Subtle opacity breathe | 6s | ease-in-out |
| Background gradient | Slow colour shift | 12s | linear |

These run independently and loop infinitely, providing constant subtle motion.

---

## Quality Checklist

Before outputting each file, verify:

- [ ] Canvas is exactly 1080 × 1920 px with no overflow
- [ ] All fonts load from Google Fonts (Instrument Serif, Outfit, JetBrains Mono)
- [ ] No external dependencies beyond Google Fonts
- [ ] No JavaScript — pure HTML + CSS only
- [ ] Animation total duration is 20–40 seconds (check `--video-duration`)
- [ ] Last frame visually matches first frame (loop test — verify every `@keyframes` block has matching 0% and 100%)
- [ ] Atmospheric elements loop independently and infinitely
- [ ] Content enters and exits cleanly — no jump cuts or flashes
- [ ] All `animation-fill-mode` values are correct (no flash of unstyled content on load)
- [ ] Brand reserve (chrisgarlick.com wordmark) is present at bottom, 60px height
- [ ] All text is ≥ 24px (readable on phone)
- [ ] All colours are from the brand palette (indigo, amber, slate, category, score)
- [ ] No content overflows the safe area (880 × 1660 px)
- [ ] Background treatment matches one of the 4 approved styles (light, dark, brand-solid, white)
- [ ] Each variation is visually distinct from the others
- [ ] Self-contained file opens correctly in a browser

---

## Recording Guidance

Include this in the output summary for the user:

### Screen Record (Simplest)
1. Open the HTML file in Chrome
2. Use macOS screen recording (Cmd+Shift+5) or OBS
3. Record for one full loop (duration shown in `--video-duration`)
4. Trim in CapCut / iMovie

### Puppeteer + ffmpeg (Automated)
```bash
# Capture frames at 30fps
node capture.js <file.html> --fps=30 --duration=36
# Stitch to MP4
ffmpeg -framerate 30 -i frame_%04d.png -c:v libx264 -pix_fmt yuv420p output.mp4
```

---

## Reference Files

| File | Purpose |
|------|---------|
| `brand-motion.md` | Motion-specific brand rules — timing tokens, easing, animation patterns, stagger system |
| `templates.md` | Reusable animation code snippets for common video patterns |
