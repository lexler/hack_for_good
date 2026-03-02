const {
    setupPage,
    startSession,
    clickButton,
    finishEvaluation,
    verifyEmailData,
    delay
} = require('./common');

async function test1HappyPath(browser) {
    console.log('\n📋 Test 1: Happy Path - Complete Session Flow');
    const page = await setupPage(browser);

    try {
        console.log('  ✓ Opened counter app');

        await startSession(page);
        console.log('  ✓ Started session');

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

        console.log('  ⏩ Manually finishing evaluation...');
        await finishEvaluation(page);

        const url = page.url();
        if (!url.includes('finish_evaluation_denver.html')) {
            throw new Error(`Expected finish_evaluation_denver.html, got: ${url}`);
        }
        console.log('  ✓ Redirected to finish page');

        if (!url.includes('c1=1&c2=2&c3=3&c4=4') || !url.includes('c6=5&c7=6&c8=7&c9=8')) {
            throw new Error(`Incorrect counts in URL: ${url}`);
        }
        console.log('  ✓ URL parameters correct');

        await page.type('#days-practiced', '1');
        await page.type('#ecbi-score', '21');
        await page.type('#coaching-time', '5');
        console.log('  ✓ Filled question fields');

        await page.click('#copy-email-btn');
        await delay(500);

        const emailData = await page.evaluate(() => window.testEmailData);

        verifyEmailData(
            emailData,
            '',
            '[PCIT Intermediary]',
            ['Questionnaire: yes', 'Asked about homework: yes', 'Did coding analysis: yes', 'Coached (mins): 5']
        );

        const expectedClipboard = '1\n2\n3\n4\n5\n6\n7\n8\n1\n21';
        if (emailData.clipboard !== expectedClipboard) {
            throw new Error(`Wrong clipboard data: ${emailData.clipboard}`);
        }

        console.log('  ✓ Email and clipboard data correct');
        console.log('  ✅ Test 1 PASSED');
        return true;

    } catch (error) {
        console.error('  ❌ Test 1 FAILED:', error.message);
        throw error;
    } finally {
        await page.close();
    }
}

module.exports = test1HappyPath;
