const {
    setupSelfPage,
    finishCodedSession,
    rate,
    answerQuestions,
    sendResults,
    verifyEmailData
} = require('./common');

async function test20EmailIncludesPositiveSkillRatings(browser) {
    console.log('\n📋 Test 20: Email Includes Positive Skill Ratings');
    const page = await setupSelfPage(browser);

    try {
        await finishCodedSession(page);
        await rate(page, 'Imitate', 'Satisfactory');
        await rate(page, 'Show Enjoyment', 'Needs Practice');
        await answerQuestions(page, { daysPracticed: 5, ecbiScore: 34, coachingMinutes: 5 });

        const email = await sendResults(page);

        verifyEmailData(email, '', '[PCIT Intermediary]', [
            'NTA (Negative Talk): 0\n' +
            '\n' +
            'Imitate: Satisfactory\n' +
            'Show Enjoyment: Needs Practice\n' +
            'Ignore Disruptive Bx: Not Applicable\n' +
            '\n' +
            'Number of days practiced last week: 5'
        ]);
        console.log('  ✓ Ratings follow the counts after an empty line, before the questions');

        console.log('  ✅ Test 20 PASSED');
        return true;

    } catch (error) {
        console.error('  ❌ Test 20 FAILED:', error.message);
        throw error;
    } finally {
        await page.close();
    }
}

module.exports = test20EmailIncludesPositiveSkillRatings;
