---
description: Scaffold a new Expo Router screen in src/app following project conventions
argument-hint: <route-name> [brief description of the screen]
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

Create a new Expo Router screen for the route: **$ARGUMENTS**

Follow these project rules:
- Read `AGENTS.md` first.
- Put the file in `src/app/` (routes only). Use the route name to derive the file path (e.g. `profile` → `src/app/profile.tsx`; a group/nested route → the matching folder). Use `expo-router` typed routes.
- The route file should be thin: compose components and call hooks/stores. If the screen body is large, keep reusable pieces in `components/` (PascalCase files).
- Default export a component named in PascalCase.
- Style with NativeWind v5 classes. Use `SafeAreaView` from `react-native-safe-area-context` with inline `style` (per the AGENTS.md exception list).
- Pull images from `@/constants/images`, colors/fonts from `theme/`.
- Add a friendly, playful placeholder UI (heading + short body) so the screen renders immediately.

After creating it:
1. Run `npm run typecheck && npm run lint` and fix any issues.
2. Tell me the route path to open and how to navigate to it.
