// Test 10: Return Navigation Flow
const { 
    setupPage,
    startSession,
    clickButton,
    finishEvaluation,
    delay 
} = require('./common');

async function test10ReturnNavigation(browser) {
    console.log('\n📋 Test 10: Return Navigation Flow');
    const page = await setupPage(browser);
    
    try {
        // First session - add some counts
        await startSession(page);
        await clickButton(page, 'button[data-id="1"]', 2);  // TA: 2
        await clickButton(page, 'button[data-id="2"]', 3);  // BD: 3
        console.log('  ✓ First session started with counts');
        
        // Finish evaluation
        await finishEvaluation(page);
        console.log('  ✓ Navigated to finish page');
        
        // Verify we're on finish page
        let url = page.url();
        if (!url.includes('finish_evaluation.html')) {
            throw new Error('Should be on finish page');
        }
        
        // Fill minimal data
        await page.type('#days-practiced', '2');
        await page.type('#ecbi-score', '10');
        
        // Click Exit to return
        await page.click('#combined-return-btn');
        await delay(200);
        console.log('  ✓ Clicked Exit button');
        
        // Verify returned to counter page
        url = page.url();
        if (!url.includes('/index.html')) {
            throw new Error(`Should return to index.html, got: ${url}`);
        }
        console.log('  ✓ Returned to /v2/index.html');
        
        // Verify all counts reset
        const counts = await page.evaluate(() => {
            const buttons = document.querySelectorAll('.count-button .count');
            return Array.from(buttons).map(el => el.textContent);
        });
        
        for (const count of counts) {
            if (count !== '0') {
                throw new Error(`Count should be 0 after return, got: ${count}`);
            }
        }
        console.log('  ✓ All counts reset');
        
        // Verify timer ready to start
        const buttonText = await page.$eval('#button-text', el => el.textContent);
        if (buttonText !== 'Start') {
            throw new Error(`Button should show "Start", got: ${buttonText}`);
        }
        console.log('  ✓ Timer ready to start');
        
        // Start new session to verify it works
        await startSession(page);
        await clickButton(page, 'button[data-id="1"]', 1);
        const newCount = await page.$eval('button[data-id="1"] .count', el => el.textContent);
        if (newCount !== '1') {
            throw new Error(`New session should work, TA should be 1, got: ${newCount}`);
        }
        console.log('  ✓ New session works correctly');
        
        console.log('  ✅ Test 10 PASSED');
        return true;
        
    } catch (error) {
        console.error('  ❌ Test 10 FAILED:', error.message);
        throw error;
    } finally {
        await page.close();
    }
}

module.exports = test10ReturnNavigation;