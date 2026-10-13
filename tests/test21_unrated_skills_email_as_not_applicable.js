const {
    setupSelfPage,
    finishCodedSession,
    answerQuestions,
    sendResults,
    verifyEmailData
} = require('./common');

async function test21UnratedSkillsEmailAsNotApplicable(browser) {
    console.log('\n📋 Test 21: Unrated Skills Email as Not Applicable');
    const page = await setupSelfPage(browser);

    try {
        await finishCodedSession(page);
        await answerQuestions(page, { daysPracticed: 5, ecbiScore: 34, coachingMinutes: 5 });

        const email = await sendResults(page);

        verifyEmailData(email, '', '[PCIT Intermediary]', [
            'Imitate: Not Applicable',
            'Show Enjoyment: Not Applicable',
            'Ignore Disruptive Bx: Not Applicable'
        ]);
        console.log('  ✓ All three go out as Not Applicable');

        console.log('  ✅ Test 21 PASSED');
        return true;

    } catch (error) {
        console.error('  ❌ Test 21 FAILED:', error.message);
        throw error;
    } finally {
        await page.close();
    }
}

module.exports = test21UnratedSkillsEmailAsNotApplicable;
