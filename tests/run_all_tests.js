// Master test runner
const puppeteer = require('puppeteer');

// Import all test files
const test1HappyPath = require('./test1_happy_path');
const test2SkipCodingTeaching = require('./test2_skip_coding_teaching');
const test3SkipCodingAlternative = require('./test3_skip_coding_alternative');
const test4ManualFinish = require('./test4_manual_finish');
const test5CancelEvaluation = require('./test5_cancel_evaluation');
const test6UndoFunctionality = require('./test6_undo_functionality');
const test7KeyboardShortcuts = require('./test7_keyboard_shortcuts');
const test8ValidationDidNotCollect = require('./test8_validation_did_not_collect');
const test9ValidationDidNotAdminister = require('./test9_validation_did_not_administer');
const test10ReturnNavigation = require('./test10_return_navigation');
const test11SelfHappyPath = require('./test11_self_happy_path');
const test12SelfSkipTeaching = require('./test12_self_skip_teaching');
const test13SelfSkipAlternative = require('./test13_self_skip_alternative');
const test14SelfDidNotCollect = require('./test14_self_did_not_collect');
const test15SelfDidNotAdminister = require('./test15_self_did_not_administer');

// Test registry - add new tests here
const tests = [
    { name: 'Test 1: Happy Path', fn: test1HappyPath },
    { name: 'Test 2: Skip Coding - Teaching', fn: test2SkipCodingTeaching },
    { name: 'Test 3: Skip Coding - Alternative', fn: test3SkipCodingAlternative },
    { name: 'Test 4: Manual Finish', fn: test4ManualFinish },
    { name: 'Test 5: Cancel Evaluation', fn: test5CancelEvaluation },
    { name: 'Test 6: Undo Functionality', fn: test6UndoFunctionality },
    { name: 'Test 7: Keyboard Shortcuts', fn: test7KeyboardShortcuts },
    { name: 'Test 8: Validation - Did Not Collect', fn: test8ValidationDidNotCollect },
    { name: 'Test 9: Validation - Did Not Administer', fn: test9ValidationDidNotAdminister },
    { name: 'Test 10: Return Navigation', fn: test10ReturnNavigation },
    { name: 'Test 11: Self - Happy Path', fn: test11SelfHappyPath },
    { name: 'Test 12: Self - Skip Coding Teaching', fn: test12SelfSkipTeaching },
    { name: 'Test 13: Self - Skip Coding Alternative', fn: test13SelfSkipAlternative },
    { name: 'Test 14: Self - Did Not Collect', fn: test14SelfDidNotCollect },
    { name: 'Test 15: Self - Did Not Administer', fn: test15SelfDidNotAdminister },
];

// Main test runner
async function runAllTests() {
    console.log('🚀 Starting Puppeteer Test Suite');
    console.log('================================');
    
    const browser = await puppeteer.launch({
        headless: false,  // Set to true for CI/CD
        slowMo: 20,       // Reduced slow motion for faster execution
        devtools: false
    });
    
    let passedCount = 0;
    let failedCount = 0;
    const failedTests = [];
    
    // Run tests sequentially
    for (const test of tests) {
        try {
            await test.fn(browser);
            passedCount++;
        } catch (error) {
            failedCount++;
            failedTests.push(test.name);
        }
    }
    
    await browser.close();
    
    // Print summary
    console.log('\n================================');
    console.log('📊 Test Summary:');
    console.log(`  ✅ Passed: ${passedCount}`);
    console.log(`  ❌ Failed: ${failedCount}`);
    
    if (failedTests.length > 0) {
        console.log('\n  Failed tests:');
        failedTests.forEach(name => console.log(`    - ${name}`));
    }
    
    console.log('================================');
    
    if (failedCount === 0) {
        console.log('✨ All tests passed!');
        process.exit(0);
    } else {
        console.log('💔 Some tests failed');
        process.exit(1);
    }
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--help')) {
    console.log(`
Usage: node run_all_tests.js [options]

Options:
  --help     Show this help message
  --test=N   Run only test N (1-based index)
  
Examples:
  node run_all_tests.js           # Run all tests
  node run_all_tests.js --test=1  # Run only the first test
`);
    process.exit(0);
}

// Check if running specific test
const testArg = args.find(arg => arg.startsWith('--test='));
if (testArg) {
    const testIndex = parseInt(testArg.split('=')[1]) - 1;
    if (testIndex >= 0 && testIndex < tests.length) {
        console.log(`🎯 Running single test: ${tests[testIndex].name}`);
        console.log('================================');
        
        puppeteer.launch({
            headless: false,
            slowMo: 20,
            devtools: false
        }).then(async browser => {
            try {
                await tests[testIndex].fn(browser);
                console.log('\n✅ Test passed!');
                process.exit(0);
            } catch (error) {
                console.log('\n❌ Test failed');
                process.exit(1);
            } finally {
                await browser.close();
            }
        });
    } else {
        console.error(`Invalid test index: ${testIndex + 1}`);
        console.log(`Available tests: 1-${tests.length}`);
        process.exit(1);
    }
} else {
    // Run all tests
    runAllTests().catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
}