const {
    setupSelfPage,
    startSession,
    openSettings,
    returnFromSettings,
    secondsLeftOnTimer,
    waitSeconds,
    waitUntilCatchUpWindow,
    isOnCounterPage
} = require('./common');

async function test24SettingsPausesCatchUpWindow(browser) {
    console.log('\n📋 Test 24: Settings Pauses the Catch-Up Window');
    const page = await setupSelfPage(browser);

    try {
        await startSession(page);
        await waitUntilCatchUpWindow(page);

        await openSettings(page);
        const catchUpSecondsWhenPaused = await secondsLeftOnTimer(page);
        await waitSeconds(4);

        if (!await isOnCounterPage(page)) {
            throw new Error('Session ended while settings were open in the catch-up window');
        }
        const catchUpSecondsNow = await secondsLeftOnTimer(page);
        if (catchUpSecondsNow !== catchUpSecondsWhenPaused) {
            throw new Error(`Catch-up window kept counting: ${catchUpSecondsWhenPaused}s → ${catchUpSecondsNow}s`);
        }
        console.log('  ✓ Catch-up window stands still while settings are open');

        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 }),
            returnFromSettings(page)
        ]);
        if (!page.url().includes('finish_evaluation_self.html')) {
            throw new Error(`Expected the results page after the catch-up window, got: ${page.url()}`);
        }
        console.log('  ✓ After Return, the catch-up window runs out and results open');

        console.log('  ✅ Test 24 PASSED');
        return true;

    } catch (error) {
        console.error('  ❌ Test 24 FAILED:', error.message);
        throw error;
    } finally {
        await page.close();
    }
}

module.exports = test24SettingsPausesCatchUpWindow;
