---
name: qualia-idk
description: "Diagnostic intelligence for 'I don't know what's going on.' Runs two isolated scans (.planning/ vs codebase), cross-references against the user's confusion, then explains the situation in plain language with a concrete recommended next step. Use whenever the user says 'I don't know', 'something feels off', 'not sure what to do', 'am I doing this right', 'what's happening', 'help me understand'."
allowed-tools:
  - Bash
  - Read
  - Grep
  - Glob
  - Agent
---

# /qualia-idk — "I Don't Know What's Going On"

Not a router. A **diagnostician**. Use when the user isn't stuck on a command — they're stuck on *understanding*.

## How This Differs from `/qualia`

| `/qualia` | `/qualia-idk` |
|---|---|
| Mechanical: reads state.js, returns `/qualia-X` | Interpretive: reads the project + the code + the confusion |
| "What command do I run next?" | "What is actually going on here?" |
| Always returns a skill name | Returns an explanation + a recommendation |
| Cheap, instant | Spawns 2 isolated agents, ~30s |

Run `/qualia` first when the user knows what they're trying to do. Run `/qualia-idk` when the user's confusion is about the *situation itself*.

## Process

### Step 0. Banner

```bash
node ~/.claude/bin/qualia-ui.js banner router
node ~/.claude/bin/qualia-ui.js spawn "diagnostic" "Reading planning and codebase in isolation..."
```

Say: **"Let me take a proper look."**

### Step 1. Gather the User's Confusion

Look at the conversation context (if any). Note:
- What did the user just say or ask?
- Any recent errors, failed commands, surprising output?
- Any mismatch between what they expected and what happened?

If there's nothing in conversation context yet, ask:
- header: "What's unclear?"
- question: "Where are you stuck? (one sentence is fine)"
- Free text.

Store this as `<user_confusion>`.

### Step 2. Spawn Two Isolated Scans (Parallel)

Two fresh subagents. Each sees ONLY its respective scope — no cross-contamination.

```
Agent(prompt="
You are a read-only diagnostic scanner for the .planning/ folder only.

Read ALL of the following if present:
  - .planning/PROJECT.md
  - .planning/JOURNEY.md
  - .planning/REQUIREMENTS.md
  - .planning/ROADMAP.md
  - .planning/STATE.md
  - .planning/tracking.json
  - .planning/phase-*-plan.md (latest 1-2)
  - .planning/phase-*-verification.md (latest 1-2)
  - .planning/DESIGN.md (skim)
  - .continue-here.md (if present)

DO NOT read any source code — no src/, app/, components/, lib/, etc.
DO NOT run any build tools.

Produce a 'Plan View' report answering:
  1. What is this project? (one sentence from PROJECT.md)
  2. Where does the plan say we ARE? (current milestone + phase + status)
  3. What does the plan say should be TRUE right now? (current phase's acceptance criteria / success criteria)
  4. What does the plan say is UNFINISHED? (upcoming phases or unresolved gaps from latest verification)
  5. Any plan-level inconsistencies? (e.g. tracking.json says phase 3 but STATE.md says phase 2, JOURNEY.md missing, roadmap out of sync)

Keep it under 250 words. Be specific. No filler.
", subagent_type="Explore", description="Plan-view scan")

Agent(prompt="
You are a read-only diagnostic scanner for the source code only.

DO NOT read anything in .planning/ — skip it entirely.

Scan the repo:
  - Package/framework detection (package.json, requirements.txt, etc.)
  - Entry points (app/, src/, pages/, index.*)
  - Key files referenced in recent commits (git log --oneline -5, then inspect)
  - Run quick static checks if applicable: 'npx tsc --noEmit' output, lint errors, test status
  - Look for stubs: grep for TODO, FIXME, 'not implemented', empty catch blocks, unused exports

Produce a 'Code View' report answering:
  1. What does the code look like it's BUILDING? (inferred from structure + imports, not from docs)
  2. What ACTUALLY WORKS right now? (compile status, recent commit messages, any obvious smoke signals)
  3. What's STUBBED or INCOMPLETE? (concrete file:line citations)
  4. What's RUNNING locally or deployed? (if there's a dev server log, vercel link, supabase project — flag it)
  5. Any code-level inconsistencies? (imports that don't resolve, routes referenced but not defined, schema mismatches)

Keep it under 250 words. Cite specific files/lines. No filler.
", subagent_type="Explore", description="Code-view scan")
```

Wait for both. Don't proceed to synthesis until you have both reports.

### Step 3. Synthesize

With both reports + the user's confusion in hand, cross-reference:

**Produce a structured diagnosis** (use this exact shape):

```
## What I see

**The plan says:** {1-2 sentences — current milestone/phase/status, what should be true}

**The code says:** {1-2 sentences — what actually exists, what works, what's stubbed}

**The mismatch (if any):** {1-2 sentences — where plan and code disagree. If no mismatch, say "plan and code are consistent".}

## What I think is happening

{3-5 sentences, plain language. Tie the user's confusion to what you found. Avoid jargon. If the user said "the login is broken", don't say "the auth middleware has a type inference issue" — say "you're seeing the login fail because the signin function isn't actually imported into the login page, even though the plan says it should be. Someone wrote the helper but forgot to wire it up."}

## What to do next

1. **{concrete action}** — {one sentence why}
2. **{concrete action}** — {one sentence why}
3. **{optional third}** — {one sentence why}

If one of these maps to an existing Qualia command, use it:
  - `/qualia-plan {N} --gaps` if the mismatch is "plan says X but code has stubs"
  - `/qualia-verify {N}` if the mismatch is "code says built but no verification exists"
  - `/qualia-debug` if a specific error is the block
  - `/qualia-map` if the plan and code have drifted far apart
  - `/qualia-pause` if the user is overwhelmed and should step away
```

### Step 4. Close

```bash
node ~/.claude/bin/qualia-ui.js divider
node ~/.claude/bin/qualia-ui.js end "DIAGNOSED" "{top-recommended action if it's a command, else leave blank}"
```

## Rules

1. **Two isolated scans, always.** Plan view never peeks at code, code view never peeks at planning. This is what keeps the diagnosis honest — each agent sees one side of the story, and the synthesis catches the delta.
2. **Plain language over jargon.** If you can't explain it to a non-dev, rewrite it.
3. **No fake certainty.** If the scans come back thin (e.g., brand new repo), say "I don't have enough signal yet — here's what I'd do to gather more."
4. **Never invent facts.** If the code-view scan didn't find something, don't say it exists. Cite files.
5. **One recommendation primary, two backups.** Decision fatigue is the problem — give the user a lead option.
6. **Don't re-run if state.js already knows.** If the user's confusion is purely "what's my next command", `/qualia` already handles that — gently suggest it instead of spawning agents.

## When NOT to Use

- User knows what they're doing and just wants the next command → `/qualia`
- User has a specific error message → `/qualia-debug`
- User wants to review code quality → `/qualia-review`
- User wants to pause and come back → `/qualia-pause`

`/qualia-idk` is specifically for **"I'm not sure what I'm even looking at"** situations. Route to sharper tools when the question is sharper.
