# TODO

┌─────────────────────────┐
│ Modal                   │
│                         │
│ ┌─────────┐ ┌─────────┐ │
│ │Summary  │ │Question │ │
│ │         │ │subpanel │ │
│ │         │ │         │ │
│ └─────────┘ └─────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │     CONTINUE        │ │
│ └─────────────────────┘ │
└─────────────────────────┘

Window description:
- Modal popup with two sections: Summary and Question subpanel
- Summary section shows behavioral codes data
- Question subpanel for additional clinician inputs
- Continue button to proceed
- Copy functionality to get session data

## Question Panel
┌─────────────────────────────────────┐
│ Modal                               │
│                                     │
│ ┌─────────┐ ┌─────────────────────┐ │
│ │Summary  │ │Question subpanel    │ │
│ │         │ │                     │ │
│ │         │ │1. Number of days    │ │
│ │         │ │   practiced [____]  │ │
│ │         │ │   ☐ Did not collect │ │
│ │         │ │                     │ │
│ │         │ │2. ECBI/WACB score:  │ │
│ │         │ │   [____]            │ │
│ │         │ │   ☐ Did not         │ │
│ │         │ │     administer      │ │
│ └─────────┘ └─────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │     COPY & EMAIL RESULTS        │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘


## Reporting Improvement
Yes/no question is bad.
- [ ] How many times did you do homework? 0-7 - derive yes/no for that
[ ] Number of days practiced
[ ] Did not ask
- [ ] Actual questionnaire questions asked - derive yes/no from that
ECBI or WACB score: <input field>
[ ] Did not administer

Questionnaire: yes
Asked about homework: no
Did coding analysis: yes

