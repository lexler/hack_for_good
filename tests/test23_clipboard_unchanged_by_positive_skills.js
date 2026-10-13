const {
    setupSelfPage,
    finishCodedSession,
    rate,
    answerQuestions,
    sendResults
} = require('./common');

async function test23ClipboardUnchangedByPositiveSkills(browser) {
    console.log('\n📋 Test 23: Clipboard Unchanged by Positive Skills');
    const page = await setupSelfPage(browser);

    try {
        await finishCodedSession(page);
        await rate(page, 'Imitate', 'Satisfactory');
        await answerQuestions(page, { daysPracticed: 5, ecbiScore: 34, coachingMinutes: 5 });

        const { clipboard } = await sendResults(page);

        const eightCountsThenDaysThenScore = '0\n0\n0\n0\n0\n0\n0\n0\n5\n34';
        if (clipboard !== eightCountsThenDaysThenScore) {
            throw new Error(`Clipboard changed: got ${JSON.stringify(clipboard)}`);
        }
        console.log('  ✓ Clipboard is still the 8 counts, days and score');

        console.log('  ✅ Test 23 PASSED');
        return true;

    } catch (error) {
        console.error('  ❌ Test 23 FAILED:', error.message);
        throw error;
    } finally {
        await page.close();
    }
}

module.exports = test23ClipboardUnchangedByPositiveSkills;
