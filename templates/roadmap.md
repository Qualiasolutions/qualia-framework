# Roadmap · Milestone {N} · {Milestone Name}

**Project:** {Project Name}
**Milestone:** {N} of {Total} ({"CURRENT" / shipped})
**Created:** {date}
**Phases:** {P}
**Requirements covered:** {REQ-IDs from this milestone's REQUIREMENTS.md section}

See `JOURNEY.md` for the full project arc. This file is ONLY the current milestone's phases.

## Exit Criteria

What "shipped" means for this milestone:

- {observable outcome 1}
- {observable outcome 2}
- {observable outcome 3}

---

## Phases

| # | Phase | Goal | Requirements | Status |
|---|-------|------|--------------|--------|
| 1 | {name} | {one-sentence goal} | {REQ-IDs} | ready |
| 2 | {name} | {goal} | {REQ-IDs} | — |
| 3 | {name} | {goal} | {REQ-IDs} | — |

## Phase Details

### Phase 1: {Name}

**Goal:** {what must be TRUE when this phase is done}

**Requirements covered:**
- {REQ-ID}: {description}
- {REQ-ID}: {description}

**Success criteria** (observable user behaviors):
1. {user can do X}
2. {user can do Y}

**Depends on:** none

---

### Phase 2: {Name}

**Goal:** {goal}

**Requirements covered:**
- {REQ-ID}: {description}

**Success criteria:**
1. {criterion}
2. {criterion}

**Depends on:** Phase 1

---

### Phase 3: {Name}

**Goal:** {goal}

**Requirements covered:**
- {REQ-ID}: {description}

**Success criteria:**
1. {criterion}

**Depends on:** Phase 2

---

## Coverage Verification

Every requirement in this milestone must map to exactly one phase.

| Requirement | Phase | Covered? |
|-------------|-------|----------|
| {REQ-ID} | Phase {N} | ✓ |

---

## When This Milestone Closes

Triggered by `/qualia-milestone` after `/qualia-verify` passes on the last phase:

1. All phase artifacts are archived to `.planning/archive/milestone-{N}-{slug}/`
2. `tracking.json` `milestones[]` gets a summary entry (num, name, phases_completed, shipped_url, closed_at)
3. REQUIREMENTS.md marks this milestone's requirements as **Complete**
4. Next milestone from JOURNEY.md opens — roadmapper regenerates this ROADMAP.md for Milestone {N+1}
5. `state.js init --force --milestone_name "{N+1 name}"` resets current-phase fields, preserves lifetime + milestones[] history

---

*Last updated: {date}*
