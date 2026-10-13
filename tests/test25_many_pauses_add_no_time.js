const {
    setupSelfPage,
    startSession,
    openSettings,
    returnFromSettings,
    secondsLeftOnTimer,
    delay
} = require('./common');

const TEST_SESSION_SECONDS = 30;
const PAUSES = 8;
const RUN_BETWEEN_PAUSES_MS = 400;
const PAUSE_MS = 300;
const ONE_SECOND_TICK_TOLERANCE = 1;

async function test25ManyPausesAddNoTime(browser) {
    console.log('\n📋 Test 25: Many Pauses Add No Time');
    const page = await setupSelfPage(browser);

    try {
        await startSession(page);
        let runningMs = 0;
        let runningSince = Date.now();

        for (let pause = 0; pause < PAUSES; pause++) {
            await delay(RUN_BETWEEN_PAUSES_MS);
            await page.click('#config-btn');
            runningMs += Date.now() - runningSince;
            await delay(PAUSE_MS);
            await returnFromSettings(page);
            runningSince = Date.now();
        }
        await openSettings(page);
        runningMs += Date.now() - runningSince;

        const expectedSecondsLeft = TEST_SESSION_SECONDS - Math.floor(runningMs / 1000);
        const actualSecondsLeft = await secondsLeftOnTimer(page);
        if (Math.abs(actualSecondsLeft - expectedSecondsLeft) > ONE_SECOND_TICK_TOLERANCE) {
            throw new Error(`After ${PAUSES} pauses and ${(runningMs / 1000).toFixed(1)}s of counting: expected about ${expectedSecondsLeft}s left, got ${actualSecondsLeft}s`);
        }
        console.log(`  ✓ ${PAUSES} pauses: time left matches the ${(runningMs / 1000).toFixed(1)}s actually counted`);

        console.log('  ✅ Test 25 PASSED');
        return true;

    } catch (error) {
        console.error('  ❌ Test 25 FAILED:', error.message);
        throw error;
    } finally {
        await page.close();
    }
}

module.exports = test25ManyPausesAddNoTime;
