const {
    setupSelfPage,
    startSession,
    clickButton,
    finishEvaluation,
    verifyEmailData,
    delay
} = require('./common');

async function test15SelfDidNotAdminister(browser) {
    console.log('\n📋 Test 15: Self Page - Did Not Administer ECBI');
    const page = await setupSelfPage(browser);

    try {
        await startSession(page);
        await clickButton(page, 'button[data-id="1"]', 1);
        console.log('  ✓ Started session with count');

        await finishEvaluation(page);
        console.log('  ✓ Navigated to self finish page');

        await page.type('#days-practiced', '5');
        await page.click('#did-not-administer');
        console.log('  ✓ Checked "Did not administer"');

        await page.type('#coaching-time', '5');

        await page.click('#copy-email-btn');
        await delay(500);

        const emailData = await page.evaluate(() => window.testEmailData);

        verifyEmailData(
            emailData,
            '',
            '[PCIT Intermediary]',
            [
                'Number of days practiced last week: 5',
                'ECBI/WACB score: Not collected',
                'Coached (mins): 5'
            ]
        );

        console.log('  ✓ Email shows "Not collected" for ECBI score');
        console.log('  ✅ Test 15 PASSED');
        return true;

    } catch (error) {
        console.error('  ❌ Test 15 FAILED:', error.message);
        throw error;
    } finally {
        await page.close();
    }
}

module.exports = test15SelfDidNotAdminister;