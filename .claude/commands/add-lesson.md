---
description: Add typed lesson / unit / language content to data/
argument-hint: <language> <unit or lesson title> [details]
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

Add hardcoded, typed learning content for: **$ARGUMENTS**

This project has **no database** — all content lives typed in `data/`:
- `data/languages.ts` → `Language[]`
- `data/units.ts` → `Unit[]`
- `data/lessons.ts` → `Lesson[]`
- Types come from `types/learning.ts` (`Language`, `Unit`, `Lesson`, vocabulary, etc.).

Steps:
1. Read `types/learning.ts` to get the exact shapes. **If `types/learning.ts` is missing**, stop and tell me — the data files import it and it must exist first.
2. Read the relevant `data/*.ts` file and match the existing structure exactly (id conventions like `es-unit-1`, `es-lesson-1`, `vocab-es-1`; `order`, `xpReward`, `estimatedMinutes`, `accentColor`/`color`, etc.).
3. Add the new entry/entries, keeping ids unique and consistent, and update any dependent counts (`totalUnits`, `totalLessons`).
4. No `any`. Keep content realistic and playful.
5. Run `npm run typecheck && npm run lint` and fix issues.
6. Summarize what you added and which ids reference it.
