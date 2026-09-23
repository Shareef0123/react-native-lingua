---
name: lingua-feature
description: The feature-by-feature build workflow for the duolingo-clone Expo teaching app. Use when building, extending, or reviewing any feature in this repo — it encodes the AGENTS.md philosophy, the real project structure, and the run/verify loop so changes stay clean, teachable, and consistent.
---

# Building a feature in duolingo-clone

This is a **teaching project**: a Duolingo-inspired AI language-learning app built with Expo. Code is read by learners, so favor clarity over cleverness and build the **smallest useful version first**. `AGENTS.md` at the repo root is the source of truth; this skill is the operational checklist.

## 1. Orient before coding
- Re-read `AGENTS.md` (philosophy, UI rules, style exceptions, constraints).
- Look at neighbors: `src/app/` (screens), `components/` (reusable UI), `data/` (content), `theme/` (colors/typography), `constants/images.ts`, `global.css`.

## 2. Actual project structure (not the aspirational tree in AGENTS.md)
```
src/app/            # Expo Router routes ONLY (index, onboarding, (auth)/…)
components/         # reusable UI, PascalCase files (e.g. VerificationModal.tsx)
constants/images.ts # centralized image imports
data/              # typed hardcoded content: languages.ts, units.ts, lessons.ts
types/             # shared types (e.g. learning.ts)  ← data/ imports from here
theme/             # colors.ts, typography.ts, index.ts
global.css         # NativeWind/Tailwind + BEM utility classes
assets/            # images + Poppins fonts
```
`@/*` resolves to both `./src/*` and `./*` (see `tsconfig.json`), so `@/constants/images`, `@/theme`, `@/assets` all work.

## 3. Tech stack — installed vs planned
**Installed & usable now:** Expo SDK 57, React Native 0.86, TypeScript, Expo Router (typed routes), NativeWind v5 (`^5.0.0-preview.4`), Reanimated, expo-image/font/glass-effect.

**Planned but NOT installed** — do not assume these exist; recommend + ask before `npx expo install`-ing:
- **Zustand** (global state) and **AsyncStorage** (persistence)
- **Clerk** (auth — do not build custom auth)
- **Stream / GetStream** + **Vision Agents** (video, real-time, AI teacher)

Never put secret keys in the app. Tokens and AI calls go through a backend/serverless route.

## 4. Constraints
- **No database.** Content is hardcoded and typed in `data/`.
- **Styling: NativeWind v5 classes only** (syntax per https://www.nativewind.dev/v5/llms-full.txt). Use `StyleSheet`/inline **only** for the AGENTS.md exception list: `SafeAreaView`, `KeyboardAvoidingView`, `Modal`, `ScrollView` (`contentContainerStyle`), `TextInput` native props, `Animated.View`, dynamic/runtime styles, platform-specific props, shadows, transforms, z-index, `Pressable`/`TouchableOpacity` pressed states.
- Repeated long className strings → BEM utilities in `global.css`.
- Images via `@/constants/images`; colors/fonts via `theme/`. No hardcoded hex or inline `require()`.
- TypeScript strict, no `any`.
- Files in `src/app/` are routes only. Reusable UI → `components/` (PascalCase). Create a component only when reused or when it clarifies a screen; ask if unsure.

## 5. UI fidelity
When a design image is provided, replicate it **pixel-perfectly** — layout, spacing, fonts, colors, radius, shadows, proportions. Do not simplify unless asked. (The `ui-replicator` agent specializes in this.)

## 6. Build loop
1. Restate the feature; list exact files to add/change. Keep changes focused — don't rewrite unrelated code.
2. Add/extend typed content in `data/` + `types/` if needed.
3. Implement UI + state + wiring, reusing existing components/utilities.
4. **Verify:** `npm run typecheck && npm run lint` — fix everything. (A PostToolUse hook also runs these after edits.)
5. Run it: `npx expo start --dev-client` (uses expo-dev-client, needs a dev build on device — not Expo Go). Confirm the feature works end-to-end.
6. Summarize what changed and give concrete test steps.

## 7. Related helpers in this repo
- Agents: `feature-builder`, `ui-replicator`, `expo-reviewer` (`.claude/agents/`).
- Commands: `/new-screen`, `/new-component`, `/add-lesson`, `/run-app` (`.claude/commands/`).
- Expo/EAS skills under `.agents/skills/` (routing, tailwind setup, native UI, upgrades, EAS builds, etc.).
