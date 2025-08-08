const puppeteer = require('puppeteer');

const BASE_URL = 'http://localhost:8080/v2';
const DELAY = 10; // ms between button clicks - minimal delay

// Test utilities
async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function clickButton(page, selector, times = 1) {
    for (let i = 0; i < times; i++) {
        await page.click(selector);
        if (i < times - 1) { // Only delay between clicks, not after last one
            await delay(DELAY);
        }
    }
}

// Fast click option - no delays
async function clickButtonFast(page, selector, times = 1) {
    const promises = [];
    for (let i = 0; i < times; i++) {
        promises.push(page.click(selector));
    }
    await Promise.all(promises);
}

// Test 1: Happy Path
async function testHappyPath(browser) {
    console.log('\n📋 Test 1: Happy Path - Complete Session Flow');
    const page = await browser.newPage();
    
    try {
        // Open app in test mode
        await page.goto(`${BASE_URL}/index.html?testMode=true`);
        console.log('  ✓ Opened counter app');
        
        // Start session
        await page.click('button[id="undo-direct-btn"]');
        await delay(50);  // Slightly longer for session start
        console.log('  ✓ Started session');
        
        // Click counts according to test plan
        await page.waitForSelector('button[data-id="1"]');
        await clickButton(page, 'button[data-id="1"]', 1);  // TA: 1
        await clickButton(page, 'button[data-id="2"]', 2);  // BD: 2
        await clickButton(page, 'button[data-id="3"]', 3);  // RF: 3
        await clickButton(page, 'button[data-id="4"]', 5);  // LP: 5
        await clickButton(page, 'button[id="undo-direct-btn"]', 1);  // Undo: LP→4
        await clickButton(page, 'button[data-id="6"]', 5);  // UP: 5
        await clickButton(page, 'button[data-id="7"]', 6);  // QU: 6
        await clickButton(page, 'button[data-id="8"]', 7);  // CM: 7
        await clickButton(page, 'button[data-id="9"]', 8);  // NTA: 8
        console.log('  ✓ Clicked all count buttons');
        
        // Option: Wait for timer OR manually finish
        const USE_MANUAL_FINISH = true; // Set to false to wait for timer
        
        if (USE_MANUAL_FINISH) {
            console.log('  ⏩ Manually finishing evaluation...');
            await page.click('#config-btn');
            await delay(100);  // Modal opening
            await page.waitForSelector('#finish-btn', { visible: true });
            
            // Click finish and wait for navigation together
            await Promise.all([
                page.click('#finish-btn'),
                page.waitForNavigation({ 
                    waitUntil: 'networkidle0',
                    timeout: 10000 
                })
            ]);
        } else {
            console.log('  ⏳ Waiting for timer to expire (10s)...');
            await page.waitForNavigation({ 
                waitUntil: 'networkidle2',
                timeout: 15000 
            });
        }
        
        // Verify redirect to finish page
        const url = page.url();
        if (!url.includes('finish_evaluation.html')) {
            throw new Error(`Expected finish_evaluation.html, got: ${url}`);
        }
        console.log('  ✓ Redirected to finish page');
        
        // Verify URL parameters
        if (!url.includes('c1=1&c2=2&c3=3&c4=4') || !url.includes('c6=5&c7=6&c8=7&c9=8')) {
            throw new Error(`Incorrect counts in URL: ${url}`);
        }
        console.log('  ✓ URL parameters correct');
        
        // Fill in questions
        await page.type('#days-practiced', '1');
        await page.type('#ecbi-score', '21');
        console.log('  ✓ Filled question fields');
        
        // Submit form
        await page.click('#copy-email-btn');
        await delay(500);  // Time for email data capture
        
        // Get captured email data
        const emailData = await page.evaluate(() => window.testEmailData);
        
        // Verify email data
        if (emailData.recipient !== 'RACHEL.4.WILSON@cuanschutz.edu') {
            throw new Error(`Wrong recipient: ${emailData.recipient}`);
        }
        if (emailData.subject !== '[PCIT Intermediary]') {
            throw new Error(`Wrong subject: ${emailData.subject}`);
        }
        if (!emailData.body.includes('Questionnaire: yes')) {
            throw new Error(`Wrong email body: ${emailData.body}`);
        }
        console.log('  ✓ Email data correct');
        console.log('  ✅ Test 1 PASSED');
        
    } catch (error) {
        console.error('  ❌ Test 1 FAILED:', error.message);
        throw error;
    } finally {
        await page.close();
    }
}

// Test 2: Skip Coding - Teaching Session
async function testSkipCodingTeaching(browser) {
    console.log('\n📋 Test 2: Skip Coding - Teaching Session');
    const page = await browser.newPage();
    
    try {
        await page.goto(`${BASE_URL}/index.html?testMode=true`);
        
        // Open settings and skip coding
        await page.click('#config-btn');
        await delay(100);  // Modal opening
        await page.click('#skip-coding-btn');
        await page.waitForNavigation();
        console.log('  ✓ Navigated to skip coding');
        
        // Select Yes for teaching session
        await page.click('#teaching-yes-btn');
        await delay(50);  // Quick transition
        console.log('  ✓ Selected teaching session');
        
        // Fill questions
        await page.type('#days-practiced', '3');
        await page.type('#ecbi-score', '15');
        
        // Submit
        await page.click('#copy-email-btn');
        await delay(500);  // Time for email data capture
        
        // Verify email data
        const emailData = await page.evaluate(() => window.testEmailData);
        if (!emailData.body.includes('Did coding analysis: yes')) {
            throw new Error(`Wrong email for teaching session: ${emailData.body}`);
        }
        console.log('  ✓ Email shows teaching session');
        console.log('  ✅ Test 2 PASSED');
        
    } catch (error) {
        console.error('  ❌ Test 2 FAILED:', error.message);
        throw error;
    } finally {
        await page.close();
    }
}

// Test 3: Manual Finish Evaluation
async function testManualFinish(browser) {
    console.log('\n📋 Test 3: Manual Finish Evaluation');
    const page = await browser.newPage();
    
    try {
        await page.goto(`${BASE_URL}/index.html?testMode=true`);
        
        // Start and add some counts
        await page.click('#undo-direct-btn'); // Start
        await delay(50);  // Session start
        await clickButton(page, 'button[data-id="1"]', 2);  // TA: 2
        await clickButton(page, 'button[data-id="2"]', 1);  // BD: 1
        
        // Manual finish
        await page.click('#config-btn');
        await delay(100);  // Modal opening
        await page.click('#finish-btn');
        await page.waitForNavigation();
        
        // Verify URL
        const url = page.url();
        if (!url.includes('c1=2&c2=1')) {
            throw new Error(`Incorrect counts in manual finish: ${url}`);
        }
        console.log('  ✓ Manual finish with correct counts');
        console.log('  ✅ Test 3 PASSED');
        
    } catch (error) {
        console.error('  ❌ Test 3 FAILED:', error.message);
        throw error;
    } finally {
        await page.close();
    }
}

// Main test runner
async function runTests() {
    console.log('🚀 Starting Puppeteer Test Suite');
    console.log('================================');
    
    const browser = await puppeteer.launch({
        headless: false,  // Set to true for CI/CD
        slowMo: 20,      // Reduced slow motion for faster execution
        devtools: false
    });
    
    let allTestsPassed = true;
    
    try {
        // Run tests sequentially
        await testHappyPath(browser);
        await testSkipCodingTeaching(browser);
        await testManualFinish(browser);
        
        // Add more tests here as needed
        
    } catch (error) {
        allTestsPassed = false;
    } finally {
        await browser.close();
    }
    
    console.log('\n================================');
    if (allTestsPassed) {
        console.log('✅ All tests passed!');
        process.exit(0);
    } else {
        console.log('❌ Some tests failed');
        process.exit(1);
    }
}

// Run tests
runTests().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});