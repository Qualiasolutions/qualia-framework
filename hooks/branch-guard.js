#!/usr/bin/env node
// ~/.claude/hooks/branch-guard.js — block non-OWNER push to main/master.
// PreToolUse hook on `git push*` commands. Reads role from
// ~/.claude/.qualia-config.json (single source of truth).
// Exits 2 to BLOCK (Claude Code hook protocol). Exits 0 to allow.
// Cross-platform (Windows/macOS/Linux).

const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawnSync } = require("child_process");

const _traceStart = Date.now();

const CONFIG = path.join(os.homedir(), ".claude", ".qualia-config.json");

function _trace(hookName, result, extra) {
  try {
    const traceDir = path.join(os.homedir(), ".claude", ".qualia-traces");
    if (!fs.existsSync(traceDir)) fs.mkdirSync(traceDir, { recursive: true });
    const entry = {
      hook: hookName,
      result,
      timestamp: new Date().toISOString(),
      duration_ms: Date.now() - _traceStart,
      ...extra,
    };
    const file = path.join(traceDir, `${new Date().toISOString().split("T")[0]}.jsonl`);
    fs.appendFileSync(file, JSON.stringify(entry) + "\n");
  } catch {}
}

function fail(msg, extraLines) {
  // Claude Code surfaces stderr in hook block reasons — write there primarily.
  // Also mirror to stdout so downstream tooling that scrapes stdout still sees it.
  console.error(msg);
  console.log(msg);
  if (Array.isArray(extraLines)) {
    for (const line of extraLines) {
      console.error(line);
      console.log(line);
    }
  }
  _trace("branch-guard", "block", { reason: msg });
  process.exit(2);
}

let role = "";
try {
  const cfg = JSON.parse(fs.readFileSync(CONFIG, "utf8"));
  role = cfg.role || "";
} catch {
  fail(`BLOCKED: ${CONFIG} missing or unreadable. Run: npx qualia-framework install`);
}

if (!role) {
  fail(`BLOCKED: Cannot determine role from ${CONFIG}. Defaulting to deny.`);
}

// Read Claude Code hook payload from stdin (if any). Contains tool_input.command
// with the actual `git push ...` invocation. Parsing this lets us catch refspec
// bypasses like `git push origin feature/x:main` that --show-current would miss.
let pushCommand = "";
try {
  const raw = fs.readFileSync(0, "utf8");
  if (raw && raw.trim()) {
    const payload = JSON.parse(raw);
    pushCommand = (payload && payload.tool_input && payload.tool_input.command) || "";
  }
} catch {
  // No stdin or non-JSON stdin — fall through to branch check.
}

// Tokenize the push command and detect refspecs targeting main/master.
// Refspec forms: <src>:<dst>, :<dst> (delete), +<src>:<dst> (force).
// We only flag explicit <src>:<dst> refspecs here; bare branch pushes
// (e.g. `git push origin main` from a non-main branch) are uncommon and
// handled by the --show-current fallback below when applicable.
function refspecTargetsProtected(cmd) {
  if (!cmd || typeof cmd !== "string") return null;
  const tokens = cmd.split(/\s+/).filter(Boolean);
  const pushIdx = tokens.indexOf("push");
  if (pushIdx === -1) return null;

  for (let i = pushIdx + 1; i < tokens.length; i++) {
    let tok = tokens[i];
    if (tok.startsWith("-")) continue;
    if (tok.startsWith("+")) tok = tok.slice(1);
    tok = tok.replace(/^['"]|['"]$/g, "");

    if (tok.includes(":")) {
      const parts = tok.split(":");
      const dst = parts[parts.length - 1].replace(/^refs\/heads\//, "");
      if (dst === "main" || dst === "master") return dst;
    }
  }
  return null;
}

const refspecTarget = refspecTargetsProtected(pushCommand);
if (refspecTarget && role !== "OWNER") {
  fail(
    `BLOCKED: Employees cannot push to ${refspecTarget}. Create a feature branch first.`,
    ["Run: git checkout -b feature/your-feature-name"]
  );
}

// Ask git for the current branch --show-current. Works identically on Windows/macOS/Linux.
const r = spawnSync("git", ["branch", "--show-current"], {
  encoding: "utf8",
  timeout: 3000,
  shell: process.platform === "win32",
});
const branch = ((r.stdout || "").trim());

if (branch === "main" || branch === "master") {
  if (role !== "OWNER") {
    fail(
      `BLOCKED: Employees cannot push to ${branch}. Create a feature branch first.`,
      ["Run: git checkout -b feature/your-feature-name"]
    );
  }
}

_trace("branch-guard", "allow");
process.exit(0);
