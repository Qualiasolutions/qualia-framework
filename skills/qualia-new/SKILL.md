---
name: qualia-new
description: "Set up a new project from scratch — deep questioning, parallel research, REQUIREMENTS.md, ROADMAP.md, approval gate. Use when starting any new client project."
---

# /qualia-new — New Project

Comprehensive project initialization. Deep questioning → 4 parallel research agents → REQUIREMENTS.md with REQ-IDs → ROADMAP.md with phases → approval → scaffold → ready to plan Phase 1.

**Flags:**
- `/qualia-new` — full flow (default)
- `/qualia-new --quick` — 4-phase flat wizard (faster, less rigorous, for trivial projects)

## Process

### Step 0. Banner

```bash
node ~/.claude/bin/qualia-ui.js banner new
```

Then say: **"Let's build something. Tell me what you want to make."**

Wait for free-text answer. Do NOT use AskUserQuestion here — let them talk naturally.

### Step 0.5. Brownfield Check

Before questioning, detect if we're in an existing codebase:

```bash
test -f package.json && echo "HAS_PACKAGE"
test -d .git && echo "HAS_GIT"
ls *.ts *.tsx *.js *.jsx *.py 2>/dev/null | head -5
test -f .planning/codebase/README.md && echo "ALREADY_MAPPED"
```

**If existing code detected AND not already mapped:**

- header: "Existing Code"
- question: "I see existing code here. Map the codebase first so I understand what's already built?"
- options:
  - "Map codebase first" — Run /qualia-map, then continue (recommended for brownfield)
  - "Skip mapping" — Treat as greenfield anyway

If "Map codebase first": invoke the `qualia-map` skill inline, wait for completion, then continue to Step 1.

### Step 1. Deep Questioning

**Load the questioning methodology as your guide:**

```bash
cat ~/.claude/qualia-references/questioning.md 2>/dev/null
```

Follow that methodology:
- Start with their free-text answer from Step 0
- Follow energy — dig into what excited them
- Challenge vagueness — never accept fuzzy answers
- Make abstract concrete — "walk me through using this"
- Surface motivation — "what prompted this?"
- Check the 4-item context checklist mentally (what, why, who, done)

**Use AskUserQuestion for forks with 2-4 concrete interpretations.** Use free text when you want them to think freely.

**Decision gate** — when you could write a clear PROJECT.md:

- header: "Ready?"
- question: "I think I understand what you're building. Ready to create PROJECT.md?"
- options:
  - "Create PROJECT.md" — Let's move forward
  - "Keep exploring" — I want to share more

Loop until "Create PROJECT.md".

### Step 2. Detect Project Type + Load Template

From the questioning answers, infer project type:

- "website", "landing page", "marketing site", "SaaS", "dashboard", "portal" → `website`
- "chatbot", "AI assistant", "chat agent", "RAG", "agent" → `ai-agent`
- "voice agent", "phone agent", "call bot", "VAPI", "Retell" → `voice-agent`
- "mobile app", "iOS", "Android", "React Native", "Expo" → `mobile-app`

**If a type matches:**

```bash
cat ~/.claude/qualia-templates/projects/{type}.md
```

This template gives suggested phase structure and category names the roadmapper will use.

**If no type matches:** continue without a template — the roadmapper will derive structure from requirements.

Store `template_type` (or `null`) for use in Step 6.

### Step 3. Design Direction (frontend only)

If the project involves frontend work (most do), capture design direction:

- header: "Design"
- question: "What's the design vibe?"
- options:
  - "Dark & Bold" — Dark backgrounds, neon accents, strong contrast
  - "Clean & Minimal" — White space, subtle shadows, refined typography
  - "Colorful & Playful" — Gradients, rounded shapes, vibrant palette
  - "Corporate / Professional" — Structured, trust signals, enterprise feel

Also ask (free text): "Any brand colors or reference sites I should look at?"

Store these for Step 7 (DESIGN.md generation).

### Step 4. Client Context

- header: "Client"
- question: "Client project or internal?"
- options:
  - "Client project" — External client, needs handoff
  - "Internal / Qualia" — Our own product
  - "Personal / Side project" — No formal client

If client, ask their name (free text) and check for saved prefs:
```bash
cat ~/.claude/knowledge/client-prefs.md 2>/dev/null | grep -A 10 "{client name}"
```

If prefs found, mention: *"I have notes on {client} — {summary}. Applying these to defaults unless you say otherwise."*

### Step 5. Write PROJECT.md

Create `.planning/PROJECT.md` from the template:

```bash
mkdir -p .planning
cat ~/.claude/qualia-templates/project.md
```

Fill in with questioning answers. Include:

```markdown
# {Project Name}

## Client
{name or "Internal" or "Personal"}

## What We're Building
{one-paragraph description from questioning}

## Core Value
{the ONE thing that must work}

## Requirements
### Validated
{if brownfield, inferred from codebase map; else "(none yet)"}

### Active (hypotheses)
- [ ] {requirement 1 — from questioning}
- [ ] {requirement 2}
- [ ] {requirement 3}

### Out of Scope
- {exclusion 1}

## Stack
{from questioning — default: Next.js 16 + React 19 + TypeScript + Supabase + Vercel}

## Design Direction
{from Step 3}

## Decisions
| Decision | Rationale |
|----------|-----------|
| {choice from questioning} | {why} |

---
*Created: {date}*
```

Commit:
```bash
git init 2>/dev/null
git add .planning/PROJECT.md
git commit -m "docs: initialize project"
```

### Step 6. Create config.json

Write `.planning/config.json`:

```json
{
  "mode": "interactive",
  "depth": "standard",
  "template_type": "{detected or null}",
  "workflow": {
    "research": true,
    "plan_check": true,
    "verifier": true
  }
}
```

**If the user says "quick" or the project is clearly trivial (landing page with 2 sections, 1 form):** set `depth: "quick"` and `workflow.research: false`.

### Step 7. Create DESIGN.md (frontend projects)

If frontend work is involved, generate `.planning/DESIGN.md` from `~/.claude/qualia-templates/DESIGN.md` using the design direction from Step 3. Fill in:
- Palette (concrete hex values, not placeholders)
- Typography (distinctive fonts, NOT Inter/Roboto/system-ui)
- Spacing (8px grid)
- Motion approach
- Component patterns

Commit:
```bash
git add .planning/DESIGN.md .planning/config.json
git commit -m "docs: design direction + config"
```

### Step 8. Run Research (if enabled)

Check `.planning/config.json` → `workflow.research`. If `true`, proceed. If `false`, skip to Step 9.

**Banner:**
```bash
node ~/.claude/bin/qualia-ui.js banner research
```

Say: **"Running 4 parallel research agents (stack, features, architecture, pitfalls)..."**

**Create research dir:**
```bash
mkdir -p .planning/research
```

**Spawn 4 researchers in parallel** (single message, 4 Agent tool calls):

```
Agent(prompt="
Read your role: @~/.claude/agents/researcher.md

<dimension>stack</dimension>
<domain>{inferred domain from PROJECT.md}</domain>
<project_context>{PROJECT.md summary}</project_context>
<milestone_context>greenfield</milestone_context>
<output_path>.planning/research/STACK.md</output_path>
", subagent_type="qualia-researcher", description="Stack research")

Agent(prompt="
Read your role: @~/.claude/agents/researcher.md

<dimension>features</dimension>
<domain>{inferred domain}</domain>
<project_context>{PROJECT.md summary}</project_context>
<milestone_context>greenfield</milestone_context>
<output_path>.planning/research/FEATURES.md</output_path>
", subagent_type="qualia-researcher", description="Features research")

Agent(prompt="
Read your role: @~/.claude/agents/researcher.md

<dimension>architecture</dimension>
<domain>{inferred domain}</domain>
<project_context>{PROJECT.md summary}</project_context>
<milestone_context>greenfield</milestone_context>
<output_path>.planning/research/ARCHITECTURE.md</output_path>
", subagent_type="qualia-researcher", description="Architecture research")

Agent(prompt="
Read your role: @~/.claude/agents/researcher.md

<dimension>pitfalls</dimension>
<domain>{inferred domain}</domain>
<project_context>{PROJECT.md summary}</project_context>
<milestone_context>greenfield</milestone_context>
<output_path>.planning/research/PITFALLS.md</output_path>
", subagent_type="qualia-researcher", description="Pitfalls research")
```

**After all 4 complete, spawn synthesizer:**

```
Agent(prompt="
Read your role: @~/.claude/agents/research-synthesizer.md

Merge the 4 research files at .planning/research/ into .planning/research/SUMMARY.md.
Include roadmap implications.
", subagent_type="qualia-research-synthesizer", description="Synthesize research")
```

**Commit research:**
```bash
git add .planning/research/
git commit -m "docs: research synthesis (4 dimensions)"
```

**Show key findings:**
```bash
node ~/.claude/bin/qualia-ui.js ok "Research complete"
```
Display top 3 findings from SUMMARY.md (stack recommendation, table stakes, top pitfall).

### Step 9. Feature Scoping

Read `.planning/research/FEATURES.md` (if exists) and present the feature landscape:

For each category, use AskUserQuestion:

- header: "{Category name}"
- question: "Which {category} features are in v1?"
- multiSelect: true
- options:
  - Each feature from FEATURES.md with brief description
  - "None for v1" — defer entire category

Track:
- Selected → v1 requirements
- Unselected table stakes → v2 (users expect these)
- Unselected differentiators → out of scope

**If research was skipped:** Ask free text: "What are the main things users need to be able to do?" — then probe for specifics on each capability mentioned.

Gather any additional requirements the user wants that research missed.

### Step 10. Run Roadmapper

**Banner:**
```bash
node ~/.claude/bin/qualia-ui.js banner roadmap
```

Spawn the roadmapper agent:

```
Agent(prompt="
Read your role: @~/.claude/agents/roadmapper.md

<task>
Create REQUIREMENTS.md and ROADMAP.md for this project.

User-scoped v1 features:
{list of features selected in Step 9, grouped by category}

Template type: {template_type from config.json}
If template type is set, use ~/.claude/qualia-templates/projects/{type}.md as the phase structure starting point.

Write files immediately:
- .planning/REQUIREMENTS.md
- .planning/ROADMAP.md
- Update STATE.md via: node ~/.claude/bin/state.js init --project '{name}' --client '{client}' --type '{type}' --phases '<JSON>' --total_phases <N>
</task>
", subagent_type="qualia-roadmapper", description="Create roadmap")
```

### Step 11. Review Roadmap

Read the generated `ROADMAP.md`. Present it inline:

```
## Proposed Roadmap

**{N} phases** | **{X} requirements mapped** | All v1 requirements covered ✓

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|------------------|
| 1 | {name} | {goal} | {REQ-IDs} | {count} |
| 2 | {name} | {goal} | {REQ-IDs} | {count} |
...

### Phase 1: {Name}
Goal: {goal}
Requirements: {REQ-IDs}
Success criteria:
1. {criterion}
2. {criterion}
3. {criterion}

### Phase 2: {Name}
...
```

### Step 12. Approval Gate

- header: "Roadmap"
- question: "Does this roadmap work for you?"
- options:
  - "Approve" — Commit and continue
  - "Adjust phases" — Tell me what to change
  - "Review full file" — Show raw ROADMAP.md

**If "Adjust":**
- Get the user's feedback
- Re-spawn the roadmapper with revision context
- Show revised roadmap
- Loop until approved

**If "Review full file":** `cat .planning/ROADMAP.md`, then re-ask.

**If "Approve":**

```bash
git add .planning/REQUIREMENTS.md .planning/ROADMAP.md .planning/STATE.md
git commit -m "docs: requirements + roadmap ({N} phases)"
```

### Step 13. Environment Setup

Check what the project needs (from PROJECT.md stack + research):

- Supabase project? Guide through `supabase link` or create new
- Vercel project? Guide through `vercel link`
- Env vars? Create `.env.local` with placeholders

Only walk through what's needed. Skip if the user says "I'll handle env myself."

Commit:
```bash
git add .gitignore
git commit -m "chore: environment setup" 2>/dev/null
```

### Step 14. Done

```bash
node ~/.claude/bin/qualia-ui.js end "PROJECT READY" "/qualia-plan 1"
```

Show summary:

```
⬢ PROJECT INITIALIZED

| Artifact       | Location                    |
|----------------|-----------------------------|
| Project        | .planning/PROJECT.md        |
| Config         | .planning/config.json       |
| Requirements   | .planning/REQUIREMENTS.md   |
| Roadmap        | .planning/ROADMAP.md        |
| Design         | .planning/DESIGN.md         |
| Research       | .planning/research/         |
| State          | .planning/STATE.md          |

{N} phases | {X} requirements | Ready to build

▶ Next: /qualia-plan 1 — plan Phase 1: {phase 1 name}
```

## --quick Flag (Fast Path)

If invoked as `/qualia-new --quick`, run a 4-phase flat flow instead of the full comprehensive flow:

1. Banner + "What do you want to make?"
2. 4-step wizard (type / features / design / client)
3. Fixed 4 phases based on project type (Foundation / Core / Content / Polish)
4. Skip: research, REQUIREMENTS.md, plan-check
5. Still creates: PROJECT.md, ROADMAP.md (simplified), STATE.md, DESIGN.md
6. Route to `/qualia-plan 1`

Use `--quick` for: landing pages with 1-2 sections, throwaway prototypes, personal experiments.
Do NOT use `--quick` for: client projects, anything with compliance/regulatory stakes, anything longer than 1 week.

## Rules

1. **Questioning is not a checklist.** Follow the thread, don't follow a script.
2. **Research runs automatically** unless `depth: quick` in config. Don't ask the user every time.
3. **Approval gate is mandatory.** Never commit a roadmap the user hasn't seen.
4. **STATE.md updates go through state.js init.** Never edit STATE.md by hand — the statusline reads tracking.json which state.js writes atomically.
5. **Don't skip the research synthesizer.** Four research files without a synthesis = unread bloat.
6. **Inline skill invocation.** When Step 0.5 offers `/qualia-map`, INVOKE it inline — don't exit and tell the user to re-run.
