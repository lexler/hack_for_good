const {
    setupPage,
    verifyEmailData,
    delay
} = require('./common');

async function test3SkipCodingAlternative(browser) {
    console.log('\n📋 Test 3: Skip Coding - Alternative Session');
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

        await page.click('#teaching-no-btn');
        await delay(50);
        console.log('  ✓ Selected alternative session');

        const summaryText = await page.$eval('#summary-list', el => el.textContent);
        if (!summaryText.includes('Alternative Session')) {
            throw new Error(`Wrong summary: ${summaryText}`);
        }
        console.log('  ✓ Summary shows "Alternative Session"');

        await page.click('#did-not-collect');
        await page.click('#did-not-administer');
        await page.type('#coaching-time', '8');
        console.log('  ✓ Checked "Did not collect" and "Did not administer"');

        await page.click('#copy-email-btn');
        await delay(500);

        const emailData = await page.evaluate(() => window.testEmailData);

        verifyEmailData(
            emailData,
            '',
            '[PCIT Intermediary]',
            ['Did coding analysis: no', 'Coached (mins): 8']
        );

        const lines = emailData.clipboard.split('\n');
        if (lines.length !== 10) {
            throw new Error(`Expected 10 lines in clipboard, got ${lines.length}`);
        }

        for (let i = 0; i < 8; i++) {
            if (lines[i] !== '0') {
                throw new Error(`Line ${i+1} should be 0, got: ${lines[i]}`);
            }
        }

        if (lines[8] !== '' || lines[9] !== '') {
            throw new Error(`Questions should be empty when not collected`);
        }

        console.log('  ✓ Email and clipboard data correct');
        console.log('  ✅ Test 3 PASSED');
        return true;

    } catch (error) {
        console.error('  ❌ Test 3 FAILED:', error.message);
        throw error;
    } finally {
        await page.close();
    }
}

module.exports = test3SkipCodingAlternative;
