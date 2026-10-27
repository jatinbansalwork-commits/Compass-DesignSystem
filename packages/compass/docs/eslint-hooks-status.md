# ESLint `react-hooks` local status

**Date:** 2026-10-27

## Attempted fix

Local `yarn eslint` / `yarn lint:compass` fails before any rules run:

```
ESLint couldn't find the plugin "eslint-plugin-blade".
The plugin "eslint-plugin-blade" was referenced from "../../.eslintrc.js#overrides[1]".
```

## Root cause

- `node_modules/eslint-plugin-blade` is a symlink to `packages/eslint-plugin-blade`, but **`packages/eslint-plugin-blade` does not exist**.
- The maintained package is **`packages/eslint-plugin-compass`** (`eslint-plugin-compass` on disk).
- Monorepo root `.eslintrc.js` registers plugin id `blade` and rule `blade/no-cross-platform-imports`.

## Recommended fix (DevOps / platform)

1. Add `packages/eslint-plugin-blade` → symlink to `eslint-plugin-compass`, **or** rename plugin id in `.eslintrc.js` from `blade` to `compass` and update rule prefix to `compass/no-cross-platform-imports`.
2. Run `yarn build:eslint-plugin-compass` after clone.
3. Re-run hooks sweep:

```bash
cd packages/compass
yarn eslint src/components src/hooks \
  --ext .ts,.tsx \
  --ignore-pattern "*.stories.tsx" \
  --ignore-pattern "*.test.tsx"
```

## CI

`react-hooks` rules remain enforced via root ESLint in CI where the plugin symlink/build is present. Local checkout in this environment cannot run the sweep until the symlink/package name is aligned.
