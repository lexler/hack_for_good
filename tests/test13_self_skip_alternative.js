const {
    setupSelfPage,
    verifyEmailData,
    delay
} = require('./common');

async function test13SelfSkipAlternative(browser) {
    console.log('\n📋 Test 13: Self Page - Skip Coding Alternative Session');
    const page = await setupSelfPage(browser);

    try {
        await page.click('#config-btn');
        await delay(100);

        await Promise.all([
            page.click('#skip-coding-btn'),
            page.waitForNavigation({
                waitUntil: 'networkidle0',
                timeout: 10000
            })
        ]);
        console.log('  ✓ Navigated to skip coding');

        await page.click('#teaching-no-btn');
        await delay(50);
        console.log('  ✓ Selected alternative session');

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
                'Alternative Session',
                'Number of days practiced last week: 5',
                'ECBI/WACB score: 34',
                'Coached (mins): 5',
                'Additional notes:'
            ]
        );

        if (emailData.body.includes('TA (Neutral Talk)')) {
            throw new Error('Skip coding email should not contain behavior counts');
        }

        console.log('  ✓ Email shows alternative session with question values');
        console.log('  ✅ Test 13 PASSED');
        return true;

    } catch (error) {
        console.error('  ❌ Test 13 FAILED:', error.message);
        throw error;
    } finally {
        await page.close();
    }
}

module.exports = test13SelfSkipAlternative;