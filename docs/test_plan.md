# Test Plan

---

## Test 1: Happy Path - Complete Session Flow

### Setup
- Open the counter app at `/v2/index.html`
- Ensure timer is set to test duration (10 seconds for localhost)

### Step 1: Start Session
- Click the **Start** button to begin counting

### Step 2: Click Count Buttons
Execute these clicks in sequence:

| Button | Label | Clicks | Final Count |
|--------|-------|---------|-------------|
| 1 | TA (Talk) | 1 | 1 |
| 2 | BD (Behavior Description) | 2 | 2 |
| 3 | RF (Reflection) | 3 | 3 |
| 4 | LP (Labeled Praise) | 5 | 5 |
| 5 | **Undo** | 1 | LP → 4 |
| 6 | UP (Unlabeled Praise) | 5 | 5 |
| 7 | QU (Question) | 6 | 6 |
| 8 | CM (Command) | 7 | 7 |
| 9 | NTA (Negative Talk) | 8 | 8 |

### Step 3: Timer Expiration
- Wait for timer to expire (automatic redirect to finish page)
- Verify URL: `finish_evaluation.html?c1=1&c2=2&c3=3&c4=4&c6=5&c7=6&c8=7&c9=8&skip=false`

### Step 4: Verify Counts Display
Confirm summary shows:
- TA: 1
- BD: 2  
- RF: 3
- LP: 4
- UP: 5
- QU: 6
- CM: 7
- NTA: 8

### Step 5: Complete Questions
- Days practiced: **1**
- ECBI/WACB score: **21**

### Step 6: Submit & Verify Email
- Click **Copy & Email Results**
- Verify clipboard contains:
  ```
  1
  2
  3
  4
  5
  6
  7
  8
  1
  21
  ```
- Verify email opens with:
  - To: `RACHEL.4.WILSON@cuanschutz.edu`
  - Subject: `[PCIT Intermediary]`
  - Body:
    ```
    Questionnaire: yes
    Asked about homework: yes
    Did coding analysis: yes
    ```

### Expected Outcome
- All counts transferred correctly
- Questions recorded properly
- Email formatted correctly with proper recipient and content

---------------------------------------------------------------------------------------
## Test 2: Skip Coding - Teaching Session

### Steps
1. Click **Settings** → **Skip Coding**
2. Redirects to finish page with `skip=true`
3. Select **Yes** for teaching session
4. Fill questions (Days: 3, ECBI: 15)
5. Click **Copy & Email Results**

### Verify
- Summary shows: "Teaching Session only"
- Email body: `Did coding analysis: yes`
- Clipboard: `0\n0\n0\n0\n0\n0\n0\n0\n3\n15`

---------------------------------------------------------------------------------------
## Test 3: Skip Coding - Alternative Session

### Steps
1. Click **Settings** → **Skip Coding**
2. Select **No** for teaching session
3. Check "Did not collect" and "Did not administer"

### Verify
- Summary shows: "Alternative Session"
- Email body: `Did coding analysis: no`
- Clipboard has empty lines for questions

---------------------------------------------------------------------------------------
## Test 4: Manual Finish Evaluation

### Steps
1. Start session, add counts (TA: 2, BD: 1)
2. Click **Settings** → **Finish Evaluation**
3. Redirects before timer expires

### Verify
- URL contains: `c1=2&c2=1&c3=0...&skip=false`
- Counts display correctly

---------------------------------------------------------------------------------------
## Test 5: Cancel Evaluation

### Steps
1. Start session, add counts
2. Click **Settings** → **Cancel Evaluation**

### Verify
- All counts reset to 0
- Timer resets to initial duration
- Remains on counter page

---------------------------------------------------------------------------------------
## Test 6: Undo Functionality

### Steps
1. Click TA (3 times), BD (2 times)
2. Click **Undo** twice

### Verify
- First undo: BD → 1
- Second undo: BD → 0
- Action history maintained correctly

---------------------------------------------------------------------------------------
## Test 7: Keyboard Shortcuts

### Steps
Use keyboard instead of clicking:
- Press `Q` → TA increments
- Press `W` → BD increments  
- Press `S` → Undo
- Press `5` (numpad) → Undo

### Verify
- All counts update correctly
- Visual feedback on button press

---------------------------------------------------------------------------------------
## Test 8: Question Validation - Did Not Collect

### Steps
1. Complete session normally
2. On finish page, check **Did not collect**
3. Leave days practiced empty

### Verify
- Days input disabled
- Email shows: `Asked about homework: no`
- No validation error

---------------------------------------------------------------------------------------
## Test 9: Question Validation - Did Not Administer

### Steps
1. Complete session
2. Check **Did not administer**
3. Submit without ECBI score

### Verify
- ECBI input disabled
- Email shows: `Questionnaire: no`
- Submission succeeds

---------------------------------------------------------------------------------------
## Test 10: Return Navigation Flow

### Steps
1. Complete any session type
2. Click **Exit** on finish page
3. Start new session

### Verify
- Returns to `/v2/index.html`
- All counts reset
- Timer ready to start