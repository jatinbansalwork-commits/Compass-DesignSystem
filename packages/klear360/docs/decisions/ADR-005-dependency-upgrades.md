# ADR-005: Dependency hygiene and upgrades

**Status:** Proposed  
**Date:** 2026-10-27  
**Owner:** 

## Context

The audit used **depcheck** and noted **unused devDependencies** (including `react-scripts` and `style-dictionary` in `packages/klear360/package.json`). No packages were removed during Tracks A–C to avoid build and visual regressions.

**npm/yarn audit** for the monorepo should run from the **repository root** (yarn workspaces; no package-level lockfile in isolation). Production dependencies (`styled-components`, `react`, animation libraries, etc.) carry **visual regression** risk on upgrade.

Current package version: **12.130.0**.

## Options

### Option A — Remove confirmed unused devDependencies

Delete deps verified unused in scripts, CI, and configs.

**Trade-offs:** Smaller install footprint; **Low** risk if verification is thorough. Immediate win.

### Option B — Manual audit-driven upgrades

Run audit at repo root; triage **High/Critical**; upgrade one dependency at a time with Chromatic / visual regression after each.

**Trade-offs:** Addresses security; **Medium–High** effort and CI time per bump.

### Option C — Automated update PRs (Renovate / Dependabot)

Ongoing PRs with required Chromatic (or equivalent) before merge.

**Trade-offs:** Steady hygiene; requires policy for major bumps and design-system visual gates. **Medium** setup cost.

## Recommendation

Execute **Option A immediately** for deps that pass investigation below. Adopt **Option C** for ongoing maintenance. Use **Option B** for any **High/Critical** findings from the latest root audit that affect runtime or build.

Do **not** bulk-upgrade `styled-components`, `react`, or Reanimated without a dedicated visual QA window.

### Investigation before removing devDependencies

#### `react-scripts` (5.0.1)

Before removal, search:

- `packages/klear360/package.json` — `scripts` block for `react-scripts start/build/test`
- Monorepo root and package **CI workflows** (`.github/workflows`, internal CI configs)
- Any doc or example app under `packages/klear360` referencing CRA

**Accept removal when:** zero references and Storybook/Vite (or current toolchain) owns dev server and tests.

#### `style-dictionary` (3.7.1)

Before removal, search:

- Token generation scripts under `packages/klear360/scripts` or monorepo `scripts/`
- Config files: `style-dictionary.config.js`, `tokens/**/*.json` pipelines
- References in root or package `package.json` scripts named `tokens`, `build-tokens`, etc.

**Accept removal when:** tokens are generated elsewhere or checked in without style-dictionary in the active path.

### Option A execution steps

1. Run depcheck + ripgrep verification checklist above.
2. Remove unused entries from `devDependencies`.
3. `yarn install` at monorepo root; run `packages/klear360` build and Storybook smoke.
4. Changelog: chore entry under internal/dev.

## Migration path

**Consumers:** Unaffected by devDependency removal.

**Maintainers:**

1. Complete investigation checklist; open PR removing only confirmed-unused deps.
2. Configure Renovate/Dependabot at monorepo root with grouping rules for `@klearnow/*` internal packages.
3. Document “upgrade playbook”: one bump → unit tests → Chromatic → merge.

## Risks

| Risk | Severity | Notes |
|------|----------|--------|
| Removing a dep still used by obscure script | **Medium** | CI failure on main; mitigate with ripgrep + CI dry run. |
| Blind major upgrades | **High** | Visual and RN breakage. |
| Audit noise from transitive deps | **Low** | Triage at root; ignore unfixable without major bumps. |

## Decision

_To be filled by the team._
