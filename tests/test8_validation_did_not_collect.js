const {
    setupPage,
    startSession,
    clickButton,
    finishEvaluation,
    verifyEmailData,
    delay
} = require('./common');

async function test8ValidationDidNotCollect(browser) {
    console.log('\n📋 Test 8: Question Validation - Did Not Collect');
    const page = await setupPage(browser);

    try {
        await startSession(page);
        await clickButton(page, 'button[data-id="1"]', 1);
        console.log('  ✓ Started session with count');

        await finishEvaluation(page);
        console.log('  ✓ Navigated to finish page');

        await page.click('#did-not-collect');
        console.log('  ✓ Checked "Did not collect"');

        const daysDisabled = await page.$eval('#days-practiced', el => el.disabled);
        if (!daysDisabled) {
            throw new Error('Days practiced input should be disabled');
        }
        console.log('  ✓ Days input disabled');

        await page.type('#ecbi-score', '30');
        await page.type('#coaching-time', '12');

        await page.click('#copy-email-btn');
        await delay(500);

        const errorVisible = await page.$eval('#validation-error', el => {
            return window.getComputedStyle(el).display !== 'none';
        });

        if (errorVisible) {
            throw new Error('Should not show validation error when "Did not collect" is checked');
        }
        console.log('  ✓ No validation error');

        const emailData = await page.evaluate(() => window.testEmailData);

        if (!emailData.body.includes('Asked about homework: no')) {
            throw new Error(`Email should show homework not collected: ${emailData.body}`);
        }
        if (!emailData.body.includes('Coached (mins): 12')) {
            throw new Error(`Email should show coaching time: ${emailData.body}`);
        }
        console.log('  ✓ Email shows: Asked about homework: no');

        const lines = emailData.clipboard.split('\n');
        if (lines[8] !== '') {
            throw new Error(`Days practiced should be empty in clipboard, got: "${lines[8]}"`);
        }
        if (lines[9] !== '30') {
            throw new Error(`ECBI score should be 30, got: "${lines[9]}"`);
        }

        console.log('  ✓ Submission succeeds');
        console.log('  ✅ Test 8 PASSED');
        return true;

    } catch (error) {
        console.error('  ❌ Test 8 FAILED:', error.message);
        throw error;
    } finally {
        await page.close();
    }
}

module.exports = test8ValidationDidNotCollect;
