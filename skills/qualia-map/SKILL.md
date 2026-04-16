---
name: qualia-map
description: "Map an existing codebase to infer architecture, stack, conventions, and what's already built. For brownfield projects — run BEFORE /qualia-new so Validated requirements get inferred from existing code."
---

# /qualia-map — Codebase Mapping (Brownfield)

Scans an existing repo and produces `.planning/codebase/` — architecture, stack, conventions, concerns. Used by `/qualia-new` to infer what's already built and seed Validated requirements.

## When to Use

- Taking over an existing client project
- Adding features to a repo you didn't build
- Before `/qualia-new` on any directory that already has code

## Usage

`/qualia-map` — scan the current working directory

## Process

### 1. Check for Existing Code

```bash
ls -la 2>/dev/null
test -f package.json && echo "HAS_PACKAGE"
test -d .git && echo "HAS_GIT"
test -d .planning/codebase && echo "ALREADY_MAPPED"
```

If `ALREADY_MAPPED`, ask:
- header: "Re-map?"
- question: "Codebase already mapped. Re-scan?"
- options:
  - "Re-scan" — overwrite existing map
  - "Skip" — use existing map

### 2. Banner

```bash
node ~/.claude/bin/qualia-ui.js banner map
```

### 3. Spawn Parallel Mapper Agents

Map 4 dimensions in parallel for speed. Each writes one file in `.planning/codebase/`:

```
Agent 1: Architecture scanner
  Agent(prompt="
  Scan the current codebase and produce .planning/codebase/architecture.md.
  Identify: entry points, folder structure, module boundaries, data flow.
  Focus on WHAT the codebase does, not HOW to fix it.
  ", subagent_type="general-purpose", description="Architecture scan")

Agent 2: Stack detector
  Agent(prompt="
  Detect the tech stack. Read package.json, requirements.txt, Gemfile, etc.
  Produce .planning/codebase/stack.md listing: runtime, framework, key libraries,
  database, hosting, CI. Include version numbers.
  ", subagent_type="general-purpose", description="Stack detection")

Agent 3: Conventions analyzer
  Agent(prompt="
  Analyze code style and conventions. Sample 10-15 files across the codebase.
  Produce .planning/codebase/conventions.md listing: naming, component patterns,
  file organization, import style, test style, commit message format.
  ", subagent_type="general-purpose", description="Conventions analysis")

Agent 4: Concerns scanner
  Agent(prompt="
  Scan for code quality concerns — NOT to fix, just to document.
  Look for: TODO/FIXME, deprecated APIs, outdated dependencies, missing tests,
  security smells (hardcoded secrets, no input validation).
  Produce .planning/codebase/concerns.md.
  ", subagent_type="general-purpose", description="Concerns scan")
```

### 4. Wait for All 4

After all 4 agents complete, read the 4 output files.

### 5. Synthesize

Create `.planning/codebase/README.md` — one-page summary linking to the 4 dimension files.

```markdown
# Codebase Map

**Scanned:** {date}
**Repo:** {name}
**LOC:** {lines of code from wc -l}

## At a Glance

- **Stack:** {from stack.md — one line}
- **Architecture:** {from architecture.md — one sentence}
- **Conventions:** {from conventions.md — one sentence}
- **Concerns:** {count of concerns found}

## Validated Capabilities (Inferred)

Based on existing code, this project already does:
- {capability 1} (evidence: {file path})
- {capability 2} (evidence: {file path})
- {capability 3} (evidence: {file path})

These become **Validated requirements** in PROJECT.md when `/qualia-new` runs.

## Dimension Details

- [Architecture](./architecture.md)
- [Stack](./stack.md)
- [Conventions](./conventions.md)
- [Concerns](./concerns.md)
```

### 6. Commit

```bash
git add .planning/codebase/
git commit -m "docs: map existing codebase"
```

### 7. Route

```bash
node ~/.claude/bin/qualia-ui.js end "CODEBASE MAPPED" "/qualia-new"
```

## What `/qualia-new` Does With This

When `/qualia-new` runs AFTER `/qualia-map`, it:
1. Reads `.planning/codebase/README.md`
2. Extracts Validated capabilities
3. Pre-populates PROJECT.md with Validated requirements section
4. Skips questions about things already built
5. Focuses questioning on NEW capabilities being added

## Rules

1. **Non-destructive.** This skill only READS code, never modifies it.
2. **Four parallel agents.** Don't sequential-scan — parallel is ~4x faster.
3. **Dimension files are structured.** The orchestrator downstream (`/qualia-new`) reads them programmatically.
4. **Concerns ≠ fixes.** This skill documents concerns. It does NOT fix them. Use `/qualia-optimize` for that.
