# Contributing to Counter App

## Local Development

Run the app locally on port 8080:
```bash
./run.sh
```

## Shell Scripts

| Script | Purpose                                                                                             |
|--------|-----------------------------------------------------------------------------------------------------|
| `run.sh` | Starts local development server on port 8080 using http-server (installs if needed)                 |
| `capture_screenshot.sh` | Captures a screenshot of the running app at iPhone 12 dimensions (390x844)                          |
| `update_version.sh` | Increments patch version in script.js and index.html files. This is run automatically as a git hook |


## GitHub Pages Deployment

Once you push this repository to GitHub, enable GitHub Pages in the repository settings and the app will be available at:
```
https://lexler.github.io/hack_for_good/
```

## Technical Details

The app runs entirely in the browser with no backend required. It's built with:
- HTML5
- CSS3 (Mobile-first responsive design)
- Vanilla JavaScript

## Project Structure

- `index.html` - Main application file
- `img/` - Contains app screenshot and QR code
- `run.sh` - Local development server script

## How It Works

The counter app maintains state in the browser and provides:
- 8 counting buttons (LP, RF, BD, TA, UP, NTA, QU, CA)
- Configuration panel with undo, cancel, and finish options
- Results display with category counts

Each button increment is tracked and can be undone via the configuration panel.