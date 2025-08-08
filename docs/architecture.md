# Architecture

## Overview
Split architecture separating counting phase from evaluation phase. Data passes via URL parameters enabling flexible endpoint configuration.

## Flow Diagram
```
┌─────────────────┐
│   index.html    │
│                 │
│  ┌───────────┐  │
│  │  Counting │  │──────┐
│  │   Phase   │  │      │
│  └───────────┘  │      │ Timer Expires / Manual Finish / Skip
│                 │      │
└─────────────────┘      │
                         ▼
              ┌──────────────────┐
              │ URL Parameters:  │
              │ - Counts (c1-c9) │
              │ - Skip flag      │
              │ - Test mode      │
              └────────┬─────────┘
                       ▼
         ┌────────────────────────┐
         │ finish_evaluation.html │
         │                        │
         │  ┌────────────────┐    │
         │  │   Questions    │    │
         │  │   & Results    │    │
         │  └────────────────┘    │
         │                        │
         └────────────────────────┘
```

## File Structure
```
/
├── index.html              # Counter UI
├── script.js               # Counter logic + timer
├── finish_evaluation.html  # Results UI  
├── finish_evaluation.js    # Results logic + email
├── styles.css             # Shared styles
└── tests/                 # Automated test suite
    ├── common.js          # Shared test utilities
    └── test*.js           # Individual test files
```

## Key Components

### Counter Phase (index.html + script.js)
- 8 behavior counters with keyboard shortcuts
- Configurable timer (10s dev / 5min prod / 30s test)
- Undo functionality with action history
- Settings modal for navigation options

### Evaluation Phase (finish_evaluation.html + finish_evaluation.js)
- Receives counts via URL parameters
- Teaching session modal (skip coding flow)
- Question validation with checkboxes
- Email generation with test mode seam

### Data Flow
```
Counts → URL Params → Finish Page → Email/Clipboard
         c1=2&c2=3                   
         &skip=false                 
```

### Test Architecture
- Puppeteer-based automation
- Test mode prevents email sending
- Individual test files for modularity
- Master runner with selective execution

## Navigation Paths
```
Start → Count → Timer/Finish → Questions → Email → Exit
                     ↓
                Skip Coding → Teaching? → Questions → Email
```
