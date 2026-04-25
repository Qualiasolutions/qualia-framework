# Knowledge Index

Entry point for `~/.claude/knowledge/`. When answering a question, **read this
file first**, then jump to the specific file(s) that match.

> Auto-maintained by `/qualia-learn`. Do not hand-edit unless the file is out
> of sync (e.g. after a manual move). Last manual edit: framework install.

## What's where

| If the user asks about… | Read… |
|--------------------------|-------|
| "How do we usually X?" / patterns we've used before | `learned-patterns.md` |
| Recurring bug + fix recipes | `common-fixes.md` |
| Supabase auth, RLS, migrations, edge functions | `supabase-patterns.md` |
| Retell, ElevenLabs, voice agent flows | `voice-agent-patterns.md` |
| Where a project is deployed, env vars, domains | `deployment-map.md` |
| Who is on the team, their role, their access | `employees.md` |
| What I worked on yesterday / last week | `daily-log/YYYY-MM-DD.md` |
| Memory layer architecture itself | `agents.md` |

## Daily log conventions

`daily-log/YYYY-MM-DD.md` is raw, mechanical, and append-only. Each line is a
single Stop-hook checkpoint with project, branch, phase, task counts, commit
count, and up to 3 touched files. **Do not promote daily-log content into the
curated tier by hand** — the upcoming `bin/knowledge-flush.js` will do that
deliberately. Hand-promoted entries break the source-of-truth invariant.

## Adding new knowledge

Use `/qualia-learn` with the type that matches:

- `pattern` → `learned-patterns.md`
- `fix` → `common-fixes.md`
- `client preference` → the relevant project's `.planning/`, **not** this
  directory
- `team member info` → `employees.md`

If a new top-level file is needed (e.g. a new technology stack), update this
index in the same commit.

## Empty / new-install state

If a tier file does not exist yet, that means we have not learned anything in
that domain yet. Don't pretend we have. Either say "no entries" or, if the
user is asking you to learn it now, run `/qualia-learn`.
