#!/usr/bin/env bash
set -euo pipefail

readonly LOCALHOST_URL="http://localhost:8080"
readonly SCREENSHOT_PATH="img/current_screenshot.png"
readonly IPHONE_WIDTH=390
readonly IPHONE_HEIGHT=844

if ! curl -s --connect-timeout 3 "$LOCALHOST_URL" >/dev/null; then
    echo "Error: Cannot connect to $LOCALHOST_URL. Make sure your app is running." >&2
    exit 1
fi

mkdir -p "$(dirname "$SCREENSHOT_PATH")"

if command -v node >/dev/null 2>&1 && npm list -g puppeteer >/dev/null 2>&1; then
    node -e "
    const puppeteer = require('puppeteer');
    (async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setViewport({ width: $IPHONE_WIDTH, height: $IPHONE_HEIGHT });
        await page.goto('$LOCALHOST_URL');
        await page.screenshot({ path: '$SCREENSHOT_PATH' });
        await browser.close();
    })();
    "
else
    temp_html=$(mktemp).html
    cat > "$temp_html" << EOF
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body, html { margin: 0; padding: 0; }
        iframe { width: ${IPHONE_WIDTH}px; height: ${IPHONE_HEIGHT}px; border: none; }
    </style>
</head>
<body>
    <iframe src="$LOCALHOST_URL"></iframe>
</body>
</html>
EOF
    
    open -a Safari "$temp_html"
    sleep 3
    screencapture -x "$SCREENSHOT_PATH"
    rm "$temp_html"
    
    osascript -e 'tell application "Safari" to close front window' 2>/dev/null || true
fi

if [[ -f "$SCREENSHOT_PATH" ]]; then
    echo "Screenshot saved to $SCREENSHOT_PATH"
else
    echo "Error: Screenshot capture failed" >&2
    exit 1
fi
