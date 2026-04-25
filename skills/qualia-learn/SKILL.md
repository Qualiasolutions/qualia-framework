---
name: qualia-learn
description: "Save a learning, pattern, fix, or client preference to the knowledge base. Persists across projects and sessions. Trigger on 'remember this', 'save this pattern', 'learned something', 'note for future', 'client prefers', 'qualia-learn'."
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
---

# /qualia-learn — Save Knowledge

Persist learnings across projects and sessions. Saved to `~/.claude/knowledge/`.

## Usage

- `/qualia-learn` — Interactively save a learning
- `/qualia-learn {description}` — Save directly

## Knowledge Types

### Patterns (`learned-patterns.md`)
Recurring approaches that work (or don't). Architecture decisions, library choices, prompt patterns.

**Example:** "Supabase RLS policies need to be added in the same migration as the table — adding them later causes a window where data is unprotected."

### Fixes (`common-fixes.md`)
Problems you've solved before. Error messages and their solutions.

**Example:** "`next/font` crash on Vercel: caused by importing font in a client component that's also used server-side. Fix: move font import to layout.tsx."

### Client Prefs (`client-prefs.md`)
Client-specific preferences, design choices, requirements.

**Example:** "Acme Corp: prefers dark mode, hates rounded corners, logo must be SVG not PNG, primary color #FF6B00."

## Process

```bash
node ~/.claude/bin/qualia-ui.js banner learn
```

### 1. Classify

If description given, classify automatically. Otherwise ask:

```
What did you learn?
1. Pattern — approach that works (or doesn't)
2. Fix — problem and its solution
3. Client preference — client-specific requirement
```

### 2. Check for Duplicates

Before saving, search the existing knowledge for a similar entry. Use the
unified loader, **never** raw `cat` or `grep` directly — the loader handles
missing-file edge cases and stays consistent across skills.

```bash
node ~/.claude/bin/knowledge.js search "{title keywords}"
```

If a near-match exists:
- Show the existing entry to the user
- Ask: "A similar entry exists. Update it, create a new one, or skip?"
- If update: edit the file directly (find the entry by `**ID:**` line). If
  new: continue to step 3. If skip: done.

### 3. Append the Entry

The loader's `append` subcommand handles ID generation, ISO date, project
detection, and the canonical entry format — one call, no shell escaping
concerns:

```bash
node ~/.claude/bin/knowledge.js append \
  --type {pattern|fix|client} \
  --title "{Title}" \
  --body "{The learning — be specific enough that future-you understands without context}" \
  --project "{current project name or 'general'}" \
  --context "{brief context — what you were building when you learned this}"
```

Type → file mapping (handled by the loader):
- `pattern` → `learned-patterns.md`
- `fix`     → `common-fixes.md`
- `client`  → `client-prefs.md`

The loader prints `appended {id} to {file}` on success. If the destination
file does not exist, the loader creates it with a header — you do not need
to bootstrap it.

### 4. Confirm

```
⬢ Saved to {file}
  "{title}"
```

## Reading Knowledge

**Always use the loader.** Hardcoded `cat ~/.claude/knowledge/X.md` is an
anti-pattern — it makes new files invisible (this was v4.1.0 audit finding
#3). The loader, by contrast, lets agents discover available knowledge via
the index.

```bash
# Print the index (entry point — read this first)
node ~/.claude/bin/knowledge.js

# Print a specific file (accepts aliases: patterns, fixes, client)
node ~/.claude/bin/knowledge.js load patterns
node ~/.claude/bin/knowledge.js load common-fixes.md

# List everything available
node ~/.claude/bin/knowledge.js list

# Search across all files
node ~/.claude/bin/knowledge.js search "RLS"
```

The `/qualia-debug` skill should check `common-fixes.md` (`load fixes`) before
investigating. The `/qualia-new` skill should check `client-prefs.md`
(`load client`) when setting up client projects. The `/qualia-plan` skill
should check `learned-patterns.md` (`load patterns`) when planning phases.
