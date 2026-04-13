---
name: qualia-discuss
description: "Capture phase decisions, trade-offs, and constraints BEFORE planning. Use for complex phases with regulatory, compliance, or architectural stakes. Creates .planning/phase-{N}-context.md that planner honors as locked input."
---

# /qualia-discuss — Phase Context Capture

Before a complex phase gets planned, surface the decisions and trade-offs that must inform planning. Output: `.planning/phase-{N}-context.md` that the planner reads as locked input.

## When to Use

- Regulated domains (legal, medical, financial) where wrong choices have legal cost
- Phases with architectural forks (e.g., "auth via middleware or RLS?")
- Phases with external dependencies you want to lock first
- Anytime the user says "wait, let's think about this one"

## Process

### 1. Determine Phase

```bash
node ~/.claude/bin/state.js check 2>/dev/null
```

If a phase number was passed as argument, use it. Otherwise use the current phase from STATE.md.

### 2. Load Context

```bash
cat .planning/PROJECT.md 2>/dev/null
cat .planning/ROADMAP.md 2>/dev/null
cat .planning/research/SUMMARY.md 2>/dev/null
```

Identify:
- Phase goal from ROADMAP.md
- Requirements covered by this phase
- Research flags for this phase (from SUMMARY.md)

### 3. Open the Conversation

Print the banner:
```bash
node ~/.claude/bin/qualia-ui.js banner discuss {N} "{phase name from ROADMAP.md}"
```

Ask inline (free text, not AskUserQuestion):

**"We're about to plan {phase name}. The goal is: {goal from ROADMAP.md}. Before I hand this to the planner, what decisions, trade-offs, or constraints should be locked in?"**

Wait for their response.

### 4. Follow the Thread

Based on their answer, dig into specifics:

- If they mention a technology → "Why that one specifically?"
- If they mention a constraint → "What happens if we don't honor this?"
- If they mention a trade-off → "Which side do you want to land on, and why?"
- If they mention a concern → "What's the worst case?"

Use `AskUserQuestion` when there are clear interpretation forks. Free text otherwise.

### 5. Capture Locked Decisions

Build up a list of **locked decisions** — things the planner MUST honor. Each decision has:
- The choice (what)
- The rationale (why)
- The source (who/when)

Also capture:
- **Discretion items** — things the planner can decide freely
- **Deferred ideas** — good ideas that are NOT in this phase
- **Risk flags** — things to watch during building
- **Open questions** — things that still need resolution

### 6. Decision Gate

When you have enough context:

- header: "Ready to lock?"
- question: "Ready to lock these decisions and move to /qualia-plan {N}?"
- options:
  - "Lock it in" — Write phase-{N}-context.md and done
  - "Keep exploring" — I have more to say

Loop until "Lock it in".

### 7. Write phase-{N}-context.md

Use the template at `~/.claude/qualia-templates/phase-context.md`. Fill every section with concrete content.

```bash
# Write the file to .planning/phase-{N}-context.md
```

### 8. Commit

```bash
git add .planning/phase-{N}-context.md
git commit -m "docs(phase-{N}): capture phase context before planning"
```

### 9. Route to Next

```bash
node ~/.claude/bin/qualia-ui.js end "PHASE {N} CONTEXT LOCKED" "/qualia-plan {N}"
```

## Rules

1. **One session, one phase.** Don't try to discuss phases 1 and 2 in the same invocation.
2. **Locked decisions are NON-NEGOTIABLE.** The planner will honor them exactly. If you lock something you're not sure about, that's a mistake.
3. **Don't redo research.** If the user asks a research question you don't know, suggest `/qualia-research {N}` instead.
4. **Short context files are fine.** If the phase is simple, a 30-line context.md is better than a forced 200-line one.
