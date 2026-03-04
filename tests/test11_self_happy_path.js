const {
    setupSelfPage,
    startSession,
    clickButton,
    finishEvaluation,
    verifyEmailData,
    delay
} = require('./common');

async function test11SelfHappyPath(browser) {
    console.log('\n📋 Test 11: Self Page - Happy Path');
    const page = await setupSelfPage(browser);

    try {
        await startSession(page);
        await page.waitForSelector('button[data-id="1"]');
        await clickButton(page, 'button[data-id="1"]', 1);
        await clickButton(page, 'button[data-id="2"]', 2);
        await clickButton(page, 'button[data-id="3"]', 3);
        await clickButton(page, 'button[data-id="4"]', 5);
        await clickButton(page, 'button[id="undo-direct-btn"]', 1);
        await clickButton(page, 'button[data-id="6"]', 5);
        await clickButton(page, 'button[data-id="7"]', 6);
        await clickButton(page, 'button[data-id="8"]', 7);
        await clickButton(page, 'button[data-id="9"]', 8);
        console.log('  ✓ Clicked all count buttons');

        await finishEvaluation(page);

        const url = page.url();
        if (!url.includes('finish_evaluation_self.html')) {
            throw new Error(`Expected finish_evaluation_self.html, got: ${url}`);
        }
        console.log('  ✓ Redirected to self finish page');

        await page.type('#days-practiced', '5');
        await page.type('#ecbi-score', '34');
        await page.type('#coaching-time', '5');

        await page.click('#copy-email-btn');
        await delay(500);

        const emailData = await page.evaluate(() => window.testEmailData);

        verifyEmailData(
            emailData,
            '',
            '[PCIT Intermediary]',
            [
                'TA (Neutral Talk): 1',
                'BD (Behavior Description): 2',
                'RF (Reflection): 3',
                'LP (Labeled Praise): 4',
                'UP (Unlabeled Praise): 5',
                'QU (Question): 6',
                'CM (Command): 7',
                'NTA (Negative Talk): 8',
                'Number of days practiced last week: 5',
                'ECBI/WACB score: 34',
                'Coached (mins): 5',
                'Additional notes:'
            ]
        );

        console.log('  ✓ Email contains all 8 labeled counts and question values');
        console.log('  ✅ Test 11 PASSED');
        return true;

    } catch (error) {
        console.error('  ❌ Test 11 FAILED:', error.message);
        throw error;
    } finally {
        await page.close();
    }
}

module.exports = test11SelfHappyPath;