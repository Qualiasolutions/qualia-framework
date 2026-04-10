#!/usr/bin/env node
// ~/.claude/hooks/pre-deploy-gate.js — quality gates before production deploy.
// PreToolUse hook on `vercel --prod*` commands. Runs tsc, lint, tests, build,
// then scans for service_role leaks in client code.
// Exits 1 to BLOCK deploy. Exits 0 to allow.
// Cross-platform (Windows/macOS/Linux). No `grep` or `find` — pure Node.

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

function runGate(label, cmd, args, { required = true } = {}) {
  const r = spawnSync(cmd, args, {
    stdio: "ignore",
    timeout: 180000,
    shell: process.platform === "win32",
  });
  if (r.status === 0) {
    console.log(`  ✓ ${label}`);
    return true;
  }
  if (required) {
    console.log(`BLOCKED: ${label} errors. Fix before deploying.`);
    process.exit(1);
  }
  return false;
}

function hasScript(name) {
  try {
    const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
    return pkg.scripts && typeof pkg.scripts[name] === "string";
  } catch {
    return false;
  }
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    if (e.name === "node_modules" || e.name.startsWith(".")) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      walk(full, out);
    } else if (/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(e.name)) {
      out.push(full);
    }
  }
  return out;
}

function scanServiceRoleLeaks() {
  const roots = ["app", "components", "src", "pages", "lib"];
  const leaks = [];
  for (const root of roots) {
    for (const file of walk(root)) {
      // Skip server-only files (convention: *.server.ts, server/ dirs)
      if (/\.server\.|[\\/]server[\\/]/.test(file)) continue;
      try {
        const content = fs.readFileSync(file, "utf8");
        if (/service_role/.test(content)) {
          leaks.push(file);
        }
      } catch {}
    }
  }
  return leaks;
}

console.log("⬢ Pre-deploy gate...");

// TypeScript
if (fs.existsSync("tsconfig.json")) {
  runGate("TypeScript", "npx", ["tsc", "--noEmit"]);
}

// Lint
if (hasScript("lint")) {
  runGate("Lint", "npm", ["run", "lint"]);
}

// Tests
if (hasScript("test")) {
  runGate("Tests", "npm", ["test"]);
}

// Build
if (hasScript("build")) {
  runGate("Build", "npm", ["run", "build"]);
}

// Security: no service_role in client code
const leaks = scanServiceRoleLeaks();
if (leaks.length > 0) {
  console.log("BLOCKED: service_role found in client code. Remove before deploying.");
  for (const f of leaks.slice(0, 10)) {
    console.log(`  ✗ ${f}`);
  }
  process.exit(1);
}
console.log("  ✓ Security");
console.log("⬢ All gates passed.");

process.exit(0);
