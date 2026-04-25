# Memory Layer — How This Works

You are operating inside the **Qualia Framework memory layer**. This file
describes the system you're in so you can navigate it deliberately. Read this
once at session start.

## What's here

`~/.claude/knowledge/` is the project-spanning memory tier. It holds three
kinds of files, each with a clear purpose. Treat the structure as a contract.

```
~/.claude/knowledge/
├── agents.md              ← this file (system overview)
├── index.md               ← entry point — start here when answering questions
├── daily-log/
│   └── YYYY-MM-DD.md      ← raw session checkpoints (auto-written by Stop hook)
├── concepts/              ← (future) promoted, durable patterns
├── connections/           ← (future) cross-references between concepts
├── learned-patterns.md    ← curated patterns from /qualia-learn
├── common-fixes.md        ← recurring fix recipes
├── supabase-patterns.md   ← Supabase-specific patterns
├── voice-agent-patterns.md
├── deployment-map.md
└── employees.md           ← team roster
```

## How to use it

**To answer a question that might be in memory:**
1. Read `index.md` first. It tells you which file is likely to have what you
   need. Do **not** scan every file — that defeats the index.
2. Follow the index to one or two specific files. Read those.
3. If the answer is not there, say so and (when the user agrees) add it via
   `/qualia-learn`.

**To remember something new:**
- Use `/qualia-learn`. It writes to the right tier (pattern vs. fix vs.
  client preference) and updates the index.
- Do not write to these files directly without an explicit user instruction —
  the index will fall out of sync.

**Do not pretend something is in memory if it is not.** Better to say
"INSUFFICIENT EVIDENCE: searched index.md and learned-patterns.md, no entry
matches" than to hallucinate a recalled pattern. The grounding protocol
(`~/.claude/rules/grounding.md`) applies here too.

## Tiers

The memory layer follows a Karpathy-style **raw → wiki** progression. Most of
this is still being built — v4.2.0 ships the daily-log raw tier; v4.3.0 will
add the LLM-driven flush job that promotes raw entries into concepts and
connections.

| Tier | Files | How it's written | When to read |
|------|-------|------------------|--------------|
| Raw | `daily-log/*.md` | Stop hook (auto, mechanical) | Resuming a recent session, debugging a regression |
| Curated | `learned-patterns.md`, `common-fixes.md`, `*-patterns.md` | `/qualia-learn` (manual, deliberate) | Answering "how do we usually do X?" |
| Index | `index.md` | `/qualia-learn` updates it; auto-rebuilt by `bin/knowledge.js` | Always read first |

## Cross-cutting rules

- **Stale data is dangerous.** If a memory file has not been touched in
  months and the codebase has changed, the memory may be lying. Verify
  current state in the actual files before recommending anything based on
  memory.
- **Project memory ≠ global memory.** Project-specific decisions belong in
  that project's `.planning/` directory, not here. This directory is for
  patterns that apply across multiple projects.
- **Never put secrets here.** API keys, tokens, passwords — never. The
  knowledge layer is plain markdown checked into a non-encrypted directory.
