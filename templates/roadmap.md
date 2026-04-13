# Roadmap: {Project Name}

**Created:** {date}
**Total phases:** {N}
**v1 requirements:** {X} covered

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
3. {user can do Z}

**Depends on:** none (or: Phase {N})

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

{... continue for all phases ...}

## Coverage Verification

All v1 requirements must map to exactly one phase. Unmapped requirements = roadmap gap.

| Requirement | Phase | Covered? |
|-------------|-------|----------|
| {REQ-ID} | Phase {N} | ✓ |

**Coverage:** {X}/{Y} v1 requirements mapped ({100% expected})

---

## Rules

1. **Feature phases only.** No "review" / "deploy" / "handoff" phases — those are driven by `/qualia-polish` → `/qualia-ship` → `/qualia-handoff` after all feature phases verify.
2. **Each requirement maps to exactly one phase.** If a requirement spans phases, it's too big — split it.
3. **Phases are independently verifiable.** A phase completes when its success criteria are observable in a running app.
4. **Order by dependency, not priority.** Phase 2 should depend on Phase 1's outputs.

---
*Last updated: {date}*
