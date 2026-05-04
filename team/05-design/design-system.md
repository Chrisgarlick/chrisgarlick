<!-- Version: 1 | Department: design | Updated: 2026-05-02 -->

# Design System — chrisgarlick.com

## Colour Palette

### Core Tokens

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `bg-primary` | `#0A0A0A` | 10, 10, 10 | Page background |
| `bg-secondary` | `#111111` | 17, 17, 17 | Card surfaces, elevated containers |
| `bg-tertiary` | `#1A1A1A` | 26, 26, 26 | Borders, dividers, subtle backgrounds |
| `text-primary` | `#F0EDE8` | 240, 237, 232 | Headlines, body text |
| `text-secondary` | `#8A8580` | 138, 133, 128 | Supporting text, dates, metadata |
| `text-tertiary` | `#4A4845` | 74, 72, 69 | Labels, captions, ghost/placeholder text |
| `accent` | `#E8D5A3` | 232, 213, 163 | Links, CTAs, result numbers, CG monogram |
| `accent-hover` | `#F0E4BA` | 240, 228, 186 | Hover states for accent elements |
| `destructive` | `#C0392B` | 192, 57, 43 | Error states only |

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
| neutral-300 | `#C5C0BA` | — |
| neutral-200 | `#D8D4CE` | — |
| neutral-100 | `#F0EDE8` | = text-primary |

### Semantic Colours

| Token | Value | Usage |
|-------|-------|-------|
| `success` | `#E8D5A3` | Reuses accent — success states use gold |
| `error` | `#C0392B` | Form validation errors |
| `error-bg` | `#1A1111` | Error state background tint |
| `focus-ring` | `#E8D5A3` | Keyboard focus indicator (2px solid) |
| `border-default` | `#1A1A1A` | Standard borders and dividers |
| `border-hover` | `#333330` | Border on hover |
| `overlay` | `rgba(10,10,10,0.80)` | Modal/drawer overlays |

### Contrast Ratios (WCAG 2.1)

| Pairing | Ratio | Rating |
|---------|-------|--------|
| text-primary on bg-primary | 17.4:1 | AAA |
| text-primary on bg-secondary | 14.8:1 | AAA |
| text-secondary on bg-primary | 5.5:1 | AA |
| text-secondary on bg-secondary | 4.7:1 | AA |
| text-tertiary on bg-primary | 2.6:1 | Fail — decorative only |
| accent on bg-primary | 11.2:1 | AAA |
| accent on bg-secondary | 9.5:1 | AAA |

### Colour Pairing Rules

- **Body text**: Always text-primary on bg-primary or bg-secondary
- **Supporting text**: text-secondary on bg-primary or bg-secondary. Never on bg-tertiary
- **Decorative text**: text-tertiary only for large numerals (24px+), never readable content
- **Accent**: On any dark background. Always interactive or high-value
- **Error**: destructive only at 18px+ or bold, or paired with icon

---

## Typography

### Font Loading

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### Font Stack

| Token | Font | Fallback |
|-------|------|----------|
| `--font-display` | Instrument Serif | Georgia, Times New Roman, serif |
| `--font-body` | DM Mono | SFMono-Regular, Menlo, Consolas, monospace |

### Type Scale

| Token | Font | Size | Weight | Line Height | Letter Spacing |
|-------|------|------|--------|-------------|----------------|
| display | Instrument Serif | 64px | 400 | 1.1 | -0.02em |
| h1 | Instrument Serif | 48px | 400 | 1.15 | -0.01em |
| h2 | Instrument Serif | 36px | 400 | 1.2 | -0.01em |
| h3 | Instrument Serif | 28px | 400 | 1.25 | 0 |
| h4 | DM Mono | 18px | 500 | 1.4 | 0.05em |
| body-lg | DM Mono | 18px | 400 | 1.8 | 0 |
| body | DM Mono | 16px | 400 | 1.75 | 0 |
| body-sm | DM Mono | 14px | 400 | 1.7 | 0 |
| caption | DM Mono | 14px | 400 | 1.5 | 0.03em |
| label | DM Mono | 12px | 500 | 1.4 | 0.08em |
| code | DM Mono | 15px | 400 | 1.6 | 0 |

### Responsive Type Scale

| Token | Mobile (<768px) | Desktop (1024px+) |
|-------|-----------------|-------------------|
| display | 40px | 64px |
| h1 | 36px | 48px |
| h2 | 28px | 36px |
| h3 | 24px | 28px |

---

## Spacing System

Base unit: 4px.

| Token | Value |
|-------|-------|
| space-1 | 4px |
| space-2 | 8px |
| space-3 | 12px |
| space-4 | 16px |
| space-5 | 20px |
| space-6 | 24px |
| space-8 | 32px |
| space-10 | 40px |
| space-12 | 48px |
| space-16 | 64px |
| space-20 | 80px |
| space-24 | 96px |
| space-32 | 128px |

---

## Borders & Radius

| Token | Value |
|-------|-------|
| radius-none | 0px |
| radius-sm | 2px |
| radius-default | 4px |
| radius-full | 9999px |

Max 4px for rectangular elements. Only pill buttons use radius-full.

| Border | Value |
|--------|-------|
| border-default | 1px solid #1A1A1A |
| border-hover | 1px solid #333330 |
| border-accent | 1px solid #E8D5A3 |
| border-error | 1px solid #C0392B |
| divider | 1px solid #1A1A1A |

---

## Shadows

| Token | Value |
|-------|-------|
| shadow-none | none |
| shadow-sm | 0 1px 2px rgba(0,0,0,0.3) |
| shadow-card | 0 2px 8px rgba(0,0,0,0.2) |
| shadow-nav | 0 1px 0 rgba(26,26,26,1) |

Never exceed 0 2px 8px. No coloured shadows. No glow.

---

## Components

### Button — Primary (Pill)
- Background: accent (#E8D5A3), Text: bg-primary (#0A0A0A)
- Font: DM Mono, 14px, weight 500, uppercase, letter-spacing 0.05em
- Padding: 12px 24px, border-radius: 9999px
- Hover: accent-hover, translateY(-1px)
- Focus: 2px solid accent, offset 2px

### Button — Secondary (Outlined)
- Background: transparent, Border: 1px solid #1A1A1A
- Text: text-primary, Padding: 12px 24px, radius: 4px
- Hover: border #333330, bg bg-secondary

### Button — Ghost (Arrow Link)
- Text: accent, Prefix: → character
- Hover: accent-hover, arrow translateX(2px), underline
- No background, no border

### Input
- Background: bg-secondary, Border: 1px solid #1A1A1A, radius: 4px
- Text: text-primary, Font: DM Mono, 16px (prevents iOS zoom)
- Padding: 12px 16px, Placeholder: text-tertiary
- Focus: border accent, Error: border destructive
- Label: DM Mono, 12px, weight 500, uppercase, letter-spacing 0.08em, text-secondary

### Radio Group
- Row of bordered boxes, flex-wrap, gap 8px
- Default: bg-secondary, border #1A1A1A, text-secondary
- Selected: border accent, text-primary, bg bg-tertiary

### Card
- bg-secondary, border 1px solid #1A1A1A, radius 4px
- Padding: 24px (mobile), 32px (desktop)
- Hover: translateY(-2px), shadow-card, border #333330

### Navigation
- Fixed top, height 64px, z-50
- Background: rgba(10,10,10,0.85), backdrop-filter: blur(12px)
- Left: CG monogram (accent, 20px), Right: links + Apply pill
- Mobile: hamburger → off-canvas drawer from right

### Badge/Tag
- bg-tertiary, text-secondary, DM Mono 12px uppercase
- Padding: 4px 10px, radius-sm (2px)
- Active: accent bg, bg-primary text

### Marquee Strip
- Full-bleed, bg-secondary, border top/bottom
- DM Mono caption, text-secondary, separated by ·
- CSS translateX animation, 30s linear infinite
- Pause on hover, respects prefers-reduced-motion

---

## Layout

| Token | Value | Usage |
|-------|-------|-------|
| width-reading | 720px | Blog posts, about, form |
| width-full | 1100px | Nav, hero, grids |
| width-bleed | 100vw | Marquee, full dividers |

### Breakpoints

| Token | Value |
|-------|-------|
| sm | 640px |
| md | 768px |
| lg | 1024px |
| xl | 1200px |

---

## Accessibility

- Focus: 2px solid accent, offset 2px, :focus-visible only
- Skip-to-content link at top
- Marquee: aria-hidden with sr-only fallback
- Arrow chars: aria-hidden
- Min touch targets: 44x44px
- prefers-reduced-motion: all animations disabled

---

## Animation Tokens

| Token | Value |
|-------|-------|
| duration-fast | 150ms |
| duration-default | 200ms |
| duration-slow | 300ms |
| ease-default | cubic-bezier(0.25, 0.1, 0.25, 1) |
| fade-up-distance | 16px |
| fade-up-stagger | 60ms |
| hover-lift | translateY(-2px) |
| arrow-nudge | translateX(2px) |

---

## Tailwind CSS 4 Theme Overrides

```css
@theme {
  --color-bg-primary: #0A0A0A;
  --color-bg-secondary: #111111;
  --color-bg-tertiary: #1A1A1A;
  --color-text-primary: #F0EDE8;
  --color-text-secondary: #8A8580;
  --color-text-tertiary: #4A4845;
  --color-accent: #E8D5A3;
  --color-accent-hover: #F0E4BA;
  --color-destructive: #C0392B;
  --color-border-default: #1A1A1A;
  --color-border-hover: #333330;
  --color-neutral-800: #222220;
  --color-error-bg: #1A1111;

  --font-display: 'Instrument Serif', 'Georgia', 'Times New Roman', serif;
  --font-body: 'DM Mono', 'SFMono-Regular', 'Menlo', 'Consolas', monospace;

  --radius-none: 0px;
  --radius-sm: 2px;
  --radius-default: 4px;
  --radius-full: 9999px;

  --shadow-sm: 0 1px 2px rgba(0,0,0,0.3);
  --shadow-card: 0 2px 8px rgba(0,0,0,0.2);
  --shadow-nav: 0 1px 0 rgba(26,26,26,1);

  --container-reading: 720px;
  --container-full: 1100px;
  --breakpoint-xl: 1200px;

  --duration-fast: 150ms;
  --duration-default: 200ms;
  --duration-slow: 300ms;
  --ease-default: cubic-bezier(0.25, 0.1, 0.25, 1);
}

@layer base {
  html {
    background-color: var(--color-bg-primary);
    color: var(--color-text-primary);
    font-family: var(--font-body);
    font-size: 16px;
    line-height: 1.75;
    -webkit-font-smoothing: antialiased;
  }
  ::selection {
    background-color: var(--color-accent);
    color: var(--color-bg-primary);
  }
  h1, h2, h3 { font-family: var(--font-display); font-weight: 400; }
  h4 { font-family: var(--font-body); font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; }
  a { color: var(--color-accent); text-decoration: none; }
  :focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
}
```
