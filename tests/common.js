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
    const url = testMode ? `${BASE_URL}/index.html?testMode=true&finishPage=finish_evaluation_denver.html` : `${BASE_URL}/index.html`;
    await page.goto(url);
    return page;
}

async function setupSelfPage(browser, testMode = true) {
    const page = await browser.newPage();
    const url = testMode ? `${BASE_URL}/index.html?testMode=true&finishPage=finish_evaluation_self.html` : `${BASE_URL}/index.html`;
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

async function returnFromSettings(page) {
    await page.click('#return-btn');
    await page.waitForSelector('#config-modal', { hidden: true });
}

async function secondsLeftOnTimer(page) {
    const reading = await page.$eval('#timer-display', element => element.textContent);
    const [minutes, seconds] = reading.split(':').map(Number);
    return minutes * 60 + seconds;
}

async function waitSeconds(seconds) {
    await delay(seconds * 1000);
}

const LONGEST_TEST_SESSION_MS = 40000;

async function waitUntilCatchUpWindow(page) {
    await page.waitForSelector('body.capture-window', { timeout: LONGEST_TEST_SESSION_MS });
}

async function waitUntilSecondsLeft(page, seconds) {
    await page.waitForFunction(
        expected => document.getElementById('timer-display').textContent === expected,
        { timeout: LONGEST_TEST_SESSION_MS },
        `0:${String(seconds).padStart(2, '0')}`
    );
}

async function isOnCounterPage(page) {
    return page.evaluate(() => window.location.pathname.endsWith('index.html'));
}

async function isInCatchUpWindow(page) {
    return page.evaluate(() => document.body.classList.contains('capture-window'));
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

const POSITIVE_SKILLS = ['Imitate', 'Show Enjoyment', 'Ignore Disruptive Bx'];

async function finishCodedSession(page) {
    await startSession(page);
    await finishEvaluation(page);
}

async function skipCodingAsTeachingSession(page) {
    await openSettings(page);
    await Promise.all([
        page.click('#skip-coding-btn'),
        page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 })
    ]);
    await page.click('#teaching-yes-btn');
}

async function positiveSkillsAreShown(page) {
    return page.evaluate(() => {
        const positiveSkills = document.getElementById('positive-skills');
        return positiveSkills !== null && positiveSkills.offsetParent !== null;
    });
}

async function ratingOf(page, skill) {
    return page.evaluate(skill => {
        const chosen = document.querySelector(`[data-skill="${skill}"] [aria-pressed="true"]`);
        return chosen ? chosen.dataset.rating : 'nothing';
    }, skill);
}

async function rate(page, skill, rating) {
    const ratingButton = await page.$(`[data-skill="${skill}"] [data-rating="${rating}"]`);
    if (!ratingButton) {
        throw new Error(`Cannot rate ${skill} as ${rating}: no such choice on the page`);
    }
    await ratingButton.click();
}

async function answerQuestions(page, { daysPracticed, ecbiScore, coachingMinutes }) {
    await page.type('#days-practiced', String(daysPracticed));
    await page.type('#ecbi-score', String(ecbiScore));
    await page.click('#coaching-time', { clickCount: 3 });
    await page.type('#coaching-time', String(coachingMinutes));
}

async function sendResults(page) {
    await page.click('#copy-email-btn');
    await delay(500);
    return page.evaluate(() => window.testEmailData);
}

function expectRating(actual, skill, expected) {
    if (actual !== expected) {
        throw new Error(`${skill}: expected ${expected}, got ${actual}`);
    }
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
    setupSelfPage,
    startSession,
    openSettings,
    returnFromSettings,
    secondsLeftOnTimer,
    waitSeconds,
    waitUntilCatchUpWindow,
    waitUntilSecondsLeft,
    isOnCounterPage,
    isInCatchUpWindow,
    finishEvaluation,
    POSITIVE_SKILLS,
    finishCodedSession,
    skipCodingAsTeachingSession,
    positiveSkillsAreShown,
    ratingOf,
    rate,
    answerQuestions,
    sendResults,
    expectRating,
    verifyEmailData,
    logTestResult
};