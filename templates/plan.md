---
phase: {N}
goal: "{phase goal}"
tasks: {count}
waves: {count}
---

# Phase {N}: {Name}

**Goal:** {what must be TRUE when this phase is done}

**Why this phase:** {one sentence — what this unlocks for the user or the product}

---

## Task 1 — {title}

**Wave:** 1
**Persona:** {optional: security | architect | ux | frontend | backend | performance | none}
**Files:** {specific absolute paths — e.g. `src/lib/auth.ts`, `src/app/login/page.tsx`}
**Depends on:** {task numbers (e.g. "Task 0"), or "none"}

**Why:**
{one-sentence rationale — what problem this solves, what would break without it. Not "implement auth" but "Session persistence is the #1 abandonment trigger in onboarding — verification emails are wasted without it."}

**Acceptance Criteria:**
- {observable user-facing behavior 1}
- {observable user-facing behavior 2}
- {observable user-facing behavior 3}

**Action:**
{concrete steps the builder follows — specific function names, imports, patterns. Not "add auth" but "Add `signInWithPassword()` call in `handleSubmit`, validate email with Zod schema, redirect to `/dashboard` on success."}

**Validation:** (builder self-check before commit)
- `{exact command 1}` → expected output
- `{exact command 2}` → expected output

**Context:** Read @{file references}

---

## Task 2 — {title}

**Wave:** 1
**Persona:** {optional}
**Files:** {files}
**Depends on:** {none | Task N}

**Why:**
{one-sentence rationale}

**Acceptance Criteria:**
- {user-facing behavior}

**Action:**
{steps}

**Validation:**
- `{command}` → expected

**Context:** Read @{files}

---

## Success Criteria

Phase-level truths — what must be observable when this phase is done.

- [ ] {truth 1 — what the user can do}
- [ ] {truth 2}
- [ ] {truth 3}

## Verification Contract

Machine-executable checks the verifier runs verbatim. One per task minimum.

### Contract for Task 1 — {title}
**Check type:** {file-exists | grep-match | command-exit | behavioral}
**Command:** `{exact command}`
**Expected:** {output}
**Fail if:** {failure condition}

### Contract for Task 2 — {title}
**Check type:** {type}
**Command:** `{exact command}`
**Expected:** {output}
**Fail if:** {failure condition}
