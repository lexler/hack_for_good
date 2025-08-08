// Test 1: Happy Path - Complete Session Flow
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
        
        // Click counts according to test plan
        await page.waitForSelector('button[data-id="1"]');
        await clickButton(page, 'button[data-id="1"]', 1);  // TA: 1
        await clickButton(page, 'button[data-id="2"]', 2);  // BD: 2
        await clickButton(page, 'button[data-id="3"]', 3);  // RF: 3
        await clickButton(page, 'button[data-id="4"]', 5);  // LP: 5
        await clickButton(page, 'button[id="undo-direct-btn"]', 1);  // Undo: LP→4
        await clickButton(page, 'button[data-id="6"]', 5);  // UP: 5
        await clickButton(page, 'button[data-id="7"]', 6);  // QU: 6
        await clickButton(page, 'button[data-id="8"]', 7);  // CM: 7
        await clickButton(page, 'button[data-id="9"]', 8);  // NTA: 8
        console.log('  ✓ Clicked all count buttons');
        
        // Manual finish (faster than waiting for timer)
        console.log('  ⏩ Manually finishing evaluation...');
        await finishEvaluation(page);
        
        // Verify redirect to finish page
        const url = page.url();
        if (!url.includes('finish_evaluation.html')) {
            throw new Error(`Expected finish_evaluation.html, got: ${url}`);
        }
        console.log('  ✓ Redirected to finish page');
        
        // Verify URL parameters
        if (!url.includes('c1=1&c2=2&c3=3&c4=4') || !url.includes('c6=5&c7=6&c8=7&c9=8')) {
            throw new Error(`Incorrect counts in URL: ${url}`);
        }
        console.log('  ✓ URL parameters correct');
        
        // Fill in questions
        await page.type('#days-practiced', '1');
        await page.type('#ecbi-score', '21');
        console.log('  ✓ Filled question fields');
        
        // Submit form
        await page.click('#copy-email-btn');
        await delay(500);  // Time for email data capture
        
        // Get captured email data
        const emailData = await page.evaluate(() => window.testEmailData);
        
        // Verify email data
        verifyEmailData(
            emailData,
            'RACHEL.4.WILSON@cuanschutz.edu',
            '[PCIT Intermediary]',
            ['Questionnaire: yes', 'Asked about homework: yes', 'Did coding analysis: yes']
        );
        
        // Verify clipboard data
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