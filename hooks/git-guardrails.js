#!/usr/bin/env node
// ~/.claude/hooks/git-guardrails.js — block destructive git commands.
//
// PreToolUse hook on `Bash`. Reads the proposed command from the Claude Code
// hook payload (stdin JSON: tool_input.command) and exits 2 to BLOCK, 0 to
// allow. Cross-platform (Windows/macOS/Linux), zero shell dependencies.
//
// Patterns blocked unconditionally:
//   • git push --force / -f to main or master (use --force-with-lease instead)
//   • git push --force / -f from current branch when current branch is main
//   • git reset --hard <anything> when on main/master (would discard uncommitted)
//   • git clean -fd / -fdx (no recovery — irreversible)
//   • git branch -D main / master (destroys the branch)
//   • rm -rf .git (nukes repo history)
//
// Escape hatch:
//   QUALIA_ALLOW_DESTRUCTIVE=1 in env → all checks pass through (use sparingly,
//   document the reason in your commit message).
//
// This hook complements branch-guard.js, which blocks NORMAL pushes by EMPLOYEE
// to main. git-guardrails.js applies to EVERYONE (OWNER too) for irreversible
// operations — guardrails, not permissions.

const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawnSync } = require("child_process");

const _traceStart = Date.now();

function _trace(result, extra) {
  try {
    const traceDir = path.join(os.homedir(), ".claude", ".qualia-traces");
    if (!fs.existsSync(traceDir)) fs.mkdirSync(traceDir, { recursive: true });
    const entry = {
      hook: "git-guardrails",
      result,
      timestamp: new Date().toISOString(),
      duration_ms: Date.now() - _traceStart,
      ...extra,
    };
    const file = path.join(traceDir, `${new Date().toISOString().split("T")[0]}.jsonl`);
    fs.appendFileSync(file, JSON.stringify(entry) + "\n");
  } catch {}
}

function block(reason, suggestion) {
  const lines = [
    `BLOCKED: ${reason}`,
    suggestion ? `Suggestion: ${suggestion}` : null,
    `Override (use sparingly): QUALIA_ALLOW_DESTRUCTIVE=1`,
  ].filter(Boolean);
  for (const l of lines) {
    console.error(l);
    console.log(l);
  }
  _trace("block", { reason });
  process.exit(2);
}

// Honor escape hatch first — keeps tests and emergency overrides cheap.
if (process.env.QUALIA_ALLOW_DESTRUCTIVE === "1") {
  _trace("allow", { reason: "QUALIA_ALLOW_DESTRUCTIVE=1" });
  process.exit(0);
}

// Read hook payload from stdin (Claude Code passes JSON; if no stdin, allow).
let payload = "";
try {
  if (!process.stdin.isTTY) payload = fs.readFileSync(0, "utf8");
} catch {}

let command = "";
try {
  if (payload) command = (JSON.parse(payload).tool_input || {}).command || "";
} catch {}

if (!command) {
  _trace("allow", { reason: "no-command" });
  process.exit(0);
}

// Normalize for matching: collapse whitespace, lowercase the flags.
// We deliberately match on substrings — chained commands (`x && y`) and
// quoted arguments still get scanned for the dangerous primitive.
const cmd = command.replace(/\s+/g, " ").trim();

// Helper: detect current git branch (silent on failure).
function currentBranch() {
  try {
    const r = spawnSync("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
      encoding: "utf8",
      timeout: 2000,
      shell: process.platform === "win32",
    });
    return (r.stdout || "").trim();
  } catch {
    return "";
  }
}

// ── Rule 1: nuking .git ───────────────────────────────────
if (/\brm\s+(-[a-z]*r[a-z]*f|-[a-z]*f[a-z]*r)\b[^|;&]*\.git(\b|$|\/)/.test(cmd)) {
  block(
    "rm -rf .git would destroy all repository history",
    "If you really need to reinitialize, do it deliberately — back up first",
  );
}

// ── Rule 2: git clean -fd / -fdx ──────────────────────────
// `git clean -fd` deletes untracked files and directories with no recovery.
// We block this because the recovery cost is high and the agent rarely needs
// it — `git stash` or moving the file is almost always the right answer.
if (/\bgit\s+clean\s+(-[a-zA-Z]*f[a-zA-Z]*d|-[a-zA-Z]*d[a-zA-Z]*f)/.test(cmd)) {
  block(
    "git clean -fd permanently deletes untracked files",
    "Use `git stash --include-untracked` if you need a clean tree but might want the files later",
  );
}

// ── Rule 3: git branch -D main / master ───────────────────
if (/\bgit\s+branch\s+-D\s+(main|master)\b/.test(cmd)) {
  block(
    "deleting main/master branch is destructive",
    "If this is intentional, run it manually outside Claude with QUALIA_ALLOW_DESTRUCTIVE=1",
  );
}

// ── Rule 4: git push --force to main / master ─────────────
// Match `git push ... --force ... main` or `git push ... -f ... main` (and
// master). Excludes --force-with-lease which is the safe variant.
const isPush = /\bgit\s+push\b/.test(cmd);
const hasForce =
  /\s(--force|-f)(\s|$)/.test(" " + cmd + " ") &&
  !/--force-with-lease/.test(cmd);

if (isPush && hasForce) {
  // Targets main/master explicitly: `git push origin main`, `git push --force origin main`
  if (/\b(main|master)\b/.test(cmd)) {
    block(
      "force-pushing to main/master rewrites shared history",
      "Use `git push --force-with-lease origin <branch>` on a feature branch instead",
    );
  }
  // Or pushing the current branch when on main
  const branch = currentBranch();
  if (branch === "main" || branch === "master") {
    block(
      `force-pushing while on ${branch} (rewrites shared history)`,
      "Switch to a feature branch first: `git checkout -b feat/<name>`",
    );
  }
}

// ── Rule 5: git reset --hard while on main / master ───────
if (/\bgit\s+reset\s+--hard\b/.test(cmd)) {
  const branch = currentBranch();
  if (branch === "main" || branch === "master") {
    block(
      `git reset --hard while on ${branch} discards uncommitted work and rewrites local history`,
      "Switch to a feature branch first, or use `git stash` to preserve work",
    );
  }
}

_trace("allow", {});
process.exit(0);
