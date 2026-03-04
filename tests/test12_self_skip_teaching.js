const {
    setupSelfPage,
    verifyEmailData,
    delay
} = require('./common');

async function test12SelfSkipTeaching(browser) {
    console.log('\n📋 Test 12: Self Page - Skip Coding Teaching Session');
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

        await page.click('#teaching-yes-btn');
        await delay(50);
        console.log('  ✓ Selected teaching session');

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
                'Teaching Session only',
                'Number of days practiced last week: 5',
                'ECBI/WACB score: 34',
                'Coached (mins): 5',
                'Additional notes:'
            ]
        );

        if (emailData.body.includes('TA (Neutral Talk)')) {
            throw new Error('Skip coding email should not contain behavior counts');
        }

        console.log('  ✓ Email shows teaching session with question values');
        console.log('  ✅ Test 12 PASSED');
        return true;

    } catch (error) {
        console.error('  ❌ Test 12 FAILED:', error.message);
        throw error;
    } finally {
        await page.close();
    }
}

module.exports = test12SelfSkipTeaching;