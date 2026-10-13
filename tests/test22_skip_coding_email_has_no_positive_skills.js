const {
    setupSelfPage,
    POSITIVE_SKILLS,
    skipCodingAsTeachingSession,
    answerQuestions,
    sendResults
} = require('./common');

async function test22SkipCodingEmailHasNoPositiveSkills(browser) {
    console.log('\n📋 Test 22: Skip Coding Email Has No Positive Skills');
    const page = await setupSelfPage(browser);

    try {
        await skipCodingAsTeachingSession(page);
        await answerQuestions(page, { daysPracticed: 5, ecbiScore: 34, coachingMinutes: 5 });

        const email = await sendResults(page);

        const mentionedSkills = POSITIVE_SKILLS.filter(skill => email.body.includes(skill));
        if (mentionedSkills.length > 0) {
            throw new Error(`Email mentions ${mentionedSkills.join(', ')}, but no coding happened`);
        }
        console.log('  ✓ No positive skills in the email');

        console.log('  ✅ Test 22 PASSED');
        return true;

    } catch (error) {
        console.error('  ❌ Test 22 FAILED:', error.message);
        throw error;
    } finally {
        await page.close();
    }
}

module.exports = test22SkipCodingEmailHasNoPositiveSkills;
