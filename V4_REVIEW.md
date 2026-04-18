# v4.0.0 — Review & Publish Handoff

**Date:** 2026-04-18
**Branch:** `feature/full-journey`
**Release tag:** v4.0.0 (not yet tagged, not yet pushed)
**Status:** Ready for review. Tests 156/156 green. Needs human eyeball before `git push` + `npm publish`.

This document is the single source of truth for what shipped in v4.0.0 and what the next agent/reviewer needs to verify before the release goes public.

---

## TL;DR

The Qualia Framework v4.0.0 makes `/qualia-new` produce the **entire project journey** (all milestones → Handoff) upfront, enables **end-to-end auto-chaining** of the Road with `--auto`, locks down the **milestone/phase/task hierarchy**, and **rebuilds `/qualia-idk` as a real diagnostician** instead of a router alias.

10 commits on `feature/full-journey` (8 feature + 1 docs + 1 release-state fix). ~28 files touched. 156/156 tests green.

Two local branches, neither pushed:

| Branch | HEAD | Ships |
|---|---|---|
| `feature/story-file-plans` | `8ae5b0e` | v3.7.0 — story-file plan format (independent, useful on its own) |
| `feature/full-journey` | `f790554` | v4.0.0 — full journey, auto-chain, diagnostic idk (includes v3.7.0) |

---

## The commits on `feature/full-journey`

```
94bc119 fix(v4): correct v4.0.0 — fold qualia-idk changelog entries into initial release
ea9e7f3 docs(v4): README, guide.md, SESSION_REPORT updated for v4.0.0 + V4_REVIEW.md handoff
f790554 release(v4.0.0): full journey — kickoff to handoff on rails
f62e753 fix(v4/phase-g): milestone summary cumulative task count + smoke tests
b41a52d feat(v4/phase-f): build_count + deploy_count bump, ERP v4 payload, handoff 4-deliverables
74dd26e feat(v4/phase-d-e): builder pre-inline + journey visualization
400cd17 feat(v4/phase-c): auto-chain wiring across Road skills
87af253 feat(v4/phase-b): roadmapper + qualia-new full-journey output
2e371c2 feat(v4/phase-a): model foundation — milestones[] + readiness guards
8ae5b0e release(v3.7.0): story-file plan format (from feature/story-file-plans)
```

**Release-point:** `94bc119` is the canonical v4.0.0 HEAD (package.json = "4.0.0", CHANGELOG has a single [4.0.0] section with `/qualia-idk` folded in). Tag v4.0.0 at this commit.

---

## What v4.0.0 actually changes

### Hierarchy (locked down)
```
Project
└─ Journey (all milestones defined upfront)
   └─ Milestone (a release — 2-5 total, Handoff is always last)
      └─ Phase (2-5 tasks per phase)
         └─ Task (one commit, one verification contract)
```

- Hard floor: 2 milestones. Hard ceiling: 5.
- Final milestone is **always literally named "Handoff"** with 4 fixed phases (Polish, Content + SEO, Final QA, Handoff).
- Every non-Handoff milestone needs **≥ 2 phases** (guarded by `state.js close-milestone`).
- Milestone numbering is **contiguous** — no skipped numbers.

### New artifact: `.planning/JOURNEY.md`
The North Star. Lists every milestone with why-now + exit criteria + phase sketches. Written once during `/qualia-new`, consulted at every milestone boundary.

### Auto mode (`--auto` flag)
```
/qualia-new --auto
  → research runs automatically
  → JOURNEY.md written
  → SINGLE human approval on the whole journey
  → plan 1 → build 1 → verify 1 → plan 2 → build 2 → verify 2 → ...
  → [milestone boundary — HUMAN GATE: "Continue to M{N+1}?"]
  → ... repeat until Handoff last phase ...
  → /qualia-ship → /qualia-handoff → /qualia-report → DONE
```

**Two human gates total per project** (journey approval + each milestone boundary). Plus one halt if gap-cycle limit exceeded on a failed phase.

### `/qualia-idk` now diagnostic (not a router alias)
Spawns two isolated `Explore` subagents in parallel:
1. **Plan view** — reads only `.planning/*`, reports what plan says we are + what should be TRUE
2. **Code view** — reads only source code, reports what's built + what compiles + what's stubbed, cites file:line

Main skill synthesizes: "What I see / The mismatch / What I think is happening / What to do next."

### `/qualia` description scoped back to state routing
Previously claimed "idk / stuck / lost / confused" triggers. Those now route to `/qualia-idk`. `/qualia` keeps "what next / what now / next command."

### Schema changes (all additive, backward compatible)
`tracking.json` gains:
- `milestone_name` — human name of current milestone
- `milestones[]` — array of closed milestone summaries (for ERP tree render)
- `build_count`, `deploy_count` — now actually incremented on transitions

`state.js` check output gains `milestone_name` + `milestones`.

`qualia-report` ERP payload now includes all v4 fields.

---

## How to verify before publishing

### 1. Run the test suite
```bash
cd /home/qualiasolutions/qualia-framework
node --test tests/runner.js
```
Expected: `# pass 156 / # fail 0`.

### 2. Visual smoke test of new UI commands
```bash
# Make a fake project
TMP=/tmp/qualia-v4-visual && rm -rf $TMP && mkdir -p $TMP/.planning
cat > $TMP/.planning/JOURNEY.md <<'EOF'
---
project: "Demo"
---
## Milestone 1 · Foundation
**Why now:** Base infra.
**Phases:**
1. **Setup**
2. **Auth**
## Milestone 2 · Core Features
**Why now:** Value delivery.
**Phases:**
1. **Feature A**
2. **Feature B**
## Milestone 3 · Handoff
**Phases:**
1. **Polish**
2. **Content + SEO**
3. **Final QA**
4. **Handoff**
EOF
cat > $TMP/.planning/tracking.json <<'EOF'
{"milestone":2,"milestone_name":"Core Features","milestones":[],"phase":1,"total_phases":2,"status":"built","lifetime":{"tasks_completed":4,"phases_completed":2,"milestones_completed":1}}
EOF
cat > $TMP/.planning/STATE.md <<'EOF'
## Current Position
Phase: 1 of 2 — Feature A
Status: built
Assigned to: Reviewer

## Roadmap
| # | Phase | Goal | Status |
|---|-------|------|--------|
| 1 | Feature A | x | built |
| 2 | Feature B | x | — |
EOF
(cd $TMP && node /home/qualiasolutions/qualia-framework/bin/qualia-ui.js journey-tree .planning/JOURNEY.md)
node /home/qualiasolutions/qualia-framework/bin/qualia-ui.js milestone-complete 1 "Foundation" "Core Features"
node /home/qualiasolutions/qualia-framework/bin/qualia-ui.js milestone-complete 3 "Handoff" ""
rm -rf $TMP
```
Expected:
- Journey tree shows green dot on M1, teal diamond on M2 (CURRENT), dim circle on M3 (FINAL).
- First milestone-complete banner shows `Next: Core Features`.
- Second shows `PROJECT COMPLETE · last milestone reached`.

### 3. State-machine end-to-end smoke
Covered by test case `tests/runner.js` "milestone summary captures cumulative tasks_completed" and "build_count bumps on each 'built' transition". Both pass.

### 4. Manual eyeball of key files
Review these for v4 correctness:

| File | Why |
|---|---|
| `templates/journey.md` | New artifact schema — is the format clear and complete? |
| `agents/roadmapper.md` | Biggest agent rewrite — does it correctly describe the 3-file output (JOURNEY + REQUIREMENTS + ROADMAP)? |
| `skills/qualia-new/SKILL.md` | Core flow — is the 14-step process coherent? Is `--auto` wiring clear? |
| `skills/qualia-idk/SKILL.md` | New diagnostic — does the 2-pass isolation make sense? Is the synthesis format useful? |
| `skills/qualia-verify/SKILL.md` | Auto-chain decision table (PASS → next phase / last phase → milestone / last milestone → ship) |
| `skills/qualia-milestone/SKILL.md` | Reads next milestone from JOURNEY.md now, not user prompt |
| `skills/qualia-handoff/SKILL.md` | 4 mandatory deliverables enforced |
| `bin/state.js` lines ~975-1050 | close-milestone readiness guards + milestones[] summary append |
| `bin/qualia-ui.js` journey-tree + milestone-complete | New visualizations |
| `CHANGELOG.md` [4.0.0] section | Full feature list + migration notes |

### 5. Backward-compat verification
The v4 changes are designed additive. Verify by:
```bash
# tracking.json from an older project (no milestones[], no milestone_name)
# should still work with state.js check
echo '{"milestone":1,"phase":1,"total_phases":3,"status":"setup","lifetime":{"tasks_completed":0,"phases_completed":0,"milestones_completed":0,"total_phases":0}}' > /tmp/old-tracking.json
mkdir -p /tmp/old-project/.planning && mv /tmp/old-tracking.json /tmp/old-project/.planning/tracking.json
cat > /tmp/old-project/.planning/STATE.md <<'EOF'
Phase: 1 of 3 — Setup
Status: setup

## Roadmap
| # | Phase | Goal | Status |
|---|-------|------|--------|
| 1 | Setup | x | ready |
| 2 | Feature | x | — |
| 3 | Ship | x | — |
EOF
(cd /tmp/old-project && node /home/qualiasolutions/qualia-framework/bin/state.js check | head -20)
rm -rf /tmp/old-project
```
Expected: `check` succeeds, output includes `milestones: []` and `milestone_name: ""` (hydrated by `ensureLifetime`).

---

## Publish checklist

Once review passes:

```bash
# 1. Push both branches
git push -u origin feature/story-file-plans
git push -u origin feature/full-journey

# 2. Merge v3.7.0 first (recommended — gives it a distinct tag in history)
git checkout main
git merge --ff-only feature/story-file-plans
git tag v3.7.0
git push origin main --tags

# 3. Merge v4.0.0
git merge --ff-only feature/full-journey
# If fast-forward fails (unlikely since v4 branched off story-file-plans HEAD):
#   git merge feature/full-journey    # creates a merge commit — also fine
git tag v4.0.0
git push origin main --tags

# 4. npm publish
npm publish
# Expected: qualia-framework@4.0.0 goes live. Auto-update hook notifies
# every team member's installed client on next session.

# 5. Verify
npm view qualia-framework version    # should return 4.0.0
```

### Alternative: one combined release
If the team would rather have a single v4.0.0 release tag (skip the v3.7.0 tag):

```bash
git checkout main
git merge --ff-only feature/full-journey
git tag v4.0.0
git push origin main --tags
npm publish
```
(v3.7.0 work is still in the history, just not tagged as its own release.)

---

## Risk areas (eyeball these)

1. **Auto-chain logic in `/qualia-verify`** — the decision table (PASS → next phase / last phase of milestone / last phase of Handoff / FAIL gap / FAIL limit) is described in the SKILL.md but relies on Claude to parse JOURNEY.md at runtime to detect "last phase of milestone." Smoke test didn't actually run the auto-chain because that requires live subagent invocation. **Recommended first test on merge**: run `/qualia-new --auto` on a throwaway project and watch how it handles the milestone boundary.

2. **Roadmapper's new three-file output** — the rewritten agent prompt is long and complex. The roadmapper must:
   - Generate JOURNEY.md with all milestones
   - Assign requirements to milestones
   - Only detail Milestone 1 in ROADMAP.md
   - Pass `--milestone_name` to `state.js init`
   Smoke test didn't exercise the roadmapper directly — it's only triggered by `/qualia-new`.

3. **`/qualia-idk`'s two-pass isolation** — depends on `Explore` subagent correctly NOT crossing its scope. If an Explore agent reads .planning/ when told "code only" or vice versa, the diagnosis degrades. The SKILL.md has explicit "DO NOT read..." instructions but this is prompt-level enforcement, not hard boundary.

4. **Builder pre-inline context** — saves tool calls but inflates prompt size. On very large projects (PROJECT.md + DESIGN.md + 5 context files could easily be 10k+ tokens), the builder's prompt might balloon. Acceptable for most projects; watch for issues on monorepos.

---

## Known limitations / deferred

- **No visual / mockup generation** (gstack's `/design-shotgun` or Superpowers' Visual Companion). Not in v4 — could be a v4.1 feature.
- **No cross-model review** (gstack's `/codex`). Not in v4.
- **No cross-project vector memory** (Claude-Flow's claude-mem pattern). Current `knowledge/` is still hand-authored markdown.
- **No IDE integration** (VS Code extension, JetBrains plugin). Claude Code CLI only.
- **No token-budget compression** (SuperClaude's ~70% compression claim). Qualia relies on fresh-context agents instead of compression.

These are all discussed in the competitive gap analysis done earlier in the session — see the chat transcript or memory for details.

---

## Questions for Fawzi before publish

1. **Single v4.0.0 release or v3.7.0 + v4.0.0?** Default: both tags (v3.7.0 as a step release). Cleaner history. Alternative: fold into single v4.0.0.
2. **Alpha/beta tag on npm?** `npm publish` without `--tag` goes to `latest` and every installed client auto-updates on next session. If you want a slower rollout, publish with `--tag beta` and the team opts in manually with `npm install qualia-framework@beta install`.
3. **Do you want to dogfood v4 on an existing project before publish?** Running `npx qualia-framework@4.0.0-alpha install` locally on Sakani or another project is the safest way to verify end-to-end — especially the auto-chain which isn't covered by the unit tests.

Contact for questions: Fawzi Goussous — fawzi@qualiasolutions.net

---

*Generated 2026-04-18 by the v4 build session. Review this doc + CHANGELOG.md [4.0.0] before publishing.*
