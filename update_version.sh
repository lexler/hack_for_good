#!/usr/bin/env bash
set -euo pipefail

SCRIPT_JS="script.js"
INDEX_HTML="index.html"

if [[ ! -f "$SCRIPT_JS" ]]; then
    echo "Error: $SCRIPT_JS not found" >&2
    exit 1
fi

if [[ ! -f "$INDEX_HTML" ]]; then
    echo "Error: $INDEX_HTML not found" >&2
    exit 1
fi

current_version=$(grep "^// Version" "$SCRIPT_JS" | sed 's/^\/\/ Version //')

if [[ ! $current_version =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "Error: Invalid version format '$current_version'. Expected major.minor.patch" >&2
    exit 1
fi

IFS='.' read -r major minor patch <<< "$current_version"

new_patch=$((patch + 1))
new_version="$major.$minor.$new_patch"

echo "Updating version: $current_version -> $new_version"

sed -i.bak "s/^\/\/ Version .*/\/\/ Version $new_version/" "$SCRIPT_JS"
sed -i.bak "s/this\.version = '[^']*';/this.version = '$new_version';/" "$SCRIPT_JS"
sed -i.bak "s/Version [0-9][0-9]*\.[0-9][0-9]*\.[0-9][0-9]*/Version $new_version/" "$INDEX_HTML"

rm -f "$SCRIPT_JS.bak" "$INDEX_HTML.bak"

echo "Version updated successfully!"