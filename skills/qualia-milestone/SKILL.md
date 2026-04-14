---
name: qualia-milestone
description: "Close out a completed milestone and prep the next one. Archives the current milestone's artifacts, updates REQUIREMENTS.md to mark v1 requirements Complete, and creates the next milestone roadmap."
---

# /qualia-milestone — Milestone Closeout

Use when all feature phases in the current milestone are verified. Archives artifacts, marks requirements Complete, opens a new milestone for the next release.

## When to Use

- After `/qualia-verify N` passes on the LAST phase of a milestone
- Before starting a v1.5 / v2.0 cycle
- NOT for individual phase completions — use `/qualia-verify N` for that

## Usage

`/qualia-milestone` — close the current milestone, open the next

## Process

### 1. Validate Readiness

```bash
node ~/.claude/bin/state.js check 2>/dev/null
```

Check:
- All phases in STATE.md are `status: verified`
- `verification: pass` for every phase
- No open blockers

If not ready:
```bash
node ~/.claude/bin/qualia-ui.js fail "Milestone not ready — {reason}"
```
Exit.

### 2. Banner

```bash
node ~/.claude/bin/qualia-ui.js banner milestone
```

### 3. Confirm Closeout

Show:
- Milestone name (e.g., "v1 — Launch")
- Phases completed
- Requirements delivered

- header: "Close milestone?"
- question: "Close {milestone name} and move to the next milestone?"
- options:
  - "Close it" — Archive and open next
  - "Not yet" — I want to add more first

### 4. Archive Current Milestone

```bash
mkdir -p .planning/archive
cp .planning/ROADMAP.md .planning/archive/{milestone_slug}-ROADMAP.md
cp .planning/STATE.md .planning/archive/{milestone_slug}-STATE.md
cp .planning/tracking.json .planning/archive/{milestone_slug}-tracking.json
cp -r .planning/phases .planning/archive/{milestone_slug}-phases
```

### 5. Update REQUIREMENTS.md

Open `.planning/REQUIREMENTS.md` and:
- Mark every v1 requirement as Complete in the traceability table
- Move the `## v1 Requirements` section content to `## Completed (v1)` at the top (for historical reference)
- Elevate `## v2 Requirements` → `## v1 Requirements` (next milestone's scope)

### 6. Ask About Next Milestone

- header: "Next milestone"
- question: "What's the next milestone called?"
- options (dynamic):
  - "v1.5 — {suggested name based on v2 requirements}"
  - "v2.0 — {bigger rewrite}"
  - "Custom name" — let me type it

### 7. Create New Roadmap

Spawn the roadmapper to create a new ROADMAP.md for the next milestone:

```
Agent(prompt="
Read your role: @~/.claude/agents/roadmapper.md

<task>
Create a new ROADMAP.md for the next milestone.

Milestone name: {milestone name}
Milestone number: {M+1}

The new v1 requirements (just promoted from old v2) are in .planning/REQUIREMENTS.md.
The previous milestone's archive is at .planning/archive/.

Build phases for the new milestone scope. Do NOT plan for already-completed requirements.
", subagent_type="qualia-roadmapper", description="Create next milestone roadmap")
```

### 8a. Close Milestone in State Machine

Close the current milestone's tracking data before resetting. This preserves lifetime counters (total tasks, phases, milestones completed) across the reset.

```bash
node ~/.claude/bin/state.js close-milestone
```

### 8b. Reset STATE.md via state.js

The `init` command resets current-phase fields but preserves `milestone` and `lifetime` data from the close-milestone step above.

```bash
node ~/.claude/bin/state.js init \
  --project "{project name}" \
  --client "{client}" \
  --type "{type}" \
  --phases '{JSON from new roadmap}' \
  --total_phases {new N}
```

### 9. Commit

```bash
git add .planning/
git commit -m "feat({milestone_slug}): close milestone, open {next milestone}"
```

### 10. Route

```bash
node ~/.claude/bin/qualia-ui.js end "MILESTONE {closed} CLOSED" "/qualia-plan 1"
```

## What Stays, What Changes

**Stays:**
- `.planning/PROJECT.md` — the project doesn't change
- `.planning/archive/` — historical milestones preserved (incl. tracking.json)
- `tracking.json` lifetime fields — cumulative counters survive across milestones
- Git history — every commit preserved

**Changes:**
- `.planning/REQUIREMENTS.md` — Completed section grows, v1 scope shifts
- `.planning/ROADMAP.md` — new phases for the new milestone
- `.planning/STATE.md` — reset to Phase 1 of new milestone

**Discarded (but archived):**
- `.planning/phases/` — the old phase folders move to archive

## Rules

1. **Don't close early.** All phases must be `verified` with `pass`. No partial milestones.
2. **Archive, don't delete.** Old phase work stays accessible via `.planning/archive/`.
3. **New milestone = new phase numbering.** The next phase is Phase 1 of the new milestone, not Phase {N+1} of the old.
4. **ERP sync aware.** The ERP reads ROADMAP.md — after milestone close, push to GitHub so the ERP picks up the new phase structure.
