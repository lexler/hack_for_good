const {
    setupSelfPage,
    startSession,
    openSettings,
    returnFromSettings,
    secondsLeftOnTimer,
    waitSeconds,
    waitUntilSecondsLeft,
    isOnCounterPage,
    isInCatchUpWindow
} = require('./common');

async function test26SettingsOpenPastTheEndKeepsSession(browser) {
    console.log('\n📋 Test 26: Settings Open Past the End Keeps the Session');
    const page = await setupSelfPage(browser);

    try {
        await startSession(page);
        await waitUntilSecondsLeft(page, 2);

        await openSettings(page);
        await waitSeconds(5);

        if (!await isOnCounterPage(page) || await isInCatchUpWindow(page)) {
            throw new Error('Session moved on while settings were open');
        }
        const secondsLeft = await secondsLeftOnTimer(page);
        if (secondsLeft !== 2) {
            throw new Error(`Expected the timer to wait at 2s left, got ${secondsLeft}s`);
        }
        console.log('  ✓ Timer waits at 0:02 while settings stay open past the end');

        await returnFromSettings(page);
        await waitSeconds(3);
        if (!await isInCatchUpWindow(page)) {
            throw new Error('Expected the catch-up window after the last 2 seconds ran out');
        }
        console.log('  ✓ After Return, the last 2 seconds run and the catch-up window starts');

        console.log('  ✅ Test 26 PASSED');
        return true;

    } catch (error) {
        console.error('  ❌ Test 26 FAILED:', error.message);
        throw error;
    } finally {
        await page.close();
    }
}

module.exports = test26SettingsOpenPastTheEndKeepsSession;
