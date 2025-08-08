// Test 3: Manual Finish Evaluation
const { 
    setupPage,
    startSession,
    clickButton,
    finishEvaluation,
    delay 
} = require('./common');

async function test3ManualFinish(browser) {
    console.log('\n📋 Test 3: Manual Finish Evaluation');
    const page = await setupPage(browser);
    
    try {
        // Start and add some counts
        await startSession(page);
        console.log('  ✓ Started session');
        
        await clickButton(page, 'button[data-id="1"]', 2);  // TA: 2
        await clickButton(page, 'button[data-id="2"]', 1);  // BD: 1
        console.log('  ✓ Added counts (TA: 2, BD: 1)');
        
        // Manual finish before timer expires
        await finishEvaluation(page);
        console.log('  ✓ Manually finished evaluation');
        
        // Verify URL
        const url = page.url();
        if (!url.includes('finish_evaluation.html')) {
            throw new Error(`Expected finish_evaluation.html, got: ${url}`);
        }
        
        if (!url.includes('c1=2&c2=1')) {
            throw new Error(`Incorrect counts in manual finish: ${url}`);
        }
        
        // Verify other counts are 0
        if (!url.includes('c3=0') || !url.includes('c4=0')) {
            throw new Error(`Other counts should be 0: ${url}`);
        }
        
        console.log('  ✓ Manual finish with correct counts');
        console.log('  ✅ Test 3 PASSED');
        return true;
        
    } catch (error) {
        console.error('  ❌ Test 3 FAILED:', error.message);
        throw error;
    } finally {
        await page.close();
    }
}

module.exports = test3ManualFinish;