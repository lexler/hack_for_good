# Start/Undo Button UX Implementation Plan

## Overview
Transform the current undo button to be a start button initially, then become an undo button after the first interaction.

## Current Behavior
- [ ] App loads with blue undo button visible
- [ ] First count button click starts timer automatically
- [ ] Undo button removes last action

## Target Behavior
- [ ] App loads with green START button (play icon)
- [ ] START button click starts timer + becomes blue UNDO button
- [ ] UNDO button removes last action (same as current)
- [ ] Cancel Evaluation resets button back to green START state

## Implementation Tasks

### 1. State Management
- [ ] Add `isStarted: false` property to CounterApp class
- [ ] Track when app transitions from initial → started state

### 2. HTML Structure Changes
- [ ] Update button to support dynamic content (text + icon)
- [ ] Add play icon SVG (same icon set as current undo icon)

### 3. CSS Styling
- [ ] Add green start button styles
- [ ] Add play icon styles
- [ ] Ensure smooth transition between states

### 4. JavaScript Logic Updates
- [ ] Remove auto-timer start from `incrementCount()` method
- [ ] Add start functionality to button click handler
- [ ] Update button state when start is clicked
- [ ] Reset `isStarted` to false in `cancelEvaluation()`
- [ ] Add method to toggle button appearance/functionality

### 5. Button State Updates
- [ ] Create `updateButtonState()` method
- [ ] Handle start state: green background, play icon, "Start" text
- [ ] Handle undo state: blue background, undo icon, "Undo" text
- [ ] Call state update on app init and after cancel

### 6. Event Handler Updates
- [ ] Modify undo button click handler to check `isStarted` state
- [ ] If not started: start timer + switch to undo mode
- [ ] If started: perform undo action (existing behavior)

## Testing Checklist
- [ ] App loads with green START button
- [ ] START button starts timer and becomes blue UNDO button
- [ ] UNDO button removes last count action
- [ ] Count buttons work normally after start
- [ ] Cancel Evaluation resets button to START state
- [ ] Keyboard shortcuts work correctly (s key for start/undo)

## Design Specifications
- **Start State**: Green background, play icon, "Start" text
- **Undo State**: Blue background (current), undo icon (current), "Undo" text (current)
- **Transition**: Instant state change on click
- **Icon**: Play icon from same SVG icon set as undo arrow