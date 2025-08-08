#!/usr/bin/env bash
set -euo pipefail

if [[ ! -d .git ]]; then
    echo "Error: Not in a git repository" >&2
    exit 1
fi

HOOK_PATH=".git/hooks/pre-commit"
HOOK_CONTENT='#!/usr/bin/env bash
set -euo pipefail

# Run the version update script
./update_version.sh

# Stage the modified files
git add script.js index.html'

if [[ -f "$HOOK_PATH" ]]; then
    if [[ "$(cat "$HOOK_PATH")" == "$HOOK_CONTENT" ]]; then
        echo "Pre-commit hook already exists with correct content"
    else
        echo "$HOOK_CONTENT" > "$HOOK_PATH"
        echo "Updated existing pre-commit hook"
    fi
else
    echo "$HOOK_CONTENT" > "$HOOK_PATH"
    echo "Created new pre-commit hook"
fi

chmod +x "$HOOK_PATH"
echo "Made pre-commit hook executable"
echo "Git hook setup complete"