---
description: Start the Expo dev server and launch the app on a connected device/simulator
argument-hint: [ios|android|web]
allowed-tools: Bash, Read
---

Run the duolingo-clone app. Target: **$ARGUMENTS** (default: whatever device is connected).

Steps:
1. Ensure deps are installed (`node_modules/expo` exists); if not, run `npm install`.
2. Check what's connected: `adb devices` (Android) and `xcrun xctrace list devices` (iOS). Note this project uses `expo-dev-client`, so it needs a **development build** on the device — not Expo Go.
3. Start the server in the background: `npx expo start --dev-client` (add `--clear` if the bundler is misbehaving). For a specific target build+install with `npx expo run:android` / `npx expo run:ios` (these prebuild native code the first time and take a while).
4. Read the background output, surface the dev server URL / QR info, and report any Metro/config errors.
5. If a device is connected, launch on it and confirm the bundle builds. Report the first screen that loads and any red-box errors.

Fix bundler/config errors before declaring success. Do not commit anything.
