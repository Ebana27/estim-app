# 📋 PWA iOS Testing Checklist

## Pre-Testing Requirements

- [ ] Node.js 16+ installed
- [ ] npm packages installed (`npm install`)
- [ ] Source logo image available (512x512 PNG)
- [ ] Icons generated in `icons/` directory
- [ ] `npm run build` completed successfully
- [ ] No errors in terminal during build

## Service Worker Testing

- [ ] Service Worker registers on app load
  - Open DevTools (F12)
  - Go to Application tab
  - Check Service Workers section
  - Should show: "sw.js - active and running"

- [ ] Service Worker caches assets
  - Go to Application > Cache Storage
  - Should show: "estim-app-v1" cache
  - Contains index.html, manifest.json, etc.

- [ ] Offline functionality works
  - Go to Application > Service Workers
  - Check "Offline" checkbox
  - Refresh page
  - Page should still load from cache

## Manifest.json Testing

- [ ] Manifest is valid JSON
  - `curl http://localhost:5173/manifest.json | json_pp`
  - No parsing errors

- [ ] Contains all required fields
  - [ ] name
  - [ ] short_name
  - [ ] icons (with sizes and paths)
  - [ ] start_url
  - [ ] display
  - [ ] theme_color
  - [ ] background_color

- [ ] Icons in manifest exist
  - Verify each icon path points to existing file

## Icon Testing

- [ ] All required icons exist
  - `icons/icon-144.png` ✓
  - `icons/icon-152.png` ✓
  - `icons/icon-180.png` ✓
  - `icons/icon-192.png` ✓
  - `icons/icon-256.png` ✓
  - `icons/icon-512.png` ✓

- [ ] Icon dimensions are correct
  - Use: `identify icons/icon-*.png`
  - Should show exact sizes (no stretching)

- [ ] Icons are valid PNG format
  - Open each icon in image viewer
  - Should display correctly
  - No corruption

## iOS PWA Installation Testing

### On macOS Safari:
- [ ] App runs on localhost
  - Open Safari
  - Navigate to http://localhost:5173
  - Page loads without errors

- [ ] Share menu works
  - Click Share button (↑)
  - "Add to Home Screen" option visible
  - Click it

- [ ] App is installed
  - Close Safari completely
  - Go to Home Screen
  - App icon visible with label "ESTIM"
  - Icon matches uploaded image

- [ ] App launches in standalone mode
  - Tap home screen icon
  - App launches
  - No Safari UI visible (full screen)
  - Status bar shows app colors

### On iPhone/iPad (physical device):
- [ ] App opens Safari
  - Navigate to http://localhost:5173 (or deployed URL)
  - Page loads correctly
  - Styling looks good

- [ ] Share menu works
  - Tap Share button
  - Scroll and find "Add to Home Screen"
  - Tap it

- [ ] Install dialog appears
  - Dialog shows app name "ESTIM"
  - Shows app icon preview
  - Shows "Add" button

- [ ] App installs successfully
  - Tap "Add"
  - App appears on Home Screen
  - Icon visible with label

- [ ] Standalone mode works
  - Tap home screen app
  - App launches full screen
  - No address bar or browser controls
  - Can navigate within app

- [ ] Offline mode works
  - Disable WiFi/cellular
  - Tap app icon to open
  - App should still work
  - Cached pages load

## Lighthouse Audit Testing

- [ ] Run Lighthouse PWA audit
  - DevTools > Lighthouse
  - Category: PWA
  - Run audit

- [ ] Check PWA scores
  - Installable: ✓ (Green)
  - PWA Optimized: ✓ (Green)
  - Service Worker: ✓ Present
  - Web App Manifest: ✓ Present

- [ ] No critical warnings
  - Check "Warnings" section
  - Should be minimal
  - Fix any red flags

## Capacitor/Native Testing (Optional)

- [ ] Capacitor sync successful
  - `npm run capacitor:sync`
  - No errors in output

- [ ] iOS project opens
  - `npm run capacitor:open:ios`
  - Xcode opens successfully

- [ ] Build succeeds
  - Xcode Product > Build
  - Build completes without errors

- [ ] App runs on simulator
  - Select target device
  - Click Run (▶)
  - App launches in simulator

- [ ] App installs on device
  - Connect device to Mac
  - Select device in Xcode
  - Click Run
  - App installs and launches

## Performance Testing

- [ ] Load time is acceptable
  - First load: < 3 seconds
  - Subsequent loads: < 1 second
  - Check Network tab in DevTools

- [ ] Cache hit rate
  - Load app second time offline
  - Network tab should show "from cache"
  - Size much smaller

- [ ] Bundle size is reasonable
  - DevTools > Network
  - Total size < 5MB
  - JS size < 2MB

## Metadata Testing

- [ ] Page title displays correctly
  - Browser tab shows "ESTIM App"
  - Home screen shows "ESTIM"

- [ ] Colors are correct
  - Status bar: Blue (#3880ff)
  - Theme color: Blue (#3880ff)
  - Background: White (#ffffff)

- [ ] Viewport scaling
  - Zoom controls disabled
  - Fixed viewport: 100% zoom
  - No pinch-to-zoom

## Security Testing

- [ ] HTTPS enforcement
  - On production: HTTPS only
  - Mixed content warnings: None

- [ ] CSP headers present
  - DevTools > Network
  - Response headers include CSP

- [ ] No console errors
  - DevTools > Console
  - No errors or warnings
  - Only info/logs acceptable

## Cross-Browser Testing (Optional)

- [ ] Works in Chrome
  - Can add to home screen
  - Offline mode works

- [ ] Works in Firefox
  - Can install PWA
  - Service Worker active

- [ ] Works in Edge
  - PWA installable
  - Manifests correctly

## Final Sign-Off

- [ ] All checklist items completed
- [ ] No critical issues found
- [ ] App installable on iOS
- [ ] Offline functionality verified
- [ ] Performance acceptable
- [ ] Ready for deployment

---

## Testing Commands

```bash
# Build app
npm run build

# Start dev server
npm run dev

# Validate with Lighthouse
# DevTools > Lighthouse > PWA

# Capacitor tests
npm run capacitor:sync
npm run capacitor:open:ios

# Check manifest
curl http://localhost:5173/manifest.json

# Check service worker
curl http://localhost:5173/sw.js

# List icons
ls -la icons/icon-*.png
```

---

**Date Started**: _______________
**Date Completed**: _______________
**Tester Name**: _______________
**Notes**: _______________________________________________

