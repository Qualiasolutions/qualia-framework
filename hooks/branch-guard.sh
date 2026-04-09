#!/bin/bash
# Block non-OWNER push to main/master
# Reads role from ~/.claude/.qualia-config.json (machine-readable source of truth)

BRANCH=$(git branch --show-current 2>/dev/null)
CONFIG="$HOME/.claude/.qualia-config.json"

if [ ! -f "$CONFIG" ]; then
  echo "BLOCKED: ~/.claude/.qualia-config.json missing. Run: npx qualia-framework-v2 install"
  exit 1
fi

# Extract role without jq dependency (installers may not have jq)
ROLE=$(node -e "try{console.log(JSON.parse(require('fs').readFileSync('$CONFIG','utf8')).role||'')}catch{}" 2>/dev/null)

if [ -z "$ROLE" ]; then
  echo "BLOCKED: Cannot determine role from $CONFIG. Defaulting to deny."
  exit 1
fi

if [[ "$BRANCH" == "main" || "$BRANCH" == "master" ]]; then
  if [[ "$ROLE" != "OWNER" ]]; then
    echo "BLOCKED: Employees cannot push to $BRANCH. Create a feature branch first."
    echo "Run: git checkout -b feature/your-feature-name"
    exit 1
  fi
fi
