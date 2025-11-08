const {
    setupPage,
    verifyEmailData,
    delay
} = require('./common');

async function test2SkipCodingTeaching(browser) {
    console.log('\n📋 Test 2: Skip Coding - Teaching Session');
    const page = await setupPage(browser);

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

        const summaryText = await page.$eval('#summary-list', el => el.textContent);
        if (!summaryText.includes('Teaching Session only')) {
            throw new Error(`Wrong summary: ${summaryText}`);
        }
        console.log('  ✓ Summary shows "Teaching Session only"');

        await page.type('#days-practiced', '3');
        await page.type('#ecbi-score', '15');
        await page.type('#coaching-time', '10');
        console.log('  ✓ Filled question fields');

        await page.click('#copy-email-btn');
        await delay(500);

        const emailData = await page.evaluate(() => window.testEmailData);

        verifyEmailData(
            emailData,
            '',
            '[PCIT Intermediary]',
            ['Did coding analysis: yes', 'Coached (mins): 10']
        );

        const expectedClipboard = '0\n0\n0\n0\n0\n0\n0\n0\n3\n15';
        if (emailData.clipboard !== expectedClipboard) {
            throw new Error(`Wrong clipboard data: ${emailData.clipboard}`);
        }

        console.log('  ✓ Email shows teaching session');
        console.log('  ✅ Test 2 PASSED');
        return true;

    } catch (error) {
        console.error('  ❌ Test 2 FAILED:', error.message);
        throw error;
    } finally {
        await page.close();
    }
}

module.exports = test2SkipCodingTeaching;
