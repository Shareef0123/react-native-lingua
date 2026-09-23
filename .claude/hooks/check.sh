#!/usr/bin/env bash
# PostToolUse hook: after Claude edits a TS/TSX file, run typecheck + lint.
# Exit code 2 feeds stderr back to Claude so it fixes issues before finishing.
#
# Reads the hook JSON from stdin and pulls out tool_input.file_path with node
# (no jq dependency). Only runs the checks when a .ts/.tsx file was touched.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$REPO_ROOT"

# Extract the edited file path from the hook payload.
FILE_PATH="$(node -e '
  let raw = "";
  process.stdin.on("data", (c) => (raw += c));
  process.stdin.on("end", () => {
    try {
      const j = JSON.parse(raw || "{}");
      process.stdout.write((j.tool_input && j.tool_input.file_path) || "");
    } catch { process.stdout.write(""); }
  });
' 2>/dev/null || true)"

# Nothing to do for non-TS/TSX edits.
case "$FILE_PATH" in
  *.ts|*.tsx) ;;
  *) exit 0 ;;
esac

FAILED=0
OUTPUT=""

echo "▶ Running typecheck (tsc --noEmit)…" >&2
if ! TSC_OUT="$(npx --no-install tsc --noEmit 2>&1)"; then
  FAILED=1
  OUTPUT+=$'\n--- TypeScript errors ---\n'"$TSC_OUT"
fi

echo "▶ Running lint (expo lint)…" >&2
if ! LINT_OUT="$(npx --no-install expo lint 2>&1)"; then
  FAILED=1
  OUTPUT+=$'\n--- Lint errors ---\n'"$LINT_OUT"
fi

if [ "$FAILED" -ne 0 ]; then
  echo "Checks failed after editing ${FILE_PATH}. Fix these before finishing:$OUTPUT" >&2
  exit 2
fi

echo "✓ typecheck + lint passed" >&2
exit 0
