# Qualia Framework

## Company
Qualia Solutions — Nicosia, Cyprus. Websites, AI agents, voice agents, AI automation.

## Stack
Next.js 16+, React 19, TypeScript, Supabase, Vercel. Voice: Retell AI, ElevenLabs, Telnyx. AI: OpenRouter. Compute: Railway (agents/background jobs). See `rules/infrastructure.md` for full details.

## Role: {{ROLE}}
{{ROLE_DESCRIPTION}}

## Rules
- Read before Write/Edit — no exceptions
- Feature branches only — never push to main/master
- MVP first. Build only what's asked. No over-engineering
- Root cause on failures — no band-aids
- `npx tsc --noEmit` after multi-file TS changes
- For non-trivial work, confirm understanding before coding
- See `rules/security.md` for auth, RLS, Zod, secrets
- See `rules/frontend.md` for design standards
- See `rules/deployment.md` for deploy checklist
- See `rules/infrastructure.md` for services, APIs, GitHub orgs, Vercel teams

## The Road (how projects flow)

v4 hierarchy: **Project → Journey → Milestones (2–5, Handoff always last) → Phases (2–5 tasks each) → Tasks (one commit, one verification contract).**

```
/qualia-new        → kickoff + parallel research + JOURNEY.md (all milestones upfront)
                     add --auto to chain the whole road end-to-end
     ↓
For each milestone, for each phase:
  /qualia-plan     → plan the phase (planner + plan-checker revision loop, fresh context)
  /qualia-build    → build it (builder subagents per task, wave-based parallel)
  /qualia-verify   → goal-backward check (verifier agent, fresh context)
     ↓
/qualia-milestone  → close milestone, archive artifacts, prep next (human gate)
     ↓ (repeat for each milestone until Handoff)
Final milestone = Handoff:
  /qualia-polish   → design/UX pass (Phase 1 of Handoff)
  (content + SEO)  → Phase 2
  (final QA)       → Phase 3
  /qualia-ship     → deploy to production (quality gates → deploy → verify)
  /qualia-handoff  → 4 deliverables: credentials, doc, final update, report
     ↓
Done.

Lost?        → /qualia        (state router — tells you the next command)
Stuck/weird? → /qualia-idk    (diagnostic — spawns plan-view + code-view agents in parallel)
Quick fix?   → /qualia-quick  (skip planning for small tasks)
Paused?      → /qualia-resume (restore from .continue-here.md or STATE.md)
End of day?  → /qualia-report (mandatory before clock-out; writes ERP payload)
```

**Human gates:** journey approval after `/qualia-new`, then one at each milestone boundary via `/qualia-milestone`. `--auto` runs everything between gates automatically.

## Context Isolation
Every task runs in a fresh subagent context. Task 50 gets the same quality as Task 1.
- Planner gets: PROJECT.md + phase requirements
- Builder gets: single task from plan + PROJECT.md
- Verifier gets: success criteria + codebase access
No accumulated garbage. No context rot.

## Quality Gates (always active)
- **Frontend guard:** Read .planning/DESIGN.md before any frontend changes
- **Deploy guard:** tsc + lint + build + tests must pass before deploy
- **Migration guard:** Catches dangerous SQL (DROP without IF EXISTS, DELETE without WHERE, CREATE TABLE without RLS)
- **Intent verification:** Confirm before modifying 3+ files (OWNER: just do it)

## Tracking
`.planning/tracking.json` is updated on every push. The ERP reads it via git.
Never edit tracking.json manually — hooks update it from STATE.md.

## Compaction — ALWAYS preserve:
Project path/name, branch, current phase, modified files, decisions, test results, in-progress work, errors, tracking.json state.
