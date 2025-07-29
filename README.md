# Counter App

A simple counting app with 8 categories for behavioral tracking.

| App Preview | Quick Access |
|-------------|--------------|
| ![App Screenshot](img/current_screenshot.png) | <img src="img/qr-code.svg" width="390" alt="QR Code"> |
| Live preview of the counter app | Scan to open: [lexler.github.io/hack_for_good](https://lexler.github.io/hack_for_good/) |

## Features

- 8 counting buttons (LP, RF, BD, TA, UP, NTA, QU, CA)
- Configuration panel with undo, cancel, and finish options
- Mobile-first responsive design
- Results display with category counts

## Local Development

Run the app locally on port 80:
```bash
./run.sh
```

## GitHub Pages

Once you push this repository to GitHub, enable GitHub Pages in the repository settings and the app will be available at:
```
https://lexler.github.io/hack_for_good/
```

## Usage

1. Tap any of the 8 counting buttons to increment that category
2. Tap the config button (⚙️) to access additional options:
   - **Return**: Go back to counting
   - **Undo Last Action**: Decrements the most recently incremented counter
   - **Cancel Evaluation**: Resets all counts to zero
   - **Finish Evaluation**: Shows results summary, then returns to counting

The app runs entirely in the browser with no backend required.