const {
    setupSelfPage,
    startSession,
    openSettings,
    returnFromSettings,
    secondsLeftOnTimer,
    waitSeconds
} = require('./common');

const ONE_SECOND_TICK_TOLERANCE = 1;

function expectSecondsLeft(actual, expected, moment) {
    if (Math.abs(actual - expected) > ONE_SECOND_TICK_TOLERANCE) {
        throw new Error(`Timer ${moment}: expected about ${expected}s left, got ${actual}s`);
    }
}

async function test16SettingsPausesTimer(browser) {
    console.log('\n📋 Test 16: Opening Settings Pauses the Timer');
    const page = await setupSelfPage(browser);

    try {
        await startSession(page);
        await waitSeconds(2);

        await openSettings(page);
        const secondsLeftWhenPaused = await secondsLeftOnTimer(page);
        await waitSeconds(3);
        expectSecondsLeft(await secondsLeftOnTimer(page), secondsLeftWhenPaused, 'while settings are open');
        console.log('  ✓ Timer stands still while settings are open');

        await returnFromSettings(page);
        await waitSeconds(2);
        expectSecondsLeft(await secondsLeftOnTimer(page), secondsLeftWhenPaused - 2, 'two seconds after returning');
        console.log('  ✓ Timer carries on from where it paused');

        console.log('  ✅ Test 16 PASSED');
        return true;

    } catch (error) {
        console.error('  ❌ Test 16 FAILED:', error.message);
        throw error;
    } finally {
        await page.close();
    }
}

module.exports = test16SettingsPausesTimer;
