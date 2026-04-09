#!/bin/bash
# Qualia Framework v2 — Hook Tests (cross-platform Node.js hooks)
# Run: bash tests/hooks.test.sh

PASS=0
FAIL=0
# Resolve HOOKS_DIR to an ABSOLUTE path so `cd` inside subshells doesn't break it.
HOOKS_DIR="$(cd "$(dirname "$0")/../hooks" && pwd)"
NODE="${NODE:-node}"

assert_exit() {
  local name="$1" expected="$2" actual="$3"
  if [ "$expected" = "$actual" ]; then
    echo "  ✓ $name"
    PASS=$((PASS + 1))
  else
    echo "  ✗ $name (expected exit $expected, got $actual)"
    FAIL=$((FAIL + 1))
  fi
}

echo "=== Hook Tests (Node.js) ==="
echo ""

# --- All hooks are syntactically valid Node.js ---
echo "syntax:"
for f in "$HOOKS_DIR"/*.js; do
  if $NODE -c "$f" 2>/dev/null; then
    echo "  ✓ $(basename "$f")"
    PASS=$((PASS + 1))
  else
    echo "  ✗ $(basename "$f")"
    FAIL=$((FAIL + 1))
  fi
done

# --- block-env-edit.js ---
echo ""
echo "block-env-edit:"

echo '{"tool_input":{"file_path":".env.local"}}' | $NODE "$HOOKS_DIR/block-env-edit.js" > /dev/null 2>&1
assert_exit "blocks .env.local" 2 $?

echo '{"tool_input":{"file_path":".env.production"}}' | $NODE "$HOOKS_DIR/block-env-edit.js" > /dev/null 2>&1
assert_exit "blocks .env.production" 2 $?

echo '{"tool_input":{"file_path":".env"}}' | $NODE "$HOOKS_DIR/block-env-edit.js" > /dev/null 2>&1
assert_exit "blocks .env" 2 $?

# Windows-style path with backslashes (normalized by the hook)
echo '{"tool_input":{"file_path":"C:\\project\\.env.local"}}' | $NODE "$HOOKS_DIR/block-env-edit.js" > /dev/null 2>&1
assert_exit "blocks windows .env.local" 2 $?

echo '{"tool_input":{"file_path":"src/app.tsx"}}' | $NODE "$HOOKS_DIR/block-env-edit.js" > /dev/null 2>&1
assert_exit "allows src/app.tsx" 0 $?

echo '{"tool_input":{"file_path":"components/Footer.tsx"}}' | $NODE "$HOOKS_DIR/block-env-edit.js" > /dev/null 2>&1
assert_exit "allows components/Footer.tsx" 0 $?

# --- migration-guard.js ---
echo ""
echo "migration-guard:"

echo '{"tool_input":{"file_path":"migrations/001.sql","content":"DROP TABLE users;"}}' | $NODE "$HOOKS_DIR/migration-guard.js" > /dev/null 2>&1
assert_exit "blocks DROP TABLE without IF EXISTS" 2 $?

echo '{"tool_input":{"file_path":"migrations/001.sql","content":"DROP TABLE IF EXISTS old_users;"}}' | $NODE "$HOOKS_DIR/migration-guard.js" > /dev/null 2>&1
assert_exit "allows DROP TABLE IF EXISTS" 0 $?

echo '{"tool_input":{"file_path":"migrations/002.sql","content":"DELETE FROM users;"}}' | $NODE "$HOOKS_DIR/migration-guard.js" > /dev/null 2>&1
assert_exit "blocks DELETE without WHERE" 2 $?

echo '{"tool_input":{"file_path":"migrations/003.sql","content":"TRUNCATE TABLE sessions;"}}' | $NODE "$HOOKS_DIR/migration-guard.js" > /dev/null 2>&1
assert_exit "blocks TRUNCATE" 2 $?

echo '{"tool_input":{"file_path":"migrations/004.sql","content":"CREATE TABLE users (id uuid);"}}' | $NODE "$HOOKS_DIR/migration-guard.js" > /dev/null 2>&1
assert_exit "blocks CREATE TABLE without RLS" 2 $?

echo '{"tool_input":{"file_path":"migrations/005.sql","content":"ALTER TABLE users ADD COLUMN email text;"}}' | $NODE "$HOOKS_DIR/migration-guard.js" > /dev/null 2>&1
assert_exit "allows safe ALTER TABLE" 0 $?

echo '{"tool_input":{"file_path":"src/app.tsx","content":"DROP TABLE users;"}}' | $NODE "$HOOKS_DIR/migration-guard.js" > /dev/null 2>&1
assert_exit "skips non-migration files" 0 $?

# --- branch-guard.js (grep-based — full run needs git + real config) ---
echo ""
echo "branch-guard:"

if grep -q '.qualia-config.json' "$HOOKS_DIR/branch-guard.js"; then
  echo "  ✓ reads role from .qualia-config.json"
  PASS=$((PASS + 1))
else
  echo "  ✗ not reading from .qualia-config.json"
  FAIL=$((FAIL + 1))
fi

if grep -q 'branch --show-current' "$HOOKS_DIR/branch-guard.js"; then
  echo "  ✓ checks current git branch"
  PASS=$((PASS + 1))
else
  echo "  ✗ missing branch check"
  FAIL=$((FAIL + 1))
fi

if grep -q 'OWNER' "$HOOKS_DIR/branch-guard.js"; then
  echo "  ✓ enforces OWNER role"
  PASS=$((PASS + 1))
else
  echo "  ✗ missing OWNER check"
  FAIL=$((FAIL + 1))
fi

# --- pre-push.js ---
echo ""
echo "pre-push:"

if grep -q 'tracking.json' "$HOOKS_DIR/pre-push.js"; then
  echo "  ✓ updates tracking.json"
  PASS=$((PASS + 1))
else
  echo "  ✗ missing tracking.json update"
  FAIL=$((FAIL + 1))
fi

if grep -q 'last_commit' "$HOOKS_DIR/pre-push.js"; then
  echo "  ✓ stamps last_commit"
  PASS=$((PASS + 1))
else
  echo "  ✗ missing last_commit stamp"
  FAIL=$((FAIL + 1))
fi

# Run pre-push.js in a dir with no tracking.json — must exit 0 cleanly
TMP=$(mktemp -d)
(cd "$TMP" && $NODE "$HOOKS_DIR/pre-push.js" >/dev/null 2>&1)
assert_exit "exits 0 with no tracking.json" 0 $?
rm -rf "$TMP"

# --- pre-deploy-gate.js ---
echo ""
echo "pre-deploy-gate:"

if grep -q 'tsc' "$HOOKS_DIR/pre-deploy-gate.js"; then
  echo "  ✓ runs TypeScript check"
  PASS=$((PASS + 1))
else
  echo "  ✗ missing TypeScript check"
  FAIL=$((FAIL + 1))
fi

if grep -q 'service_role' "$HOOKS_DIR/pre-deploy-gate.js"; then
  echo "  ✓ checks for service_role leaks"
  PASS=$((PASS + 1))
else
  echo "  ✗ missing service_role check"
  FAIL=$((FAIL + 1))
fi

# --- session-start.js — must exit 0 always ---
echo ""
echo "session-start:"

TMP=$(mktemp -d)
(cd "$TMP" && $NODE "$HOOKS_DIR/session-start.js" >/dev/null 2>&1)
assert_exit "exits 0 with no project" 0 $?

# Simulate a project with STATE.md
mkdir -p "$TMP/.planning"
cat > "$TMP/.planning/STATE.md" <<'EOF'
# Project State
Phase: 1 of 3 — Foundation
Status: setup
EOF
(cd "$TMP" && $NODE "$HOOKS_DIR/session-start.js" >/dev/null 2>&1)
assert_exit "exits 0 with STATE.md" 0 $?
rm -rf "$TMP"

# --- pre-compact.js ---
echo ""
echo "pre-compact:"

TMP=$(mktemp -d)
(cd "$TMP" && $NODE "$HOOKS_DIR/pre-compact.js" >/dev/null 2>&1)
assert_exit "exits 0 with no STATE.md" 0 $?
rm -rf "$TMP"

# --- auto-update.js ---
echo ""
echo "auto-update:"

TMP=$(mktemp -d)
mkdir -p "$TMP/.claude"
echo '{"code":"QS-FAWZI-01","version":"99.99.99"}' > "$TMP/.claude/.qualia-config.json"
HOME="$TMP" $NODE "$HOOKS_DIR/auto-update.js" >/dev/null 2>&1
assert_exit "exits 0 (fast path)" 0 $?
# Should now have cache file
if [ -f "$TMP/.claude/.qualia-last-update-check" ]; then
  echo "  ✓ writes cache timestamp"
  PASS=$((PASS + 1))
else
  echo "  ✗ missing cache timestamp"
  FAIL=$((FAIL + 1))
fi
rm -rf "$TMP"

echo ""
echo "=== Results: $PASS passed, $FAIL failed ==="
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
