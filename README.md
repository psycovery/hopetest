# Hope Forward — Deployment Package
Powered by Psycovery · www.psycovery.co.uk

## Contents

| File | Purpose |
|------|---------|
| `capacitor.config.ts` | Drop into your project root — configures Capacitor for iOS |
| `manifest.json` | Drop into `/public/` — enables PWA install on Android/Safari |
| `hopeforward-sw.js` | Drop into `/public/` — service worker for offline support |
| `appstore-metadata.md` | Copy-paste text for App Store Connect submission |
| `icons/` | All icon sizes for iOS (20px–1024px) and PWA |

## Quick Setup

```bash
# 1. Install dependencies
npm install @capacitor/core @capacitor/cli @capacitor/ios
npm install @capacitor/splash-screen @capacitor/status-bar @capacitor/keyboard

# 2. Copy capacitor.config.ts to your project root
# 3. Copy manifest.json and hopeforward-sw.js to /public/

# 4. Build your app
npm run build

# 5. Add iOS and sync
npx cap add ios
npx cap sync ios

# 6. Open in Xcode
npx cap open ios
```

## Register the Service Worker

Add to your `index.html` before `</body>`:

```html
<link rel="manifest" href="/manifest.json" />
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/hopeforward-sw.js')
      .then(reg => console.log('SW registered:', reg.scope))
      .catch(err => console.error('SW error:', err));
  }
</script>
```

## Icons

- `icon-1024x1024-appstore.png` — App Store Connect (no alpha channel)
- `icon-180x180.png` — iPhone home screen (@3x)
- `icon-167x167.png` — iPad Pro
- `icon-152x152.png` — iPad
- All other sizes auto-assigned by Xcode via AppIcon.appiconset

## Apple Developer Account

Sign up at: https://developer.apple.com/programs/
Cost: £79/year (UK)
Required before any Xcode Archive or TestFlight upload.
