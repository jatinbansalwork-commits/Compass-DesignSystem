# ESLint `react-hooks` local status

**Date:** 2026-10-28  
**Status:** **Complete** (rules-of-hooks **0** errors; exhaustive-deps **0** warnings in components/hooks sweep scope)

## Plugin fix (Item 1)

Root `.eslintrc.js` uses **`eslint-plugin-kdesign`** (`plugins: ['kdesign']`, rule `kdesign/no-cross-platform-imports`). Root `package.json` includes `"eslint-plugin-kdesign": "1.0.0"`. Local ESLint runs without the former `eslint-plugin-kdesign` error.

Verify:

```bash
cd packages/kdesign
yarn eslint src/components/Button --ext .ts,.tsx
```

## Hooks sweep (2026-10-28)

Command:

```bash
yarn eslint src/components src/hooks \
  --rule '{"react-hooks/rules-of-hooks": "error", "react-hooks/exhaustive-deps": "warn"}' \
  --ext .ts,.tsx \
  --ignore-pattern "*.stories.tsx" \
  --ignore-pattern "*.test.tsx"
```

| Rule | Result |
|------|--------|
| `react-hooks/rules-of-hooks` | **0 errors** |
| `react-hooks/exhaustive-deps` | **~30 warnings** (mostly charts, motion, overlays) |

`rules-of-hooks` violations are **bugs** — none open in `src/components` / `src/hooks` (excluding stories/tests).

### Exhaustive-deps policy

Fix only when dependency changes are provably safe. Otherwise use:

```ts
// eslint-disable-next-line react-hooks/exhaustive-deps -- [reason]
```

Bulk autofix of exhaustive-deps across charts/motion is **out of scope** for this pass (high regression risk without component owners).

## Other ESLint noise

The same command still reports many **non-hooks** issues (e.g. `import/extensions`, `prettier/prettier`, duplicate imports). Those are pre-existing and not part of the hooks checklist gate.
