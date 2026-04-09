#!/bin/bash
# Qualia session start — show branded context panel on every new session.
# Delegates to qualia-ui.js so formatting matches the rest of the framework.

UI="$HOME/.claude/bin/qualia-ui.js"
STATE=".planning/STATE.md"

# Fallback if qualia-ui.js is missing (first install before mirror)
if [ ! -f "$UI" ]; then
  if [ -f "$STATE" ]; then
    PHASE=$(grep "^Phase:" "$STATE" 2>/dev/null | head -1)
    STATUS=$(grep "^Status:" "$STATE" 2>/dev/null | head -1)
    echo "QUALIA: Project loaded. $PHASE | $STATUS"
    echo "QUALIA: Run /qualia for next step."
  elif [ -f ".continue-here.md" ]; then
    echo "QUALIA: Handoff file found. Read .continue-here.md to resume."
  else
    echo "QUALIA: No project detected. Run /qualia-new to start."
  fi
  exit 0
fi

# Branded banner for every session start
if [ -f "$STATE" ]; then
  node "$UI" banner router
  # Read next command from state.js and suggest it
  NEXT=$(node "$HOME/.claude/bin/state.js" check 2>/dev/null | node -e "try{let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const j=JSON.parse(d);process.stdout.write(j.next_command||'')})}" 2>/dev/null)
  [ -n "$NEXT" ] && node "$UI" info "Run $NEXT to continue"
elif [ -f ".continue-here.md" ]; then
  node "$UI" banner router
  node "$UI" warn "Handoff found — read .continue-here.md to resume"
else
  node "$UI" banner router
  node "$UI" info "No project detected. Run /qualia-new to start."
fi
