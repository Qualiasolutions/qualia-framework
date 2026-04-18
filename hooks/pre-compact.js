#!/usr/bin/env node
// ~/.claude/hooks/pre-compact.js — commit STATE.md before context compaction.
// PreCompact hook. Silent on failure — context compaction must never be blocked.
// Cross-platform (Windows/macOS/Linux).
//
// BY DEFAULT this commit uses --no-verify + --no-gpg-sign. The auto-save is a
// framework bot commit, and pre-commit hooks that run full test suites would
// routinely fail (context compaction happens at any moment) and lose the
// STATE.md snapshot. But compliance-sensitive projects can opt into strict
// mode via ~/.claude/.qualia-config.json:
//
//   {
//     "pre_compact": {
//       "respect_user_hooks": true,
//       "respect_gpg_signing": true
//     }
//   }
//
// When either is true, the corresponding --no-* flag is dropped.

const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawnSync } = require("child_process");

const _traceStart = Date.now();

const STATE_FILE = path.join(".planning", "STATE.md");
const CONFIG_FILE = path.join(os.homedir(), ".claude", ".qualia-config.json");

function readCompactConfig() {
  try {
    const cfg = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
    return cfg.pre_compact || {};
  } catch {
    return {};
  }
}

let _commitStatus = null;
let _commitReason = "no-state-file";
let _commitFlags = null;

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
      const cfg = readCompactConfig();
      const commitArgs = ["commit"];
      if (!cfg.respect_user_hooks) commitArgs.push("--no-verify");
      if (!cfg.respect_gpg_signing) commitArgs.push("--no-gpg-sign");
      commitArgs.push("--author=Qualia Framework <bot@qualia.solutions>");
      commitArgs.push("-m", "state: pre-compaction save");
      _commitFlags = {
        no_verify: !cfg.respect_user_hooks,
        no_gpg_sign: !cfg.respect_gpg_signing,
      };
      const commitRes = spawnSync("git", commitArgs, {
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

_trace("pre-compact", "allow", { commit_status: _commitStatus, commit_reason: _commitReason, commit_flags: _commitFlags });
process.exit(0);
