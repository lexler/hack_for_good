#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🧪 Counter App Test Suite${NC}"
echo "=========================="

# Check if puppeteer is installed
if ! npm list puppeteer &>/dev/null; then
    echo -e "${YELLOW}📦 Installing Puppeteer...${NC}"
    npm install puppeteer
fi

# Start the server in background
echo -e "${YELLOW}🚀 Starting test server on port 8080...${NC}"
python3 -m http.server 8080 > /dev/null 2>&1 &
SERVER_PID=$!

# Give server time to start
sleep 2

# Check if server is running
if ! curl -s http://localhost:8080 > /dev/null; then
    echo -e "${RED}❌ Failed to start server${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Server started (PID: $SERVER_PID)${NC}"

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}🧹 Cleaning up...${NC}"
    kill $SERVER_PID 2>/dev/null
    echo -e "${GREEN}✓ Server stopped${NC}"
}

# Set trap to cleanup on script exit
trap cleanup EXIT INT TERM

# Run the tests
echo -e "${YELLOW}🏃 Running tests...${NC}"
echo "=========================="

# Check if specific test requested
if [ "$1" != "" ]; then
    node tests/run_all_tests.js --test=$1
else
    node tests/run_all_tests.js
fi

TEST_EXIT_CODE=$?

# Exit with test status
if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✨ All tests completed successfully!${NC}"
else
    echo -e "${RED}💔 Tests failed with exit code: $TEST_EXIT_CODE${NC}"
fi

exit $TEST_EXIT_CODE