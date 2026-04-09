#!/usr/bin/env node
// ~/.claude/hooks/block-env-edit.js — prevent editing .env files.
// PreToolUse hook on Edit/Write tool calls. Reads tool input as JSON on stdin.
// Exits 2 to BLOCK the tool call. Exits 0 to allow it.
// Cross-platform (Windows/macOS/Linux).

const fs = require("fs");

function readInput() {
  try {
    const raw = fs.readFileSync(0, "utf8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

const input = readInput();
const file = (input.tool_input && (input.tool_input.file_path || input.tool_input.command)) || "";

// Match .env, .env.local, .env.production, .env.*, etc.
// Normalize separators so Windows paths (C:\project\.env.local) also match.
const normalized = String(file).replace(/\\/g, "/");

if (/\.env(\.|$)/.test(normalized)) {
  console.log("BLOCKED: Cannot edit environment files. Ask Fawzi to update secrets.");
  process.exit(2);
}

process.exit(0);
