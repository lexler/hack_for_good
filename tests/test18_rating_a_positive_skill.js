const {
    setupSelfPage,
    finishCodedSession,
    ratingOf,
    rate,
    expectRating
} = require('./common');

async function test18RatingAPositiveSkill(browser) {
    console.log('\n📋 Test 18: Rating a Positive Skill');
    const page = await setupSelfPage(browser);

    try {
        await finishCodedSession(page);

        await rate(page, 'Imitate', 'Satisfactory');
        expectRating(await ratingOf(page, 'Imitate'), 'Imitate', 'Satisfactory');
        expectRating(await ratingOf(page, 'Show Enjoyment'), 'Show Enjoyment', 'Not Applicable');
        expectRating(await ratingOf(page, 'Ignore Disruptive Bx'), 'Ignore Disruptive Bx', 'Not Applicable');
        console.log('  ✓ Rating Imitate leaves the others alone');

        await rate(page, 'Imitate', 'Needs Practice');
        expectRating(await ratingOf(page, 'Imitate'), 'Imitate', 'Needs Practice');
        console.log('  ✓ A new rating replaces the old one');

        console.log('  ✅ Test 18 PASSED');
        return true;

    } catch (error) {
        console.error('  ❌ Test 18 FAILED:', error.message);
        throw error;
    } finally {
        await page.close();
    }
}

module.exports = test18RatingAPositiveSkill;
