const {
    setupPage,
    startSession,
    clickButton,
    finishEvaluation,
    verifyEmailData,
    delay
} = require('./common');

async function test9ValidationDidNotAdminister(browser) {
    console.log('\n📋 Test 9: Question Validation - Did Not Administer');
    const page = await setupPage(browser);

    try {
        await startSession(page);
        await clickButton(page, 'button[data-id="1"]', 1);
        console.log('  ✓ Started session with count');

        await finishEvaluation(page);
        console.log('  ✓ Navigated to finish page');

        await page.type('#days-practiced', '5');

        await page.click('#did-not-administer');
        console.log('  ✓ Checked "Did not administer"');

        const ecbiDisabled = await page.$eval('#ecbi-score', el => el.disabled);
        if (!ecbiDisabled) {
            throw new Error('ECBI score input should be disabled');
        }
        console.log('  ✓ ECBI input disabled');

        await page.type('#coaching-time', '15');

        await page.click('#copy-email-btn');
        await delay(500);

        const errorVisible = await page.$eval('#validation-error', el => {
            return window.getComputedStyle(el).display !== 'none';
        });

        if (errorVisible) {
            throw new Error('Should not show validation error when "Did not administer" is checked');
        }
        console.log('  ✓ No validation error');

        const emailData = await page.evaluate(() => window.testEmailData);

        if (!emailData.body.includes('Questionnaire: no')) {
            throw new Error(`Email should show questionnaire not administered: ${emailData.body}`);
        }
        if (!emailData.body.includes('Coached (mins): 15')) {
            throw new Error(`Email should show coaching time: ${emailData.body}`);
        }
        console.log('  ✓ Email shows: Questionnaire: no');

        const lines = emailData.clipboard.split('\n');
        if (lines[8] !== '5') {
            throw new Error(`Days practiced should be 5, got: "${lines[8]}"`);
        }
        if (lines[9] !== '') {
            throw new Error(`ECBI score should be empty in clipboard, got: "${lines[9]}"`);
        }

        console.log('  ✓ Submission succeeds');
        console.log('  ✅ Test 9 PASSED');
        return true;

    } catch (error) {
        console.error('  ❌ Test 9 FAILED:', error.message);
        throw error;
    } finally {
        await page.close();
    }
}

module.exports = test9ValidationDidNotAdminister;
