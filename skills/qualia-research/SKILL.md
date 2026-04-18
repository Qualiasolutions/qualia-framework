---
name: qualia-research
description: "Deep-research a niche domain or library BEFORE planning a specific phase. Spawns the researcher agent with Context7/WebFetch access. Writes to .planning/phase-{N}-research.md."
allowed-tools:
  - Bash
  - Read
  - Write
  - Agent
  - WebFetch
  - WebSearch
---

# /qualia-research — Per-Phase Deep Research

Runs targeted research on a domain, library, or integration that a specific phase depends on. Distinct from `/qualia-new` research (which covers 4 dimensions project-wide) — this one is narrow and phase-scoped.

## When to Use

- A phase touches a library you've never used
- A phase integrates with a niche API (FHIR, legal forms, payment gateways)
- SUMMARY.md marked this phase as a "Research flag"
- You're about to plan and realize you don't know the current best practice

## Usage

`/qualia-research {N}` — research the current phase or phase N

## Process

### 1. Determine Phase

```bash
node ~/.claude/bin/state.js check 2>/dev/null
```

Use phase N from args, or current phase from STATE.md.

### 2. Load Context

```bash
cat .planning/PROJECT.md 2>/dev/null
cat .planning/ROADMAP.md 2>/dev/null
cat .planning/phase-{N}-context.md 2>/dev/null  # if /qualia-discuss was run first
```

Identify what this phase needs to know.

### 3. Ask the User What to Research

Inline free text:

**"I'm about to research Phase {N}: {phase name}. What specifically do you want me to dig into? Library, domain, integration, pattern?"**

Wait for their answer. Their answer defines the research question.

### 4. Spawn the Researcher

```
Agent(prompt="
Read your role: @~/.claude/agents/researcher.md

<dimension>phase-specific</dimension>

<question>
{user's research question}
</question>

<phase_context>
Phase: {N}
Goal: {phase goal from ROADMAP.md}
Requirements: {REQ-IDs covered by this phase}
</phase_context>

<project_context>
{PROJECT.md summary}
</project_context>

<output_path>
.planning/phase-{N}-research.md
</output_path>

Research using Context7 first, then WebFetch, then WebSearch. Be specific and concrete.
Include: recommendation, rationale, version numbers (if applicable), code examples,
alternatives considered, what to avoid, sources.
", subagent_type="qualia-researcher", description="Phase {N} research")
```

### 5. Review Output

Read `.planning/phase-{N}-research.md`. Present the key findings:

```bash
node ~/.claude/bin/qualia-ui.js divider
node ~/.claude/bin/qualia-ui.js ok "Research complete"
```

Show:
- Recommendation
- Confidence
- Top 3 key findings
- Sources used

### 6. User Confirms or Asks More

- header: "Enough?"
- question: "Is this enough research, or should I dig deeper?"
- options:
  - "Enough" — Move to planning
  - "Dig deeper" — I have more questions

If "Dig deeper" — ask what they want, re-spawn the researcher with additional questions.

### 7. Commit

```bash
git add .planning/phase-{N}-research.md
git commit -m "docs(phase-{N}): research findings"
```

### 8. Route

```bash
node ~/.claude/bin/qualia-ui.js end "PHASE {N} RESEARCH DONE" "/qualia-plan {N}"
```

## Rules

1. **One research session per run.** Don't try to research phases 1 through 5 in one call.
2. **Must produce a file.** The research is worthless if it only lives in conversation context.
3. **Honor locked decisions from phase-{N}-context.md.** Don't research alternatives to something already locked.
4. **Context7 first.** Always try Context7 MCP before WebFetch — it's fastest and most current for known libraries.
