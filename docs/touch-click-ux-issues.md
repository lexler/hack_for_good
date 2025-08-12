# Touch/Click UX Issues

## iOS/Mobile Specific Issues

| Issue | Description | Reproduced | Verified | Fixed |
|-------|-------------|------------|----------|-------|
| Scroll momentum | Finger movement triggers scroll instead of click | ⬜ | ⬜ | ⬜ |

## General Browser Behaviors

| Issue | Description | Reproduced | Verified | Fixed |
|-------|-------------|------------|----------|-------|
| Drag-to-select | Mouse/finger drag selects text | ⬜ | ⬜ | ⬜ |
| Right-click menu | Context menu appears | ⬜ | ⬜ | ⬜ |
| Focus loss | Click registers but button loses focus immediately | ⬜ | ⬜ | ⬜ |
| Touch cancel | Finger slides off button before release | ⬜ | ⬜ | ⬜ |
| Ghost clicks | Delayed synthetic clicks after touch | ⬜ | ⬜ | ⬜ |
| Accidental zoom | Transforms button position during click | ⬜ | ⬜ | ⬜ |

## Prevention Strategy

```css
button {
  touch-action: manipulation; /* Disables double-tap zoom */
  -webkit-touch-callout: none; /* Disables long-press menu */
  -webkit-user-select: none; /* Disables text selection */
  user-select: none;
}
```

## Additional Solutions

### Disable Pull-to-Refresh
```css
body {
  overscroll-behavior: contain;
  overscroll-behavior-y: contain;
}
```

### Prevent All Touch Gestures on Specific Elements
```css
.your-draggable-area {
  touch-action: none; /* Disables all touch gestures */
  touch-action: pan-x; /* Allow horizontal only */
  touch-action: pinch-zoom; /* Allow zoom but not pan */
}
```

### JavaScript Touch Event Prevention
```javascript
document.addEventListener('touchmove', function(e) {
  e.preventDefault();
}, { passive: false });
```