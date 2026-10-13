const {
    setupSelfPage,
    POSITIVE_SKILLS,
    finishCodedSession,
    positiveSkillsAreShown,
    ratingOf,
    expectRating
} = require('./common');

async function test17PositiveSkillsStartNotApplicable(browser) {
    console.log('\n📋 Test 17: Positive Skills Start at Not Applicable');
    const page = await setupSelfPage(browser);

    try {
        await finishCodedSession(page);

        if (!await positiveSkillsAreShown(page)) {
            throw new Error('Positive skills are not shown on the results page');
        }
        console.log('  ✓ Positive skills are shown');

        for (const skill of POSITIVE_SKILLS) {
            expectRating(await ratingOf(page, skill), skill, 'Not Applicable');
        }
        console.log('  ✓ All three start at Not Applicable');

        console.log('  ✅ Test 17 PASSED');
        return true;

    } catch (error) {
        console.error('  ❌ Test 17 FAILED:', error.message);
        throw error;
    } finally {
        await page.close();
    }
}

module.exports = test17PositiveSkillsStartNotApplicable;
