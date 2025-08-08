#!/bin/bash
set -e

echo "Checking for existing servers on port 8080..."
if lsof -i :8080 > /dev/null 2>&1; then
    echo "Found existing server on port 8080. Killing it..."
    PID=$(lsof -t -i :8080)
    if [ ! -z "$PID" ]; then
        kill $PID 2>/dev/null || true
        sleep 1
        
        if lsof -i :8080 > /dev/null 2>&1; then
            kill -9 $PID 2>/dev/null || true
        fi
        echo "✓ Killed existing server (PID: $PID)"
    fi
fi

if ! command -v http-server &> /dev/null; then
    echo "http-server not found. Installing globally..."
    npm install -g http-server
fi

echo "Starting http-server on port 8080..."
http-server -p 8080 -o