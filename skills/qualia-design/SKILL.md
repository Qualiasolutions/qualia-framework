---
name: qualia-design
description: "One-shot design transformation — critiques, fixes, polishes, hardens, makes responsive. No reports, no choices, just makes it professional. Trigger on 'fix the design', 'make it look better', 'redesign', 'design pass', 'make it modern', 'it looks ugly', 'fix the UI'."
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - Agent
---

# /qualia-design — One-Shot Design Transformation

Read the code, understand what's wrong, fix everything, move on. No reports, no choices.

## Usage

- `/qualia-design` — Full transformation on all frontend files
- `/qualia-design app/page.tsx` — Specific file(s)
- `/qualia-design --scope=dashboard` — Transform a section

## Process

```bash
node ~/.claude/bin/qualia-ui.js banner design
```

### 1. Read Brand Context

```bash
cat .planning/DESIGN.md 2>/dev/null || echo "NO_DESIGN"
```

If DESIGN.md exists → it is law. Use exact values from sections 1-9 (Visual Theme, Color Palette, Typography, Components, Layout, Depth, Do's/Don'ts, Responsive, Agent Prompt Guide). If not → use Qualia defaults from `rules/frontend.md`: distinctive fonts, sharp accents, layered backgrounds, no card grids, no blue-purple gradients, full-width layouts.

### 2. Find Target Files

- If specific files given: use those
- If `--scope`: grep for matching files in `app/` and `components/`
- If none: find all `page.tsx`, `layout.tsx`, and component files

Read EVERY target file before modifying.

### 3. Critique (internal — don't output)

Evaluate each file on: AI slop detection, visual hierarchy, typography, color, states (loading/error/empty), motion, spacing, responsiveness, microcopy.

### 4. Fix Everything

Use exact values from DESIGN.md when available. Sections map to fixes:

**Typography (§3):** Apply fonts from hierarchy table. Replace any generic fonts (Inter, Arial) with project fonts. Use exact weights, sizes, letter-spacing from the table. Body line-height 1.5-1.7.

**Color (§2):** Apply palette from CSS variables. Replace scattered hex values with `var(--color-*)`. Verify contrast ratios listed in DESIGN.md.

**Components (§4):** Match button, card, input, badge specs exactly — padding, radius, shadow, hover states.

**Layout (§5):** Full-width with fluid padding `clamp(1rem, 5vw, 4rem)`. Apply spacing scale. NO hardcoded max-width caps. Prose gets `max-width: 65ch`.

**Depth (§6):** Apply shadow levels from elevation table. Use brand-tinted shadows, not neutral gray.

**Motion (§Motion):** CSS transitions 200-300ms on hover/focus. Staggered entrance animations. `prefers-reduced-motion` respected.

**States:** Loading skeleton/spinner on async ops. Error states on data fetches. Empty states on lists. Hover/focus/active/disabled on every interactive element.

**Responsive (§8):** Apply collapsing strategy from table. Mobile-first. Touch targets 44x44px min. No horizontal scroll.

**Anti-Slop (§12):** Run grep patterns from the detection table. Every match = mandatory fix.

**Kill:** Card grids → varied layouts. Generic heroes → distinctive. Blue-purple gradients → brand colors. Static pages → purposeful motion. Fixed widths → fluid.

### 5. Verify

```bash
npx tsc --noEmit 2>&1 | head -20
```

Fix any TypeScript errors before committing.

### 6. Commit

```bash
git add {modified files}
git commit -m "style: design transformation"
```

```
⬢ Design Transformation Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Files: {N}
  Changes:
  - {key change 1}
  - {key change 2}
  - {key change 3}

  Next: /qualia-polish (final pass) · /qualia-review (scored audit)
```

## Rules

- Read before write — understand every file before changing it
- Don't ask — just fix
- Respect DESIGN.md decisions
- Don't break functionality — only change styling, never logic
- TypeScript must pass after changes
