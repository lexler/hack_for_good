const {
    setupSelfPage,
    startSession,
    clickButton,
    finishEvaluation,
    verifyEmailData,
    delay
} = require('./common');

async function test14SelfDidNotCollect(browser) {
    console.log('\n📋 Test 14: Self Page - Did Not Collect Days');
    const page = await setupSelfPage(browser);

    try {
        await startSession(page);
        await clickButton(page, 'button[data-id="1"]', 1);
        console.log('  ✓ Started session with count');

        await finishEvaluation(page);
        console.log('  ✓ Navigated to self finish page');

        await page.click('#did-not-collect');
        console.log('  ✓ Checked "Did not collect"');

        await page.type('#ecbi-score', '30');
        await page.type('#coaching-time', '5');

        await page.click('#copy-email-btn');
        await delay(500);

        const emailData = await page.evaluate(() => window.testEmailData);

        verifyEmailData(
            emailData,
            '',
            '[PCIT Intermediary]',
            [
                'Number of days practiced last week: Not collected',
                'ECBI/WACB score: 30',
                'Coached (mins): 5'
            ]
        );

        console.log('  ✓ Email shows "Not collected" for days');
        console.log('  ✅ Test 14 PASSED');
        return true;

    } catch (error) {
        console.error('  ❌ Test 14 FAILED:', error.message);
        throw error;
    } finally {
        await page.close();
    }
}

module.exports = test14SelfDidNotCollect;