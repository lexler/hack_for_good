#!/bin/bash
set -e

if ! command -v http-server &> /dev/null; then
    echo "http-server not found. Installing globally..."
    npm install -g http-server
fi

echo "Starting http-server on port 8080..."
http-server -p 8080 -o