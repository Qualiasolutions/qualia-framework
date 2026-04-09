#!/usr/bin/env node
// ~/.claude/hooks/pre-push.js — update tracking.json with last commit + timestamp.
// PreToolUse hook on `git push*` commands. state.js handles phase/status sync;
// this just stamps the file so the ERP sees fresh commit info on every push.
// Cross-platform (Windows/macOS/Linux).

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const TRACKING = path.join(".planning", "tracking.json");

try {
  if (fs.existsSync(TRACKING)) {
    const r = spawnSync("git", ["log", "--oneline", "-1", "--format=%h"], {
      encoding: "utf8",
      timeout: 3000,
    });
    const lastCommit = ((r.stdout || "").trim());
    const now = new Date().toISOString().replace(/\.\d+Z$/, "Z");

    const t = JSON.parse(fs.readFileSync(TRACKING, "utf8"));
    if (lastCommit) t.last_commit = lastCommit;
    t.last_updated = now;
    fs.writeFileSync(TRACKING, JSON.stringify(t, null, 2) + "\n");

    spawnSync("git", ["add", TRACKING], { timeout: 3000 });
  }
} catch (err) {
  process.stderr.write(`WARNING: tracking sync failed: ${err.message}\n`);
}

process.exit(0);
