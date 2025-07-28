#!/bin/bash
set -e

if ! command -v http-server &> /dev/null; then
    echo "http-server not found. Installing globally..."
    npm install -g http-server
fi

echo "Starting http-server on port 80..."
sudo http-server -p 80 -o