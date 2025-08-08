// Test 9: Question Validation - Did Not Administer
const { 
    setupPage,
    startSession,
    clickButton,
    finishEvaluation,
    verifyEmailData,
    delay 
} = require('./common');

async function test9ValidationDidNotAdminister(browser) {
    console.log('\n📋 Test 9: Question Validation - Did Not Administer');
    const page = await setupPage(browser);
    
    try {
        // Start session and add minimal counts
        await startSession(page);
        await clickButton(page, 'button[data-id="1"]', 1);  // TA: 1
        console.log('  ✓ Started session with count');
        
        // Finish evaluation
        await finishEvaluation(page);
        console.log('  ✓ Navigated to finish page');
        
        // Fill days practiced
        await page.type('#days-practiced', '5');
        
        // Check "Did not administer" checkbox
        await page.click('#did-not-administer');
        console.log('  ✓ Checked "Did not administer"');
        
        // Verify ECBI input is disabled
        const ecbiDisabled = await page.$eval('#ecbi-score', el => el.disabled);
        if (!ecbiDisabled) {
            throw new Error('ECBI score input should be disabled');
        }
        console.log('  ✓ ECBI input disabled');
        
        // Submit without ECBI score
        await page.click('#copy-email-btn');
        await delay(500);
        
        // Get validation error element
        const errorVisible = await page.$eval('#validation-error', el => {
            return window.getComputedStyle(el).display !== 'none';
        });
        
        if (errorVisible) {
            throw new Error('Should not show validation error when "Did not administer" is checked');
        }
        console.log('  ✓ No validation error');
        
        // Get captured email data
        const emailData = await page.evaluate(() => window.testEmailData);
        
        // Verify email shows "Questionnaire: no"
        if (!emailData.body.includes('Questionnaire: no')) {
            throw new Error(`Email should show questionnaire not administered: ${emailData.body}`);
        }
        console.log('  ✓ Email shows: Questionnaire: no');
        
        // Verify clipboard has days but no ECBI
        const lines = emailData.clipboard.split('\n');
        if (lines[8] !== '5') {  // 9th line is days practiced
            throw new Error(`Days practiced should be 5, got: "${lines[8]}"`);
        }
        if (lines[9] !== '') {  // 10th line (ECBI) should be empty
            throw new Error(`ECBI score should be empty in clipboard, got: "${lines[9]}"`);
        }
        
        console.log('  ✓ Submission succeeds');
        console.log('  ✅ Test 9 PASSED');
        return true;
        
    } catch (error) {
        console.error('  ❌ Test 9 FAILED:', error.message);
        throw error;
    } finally {
        await page.close();
    }
}

module.exports = test9ValidationDidNotAdminister;