# Design System — {Project Name}

> Source of truth for all frontend work. Builder agents read this before writing any component.
> `/qualia-new` fills this during project setup. Update as design evolves.
> Format inspired by [awesome-design-md](https://github.com/VoltAgent/awesome-design-md).

## 1. Visual Theme & Atmosphere

<!-- 2-3 paragraphs describing the FEEL of the site. Not what it does — what it FEELS like.
     What mood does it create? What's the design philosophy? What makes it distinctive?
     Example: "The site opens on a deep charcoal canvas with copper accents that feel
     like a luxury watch brand crossed with a fintech terminal. The custom variable font
     runs at weight 300 for headlines — light as confidence, not weakness." -->

{Write the visual narrative here. Be specific about mood, density, and what makes this site NOT look AI-generated.}

**Key Characteristics:**
- {Font choice and why — e.g., "Outfit at weight 300 for headlines — geometric, modern, not overused"}
- {Color signature — e.g., "Deep charcoal (#1a1a2e) backgrounds with copper (#c9784e) accents"}
- {Shadow approach — e.g., "Warm-tinted multi-layer shadows, not flat or neutral gray"}
- {Border-radius philosophy — e.g., "Conservative 4-8px, nothing pill-shaped"}
- {Layout approach — e.g., "Full-bleed sections, asymmetric grids, no card monotony"}
- {One signature detail — e.g., "Noise texture overlay at 2% on hero, grain filter on images"}

## 2. Color Palette & Roles

<!-- Every color must have a name, hex value, AND its role. No unnamed colors in code. -->

### Primary
- **{Brand Color Name}** (`#{hex}`): Primary brand identity. Used for {where}.
- **{Heading Color}** (`#{hex}`): All headings. Not pure black — {warm/cool undertone}.
- **{Background}** (`#{hex}`): Page background.

### Accent & CTA
- **{Accent Name}** (`#{hex}`): CTAs, interactive highlights, links.
- **{Accent Hover}** (`#{hex}`): Hover state for accent elements.
- **{Secondary Accent}** (`#{hex}`): {role — badges, decorative, gradients}.

### Neutral Scale
- **{Text Primary}** (`#{hex}`): Body text, paragraphs.
- **{Text Muted}** (`#{hex}`): Secondary text, descriptions, captions.
- **{Text Subtle}** (`#{hex}`): Placeholders, hints, disabled text.
- **{Border Default}** (`#{hex}`): Card borders, dividers.
- **{Border Subtle}** (`#{hex}`): Faint separators, inactive states.

### Semantic
- **Success** (`#{hex}`): With icon. Background: `{rgba}`. Border: `{rgba}`.
- **Warning** (`#{hex}`): With icon. Background: `{rgba}`. Border: `{rgba}`.
- **Error** (`#{hex}`): With icon. Background: `{rgba}`. Border: `{rgba}`.
- **Info** (`#{hex}`): With icon. Background: `{rgba}`. Border: `{rgba}`.

### Shadow Colors
- **Primary Shadow** (`{rgba}`): {e.g., "Brand-tinted — warm brown-gray, not neutral"}.
- **Secondary Shadow** (`{rgba}`): Reinforcement layer for depth.
- **Ambient Shadow** (`{rgba}`): Soft lift for subtle elevation.

### CSS Variables

```css
:root {
  /* Brand */
  --color-primary: #{hex};
  --color-primary-hover: #{hex};
  --color-primary-subtle: #{hex};

  /* Accent */
  --color-accent: #{hex};
  --color-accent-hover: #{hex};

  /* Backgrounds */
  --color-bg: #{hex};
  --color-bg-subtle: #{hex};
  --color-bg-muted: #{hex};

  /* Text */
  --color-text: #{hex};
  --color-text-muted: #{hex};
  --color-text-subtle: #{hex};

  /* Borders */
  --color-border: #{hex};
  --color-border-subtle: #{hex};

  /* Semantic */
  --color-success: #{hex};
  --color-warning: #{hex};
  --color-error: #{hex};
  --color-info: #{hex};

  /* Shadows */
  --shadow-primary: {rgba};
  --shadow-secondary: {rgba};
  --shadow-ambient: {rgba};
}

/* Dark mode — rethink surfaces, don't just invert */
[data-theme="dark"] {
  --color-bg: #{hex};
  --color-bg-subtle: #{hex};
  --color-text: #{hex};
  --color-text-muted: #{hex};
  --color-border: #{hex};
  /* ... override all tokens ... */
}
```

**Contrast verification:**
- Body text on background: {ratio} (must be >= 4.5:1)
- Muted text on background: {ratio} (must be >= 4.5:1)
- Accent on background: {ratio} (must be >= 3:1 for large text)

## 3. Typography Rules

### Font Families
- **Display/Heading**: `'{Font Name}'`, {fallback stack}
- **Body**: `'{Font Name}'`, {fallback stack}
- **Mono**: `'{Font Name}'`, monospace

**Google Fonts import:** `{URL}`

**Never use:** Inter, Roboto, Arial, Helvetica, system-ui, Space Grotesk.

### Hierarchy Table

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|----------------|-------|
| Display Hero | {display} | {clamp(2.5rem, 1rem + 4vw, 4rem)} | {weight} | 1.05 | {-0.02em} | Largest text on site |
| Display | {display} | {clamp(2rem, 1rem + 3vw, 3rem)} | {weight} | 1.1 | {-0.015em} | Section heroes |
| H1 | {heading} | {clamp(1.75rem, 1rem + 2.5vw, 2.5rem)} | {weight} | 1.15 | {-0.01em} | Page titles |
| H2 | {heading} | {clamp(1.5rem, 0.75rem + 2vw, 2rem)} | {weight} | 1.2 | normal | Section titles |
| H3 | {heading} | {clamp(1.25rem, 0.75rem + 1.5vw, 1.5rem)} | {weight} | 1.25 | normal | Subsection titles |
| Body Large | {body} | {1.125rem} | 400 | 1.6 | normal | Intro text, feature descriptions |
| Body | {body} | {1rem} | 400 | 1.6 | normal | Standard reading text |
| Body Small | {body} | {0.875rem} | 400 | 1.5 | normal | Secondary text |
| Caption | {body} | {0.75rem} | 500 | 1.4 | {0.02em} | Labels, metadata |
| Button | {body} | {0.875rem–1rem} | 500 | 1.0 | {0.01em} | Button text |
| Code | {mono} | {0.875rem} | 500 | 1.7 | normal | Code blocks |

### Principles
- {e.g., "Weight 300 at display sizes — light as authority, not shouting"}
- {e.g., "Progressive tracking: tighter letter-spacing at larger sizes"}
- {e.g., "Two-weight simplicity: 300 for display, 400 for body/UI, 600 for emphasis only"}
- Body text max-width: `65ch`. Everything else: fluid full-width.
- Min body font size: 16px. Never smaller for reading text.

## 4. Component Specifications

### Buttons

**Primary**
- Background: `var(--color-accent)`
- Text: `#ffffff`
- Padding: {8px 20px}
- Radius: {6px}
- Font: {size} {font} weight {weight}
- Hover: `var(--color-accent-hover)`, transition 150ms ease-out
- Active: `transform: scale(0.98)`
- Focus: `2px solid var(--color-accent)` offset 2px
- Disabled: opacity 0.5, `cursor: not-allowed`, `aria-disabled="true"`

**Secondary / Outlined**
- Background: transparent
- Text: `var(--color-accent)`
- Border: `1px solid var(--color-border)`
- Hover: `var(--color-bg-subtle)` background

**Ghost**
- Background: transparent
- Text: `var(--color-text)`
- Hover: `var(--color-bg-subtle)` background

**Destructive**
- Background: `var(--color-error)`
- Text: `#ffffff`
- Use: Only for irreversible actions with confirmation

**Sizes:** sm (32px height), md (40px), lg (48px)

### Cards & Surfaces

- Background: `var(--color-bg-subtle)`
- Border: `1px solid var(--color-border-subtle)`
- Radius: {8px}
- Shadow (resting): `var(--shadow-ambient) 0px 4px 12px`
- Shadow (hover): `var(--shadow-primary) 0px 8px 24px, var(--shadow-secondary) 0px 4px 12px`
- Transition: shadow 200ms ease-out
- **No identical card grids** — vary layout, size, and emphasis

### Inputs & Forms

- Height: 40px (md), 48px (lg)
- Border: `1px solid var(--color-border)`
- Radius: {6px}
- Focus: `2px solid var(--color-accent)` ring
- Error: `var(--color-error)` border + error text below with `aria-describedby`
- Label: visible `<label>` with `htmlFor` — never placeholder-only
- Placeholder: `var(--color-text-subtle)`

### Badges / Status

- Padding: 2px 8px
- Radius: {4px}
- Font: caption size, weight 500
- Success: `var(--color-success)` bg at 0.15 alpha, text at full, border at 0.3 alpha
- Warning: same pattern with `var(--color-warning)`
- Error: same pattern with `var(--color-error)`

### Navigation

- {Sticky header with backdrop-filter blur(12px) / Fixed sidebar / etc.}
- Logo: {left-aligned / centered}
- Links: {font, size, weight, color}
- Active indicator: {underline / background / border-bottom}
- Mobile: hamburger with drawer, 44px touch target
- CTA button: accent color, right-aligned

### Toasts / Notifications

- Position: {top-right / bottom-center}
- `aria-live="polite"` for info, `"assertive"` for errors
- Auto-dismiss: 5s minimum, dismissible via close button
- Semantic coloring matching badge pattern

## 5. Layout & Spacing

### Spacing Scale (8px grid)

`4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128`

| Context | Value |
|---------|-------|
| Within components | 8–16px |
| Between related elements | 16–24px |
| Between sections | `clamp(3rem, 8vw, 6rem)` |
| Page horizontal padding | `clamp(1rem, 5vw, 4rem)` |
| Component gap | `clamp(1rem, 3vw, 2rem)` |

### Grid & Layout Strategy

- **Full-width layouts** — no hardcoded `max-width: 1200px` caps
- Prose/reading content: `max-width: 65ch`
- Feature sections: varied layouts (side-by-side, staggered, asymmetric, full-bleed)
- {Specific grid: e.g., "12-column CSS grid with fluid gutters"}
- Break symmetry where it serves design — offset, overlap, diagonal flow

### Whitespace Philosophy

{e.g., "Dense data, generous chrome. Financial tables are tightly packed, but the UI frame
around them breathes. Sections alternate between dense content and generous breathing room."}

### Border Radius Scale

| Level | Value | Use |
|-------|-------|-----|
| Micro | 2px | Subtle rounding, inline elements |
| Standard | {4-6px} | Buttons, inputs, badges — the workhorse |
| Comfortable | {8px} | Cards, containers |
| Large | {12px} | Featured cards, hero elements |
| Full | 9999px | Avatars, pills (use sparingly) |

## 6. Depth & Elevation

| Level | Shadow | Use |
|-------|--------|-----|
| Flat (0) | none | Page background, inline content |
| Subtle (1) | `var(--shadow-ambient) 0px 1px 3px` | Resting cards, slight lift |
| Standard (2) | `var(--shadow-primary) 0px 4px 12px` | Cards, panels |
| Elevated (3) | `var(--shadow-primary) 0px 8px 24px, var(--shadow-secondary) 0px 4px 12px` | Dropdowns, popovers, hover cards |
| Overlay (4) | `var(--shadow-primary) 0px 16px 48px, var(--shadow-secondary) 0px 8px 24px` | Modals, dialogs, floating panels |
| Focus ring | `0 0 0 2px var(--color-accent)` | Keyboard focus (non-negotiable) |

**Shadow philosophy:** {e.g., "Brand-tinted shadows — use warm rgba tones that echo the palette,
not neutral gray. Multi-layer: branded far shadow + neutral close shadow for depth parallax."}

## 7. Do's and Don'ts

### Do
- {e.g., "Use weight 300 for display headlines — lightness is the signature"}
- {e.g., "Apply brand-tinted shadows on all elevated elements"}
- {e.g., "Use the accent color ONLY for interactive/CTA elements — never decorative"}
- {e.g., "Keep border-radius within the defined scale — consistency over creativity"}
- {e.g., "Layer surfaces: bg → subtle → muted, each one shade step apart"}
- Use `cursor: pointer` on every clickable element
- Use CSS variables for every color — zero scattered hex values in components
- Use `clamp()` for fluid typography and spacing
- Test at 320px, 768px, 1024px, 1440px before shipping

### Don't
- {e.g., "Don't use bold (700) for headlines — this brand uses light weights"}
- {e.g., "Don't use pill-shaped buttons (border-radius: 9999px) — conservative rounding only"}
- {e.g., "Don't use warm accents (orange, yellow) for interactive elements"}
- Don't use Inter, Roboto, Arial, Helvetica, system-ui, Space Grotesk
- Don't use blue-purple gradients (AI slop tell #1)
- Don't use identical card grids — vary layout and emphasis
- Don't use `outline: none` without a visible focus replacement
- Don't use `max-width: 1200px` or `1280px` containers — go full-width fluid
- Don't use placeholder-only form inputs — always pair with visible `<label>`
- Don't ship gray-on-gray text (#999 on #fff fails WCAG)

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | < 640px | Single column, stacked nav, reduced heading sizes |
| Tablet | 640–1023px | 2-column grids, condensed nav |
| Desktop | 1024–1279px | Full layout, expanded nav |
| Large | >= 1280px | Maximum content width, generous margins |

### Collapsing Strategy

| Element | Desktop | Tablet | Mobile |
|---------|---------|--------|--------|
| Navigation | Full horizontal + CTA | Condensed or hamburger | Hamburger + drawer |
| Hero | {Side-by-side / full-width} | {Stacked, padded} | {Stacked, full-width} |
| Feature sections | {3-column / asymmetric} | {2-column} | {Single column stacked} |
| Sidebar | Always visible | Collapsible | Hidden, overlay |
| Tables | Full table | Scroll with sticky col | Card view |
| Modals | Centered, max-width | Centered, 80% width | Full screen |

### Touch Targets
- All interactive elements: 44x44px minimum (48px recommended)
- Adequate spacing between tap targets (8px minimum gap)
- Mobile nav toggle: prominent, easy to reach

### Image Behavior
- `next/image` with explicit `width`/`height` (prevent layout shift)
- Responsive `srcset` for different densities
- `max-width: 100%`, `height: auto` on all images
- Lazy-load below-fold images

## 9. Agent Prompt Guide

### Quick Color Reference
- Primary CTA: {Name} (`#{hex}`)
- CTA Hover: {Name} (`#{hex}`)
- Page background: {Name} (`#{hex}`)
- Heading text: {Name} (`#{hex}`)
- Body text: {Name} (`#{hex}`)
- Muted text: {Name} (`#{hex}`)
- Border: {Name} (`#{hex}`)
- Link: {Name} (`#{hex}`)
- Dark section: {Name} (`#{hex}`)
- Success: (`#{hex}`)
- Error: (`#{hex}`)

### Example Component Prompts

**Hero section:**
"{Describe: background color, headline font/size/weight/color/spacing, subtitle treatment, CTA button specs, layout}"

**Card:**
"{Describe: background, border, radius, shadow (exact rgba), title font treatment, body text treatment}"

**Form:**
"{Describe: input border/radius/height, focus ring, label treatment, error state, submit button}"

### Iteration Checklist
1. Always use CSS variables — never hardcode colors in components
2. {Font rule — e.g., "Enable ss01 on all display font text"}
3. {Weight rule — e.g., "Default to 300; use 400 only for UI/buttons"}
4. {Shadow rule — e.g., "Always use branded rgba, never neutral gray shadows"}
5. {Heading rule — e.g., "Heading color is deep navy, not black — warmth matters"}
6. {Radius rule — e.g., "Stay within 4-8px range except avatars"}

## 10. Accessibility (Non-Negotiable)

### Perceivable
- [ ] All images: descriptive `alt` text (decorative: `alt=""` + `aria-hidden="true"`)
- [ ] Color contrast: 4.5:1 normal text, 3:1 large text (18px+ bold / 24px+)
- [ ] Color contrast: 3:1 for UI components and graphical objects
- [ ] Information not conveyed by color alone — icons, text, patterns as supplements
- [ ] Text resizable to 200% without loss of content
- [ ] Content reflows at 320px (no horizontal scroll)

### Operable
- [ ] All functionality available via keyboard (Tab, Enter, Space, Escape, Arrows)
- [ ] No keyboard traps (except focus traps in modals)
- [ ] Visible focus indicator on every interactive element
- [ ] Skip navigation link: `<a href="#main" class="sr-only focus:not-sr-only">`
- [ ] Touch targets: 44x44px minimum
- [ ] Page titles are descriptive and unique

### Understandable
- [ ] Form inputs have visible `<label>` linked via `htmlFor`
- [ ] Error messages identify the field and describe the fix
- [ ] Required fields: `aria-required="true"` + visual indicator
- [ ] `<html lang="en">` set
- [ ] Consistent navigation across pages

### Robust
- [ ] Semantic HTML: `<nav>`, `<main>`, `<article>`, `<section>`, `<header>`, `<footer>`
- [ ] One `<h1>` per page, sequential heading order
- [ ] ARIA used correctly when HTML semantics aren't enough
- [ ] Dynamic content: `aria-live="polite"` for updates, `"assertive"` for errors
- [ ] Modals: focus trap, close on Escape, `aria-modal="true"`, restore focus on close

## 11. Hardening Criteria

Before shipping, stress-test:

- [ ] **Long text:** 200-character username, 3-paragraph description — does layout hold?
- [ ] **Empty everywhere:** all lists empty, all data missing — helpful empty states?
- [ ] **Error everywhere:** every fetch fails — error states visible and recoverable?
- [ ] **320px viewport:** nothing overflows, clips, or overlaps
- [ ] **Keyboard only:** Tab through entire app — everything reachable, focus visible?
- [ ] **Slow network:** loading states visible? Content streams, doesn't flash?
- [ ] **RTL text:** if applicable, does layout mirror correctly?
- [ ] **Zoom 200%:** content still usable, nothing hidden?

## 12. Anti-Slop Detection

<!-- These patterns are checked by /qualia-polish grep scans. Any matches = mandatory fix. -->

| Pattern | Check | Fix |
|---------|-------|-----|
| Generic fonts | `grep -rn "Inter\|Roboto\|Arial\|Helvetica\|system-ui\|Space.Grotesk"` | Replace with project fonts |
| Hardcoded containers | `grep -rn "max-w-7xl\|max-w-\[1200\|max-width.*1200"` | Use fluid `clamp()` padding |
| Blue-purple gradients | `grep -rn "from-blue.*to-purple\|from-purple.*to-blue"` | Use brand colors |
| Card grid monotony | `grep -rn "grid-cols-3\|grid-cols-4"` in component files | Vary layout and emphasis |
| Scattered hex colors | `grep -rn "text-\[#\|bg-\[#\|border-\[#"` count > 5 | Use CSS variables |
| Missing focus styles | `grep -rn "outline: none\|outline:none"` | Add visible focus replacement |
| Placeholder-only inputs | `<input>` without adjacent `<label>` | Add visible label |

## Motion Reference

### Duration Table

| Action | Duration | Easing |
|--------|----------|--------|
| Micro-feedback (press, toggle) | 100ms | ease-out |
| Hover/focus | 150ms | ease-out |
| Tooltip, dropdown | 200ms | ease-out |
| Expand/collapse | 250ms | ease-in-out |
| Page element enter | 300ms | `cubic-bezier(0, 0, 0.2, 1)` |
| Page/route transition | 400ms | `cubic-bezier(0.4, 0, 0.2, 1)` |
| Complex orchestration | 500–800ms | staggered |

### Easing Curves

```css
--ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
--ease-decelerate: cubic-bezier(0, 0, 0.2, 1);
--ease-accelerate: cubic-bezier(0.4, 0, 1, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
```

### Stagger Pattern

```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
.stagger > * { animation: fadeUp 300ms var(--ease-decelerate) both; }
.stagger > *:nth-child(1) { animation-delay: 0ms; }
.stagger > *:nth-child(2) { animation-delay: 60ms; }
.stagger > *:nth-child(3) { animation-delay: 120ms; }
.stagger > *:nth-child(4) { animation-delay: 180ms; }
.stagger > *:nth-child(5) { animation-delay: 240ms; }
```

### Reduced Motion (mandatory)

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```
