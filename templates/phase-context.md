---
phase: {N}
captured: {date}
---

# Phase {N} Context: {Phase Name}

Captured during `/qualia-discuss {N}` — decisions, trade-offs, and constraints that must inform planning.

## Goal Restatement

{What this phase must achieve, in one sentence}

## Locked Decisions

Non-negotiable choices. Planner must honor these exactly.

| Decision | Rationale | Source |
|----------|-----------|--------|
| {e.g., "Use Supabase RLS for authorization, not middleware"} | {e.g., "Client compliance requires database-level checks"} | {who/when} |

## Discretion (Planner Chooses)

Things the planner can decide based on research and best practice.

- {area where planner has freedom}
- {area where planner has freedom}

## Deferred Ideas

Good ideas that are NOT in this phase. Captured so they don't get lost.

- {deferred idea} — defer to {Phase N+1 / v2 / out of scope}

## Risk Flags

Things to watch out for during planning and building.

- **{risk}** — {mitigation approach}

## Questions Pending Answer

Things we haven't decided yet. Must be resolved before `/qualia-plan {N}`.

- [ ] {open question}

---
*Read by `/qualia-plan {N}` as locked planner input*
