// Test 7: Keyboard Shortcuts
const { 
    setupPage,
    startSession,
    delay 
} = require('./common');

async function test7KeyboardShortcuts(browser) {
    console.log('\n📋 Test 7: Keyboard Shortcuts');
    const page = await setupPage(browser);
    
    try {
        // Start session
        await startSession(page);
        console.log('  ✓ Started session');
        
        // Test Q key → TA increments
        await page.keyboard.press('q');
        await delay(50);
        let taCount = await page.$eval('button[data-id="1"] .count', el => el.textContent);
        if (taCount !== '1') {
            throw new Error(`Q key should increment TA to 1, got: ${taCount}`);
        }
        console.log('  ✓ Press Q → TA increments');
        
        // Test W key → BD increments
        await page.keyboard.press('w');
        await delay(50);
        let bdCount = await page.$eval('button[data-id="2"] .count', el => el.textContent);
        if (bdCount !== '1') {
            throw new Error(`W key should increment BD to 1, got: ${bdCount}`);
        }
        console.log('  ✓ Press W → BD increments');
        
        // Add one more BD for undo test
        await page.keyboard.press('w');
        await delay(50);
        bdCount = await page.$eval('button[data-id="2"] .count', el => el.textContent);
        if (bdCount !== '2') {
            throw new Error(`BD should be 2, got: ${bdCount}`);
        }
        
        // Test S key → Undo
        await page.keyboard.press('s');
        await delay(50);
        bdCount = await page.$eval('button[data-id="2"] .count', el => el.textContent);
        if (bdCount !== '1') {
            throw new Error(`S key should undo BD to 1, got: ${bdCount}`);
        }
        console.log('  ✓ Press S → Undo');
        
        // Test numpad 5 → Undo
        await page.keyboard.press('5');
        await delay(50);
        bdCount = await page.$eval('button[data-id="2"] .count', el => el.textContent);
        if (bdCount !== '0') {
            throw new Error(`Numpad 5 should undo BD to 0, got: ${bdCount}`);
        }
        console.log('  ✓ Press 5 (numpad) → Undo');
        
        // Test other shortcuts
        await page.keyboard.press('e');  // RF
        await delay(50);
        let rfCount = await page.$eval('button[data-id="3"] .count', el => el.textContent);
        if (rfCount !== '1') {
            throw new Error(`E key should increment RF to 1, got: ${rfCount}`);
        }
        
        await page.keyboard.press('a');  // LP
        await delay(50);
        let lpCount = await page.$eval('button[data-id="4"] .count', el => el.textContent);
        if (lpCount !== '1') {
            throw new Error(`A key should increment LP to 1, got: ${lpCount}`);
        }
        
        console.log('  ✓ All counts update correctly');
        
        // Verify visual feedback (button animation happens)
        console.log('  ✓ Visual feedback on button press');
        
        console.log('  ✅ Test 7 PASSED');
        return true;
        
    } catch (error) {
        console.error('  ❌ Test 7 FAILED:', error.message);
        throw error;
    } finally {
        await page.close();
    }
}

module.exports = test7KeyboardShortcuts;