// Master test runner
const puppeteer = require('puppeteer');

// Import all test files
const test1HappyPath = require('./test1_happy_path');
const test2SkipCodingTeaching = require('./test2_skip_coding_teaching');
const test3ManualFinish = require('./test3_manual_finish');

// Test registry - add new tests here
const tests = [
    { name: 'Happy Path', fn: test1HappyPath },
    { name: 'Skip Coding - Teaching', fn: test2SkipCodingTeaching },
    { name: 'Manual Finish', fn: test3ManualFinish },
    // Add more tests here as they're created
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