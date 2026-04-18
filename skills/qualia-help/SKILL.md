---
name: qualia-help
description: "Open the Qualia Framework reference guide in the browser. A beautiful themed HTML page with all commands, rules, services, and the road. Trigger on 'help', 'how does this work', 'show me the commands', 'qualia help', 'reference'."
allowed-tools:
  - Bash
  - Read
---

# /qualia-help — Framework Reference

Opens a Qualia-themed HTML reference guide in your default browser.

## Process

### 1. Generate the HTML

```bash
# Read the template and inject the current version.
# Prefer .qualia-config.json; fall back to the framework package.json; last resort is the
# literal string "latest" so the UI never lies about a specific version.
VERSION=$(node -e "
  const fs = require('fs'), path = require('path'), os = require('os');
  const cfg = path.join(os.homedir(), '.claude', '.qualia-config.json');
  const pkg = path.join(os.homedir(), '.claude', 'qualia-framework', 'package.json');
  try { const v = JSON.parse(fs.readFileSync(cfg,'utf8')).version; if (v) { console.log(v); process.exit(0); } } catch {}
  try { const v = JSON.parse(fs.readFileSync(pkg,'utf8')).version; if (v) { console.log('v'+v); process.exit(0); } } catch {}
  console.log('latest');
" 2>/dev/null || echo "latest")
TEMPLATE="$HOME/.claude/qualia-templates/help.html"
OUTPUT="/tmp/qualia-help.html"

# If template doesn't exist in the user home, check the installed framework copy.
if [ ! -f "$TEMPLATE" ]; then
  for CANDIDATE in "$HOME/.claude/qualia-framework/templates/help.html"; do
    if [ -f "$CANDIDATE" ]; then TEMPLATE="$CANDIDATE"; break; fi
  done
fi
```

### 2. Inject version and open

```bash
# Replace {{VERSION}} placeholder with actual version
sed "s/{{VERSION}}/$VERSION/g" "$TEMPLATE" > "$OUTPUT"

# Open in default browser (cross-platform)
if command -v xdg-open &>/dev/null; then
  xdg-open "$OUTPUT"          # Linux
elif command -v open &>/dev/null; then
  open "$OUTPUT"               # macOS
elif command -v start &>/dev/null; then
  start "$OUTPUT"              # Windows (Git Bash)
else
  echo "Open this file in your browser: $OUTPUT"
fi
```

### 3. Confirm

```bash
node ~/.claude/bin/qualia-ui.js banner router
node ~/.claude/bin/qualia-ui.js ok "Reference guide opened in browser"
node ~/.claude/bin/qualia-ui.js info "File: /tmp/qualia-help.html"
```

If the browser does not open automatically, tell the user the file path so they can open it manually.

## Notes

- The HTML file is self-contained — no external dependencies except Google Fonts
- Works offline after first load (fonts cache)
- Qualia-themed: dark background, teal accents, Outfit + Inter fonts
- Shows: The Road, all commands grouped, verification scoring, rules, stack, GitHub orgs
- Version is injected dynamically from .qualia-config.json
