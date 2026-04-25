---
name: qualia-debug
description: "Investigative debugging — parses symptom from arguments, runs diagnostic scans, identifies root cause, applies minimal fix, writes DEBUG report. Trigger on 'debug', 'find bug', 'fix error', 'something is broken', 'not working', 'weird behavior', 'layout broken', 'CSS issue', 'slow page', 'performance'."
allowed-tools:
  - Bash
  - Read
  - Edit
  - Write
  - Grep
  - Glob
  - Agent
---

# /qualia-debug — Investigative Debugging (one-shot)

Parse the symptom. Run diagnostics. Find root cause. Apply minimal fix. Write report. **One-shot — no mandatory user questions.**

## Usage

- `/qualia-debug {symptom}` — investigate a specific symptom
- `/qualia-debug` — no symptom given: investigate recently-changed files for obvious bugs
- `/qualia-debug --frontend {symptom}` — layout/z-index/overflow bias
- `/qualia-debug --perf {symptom}` — performance bias

## Tool Budget

Max 10 Read/Grep/Bash calls for investigation. If you haven't narrowed to root cause in 10, return `INSUFFICIENT EVIDENCE after 10 steps. Narrowed to: {files}. Recommend: {next diagnostic}.` Do not keep guessing.

## Process

```bash
node ~/.claude/bin/qualia-ui.js banner debug
```

### 1. Parse Symptom from $ARGUMENTS

- If arguments provided → that's the symptom. Extract: what's broken, where (file/page/feature), when (on click? on load? after change?).
- If arguments empty → run `git diff HEAD~3 --stat` to find recently-touched files. Treat those as the suspect set. Symptom = "something in recent changes".

### 2. Check Known Fixes First (cheap)

```bash
node ~/.claude/bin/knowledge.js search "{symptom_keywords}"
```

If a known fix matches, apply it and jump to step 5 (verify). Known fixes are pre-verified patterns — no need to re-investigate.

### 3. Diagnostic Scan

Run the scan matching the symptom type. All commands in a scan block run as parallel Bash calls in a single response turn.

**General mode (default):**
```bash
# Compile errors
npx tsc --noEmit 2>&1 | grep "error TS" | head -20

# Empty catch / swallowed errors
grep -rn "catch\s*{}\|catch\s*(.*)\s*{\s*}" --include="*.ts" --include="*.tsx" app/ components/ src/ lib/ 2>/dev/null | head -10

# Recent console.error or thrown errors
grep -rn "console\.error\|throw new" --include="*.ts" --include="*.tsx" app/ components/ src/ lib/ 2>/dev/null | head -10

# Broken imports
npx tsc --noEmit 2>&1 | grep -i "Cannot find module\|has no exported"
```

**Frontend mode (`--frontend`):**
```bash
# Stacking context audit (z-index issues)
grep -rn "z-index\|z-\[" --include="*.tsx" --include="*.css" app/ components/ src/ 2>/dev/null | head -20

# Overflow candidates (horizontal scroll, clipping)
grep -rn "100vw\|overflow.*hidden\|overflow-x\|position.*fixed" --include="*.tsx" --include="*.css" app/ components/ src/ 2>/dev/null | head -15

# Fixed dimensions breaking mobile
grep -rn "width:.*[0-9]\+px\|height:.*[0-9]\+px\|w-\[[0-9]\+px\|h-\[[0-9]\+px" --include="*.tsx" --include="*.css" app/ components/ src/ 2>/dev/null | grep -v "min-\|max-" | head -10

# Flex/grid blowout candidates
grep -rn "flex\|grid" --include="*.tsx" app/ components/ src/ 2>/dev/null | grep -v "min-w-0\|minmax(0" | wc -l
```

**Perf mode (`--perf`):**
```bash
# Sequential awaits that should be Promise.all
grep -rn "const.*=.*await" --include="*.tsx" --include="*.ts" app/ src/ 2>/dev/null | grep -v "Promise.all\|Promise.allSettled" | head -15

# Large files
find app/ components/ src/ -name "*.tsx" -o -name "*.ts" 2>/dev/null | xargs wc -l 2>/dev/null | sort -rn | head -10

# Missing next/image
grep -rn "<img " --include="*.tsx" --include="*.jsx" app/ components/ src/ 2>/dev/null | grep -v "next/image" | wc -l

# No dynamic imports (possible big bundles)
grep -rn "import(\|next/dynamic" --include="*.tsx" --include="*.ts" app/ src/ 2>/dev/null | wc -l

# Client-boundary usage
grep -rln "'use client'" --include="*.tsx" app/ components/ src/ 2>/dev/null | wc -l
```

### 4. Form Hypothesis + Apply Minimal Fix

From the diagnostic output, state the root cause in one sentence with `file:line` citation. No hedging — either you have evidence or you write `INSUFFICIENT EVIDENCE` and return (step 6).

Apply the minimal fix:
- Only edit files whose contents caused the symptom
- One concept per commit — don't fold in cleanup
- Don't refactor adjacent code
- If the fix touches > 3 files, stop and ask the user first (major refactor disguised as a debug)

### 5. Verify Fix

```bash
# TypeScript still compiles?
npx tsc --noEmit 2>&1 | grep -c "error TS"   # Expect 0

# Symptom reproduction — ideally a grep that would have matched the bug
# and now returns empty:
grep -rn "{pattern that represented the bug}" {scope} 2>/dev/null
```

If the verification fails, revert and return to step 3 with narrower hypothesis.

### 6. Write DEBUG Report

Write to `.planning/DEBUG-{YYYY-MM-DD-HHMM}.md`:

```markdown
# Debug Report — {YYYY-MM-DD HH:MM}

**Symptom:** {user description or "recent changes" if no args}
**Mode:** general | frontend | perf
**Tool calls used:** {N}/10

## Investigation
- Diagnostic scans run: {list}
- Files examined: {list}
- Patterns searched: {list}

## Root Cause
{file:line} — "{quoted problematic code}" — {explanation of why it caused the symptom}

## Fix Applied
- Files: {list}
- Diff summary: {one paragraph}
- Verification: {commands run + results}

## Related Observations
- {any adjacent issues noticed but NOT fixed in this debug pass}
```

### 7. Commit

```bash
git add {specific files you changed}
git commit -m "fix: {what was broken and why}"
```

## INSUFFICIENT EVIDENCE Return

If you exhaust the 10-call budget without a confident root cause:

```markdown
# Debug Report — {YYYY-MM-DD HH:MM}

**Symptom:** {description}
**Outcome:** INSUFFICIENT EVIDENCE after 10 inspection steps

## Narrowed To
- Files examined: {list}
- Ruled out: {list}
- Remaining suspects: {list}

## Recommended Next Diagnostic
- {specific next step for the user — e.g., "run `npm run dev` and watch browser console for the specific error", or "add console.log at file:line and reproduce"}
```

Do NOT apply a speculative fix. Return the report and stop.

## Rules

- **No mandatory questions.** This is one-shot. If symptom args are missing, investigate recent changes.
- **Root cause or INSUFFICIENT EVIDENCE** — no "probably" fixes.
- **Minimal fix only.** One concept, one commit. No refactors dressed as debug.
- **Tool budget is hard.** 10 calls, then stop.
- **Every fix gets a DEBUG report in .planning/** — creates a searchable record.
