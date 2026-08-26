---
title: PWA iPhone Compatibility Hard Rule
always_on: true
---

# PWA iPhone Compatibility Hard Rule

Whenever you write or modify code in this project:

- **100% PWA & iOS Safari Compatible**: Every UI element must render properly on iPhone (375px–430px) in standalone PWA and Safari mobile.
- **Safe Area Insets**: Respect notch, dynamic island, and home bar using `env(safe-area-inset-*)`.
- **Portals for Overlays**: Always mount modals/popups/sheets inside `Portal` to prevent CSS stacking bugs on iOS.
- **Touch Ergonomics**: 44px minimum touch targets, no sticky hover states on touch, `-webkit-tap-highlight-color: transparent`.
- **Inputs**: Inputs must have `font-size: 16px` (or equivalent) to avoid unwanted Safari auto-zoom.
- **No Browser Alert/Confirm**: Use `ConfirmModal.jsx` instead of `window.confirm()` / `window.alert()`.
