# Counter Description

## Overview
This single-page JS/TS app runs entirely in the browser, is optimized for phones with mobile-first responsive design, and resets all data each session (no persistence). It can be served locally with `http-server` (`./run.sh`) and is deployed via GitHub Pages.

## Layout
The home view is a 3×3 grid of buttons (8 counters plus a centered configuration button). Every counter button shows its current count directly on the tile; the configuration button is slightly smaller.

### Button Roles
1. LP — labeled praise  
2. RF — reflection  
3. BD — behavior description  
4. TA — talk  
5. Config — opens the session controls overlay  
6. UP — unlabeled praise  
7. NTA — criticism  
8. QU — question  
9. CM — command

## Interaction Patterns
- Eight primary buttons support one-tap counting with immediate visual feedback.  
- Undo last action is always available (↩️) through the session controls overlay.  
- Touch/tap on mobile is the primary input, but desktop use is supported with keyboard shortcuts and haptic feedback on supported Android devices.  
- Counts can be canceled (reset to zero) at any time.  
- The app displays the current version in the settings panel and never stores information between sessions.

## Keyboard Input
The physical numpad mirrors the on-screen grid for quick desktop entry:

```
7 8 9 | TA  BD  RF
4 5 6 | LP  --- UP
1 2 3 | QU  CM  NTA
```

## Settings & Session Controls
Tapping the center button opens an overlay with Return, Undo Last Action, Cancel Evaluation, Finish Evaluation, and Skip Coding options. The first three controls keep the user in the counter experience; Finish Evaluation and Skip Coding transition into the feedback flow described in `feedback_description.md`, then return to counting mode afterward.

## Customization
Button labels and codes can be customized via URL parameters (`?btn1=CODE:Label&...&btn8=CODE:Label`). Parameters map to the eight counter positions (excluding the center config button). Each parameter uses the `CODE:Full Label Description` format and must be URL encoded. Invalid or missing parameters fall back to defaults. Example:

```
?btn1=LP:Labeled%20Praise&btn2=RF:Reflection&btn3=BD:Behavior%20Description&btn4=TA:Talk&btn5=UP:Unlabeled%20Praise&btn6=NTA:Criticism&btn7=QU:Question&btn8=CM:Command
```

## Interface & Design
The UI is full-screen, modern, and intentionally minimal to keep focus on rapid data entry. Abbreviations are paired with full descriptions, and the grid remains legible across a range of phone sizes.
