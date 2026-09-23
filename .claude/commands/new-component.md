---
description: Scaffold a reusable component in components/ following project conventions
argument-hint: <ComponentName> [what it does / props]
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

Create a reusable component: **$ARGUMENTS**

First decide if it *should* be a component (per AGENTS.md): only extract when it is reused, makes a screen easier to read, or represents a clear UI concept (LessonCard, XPBar, PrimaryButton). If it's a premature one-off, say so and ask before creating.

If it should be created:
- File: `components/<ComponentName>.tsx` (PascalCase name and filename), one named/`default` export.
- Typed props (`type Props = { ... }`), no `any`.
- Style with NativeWind v5 classes; extract repeated class strings into `global.css` BEM utilities. Use `StyleSheet`/inline only for the AGENTS.md exceptions (pressed states, shadows, transforms, etc.).
- Images from `@/constants/images`, colors/fonts from `theme/`.
- Large touch targets, rounded cards, soft shadows, clear spacing — keep it playful and polished.

After creating it:
1. Run `npm run typecheck && npm run lint` and fix issues.
2. Show a short usage example.
