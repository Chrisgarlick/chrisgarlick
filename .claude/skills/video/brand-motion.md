# Chris Garlick Brand Motion — Video Asset Reference

This file defines the motion rules for all `/video` outputs. Every generated animation must feel like a natural extension of the Chris Garlick brand - smooth, confident, unhurried, restrained.

## Motion Philosophy

Chris Garlick motion is:
- **Smooth**: No jarring cuts or snappy transitions. Everything eases in and out gracefully.
- **Confident**: Elements move with purpose. No bouncing or wobbling unless intentional emphasis.
- **Unhurried**: Content holds long enough to read. The viewer should never feel rushed.
- **Restrained**: Minimal atmospheric elements. Let the typography and negative space do the work.

## Timing Tokens

| Token | Value | Use |
|-------|-------|-----|
| `--duration-instant` | 100ms | Micro-interactions (not common in video) |
| `--duration-fast` | 200ms | Quick secondary reveals |
| `--duration-normal` | 300ms | Standard element transitions |
| `--duration-slow` | 500ms | Emphasis transitions, important elements |
| `--duration-dramatic` | 1000ms | Hero element entrances |
| `--duration-content` | 1500ms | Full content block reveals |
| `--duration-hold-short` | 3s | Minimum readable hold for short text |
| `--duration-hold-long` | 6s | Hold for longer text or data |
| `--duration-scene` | 8-12s | Full scene (enter + hold + exit) |

## Easing Functions

| Name | CSS Value | Feel | Use |
|------|-----------|------|-----|
| **Smooth** | `cubic-bezier(0.4, 0, 0.2, 1)` | Natural, default | Most transitions |
| **Bounce** | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Playful overshoot | Stat numbers, emphasis moments |
| **Sharp-out** | `cubic-bezier(0, 0, 0.2, 1)` | Quick start, slow stop | Content entering view |
| **Gentle-in** | `cubic-bezier(0.4, 0, 1, 1)` | Slow start, fast end | Content exiting view |
| **Linear** | `linear` | Constant speed | Background colour shifts, progress bars |

### When to use each

- **Enter** animations: Use `--ease-out` (sharp-out) - elements arrive quickly and settle
- **Exit** animations: Use `--ease-gentle-in` - elements leave slowly then accelerate away
- **Hold** animations (pulse, float): Use `--ease-smooth` - gentle and symmetrical
- **Ambient** animations (drift, breathe): Use `ease-in-out` - smooth reversal at endpoints

## Stagger System

Content elements enter sequentially, not simultaneously. Use `animation-delay` with consistent intervals.

### Base stagger intervals

| Context | Interval | Example |
|---------|----------|---------|
| List items | 300ms | 5 items = 0s, 0.3s, 0.6s, 0.9s, 1.2s |
| Cards | 400ms | 3 cards = 0s, 0.4s, 0.8s |
| Text blocks | 500ms | Title > subtitle > body = 0s, 0.5s, 1.0s |
| Data points | 200ms | Fast cascade for numbers |
| Scenes | 8-12s | Each scene gets a full lifecycle |

### CSS Pattern

```css
.stagger-1 { animation-delay: calc(var(--base-delay) + 0.0s); }
.stagger-2 { animation-delay: calc(var(--base-delay) + 0.3s); }
.stagger-3 { animation-delay: calc(var(--base-delay) + 0.6s); }
.stagger-4 { animation-delay: calc(var(--base-delay) + 0.9s); }
.stagger-5 { animation-delay: calc(var(--base-delay) + 1.2s); }
```

Where `--base-delay` positions the group within the overall video timeline.

## Signature Animations

### 1. Pulse-Glow
Subtle warm gold glow that breathes - used on key numbers, active elements.

```css
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(232, 213, 163, 0); }
  50%      { box-shadow: 0 0 30px 10px rgba(232, 213, 163, 0.08); }
}
```
Duration: 3-4s | Easing: ease-in-out | Iteration: infinite

### 2. Heartbeat
Quick double-pulse to draw attention - used sparingly on CTAs or key moments.

```css
@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  14%      { transform: scale(1.05); }
  28%      { transform: scale(1); }
  42%      { transform: scale(1.08); }
  56%      { transform: scale(1); }
}
```
Duration: 2s | Easing: ease-in-out | Iteration: 2-3 times (not infinite)

### 3. Reveal-Up
Primary entrance animation - content slides up from below with fade.

```css
@keyframes reveal-up {
  0%   { opacity: 0; transform: translateY(40px); }
  100% { opacity: 1; transform: translateY(0); }
}
```
Duration: 800ms-1200ms | Easing: sharp-out | Iteration: 1

### 4. Reveal-Down (exit)
Content slides up and fades out - reverse of entrance direction for natural flow.

```css
@keyframes reveal-down-exit {
  0%   { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-30px); }
}
```
Duration: 600ms-1000ms | Easing: gentle-in | Iteration: 1

### 5. Scale-In
Element scales from small to full size with fade - good for stat numbers.

```css
@keyframes scale-in {
  0%   { opacity: 0; transform: scale(0.7); }
  100% { opacity: 1; transform: scale(1); }
}
```
Duration: 600ms-1000ms | Easing: bounce | Iteration: 1

### 6. Float
Gentle vertical drift for elements during their hold phase - adds life without distraction.

```css
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-8px); }
}
```
Duration: 4-6s | Easing: ease-in-out | Iteration: infinite

### 7. Shimmer
Subtle highlight sweep across text or cards - premium feel.

```css
@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
}
/* Apply to element with: */
/* background: linear-gradient(90deg, transparent 30%, rgba(240,237,232,0.04) 50%, transparent 70%); */
/* background-size: 200% 100%; */
```
Duration: 3s | Easing: linear | Iteration: infinite

## Atmospheric Animation Patterns

These run infinitely and independently of content animations. Keep them very subtle - the brand is restrained.

### Warm Glow Drift

```css
/* Glow 1 - warm gold, subtle */
@keyframes drift-warm {
  0%   { transform: translate(0, 0) scale(1); opacity: 0.03; }
  50%  { transform: translate(80px, 120px) scale(1.2); opacity: 0.05; }
  100% { transform: translate(0, 0) scale(1); opacity: 0.03; }
}
```
- Warm glow: 8s, ease-in-out, infinite
- Keep opacity extremely low (0.03-0.05) - barely perceptible

### Grid Breathe (optional, dark backgrounds only)

```css
@keyframes grid-breathe {
  0%, 100% { opacity: 0.3; }
  50%      { opacity: 0.5; }
}
```
Duration: 6s | Easing: ease-in-out | Iteration: infinite

### Background Gradient Shift

```css
@keyframes bg-shift {
  0%   { background-position: 0% 0%; }
  50%  { background-position: 100% 100%; }
  100% { background-position: 0% 0%; }
}
/* Apply to canvas with background-size: 200% 200% */
```
Duration: 12s | Easing: linear | Iteration: infinite

## Content Lifecycle Pattern

The master pattern for any content element in a looping video. This single animation handles enter, hold, and exit.

```css
/* For a 36s video: */
@keyframes content-lifecycle {
  0%   { opacity: 0; transform: translateY(30px); }     /* hidden - matches 100% */
  8%   { opacity: 1; transform: translateY(0); }         /* enter (~2.9s) */
  78%  { opacity: 1; transform: translateY(0); }         /* hold */
  92%  { opacity: 0; transform: translateY(-20px); }     /* exit (~33.1s) */
  100% { opacity: 0; transform: translateY(30px); }      /* return to start */
}

.element {
  animation: content-lifecycle var(--video-duration) var(--ease-smooth) infinite;
  animation-fill-mode: both;
}
```

### Adjusting for staggered elements

Each element gets a different slice of the timeline. Adjust the keyframe percentages:

- **Title** (enters first): 0%>8% enter, hold to 78%, exit 78%>92%, rest 92%>100%
- **Subtitle** (enters second): 5%>13% enter, hold to 75%, exit 75%>88%, rest 88%>100%
- **Body** (enters third): 10%>18% enter, hold to 72%, exit 72%>85%, rest 85%>100%

Each element needs its OWN `@keyframes` rule with adjusted percentages - they share the same `animation-duration` (the full video length) but have shifted enter/exit windows.

## Colour Palette (Quick Reference)

Same as `/draw` - see `brand-style.md` in the draw skill for the full palette. Key values:

- **Background**: `#0A0A0A` (near-black)
- **Card surface**: `#111111`
- **Border**: `#1A1A1A`
- **Accent**: `#E8D5A3` (warm gold)
- **Text primary**: `#F0EDE8` (warm off-white)
- **Text secondary**: `#8A8580` (muted warm)
- **Text tertiary**: `#4A4845` (faint)
- **Wordmark**: `#4A4845` on any background

## Logo & Branding

Use the "CG" monogram text or "chrisgarlick.com" wordmark in the brand-reserve area. The brand identity is typographic - no SVG logo.

### Brand Reserve Pattern
```html
<span class="wordmark" style="color: #4A4845;">chrisgarlick.com</span>
```

Style: DM Mono, 500 weight, 18px, uppercase, letter-spacing 0.08em.

## Do's

- Use smooth, confident easing - no linear content transitions
- Hold text long enough to read (minimum 3s for short, 6s for long)
- Keep atmospheric elements extremely subtle
- Ensure 0% and 100% keyframes are identical for all looping animations
- Test that the loop point feels natural
- Use stagger delays for sequential content
- Keep motion subtle during hold phases (gentle float, pulse-glow)
- Let negative space and typography be the primary design elements

## Don'ts

- Don't use JavaScript for animation - CSS only
- Don't use `animation-direction: alternate` on content lifecycle (it reverses the order)
- Don't make elements move so fast they're hard to track
- Don't have more than 3 elements animating entrance simultaneously
- Don't use rotation > 5deg for content elements
- Don't use colours outside the brand palette
- Don't skip the hold phase - content needs reading time
- Don't use heavy atmospheric effects - the brand is restrained
- Don't use fonts other than Instrument Serif and DM Mono
- Don't use border-radius larger than 4px
