# Session Report — 2026-04-18

**Project:** qualia-framework
**Branch:** feature/full-journey (local, not pushed)
**Released:** v3.7.0 (staged on feature/story-file-plans) and **v4.0.0** (staged on feature/full-journey)
**Owner:** Fawzi Goussous
**Duration:** ~4 hours

## What this session shipped

Two releases staged on separate feature branches, ready for push + merge + `npm publish`.

| Tag | Branch | Commits | Theme |
|---|---|---|---|
| **v3.7.0** | feature/story-file-plans | 1 commit (8ae5b0e) | Story-file plan format — every phase plan task carries inline Why, Acceptance Criteria, Validation, explicit Depends on |
| **v4.0.0** | feature/full-journey | 8 commits total (includes v3.7.0) | Full Journey release — /qualia-new maps the entire arc to handoff, --auto chains the Road end-to-end, milestone hierarchy locked, /qualia-idk rebuilt as diagnostician |

**Test suite:** 150 → 156 green (+6 v4 coverage, 0 regressions).
**Package:** version bumped 3.6.0 → 4.0.0.
**Release candidate:** v4.0.0 commit is `f790554` on feature/full-journey.

## Background & trigger

Fawzi came in with three pain points from Sakani's ERP view:
1. "Unphased Tasks" and "Phase 0: Central Bank Demo" rendering at the same tree level as "Milestone 1", "Milestone 2", etc. — milestones collapsed into single phases, numbering skipped (missing M5).
2. `/qualia-new` stops at v1 — team improvises subsequent milestones, no clear path to handoff.
3. Team members don't understand the framework's dev cycle. Need something a non-technical person can follow without getting lost.

Plus: "make it sexier," personalize the Qualia experience, enhance every command for best practices, ship a stable v4.0.

## The approach

Split the work into labeled phases on a feature branch so commits tell the story:

### v3.7.0 prerequisite — story-file plans
- `templates/plan.md` rewritten to 7-field story-file format (Wave, Files, Depends on, Why, Acceptance Criteria, Action, Validation, Context + optional Persona)
- `agents/planner.md` generates the new format
- `agents/plan-checker.md` validates the 7 fields and cross-checks wave↔deps consistency
- `agents/builder.md` reads rationale, respects Depends on, runs Validation before commit
- `agents/verifier.md` adds 3-layer check (phase Success Criteria + per-task AC + Verification Contract)
- `bin/qualia-ui.js` adds `plan-summary` command — terminal dashboard with colored persona chips, dependency arrows, AC/check counts per task
- `bin/state.js` accepts both legacy `Done when:` and new `Acceptance Criteria:` anchors (backward-compatible)

Committed on `feature/story-file-plans` as v3.7.0 (`8ae5b0e`). Standalone useful release; branched v4 off of it.

### v4.0.0 — Full Journey, phased

**Phase A — Model foundation** (`2e371c2`)
- `templates/journey.md` — new JOURNEY.md schema (hard ceiling 5 milestones, hard floor 2, final milestone always Handoff with 4 fixed phases)
- `tracking.json` gains `milestone_name`, `milestones[]` (array of closed milestone summaries)
- `state.js close-milestone` readiness guards: MILESTONE_NOT_READY, MILESTONE_TOO_SMALL (both bypassable with --force)
- `state.js init` accepts `--milestone_name` and preserves milestones[] across re-init
- Tests: +4

**Phase B — Roadmapper + /qualia-new full-journey output** (`87af253`)
- `agents/roadmapper.md` rewritten: now produces JOURNEY.md (all milestones) + REQUIREMENTS.md (grouped by milestone) + ROADMAP.md (Milestone 1's phase detail only)
- **Dropped** the old "no review/deploy/handoff phases" rule. **Replaced** with: final milestone is always literally named "Handoff" with fixed 4 phases.
- `skills/qualia-new/SKILL.md` rewritten: always runs research (no more `workflow.research` gate), single approval on the whole journey, new `--auto` flag
- `agents/research-synthesizer.md` thinks across all milestones
- `skills/qualia-milestone/SKILL.md` reads next milestone from JOURNEY.md (no longer asks user)
- `templates/requirements.md` multi-milestone format with standard Handoff section (HAND-01..HAND-15)
- `templates/roadmap.md` scoped to current milestone only

**Phase C — Auto-chain wiring** (`400cd17`)
- `--auto` flag added to `/qualia-plan`, `/qualia-build`, `/qualia-verify`, `/qualia-milestone`
- Auto-chain decision table in `/qualia-verify`: PASS → next phase OR milestone close OR ship+handoff; FAIL → gap closure OR halt at limit
- Two human gates total per project: journey approval + each milestone boundary

**Phase D+E — Builder pre-inline + journey visualization** (`74dd26e`)
- Builder pre-inlines PROJECT.md + DESIGN.md + Context files into agent prompt BEFORE spawning (GSD-pattern borrowing, saves 3-5 Read calls per task)
- `qualia-ui.js journey-tree` renders JOURNEY.md as ASCII ladder (green shipped, teal current, dim future, [FINAL] tag for Handoff)
- `qualia-ui.js milestone-complete` celebration banner
- 5 new banner actions: milestone ◆, journey ◯, auto ⚡, research ◱, roadmap ◐
- `/qualia` router renders journey-tree for "you are here" orientation
- `/qualia-milestone` renders journey-tree + milestone-complete

**Phase F — Ship-side fields + handoff deliverables** (`b41a52d`)
- `state.js` bumps `build_count` on each 'built' transition, `deploy_count` on each 'shipped' (previously never incremented)
- `qualia-report` ERP payload now includes all v4 fields (project_id, team_id, git_remote, milestone_name, milestones[], build_count, deploy_count, session_started_at, last_pushed_at)
- `/qualia-handoff` rewritten: explicit 4 mandatory deliverables — production URL verified (HTTP + latency + auth), docs updated, `.planning/archive/` check, final ERP report

**Phase G — Smoke test fix + coverage** (`f62e753`)
- Bug fix: close-milestone summary was recording current phase's tasks, not cumulative milestone total. Fixed via `lifetime.tasks_completed − sum(prior milestones[].tasks_completed)`
- Tests: +2 (cumulative task count, build_count bump)

**Release (`f790554`)**
- Single unified v4.0.0 release commit
- Package bumped 3.7.0 → 4.0.0
- CHANGELOG.md v4.0.0 entry with full feature list + migration notes
- `/qualia-idk` rebuilt as real diagnostician (was briefly v4.0.1 in the branch history, folded into v4.0.0 per owner request)

### The `/qualia-idk` rebuild (folded into v4.0.0)

Before: thin one-line alias to `/qualia`.

Now: interpretive diagnostic. When user says "I don't know what's going on" / "something feels off":
1. Spawns **Plan view** Explore subagent — reads only `.planning/*`, reports what plan says
2. Spawns **Code view** Explore subagent in parallel — reads only source code, reports what's actually built, cites file:line
3. Synthesizes: structured "What I see / The mismatch / What I think is happening / What to do next" in plain language
4. Maps recommendations to existing commands where applicable

`/qualia` description scoped back to mechanical state routing — no longer claims "idk/stuck/lost/confused" triggers (those route to `/qualia-idk` now).

## Competitive research completed

During the session, ran deep research on competing Claude Code frameworks:
- **Superpowers** (Jesse Vincent) — 93K stars — rigid 5-phase gates, Visual Companion, cross-agent portability
- **BMAD-METHOD** — 43K stars — 12-19 named role agents, story files, expansion packs
- **gstack** (Garry Tan) — 74K stars — 23-role team, persistent browser daemon, /codex cross-model review
- **GSD** (Get Shit Done, v1+v2) — 54K + 6K stars — state-machine auto-advance, pre-inlined dispatch, adaptive replanning
- **SuperClaude, Agent OS, Context Engineering/PRP, Claude-Flow, Cursor 2.0, Windsurf** — broader landscape

Patterns borrowed in v4.0.0:
- **Story-file plan format** (BMAD) — inline rationale + acceptance criteria
- **State-machine auto-advance** (GSD v2) — the --auto chain
- **Pre-inline context at dispatch** (GSD v2) — builder's <pre-loaded-context> block
- **Journey-as-first-class-artifact** (NotebookLM synthesis of Qualia's own docs)

Patterns deferred to v4.1+:
- Visual/mockup generation (gstack design-shotgun, Superpowers Visual Companion)
- Cross-model review (gstack /codex)
- Cross-project vector memory (claude-mem, Claude-Flow)
- IDE integration
- Token-budget compression

## Verification at checkpoint

```
✅ Git            8 commits clean on feature/full-journey
✅ Tests          156/156 pass
✅ Smoke          state transitions + close-milestone + milestones[] summary verified on scratch project
✅ UI             journey-tree + milestone-complete render correctly with real fixtures
✅ Backward compat  older tracking.json without milestones[]/milestone_name still passes state.js check
✅ No regressions Vs v3.6 baseline — all 150 existing tests still pass
✅ Package        version 4.0.0, ready for `npm publish`
✅ Handoff        V4_REVIEW.md written for next agent
```

## Pending (not done by this session)

- **Git push** — both branches are local only
- **Merge to main** — owner decides merge strategy (recommend v3.7.0 tag then v4.0.0 tag)
- **`npm publish`** — requires owner auth
- **Tag creation** — after merge
- **Live auto-chain verification** — smoke tests covered state machine; the --auto chain (which spawns planner→builder→verifier subagents in sequence) wasn't exercised end-to-end. Recommended first real test is on a throwaway project post-publish.
- **ERP-side updates** — v4 tracking.json fields are additive; ERP should accept them via its existing Zod strip-unknowns pattern, but worth verifying on deploy.

## Files the next reviewer should eyeball

Priority order (highest leverage first):

1. `V4_REVIEW.md` — this file lives in repo root, written as the handoff doc
2. `CHANGELOG.md` [4.0.0] section — full feature list
3. `templates/journey.md` — new artifact schema
4. `agents/roadmapper.md` — biggest agent rewrite
5. `skills/qualia-new/SKILL.md` — core flow, 14 steps
6. `skills/qualia-idk/SKILL.md` — new diagnostic
7. `skills/qualia-verify/SKILL.md` — auto-chain decision table
8. `skills/qualia-handoff/SKILL.md` — 4 deliverables enforcement
9. `bin/state.js` close-milestone (~975-1050) — readiness guards + summary append
10. `bin/qualia-ui.js` journey-tree + milestone-complete functions

## Recommended publish sequence

```bash
# Push both branches
git push -u origin feature/story-file-plans
git push -u origin feature/full-journey

# Merge v3.7.0 to main, tag, push
git checkout main
git merge --ff-only feature/story-file-plans
git tag v3.7.0
git push origin main --tags

# Merge v4.0.0 to main, tag, push
git merge --ff-only feature/full-journey
git tag v4.0.0
git push origin main --tags

# Publish
npm publish
npm view qualia-framework version   # should return 4.0.0
```

## Known limitations / open questions

1. **Auto-chain not live-tested.** Unit tests cover state transitions; subagent chaining is covered by the skill prompt text but not exercised. First real project run will reveal edge cases.
2. **Milestone-summary `tasks_completed` accuracy** depends on lifetime counter deltas. Works if close-milestone is the only consumer — verified in test suite.
3. **/qualia-idk two-pass isolation** depends on Explore subagent respecting the "do not read .planning/" and "do not read source code" instructions. Prompt-level enforcement, not hard boundary.
4. **Builder pre-inline** inflates prompt size for monorepos with large DESIGN.md + multiple context files. Acceptable for most projects; could be optimized in v4.1.

## For questions

Contact: Fawzi Goussous — fawzi@qualiasolutions.net

---

*Written 2026-04-18 at release-candidate time. Supersedes the 2026-04-17 session report covering v3.4.2 / v3.5.0 / v3.6.0.*
