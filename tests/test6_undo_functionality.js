// Test 6: Undo Functionality
const { 
    setupPage,
    startSession,
    clickButton,
    delay 
} = require('./common');

async function test6UndoFunctionality(browser) {
    console.log('\n📋 Test 6: Undo Functionality');
    const page = await setupPage(browser);
    
    try {
        // Start session
        await startSession(page);
        console.log('  ✓ Started session');
        
        // Click TA 3 times
        await clickButton(page, 'button[data-id="1"]', 3);
        let taCount = await page.$eval('button[data-id="1"] .count', el => el.textContent);
        if (taCount !== '3') {
            throw new Error(`TA count should be 3, got: ${taCount}`);
        }
        console.log('  ✓ TA count: 3');
        
        // Click BD 2 times
        await clickButton(page, 'button[data-id="2"]', 2);
        let bdCount = await page.$eval('button[data-id="2"] .count', el => el.textContent);
        if (bdCount !== '2') {
            throw new Error(`BD count should be 2, got: ${bdCount}`);
        }
        console.log('  ✓ BD count: 2');
        
        // First undo - should reduce BD to 1
        await page.click('#undo-direct-btn');
        await delay(50);
        bdCount = await page.$eval('button[data-id="2"] .count', el => el.textContent);
        if (bdCount !== '1') {
            throw new Error(`After first undo, BD should be 1, got: ${bdCount}`);
        }
        console.log('  ✓ First undo: BD → 1');
        
        // Second undo - should reduce BD to 0
        await page.click('#undo-direct-btn');
        await delay(50);
        bdCount = await page.$eval('button[data-id="2"] .count', el => el.textContent);
        if (bdCount !== '0') {
            throw new Error(`After second undo, BD should be 0, got: ${bdCount}`);
        }
        console.log('  ✓ Second undo: BD → 0');
        
        // Third undo - should reduce TA to 2
        await page.click('#undo-direct-btn');
        await delay(50);
        taCount = await page.$eval('button[data-id="1"] .count', el => el.textContent);
        if (taCount !== '2') {
            throw new Error(`After third undo, TA should be 2, got: ${taCount}`);
        }
        console.log('  ✓ Third undo: TA → 2');
        
        // Verify action history is maintained correctly
        console.log('  ✓ Action history maintained correctly');
        
        console.log('  ✅ Test 6 PASSED');
        return true;
        
    } catch (error) {
        console.error('  ❌ Test 6 FAILED:', error.message);
        throw error;
    } finally {
        await page.close();
    }
}

module.exports = test6UndoFunctionality;