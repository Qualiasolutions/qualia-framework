#!/usr/bin/env node
// ~/.claude/hooks/migration-guard.js — catch dangerous SQL patterns in migrations.
// PreToolUse hook on Edit/Write tool calls. Reads tool input as JSON on stdin.
// Exits 2 to BLOCK. Exits 0 to allow.
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
const ti = input.tool_input || {};
const file = String(ti.file_path || "").replace(/\\/g, "/");
const content = String(ti.content || ti.new_string || "");

// Only inspect migration/SQL files
if (!/migration|migrate|\.sql$/i.test(file)) {
  process.exit(0);
}

const errors = [];

// DROP TABLE without IF EXISTS
if (/DROP\s+TABLE/i.test(content) && !/IF\s+EXISTS/i.test(content)) {
  errors.push("DROP TABLE without IF EXISTS");
}

// DELETE without WHERE
if (/DELETE\s+FROM/i.test(content) && !/WHERE/i.test(content)) {
  errors.push("DELETE FROM without WHERE clause");
}

// TRUNCATE (almost always wrong in migrations)
if (/TRUNCATE/i.test(content)) {
  errors.push("TRUNCATE detected — are you sure?");
}

// CREATE TABLE without RLS
if (/CREATE\s+TABLE/i.test(content) && !/ENABLE\s+ROW\s+LEVEL\s+SECURITY/i.test(content)) {
  errors.push("CREATE TABLE without ENABLE ROW LEVEL SECURITY");
}

if (errors.length > 0) {
  console.log("⬢ Migration guard — dangerous patterns found:");
  for (const e of errors) {
    console.log(`  ✗ ${e}`);
  }
  console.log("");
  console.log("Fix these before proceeding. If intentional, ask Fawzi to approve.");
  process.exit(2);
}

process.exit(0);
