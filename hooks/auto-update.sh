#!/bin/bash
# Qualia auto-update — checks once per day, updates silently in background
# Runs as PreToolUse hook. Cached so it's a no-op most of the time.

CLAUDE_DIR="$HOME/.claude"
CACHE_FILE="$CLAUDE_DIR/.qualia-last-update-check"
CONFIG_FILE="$CLAUDE_DIR/.qualia-config.json"
LOCK_FILE="$CLAUDE_DIR/.qualia-updating"
MAX_AGE=86400  # 24 hours in seconds

# Exit fast if recently checked (most common path — single stat call)
if [ -f "$CACHE_FILE" ]; then
  LAST_CHECK=$(cat "$CACHE_FILE" 2>/dev/null || echo 0)
  NOW=$(date +%s)
  AGE=$((NOW - LAST_CHECK))
  if [ "$AGE" -lt "$MAX_AGE" ]; then
    exit 0
  fi
fi

# Exit if already updating
[ -f "$LOCK_FILE" ] && exit 0

# Update cache timestamp immediately (prevents concurrent checks)
date +%s > "$CACHE_FILE"

# Run the actual check + update in background so we don't block the user
(
  trap 'rm -f "$LOCK_FILE"' EXIT
  touch "$LOCK_FILE"

  # Get installed version
  INSTALLED=$(node -e "try{console.log(JSON.parse(require('fs').readFileSync('$CONFIG_FILE','utf8')).version)}catch{console.log('0.0.0')}" 2>/dev/null)
  [ -z "$INSTALLED" ] && INSTALLED="0.0.0"

  # Get latest from npm (5s timeout)
  LATEST=$(npm view qualia-framework-v2 version 2>/dev/null)
  [ -z "$LATEST" ] && exit 0

  # Compare versions
  NEEDS_UPDATE=$(node -e "
    const a='$LATEST'.split('.').map(Number), b='$INSTALLED'.split('.').map(Number);
    for(let i=0;i<3;i++){if(a[i]>b[i]){console.log('yes');process.exit()}if(a[i]<b[i]){process.exit()}}
  " 2>/dev/null)

  if [ "$NEEDS_UPDATE" = "yes" ]; then
    # Get saved install code
    CODE=$(node -e "try{console.log(JSON.parse(require('fs').readFileSync('$CONFIG_FILE','utf8')).code)}catch{}" 2>/dev/null)
    [ -z "$CODE" ] && exit 0

    # Run silent update
    npx qualia-framework-v2@latest install <<< "$CODE" > /dev/null 2>&1
  fi
) &

exit 0
