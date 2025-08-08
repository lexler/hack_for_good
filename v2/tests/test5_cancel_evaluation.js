// Test 5: Cancel Evaluation
const { 
    setupPage,
    startSession,
    clickButton,
    openSettings,
    delay 
} = require('./common');

async function test5CancelEvaluation(browser) {
    console.log('\n📋 Test 5: Cancel Evaluation');
    const page = await setupPage(browser);
    
    try {
        // Start session and add some counts
        await startSession(page);
        console.log('  ✓ Started session');
        
        await clickButton(page, 'button[data-id="1"]', 3);  // TA: 3
        await clickButton(page, 'button[data-id="2"]', 2);  // BD: 2
        console.log('  ✓ Added counts (TA: 3, BD: 2)');
        
        // Get initial timer display
        const timerBefore = await page.$eval('#timer-display', el => el.textContent);
        
        // Open settings and cancel
        await openSettings(page);
        await page.click('#cancel-btn');
        await delay(100);
        console.log('  ✓ Clicked Cancel Evaluation');
        
        // Verify we're still on counter page
        const url = page.url();
        if (url.includes('finish_evaluation.html')) {
            throw new Error('Should not navigate to finish page after cancel');
        }
        console.log('  ✓ Remained on counter page');
        
        // Verify all counts reset to 0
        const counts = await page.evaluate(() => {
            const buttons = document.querySelectorAll('.count-button .count');
            return Array.from(buttons).map(el => el.textContent);
        });
        
        for (const count of counts) {
            if (count !== '0') {
                throw new Error(`Count should be 0 after cancel, got: ${count}`);
            }
        }
        console.log('  ✓ All counts reset to 0');
        
        // Verify timer reset
        const timerAfter = await page.$eval('#timer-display', el => el.textContent);
        const buttonText = await page.$eval('#button-text', el => el.textContent);
        
        if (buttonText !== 'Start') {
            throw new Error(`Button should show "Start" after cancel, got: ${buttonText}`);
        }
        console.log('  ✓ Timer reset to initial state');
        
        console.log('  ✅ Test 5 PASSED');
        return true;
        
    } catch (error) {
        console.error('  ❌ Test 5 FAILED:', error.message);
        throw error;
    } finally {
        await page.close();
    }
}

module.exports = test5CancelEvaluation;