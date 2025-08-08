// Test 2: Skip Coding - Teaching Session
const { 
    setupPage,
    verifyEmailData,
    delay 
} = require('./common');

async function test2SkipCodingTeaching(browser) {
    console.log('\n📋 Test 2: Skip Coding - Teaching Session');
    const page = await setupPage(browser);
    
    try {
        // Open settings and skip coding
        await page.click('#config-btn');
        await delay(100);  // Modal opening
        
        // Click skip coding and wait for navigation together
        await Promise.all([
            page.click('#skip-coding-btn'),
            page.waitForNavigation({ 
                waitUntil: 'networkidle0',
                timeout: 10000 
            })
        ]);
        console.log('  ✓ Navigated to skip coding');
        
        // Select Yes for teaching session
        await page.click('#teaching-yes-btn');
        await delay(50);  // Quick transition
        console.log('  ✓ Selected teaching session');
        
        // Verify summary shows teaching session
        const summaryText = await page.$eval('#summary-list', el => el.textContent);
        if (!summaryText.includes('Teaching Session only')) {
            throw new Error(`Wrong summary: ${summaryText}`);
        }
        console.log('  ✓ Summary shows "Teaching Session only"');
        
        // Fill questions
        await page.type('#days-practiced', '3');
        await page.type('#ecbi-score', '15');
        console.log('  ✓ Filled question fields');
        
        // Submit
        await page.click('#copy-email-btn');
        await delay(500);  // Time for email data capture
        
        // Get captured email data
        const emailData = await page.evaluate(() => window.testEmailData);
        
        // Verify email data
        verifyEmailData(
            emailData,
            'RACHEL.4.WILSON@cuanschutz.edu',
            '[PCIT Intermediary]',
            ['Did coding analysis: yes']
        );
        
        // Verify clipboard has zeros for counts but includes questions
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