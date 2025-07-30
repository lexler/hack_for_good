# Modal Redesign Plan

## Goal
Replace the current two-modal flow (Results → Questions) with a single combined modal that shows behavioral counts and collects additional data.

## Current Flow
```
Results Modal → Question Modal (homework yes/no, questionnaire yes/no) → Email
```

## New Flow
```
Combined Modal (Summary + Question subpanel) → Copy & Email
```
## Overall plan
CURRENT FLOW:
┌─────────────────┐    ┌─────────────────┐
│ Results Modal   │ -> │ Question Modal  │
│                 │    │                 │
│ TA (talk): 3    │    │ Did you ask     │
│ BD (behavior):2 │    │ about homework? │
│ RF (reflect):1  │    │                 │
│ LP (praise): 4  │    │ [YES] [NO]      │
│ UP (unlabel):6  │    │                 │
│ QU (question):0 │    │ -> Next question│
│ CM (command):1  │    │ Did you admin   │
│ NTA (critic):0  │    │ questionnaire?  │
│                 │    │                 │
│ [EMAIL RESULTS] │    │ [YES] [NO]      │
└─────────────────┘    └─────────────────┘

NEW PROPOSED FLOW (single modal):
┌─────────────────────────────────────┐
│ Modal                               │
│                                     │
│ ┌─────────┐ ┌─────────────────────┐ │
│ │Summary  │ │Question subpanel    │ │
│ │TA: 3    │ │                     │ │
│ │BD: 2    │ │1. Number of days    │ │
│ │RF: 1    │ │   practiced [____]  │ │
│ │LP: 4    │ │   ☐ Did not collect │ │
│ │UP: 6    │ │                     │ │
│ │QU: 0    │ │2. ECBI/WACB score:  │ │
│ │CM: 1    │ │   [____]            │ │
│ │NTA: 0   │ │   ☐ Did not         │ │
│ │         │ │     administer      │ │
│ └─────────┘ └─────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │     COPY & EMAIL RESULTS        │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘

Updated Todo List:
- Replace separate results + question modals with single combined modal
- Move behavioral counts to Summary section of new modal
- Replace yes/no questions with numeric input + checkbox questions
- Add "Number of days practiced" field with "Did not collect" checkbox
- Add "ECBI/WACB score" field with "Did not administer" checkbox
- Add validation for each question (number OR checkbox required)
- Update email content to use new question data instead of homework/questionnaire answers
- Disable input fields when corresponding checkboxes are checked

Questions:
1. Should the new modal appear immediately when timer expires or when "Finish" is clicked?
yes
2. Do you want to keep the copy-to-clipboard functionality separate from the email, or combine them?
combine, when the button is pressed, both the clearboard should be updated and the email should pop up

## Step-by-Step Implementation

### Phase 1: Create New Modal Structure
- [ ] Create new combined modal HTML structure
- [ ] Add Summary section for behavioral counts
- [ ] Add Question subpanel section
- [ ] Style the two-column layout

### Phase 2: Build Question Subpanel
- [ ] Add "Number of days practiced" numeric input field
- [ ] Add "Did not collect" checkbox for days field
- [ ] Add "ECBI/WACB score" numeric input field  
- [ ] Add "Did not administer" checkbox for score field
- [ ] Implement checkbox logic to disable inputs when checked

### Phase 3: Add Validation
- [ ] Validate that each question has either a number OR checkbox filled
- [ ] Show validation error messages if needed
- [ ] Prevent form submission until validation passes

### Phase 4: Update Modal Behavior
- [ ] Replace old `showResults()` function to show new combined modal
- [ ] Populate Summary section with behavioral counts
- [ ] Replace old question flow with new form handling

### Phase 5: Update Data Handling
- [ ] Update email content generation to use new question data
- [ ] Modify copy-to-clipboard to include new data format
- [ ] Combine copy + email actions into single button click

### Phase 6: Clean Up
- [ ] Remove old results modal HTML
- [ ] Remove old question modal HTML
- [ ] Remove old question flow JavaScript functions
- [ ] Test the complete flow: Start → Count → Timer expires → New modal → Copy & Email

## Success Criteria
- Single modal appears when timer expires or "Finish" is clicked
- Modal shows behavioral counts and two new questions
- Validation works correctly
- Button copies data to clipboard AND opens email with all information