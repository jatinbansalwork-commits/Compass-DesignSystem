# Dependency audit report (compass)

**Date:** 2026-10-27  
**Scope:** `packages/compass` and monorepo root tooling

## Commands run

```bash
# Requested (from monorepo root)
npm audit --audit-level=high

# Fallback (yarn workspaces)
yarn audit --level high
```

## Results

| Command | Outcome |
|---------|---------|
| `npm audit --audit-level=high` | **Failed** — `ENOLOCK` (no npm lockfile; monorepo uses Yarn) |
| `yarn audit --level high` | **Failed** — could not resolve private `@klearnow/i18nify-js` on the public npm registry in this checkout |

No High/Critical vulnerability list could be generated reliably in this environment without registry auth and a lockfile-based audit path.

## Recommended follow-up (team)

1. From the **canonical CI clone** with private registry configured, run:
   - `yarn npm audit --all --recursive --severity high` (Yarn Berry), or
   - `yarn audit --level high` after `yarn install` with `.npmrc` credentials.
2. Filter output to packages that appear in `packages/compass/package.json` **dependencies** and **devDependencies**.
3. For each High/Critical hit, record: package name, advisory ID, patched version, and whether upgrade requires Chromatic.

## DevDependency removals (completed this session)

| Package | Investigation | Action |
|---------|---------------|--------|
| `react-scripts` | Not referenced in `packages/compass` scripts, CI, or build configs; only appears as a **string** in Storybook Sandbox `baseCode.ts` for CodeSandbox template JSON | **Removed** from `devDependencies` |
| `style-dictionary` | No token scripts or configs reference it in `packages/compass` | **Removed** from `devDependencies` |

## Safe upgrade candidates (report only — not upgraded)

Prioritize after audit succeeds:

- **Transitive tooling** (Rollup, Vite, Storybook) — upgrade one at a time with `yarn build` + Chromatic.
- **Runtime peers** (`react`, `styled-components`, `react-native-reanimated`) — **do not** bulk bump; visual regression risk per ADR-005.

## Decision

Track **ADR-005**: Option A (devDep cleanup) partially executed; Option B/C remain blocked on a successful authenticated audit run.
