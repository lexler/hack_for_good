# Project Description

This is an app to count that lets you press 8 buttons to count in 8 categories

## Technologies
Single-page app with no backend that runs completely on the frontend in JS/TS.
It's designed to run on a phone with mobile-first responsive design.
Data resets each session (no persistence). 

## Main Page
9 buttons in a grid (8 counting + 1 config):
1 2 3
4 5 6
7 8 9

All buttons except for the configuration (button 5) contain a count

### Button Descriptions
1. LP (labeled praise)
2. RF (reflect kid)
3. BD (behavior description)
4. TA (talk)
5. - config 
6. UP (unlabeled praise)
7. NTA (criticism)
8. QU (question)
9. CM (command)
The config button is slightly smaller than the others.

### Keyboard
Using the key pad to enter observations when on desktop.
Keyboard mapping:
7 8 9 | TA BD RF
4 5 6 | LP -  UP
1 2 3 | QU CM NTA 

#### Config Button
The config button will pop up a screen on top of the screen with other less used buttons. 
The four buttons are:
- return 
- undo last action (decrements most recently incremented counter by 1)
- cancel evaluation
- finish evaluation
When you hit finish evaluation, it gives you a list of the numbers next to the labels (counts), then returns to counting mode. 

## Serving
To serve locally: http-server (install with `npm install -g http-server`, run with `./run.sh`)
To serve globally: GitHub Pages

## Design
Modern and simple styling, mobile-first responsive design optimized for phone usage.
