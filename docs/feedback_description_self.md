# Feedback Description - Self Reporting

## Who Is This For
This is to create an email for the clinician. It is anticipated that the data will be mined later.

## Overview
The feedback flow begins when the user chooses Finish Evaluation or Skip Coding from the session controls overlay. An overlay collects any remaining context, summarizes the observation, and returns the user to counting mode once complete. All logic runs client-side; no backend services are involved.

## UI
  ┌─────────────────────────────────────────────────────────────────┐
  │                       [MODAL OVERLAY]                           │
  │                                                                 │
  │  ┌───────────────────────────────────────────────────────────┐  │
  │  │                    Session Results                        │  │  [TITLE]
  │  │                                                           │  │
  │  │  ┌─────────────────────────┬─────────────────────────┐    │  │
  │  │  │  [SUMMARY SECTION]      │  [QUESTION SECTION]     │    │  │
  │  │  │  ┌─────────────────┐    │  ┌─────────────────┐    │    │  │
  │  │  │  │   Summary       │    │  │   Questions     │    │    │  │
  │  │  │  ├─────────────────┤    │  ├─────────────────┤    │    │  │
  │  │  │  │                 │    │  │ 1. Number of    │    │    │  │
  │  │  │  │  #summary-list  │    │  │    days         │    │    │  │
  │  │  │  │  (behavior      │    │  │  ┌───────────┐  │    │    │  │
  │  │  │  │   counts        │    │  │  │[INPUT BOX]│  │    │    │  │  [DAYS INPUT]
  │  │  │  │   displayed     │    │  │  └───────────┘  │    │    │  │
  │  │  │  │   here)         │    │  │  ☐ Did not      │    │    │  │  [CHECKBOX 1]
  │  │  │  │                 │    │  │     collect     │    │    │  │
  │  │  │  │                 │    │  │                 │    │    │  │
  │  │  │  │                 │    │  │ 2. ECBI/WACB    │    │    │  │
  │  │  │  │                 │    │  │    score        │    │    │  │
  │  │  │  │                 │    │  │  ┌───────────┐  │    │    │  │
  │  │  │  │                 │    │  │  │[INPUT BOX]│  │    │    │  │  [ECBI INPUT]
  │  │  │  │                 │    │  │  └───────────┘  │    │    │  │
  │  │  │  │                 │    │  │  ☐ Did not      │    │    │  │  [CHECKBOX 2]
  │  │  │  │                 │    │  │     administer  │    │    │  │
  │  │  │  │                 │    │  │                 │    │    │  │
  │  │  │  │                 │    │  │ 3. Coaching time│    │    │  │
  │  │  │  │                 │    │  │    (minutes)    │    │    │  │
  │  │  │  │                 │    │  │  ┌───────────┐  │    │    │  │
  │  │  │  │                 │    │  │  │[INPUT BOX]│  │    │    │  │  [COACHING TIME INPUT]
  │  │  │  │                 │    │  │  └───────────┘  │    │    │  │
  │  │  │  │                 │    │  │  (default: 0)   │    │    │  │
  │  │  │  │                 │    │  │                 │    │    │  │
  │  │  │  │                 │    │  │  [ERROR MSG]    │    │    │  │  [VALIDATION ERROR]
  │  │  │  └─────────────────┘    │  └─────────────────┘    │    │  │
  │  │  └─────────────────────────┴─────────────────────────┘    │  │
  │  │                                                           │  │
  │  │  ┌─────────────────────────────────────────────────────┐  │  │
  │  │  │      [Copy & Email Results]                         │  │  │  [PRIMARY BUTTON]
  │  │  └─────────────────────────────────────────────────────┘  │  │
  │  │                                                           │  │
  │  │  ┌─────────────────────────────────────────────────────┐  │  │
  │  │  │              [Exit]                                 │  │  │  [SECONDARY BUTTON]
  │  │  └─────────────────────────────────────────────────────┘  │  │
  │  └───────────────────────────────────────────────────────────┘  │
  └─────────────────────────────────────────────────────────────────┘


## Finish Evaluation Summary
- Displays the eight behavioral counts with their labels.
- Offers Return (keep observing) or Copy & Email Results.
- Automatically copies the raw data to the clipboard so it can be pasted into other tools even if email is skipped.

## Additional Data Capture
During the summary, the user optionally records:
- Days practiced since last visit.
- ECBI/WACB score (or similar numeric rating).
- Coaching time in minutes (defaults to 0, user can modify to any number).
- Two checkboxes for "Did not collect homework" and "Did not administer questionnaire."

Clipboard data is always exported in the same order:

```
TA
BD
RF
LP
UP
QU
CM
NTA
Days practiced
Score
```

When either checkbox is selected, the corresponding line is left blank so downstream tooling can distinguish "not collected/administered" from a numeric zero.

## Skip Coding Branch
Skip Coding prompts the user: “Did you do a teaching session?” Selecting Yes produces a summary labeled “Teaching Session only.” Selecting No displays “Alternative Session.” This branch bypasses the original summary panel but still funnels into the same clipboard and email generation. The email includes a boolean flag indicating whether the session was a teaching-only experience (true) or an alternative session (false).

## Email Generation
“Copy & Email Results” launches the device’s default email client with:
- Recipient preset to the Kempe Center address.
- Subject fixed for the program (e.g., `PCIT Intermediary`).
- Body containing the counts and session metadata plus the teaching-session flag.

In addition to launching the email client, the clipboard still receives the newline-delimited export shown above so QA teams can verify or resend results if the email client fails to open.

### Sample Email:
```
subject: [PCIT Intermediary]

body:
TA (Neutral Talk): 25
BD (Behavior Description): 10
RF (Reflection): 3
LP (Labeled Praise): 1
UP (Unlabeled Praise): 4
QU (Question): 2
CM (Command): 1
NTA (Negative Talk): 0

Number of days practiced last week: 5 / Not collected
ECBI/WACB score: 34 / Not collected
Coached (mins): 5

Additional notes:

```
