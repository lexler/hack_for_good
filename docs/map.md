# Project Map

CDI Coding Counter - A behavioral tracking web application for clinicians and therapists to record parent-child therapy session observations. 
The application has two parts, one where it collects data and the other one that it sends data.
It's a frontend-only JavaScript website.

## Core App
- `index.html` the entrypoint where we count the behaviors
- `finish_evaluation.html` - this is part 2 of the app. It is automatically called by the entry point on completion 
- `styles.css` layout + theme tokens
- `script.js` counter logic, keyboard flows, scoring UI
- `img/` screenshots, qr assets
- `README.md` this is the entrypoint via github for users

## Automation & Tests
- `run.sh` spins dev server
- `run_tests.sh` + `tests/` headless flows (`common.js`, scenario scripts, `run_all_tests.js`)

## Guides
- `project_description.md` - Feature specs & requirements
- `architecture.md` - Technical design
- `test_plan.md` - Testing strategy
- `user-guide.md` - Usage instructions
- `todo.md` - Task tracking
- `touch-click-ux-issues.md` - Known UX issues