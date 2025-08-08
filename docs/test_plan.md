# Test Plan

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

## Test 2: Skip Coding - Teaching Session

## Test 3: Skip Coding - Alternative Session

## Test 4: Manual Finish Evaluation

## Test 5: Cancel Evaluation

## Test 6: Undo Functionality

## Test 7: Keyboard Shortcuts

## Test 8: Question Validation - Did Not Collect

## Test 9: Question Validation - Did Not Administer

## Test 10: Return Navigation Flow