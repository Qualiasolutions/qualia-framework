#!/usr/bin/env node
// ~/.claude/hooks/pre-compact.js — commit STATE.md before context compaction.
// PreCompact hook. Silent on failure — context compaction must never be blocked.
// Cross-platform (Windows/macOS/Linux).

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const _traceStart = Date.now();

const STATE_FILE = path.join(".planning", "STATE.md");

let _commitStatus = null;
let _commitReason = "no-state-file";

try {
  if (fs.existsSync(STATE_FILE)) {
    console.log("QUALIA: Saving state before compaction...");
    _commitReason = "state-clean";
    // Check if STATE.md has uncommitted changes
    const diff = spawnSync("git", ["diff", "--name-only", STATE_FILE], {
      encoding: "utf8",
      timeout: 3000,
      shell: process.platform === "win32",
    });
    if ((diff.stdout || "").includes("STATE.md")) {
      const addRes = spawnSync("git", ["add", STATE_FILE], {
        timeout: 3000,
        shell: process.platform === "win32",
      });
      // Bypass user pre-commit hooks and commit signing so the auto-save
      // never fails silently and STATE.md is always persisted before
      // context compaction. Attribute to the framework bot, not the user.
      const commitRes = spawnSync("git", [
        "commit",
        "--no-verify",
        "--no-gpg-sign",
        "--author=Qualia Framework <bot@qualia.solutions>",
        "-m", "state: pre-compaction save",
      ], {
        timeout: 5000,
        stdio: ["ignore", "ignore", "pipe"],
        encoding: "utf8",
        shell: process.platform === "win32",
      });
      _commitStatus = commitRes.status;
      _commitReason = addRes.status === 0 && commitRes.status === 0
        ? "committed"
        : "commit-failed";
    }
  }
} catch {
  // Silent — never block compaction
  _commitReason = "exception";
}

function _trace(hookName, result, extra) {
  try {
    const os = require("os");
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

_trace("pre-compact", "allow", { commit_status: _commitStatus, commit_reason: _commitReason });
process.exit(0);
