const {
    setupSelfPage,
    skipCodingAsTeachingSession,
    positiveSkillsAreShown
} = require('./common');

async function test19SkipCodingHidesPositiveSkills(browser) {
    console.log('\n📋 Test 19: Skip Coding Hides Positive Skills');
    const page = await setupSelfPage(browser);

    try {
        await skipCodingAsTeachingSession(page);

        if (await positiveSkillsAreShown(page)) {
            throw new Error('Positive skills are shown, but no coding happened');
        }
        console.log('  ✓ Positive skills are hidden');

        console.log('  ✅ Test 19 PASSED');
        return true;

    } catch (error) {
        console.error('  ❌ Test 19 FAILED:', error.message);
        throw error;
    } finally {
        await page.close();
    }
}

module.exports = test19SkipCodingHidesPositiveSkills;
