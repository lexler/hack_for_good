// Common test utilities and configuration

const BASE_URL = 'http://localhost:8080';
const DELAY = 10; // ms between button clicks - minimal delay

// Delay utility
async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Click button multiple times with delay
async function clickButton(page, selector, times = 1) {
    for (let i = 0; i < times; i++) {
        await page.click(selector);
        if (i < times - 1) { // Only delay between clicks, not after last one
            await delay(DELAY);
        }
    }
}

// Fast click option - no delays (parallel clicks)
async function clickButtonFast(page, selector, times = 1) {
    const promises = [];
    for (let i = 0; i < times; i++) {
        promises.push(page.click(selector));
    }
    await Promise.all(promises);
}

// Common test setup
async function setupPage(browser, testMode = true) {
    const page = await browser.newPage();
    const url = testMode ? `${BASE_URL}/index.html?testMode=true` : `${BASE_URL}/index.html`;
    await page.goto(url);
    return page;
}

// Start session (click start button)
async function startSession(page) {
    await page.click('button[id="undo-direct-btn"]');
    await delay(50);  // Slightly longer for session start
}

// Open settings modal
async function openSettings(page) {
    await page.click('#config-btn');
    await delay(100);  // Modal opening
    await page.waitForSelector('#finish-btn', { visible: true });
}

// Manual finish evaluation
async function finishEvaluation(page) {
    await openSettings(page);
    
    // Click finish and wait for navigation together
    await Promise.all([
        page.click('#finish-btn'),
        page.waitForNavigation({ 
            waitUntil: 'networkidle0',
            timeout: 10000 
        })
    ]);
}

// Verify email data
function verifyEmailData(emailData, expectedRecipient, expectedSubject, expectedBodyContains) {
    const errors = [];
    
    if (emailData.recipient !== expectedRecipient) {
        errors.push(`Wrong recipient: expected "${expectedRecipient}", got "${emailData.recipient}"`);
    }
    
    if (emailData.subject !== expectedSubject) {
        errors.push(`Wrong subject: expected "${expectedSubject}", got "${emailData.subject}"`);
    }
    
    for (const expected of expectedBodyContains) {
        if (!emailData.body.includes(expected)) {
            errors.push(`Email body missing: "${expected}"`);
        }
    }
    
    if (errors.length > 0) {
        throw new Error(errors.join('\n'));
    }
}

// Log test result
function logTestResult(testName, passed, error = null) {
    if (passed) {
        console.log(`  ✅ ${testName} PASSED`);
    } else {
        console.error(`  ❌ ${testName} FAILED:`, error.message);
    }
}

module.exports = {
    BASE_URL,
    DELAY,
    delay,
    clickButton,
    clickButtonFast,
    setupPage,
    startSession,
    openSettings,
    finishEvaluation,
    verifyEmailData,
    logTestResult
};