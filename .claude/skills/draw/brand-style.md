# Chris Garlick Brand Style — Visual Asset Reference

This file defines the visual rules for all `/draw` outputs. Every generated asset must look like it belongs on chrisgarlick.com - dark, editorial, refined.

## Colour Palette

### Core Tokens

| Token | Hex | Usage |
|-------|-----|-------|
| bg-primary | `#0A0A0A` | Page/canvas background |
| bg-secondary | `#111111` | Card surfaces, elevated containers |
| bg-tertiary | `#1A1A1A` | Borders, dividers, subtle backgrounds |
| text-primary | `#F0EDE8` | Headlines, body text |
| text-secondary | `#8A8580` | Supporting text, dates, metadata |
| text-tertiary | `#4A4845` | Labels, captions, ghost/placeholder text |
| accent | `#E8D5A3` | Links, CTAs, result numbers, key highlights |
| accent-hover | `#F0E4BA` | Hover states for accent elements |
| destructive | `#C0392B` | Error states only |

### Extended Neutral Scale

| Step | Hex | Usage |
|------|-----|-------|
| neutral-950 | `#0A0A0A` | = bg-primary |
| neutral-900 | `#111111` | = bg-secondary |
| neutral-850 | `#1A1A1A` | = bg-tertiary |
| neutral-800 | `#222220` | Hover backgrounds on cards |
| neutral-700 | `#333330` | Active/pressed backgrounds |
| neutral-600 | `#4A4845` | = text-tertiary |
| neutral-500 | `#8A8580` | = text-secondary |
| neutral-400 | `#A8A39E` | Disabled text |
| neutral-300 | `#C5C0BA` | Light accents |
| neutral-200 | `#D8D4CE` | Light elements |
| neutral-100 | `#F0EDE8` | = text-primary |

### Category Colours (for data visualisation)

| Category | Hex | Usage |
|----------|-----|-------|
| AI Tools | `#E8D5A3` | Accent/gold - primary category |
| AI Agents | `#A8A39E` | Warm grey |
| AI Dev | `#C5C0BA` | Light warm |
| AI Strategy | `#D8D4CE` | Lightest warm |
| AI Infra | `#8A8580` | Medium grey |
| AI Ethics | `#4A4845` | Dark grey |

## Typography

### Font Stack
1. **Display**: `'Instrument Serif', Georgia, 'Times New Roman', serif` — Headlines, large numbers, hero text
2. **Body/UI**: `'DM Mono', 'SFMono-Regular', Menlo, Consolas, monospace` — Descriptions, labels, supporting text, data points, URLs

### Font Loading
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### Scale (for 1080x1080 canvas)
| Role | Font | Size | Weight | Colour |
|------|------|------|--------|--------|
| Hero headline | Instrument Serif | 80-100px | 400 | `#F0EDE8` |
| Subheadline | Instrument Serif | 48-64px | 400 | `#F0EDE8` |
| Large stat/number | Instrument Serif | 140-220px | 400 | `#F0EDE8` or `#E8D5A3` |
| Body text | DM Mono | 24-32px | 400 | `#8A8580` |
| Section label | DM Mono | 16-20px | 500 | `#E8D5A3` |
| Small label | DM Mono | 14-18px | 500 | `#4A4845` |
| Data/URL | DM Mono | 20-26px | 400 | `#8A8580` |

### Label Pattern
Section labels use: `font-family: 'DM Mono'; font-weight: 500; text-transform: uppercase; letter-spacing: 0.08em; font-size: 16-20px; color: #E8D5A3;`

## Background Treatments

Choose one per variation:

### 1. Dark (default)
```css
background: #0A0A0A;
```
Minimal, near-black. Add subtle warm gradient accents sparingly.

### 2. Card Surface
```css
background: #111111;
```
For elevated content areas. Use with `border: 1px solid #1A1A1A`.

### 3. Accent Solid
```css
background: #E8D5A3;
```
Content in `#0A0A0A`. Use sparingly for high-impact statements.

### 4. Gradient
```css
background: linear-gradient(180deg, #0A0A0A 0%, #111111 100%);
```
Subtle depth. Add a very faint warm glow for atmosphere.

## Atmospheric Elements

These are the signature Chris Garlick visual elements. Keep them **subtle and minimal** - the brand is restrained, not flashy.

### Subtle Warm Glow
Very faint accent glow, barely perceptible:
```css
position: absolute;
width: 500px;
height: 500px;
border-radius: 50%;
opacity: 0.04;
filter: blur(120px);
background: #E8D5A3;
pointer-events: none;
```

### Fine Grid Overlay (optional, use sparingly)
```css
position: absolute;
inset: 0;
background-image:
  linear-gradient(rgba(240,237,232,0.02) 1px, transparent 1px),
  linear-gradient(90deg, rgba(240,237,232,0.02) 1px, transparent 1px);
background-size: 40px 40px;
```

### Border Cards
```css
background: #111111;
border: 1px solid #1A1A1A;
border-radius: 4px;
```

## Composition Rules

- **Padding**: Minimum 80px from canvas edges to content. 100-120px is preferred.
- **Visual hierarchy**: One clear focal element (large number, headline). Supporting elements at smaller scale.
- **Whitespace**: Extremely generous. The brand is defined by restraint and negative space.
- **Alignment**: Left-aligned or centred. Never right-aligned as primary layout.
- **Grid**: Use CSS flexbox/grid for alignment. Items should feel intentionally placed.
- **Border radius**: Max 4px for rectangular elements. No rounded corners.

## Logo & Branding

Use the "CG" monogram text or "chrisgarlick.com" wordmark. No SVG logo needed - the brand identity is typographic.

### Branding Pattern
```html
<span style="font-family: 'DM Mono', monospace; font-weight: 500; font-size: 16px; letter-spacing: 0.08em; text-transform: uppercase; color: #4A4845;">
  chrisgarlick.com
</span>
```

## Do's

- Use the Chris Garlick font stack - always (Instrument Serif + DM Mono)
- Use the brand palette - always (dark neutrals + warm gold accent)
- Keep compositions clean, minimal, and restrained
- Use generous whitespace - the brand breathes
- Keep text large enough for mobile social feeds
- Create distinct variations - different layouts and compositions
- Let the typography do the work - the brand is typographic, not illustrative

## Don'ts

- Don't use colours outside the brand palette (no bright blues, greens, reds)
- Don't use fonts outside the two brand fonts (no Outfit, no JetBrains Mono)
- Don't use external images or stock photos
- Don't create cluttered, busy compositions
- Don't use thin text under 20px - it won't read on mobile
- Don't use JavaScript - HTML files must be static
- Don't add watermarks unless the prompt asks for them
- Don't use emoji in the designs
- Don't use heavy shadows or glows - the brand is flat and restrained
- Don't use border-radius larger than 4px
