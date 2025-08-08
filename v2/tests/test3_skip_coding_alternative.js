// Test 3: Skip Coding - Alternative Session
const { 
    setupPage,
    verifyEmailData,
    delay 
} = require('./common');

async function test3SkipCodingAlternative(browser) {
    console.log('\n📋 Test 3: Skip Coding - Alternative Session');
    const page = await setupPage(browser);
    
    try {
        // Open settings and skip coding
        await page.click('#config-btn');
        await delay(100);  // Modal opening
        
        // Click skip coding and wait for navigation
        await Promise.all([
            page.click('#skip-coding-btn'),
            page.waitForNavigation({ 
                waitUntil: 'networkidle0',
                timeout: 10000 
            })
        ]);
        console.log('  ✓ Navigated to skip coding');
        
        // Select No for teaching session (alternative session)
        await page.click('#teaching-no-btn');
        await delay(50);  // Quick transition
        console.log('  ✓ Selected alternative session');
        
        // Verify summary shows alternative session
        const summaryText = await page.$eval('#summary-list', el => el.textContent);
        if (!summaryText.includes('Alternative Session')) {
            throw new Error(`Wrong summary: ${summaryText}`);
        }
        console.log('  ✓ Summary shows "Alternative Session"');
        
        // Check "Did not collect" and "Did not administer"
        await page.click('#did-not-collect');
        await page.click('#did-not-administer');
        console.log('  ✓ Checked "Did not collect" and "Did not administer"');
        
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
            ['Did coding analysis: no']
        );
        
        // Verify clipboard has zeros for counts and empty lines for questions
        const lines = emailData.clipboard.split('\n');
        if (lines.length !== 10) {
            throw new Error(`Expected 10 lines in clipboard, got ${lines.length}`);
        }
        
        // First 8 lines should be zeros (counts)
        for (let i = 0; i < 8; i++) {
            if (lines[i] !== '0') {
                throw new Error(`Line ${i+1} should be 0, got: ${lines[i]}`);
            }
        }
        
        // Last 2 lines should be empty (uncollected questions)
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