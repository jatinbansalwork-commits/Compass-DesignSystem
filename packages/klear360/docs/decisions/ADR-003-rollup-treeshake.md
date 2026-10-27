# ADR-003: Rollup treeshake configuration

**Status:** Proposed  
**Date:** 2026-10-27  
**Owner:** 

## Context

`packages/klear360/rollup.config.mjs` sets **`treeshake: false`** on production build outputs (multiple config blocks). This was treated as intentional in the audit because of **cross-entry references** between Rollup chunks and circular dependency pressure in the component graph.

Track B removed **453** icon-barrel cycles; madge on `src/components/index.ts` now reports **30** numbered non-icon cycles (ActionList, Badge, Button, Card, Checkbox/Radio, Input/BaseInput, Klear360Provider, List, Spark/KlearGlass, etc.).

Consumers importing from `@klearnow/klear360/components` receive a **large consolidated chunk**; dead-code elimination at the library build boundary is limited while treeshaking is disabled.

## Options

### Option A — Keep `treeshake: false`

No build change; rely on consumer bundlers (Webpack, Vite, etc.) to tree-shake application imports.

**Trade-offs:** **Lowest** risk and effort; library artifact may remain larger than necessary; does not fix root graph issues. **Low** regression risk.

### Option B — Enable `treeshake: true`

Turn on Rollup treeshaking after validating no unsafe cross-chunk side effects and reducing circular dependencies.

**Trade-offs:** Smaller published modules if entries are granular; **Medium–High** risk of subtle breakage if cycles or side-effectful modules remain. Requires resolving or isolating the **30** remaining cycles first.

### Option C — Multi-graph build (one entry per component)

Per-component or per-domain Rollup entries with explicit `package.json` exports map.

**Trade-offs:** Maximum consumer tree-shaking; **High** build, release, and typing complexity; overlaps with ADR-001 Option A at export-map level.

## Recommendation

**Option A for now.** Icon cycle cleanup removed the largest structural blocker but did not eliminate all circular graphs or prove cross-entry safety with treeshaking enabled.

Revisit **Option B** after the **30** non-icon cycles are addressed (or proven benign for treeshake). Option C remains a strategic investment, not a quick follow-up to Track B.

### Checklist — “ready for `treeshake: true`”

- [ ] Madge numbered cycles on `src/components/index.ts` at or near **0**, or each remaining cycle documented as treeshake-safe (no side-effectful barrel re-exports on critical path).
- [ ] Trial build with `treeshake: true` on web production config; diff bundle sizes and export surface.
- [ ] Run full unit + visual regression (Chromatic) on representative consumer app importing subset of components.
- [ ] Verify `sideEffects` in `package.json` accurately lists files that must not be dropped.
- [ ] Confirm native build path separately (Metro resolution differs from web Rollup).
- [ ] Document any `manualPureFunctions` / annotation needs (see `scripts/manualPureFunctions.js` comment re Rollup 3.5+).

## Migration path

**If Option B is accepted later:**

1. Enable treeshake on a **staging** Rollup output only; compare artifacts.
2. Fix any dropped modules reported by integration tests.
3. Roll out to production config blocks one at a time (web / native if applicable).
4. Release notes: “library build now tree-shaken at publish boundary” — consumers may see bundle size changes without API changes.

**Consumers:** No import path changes for Option A or B alone. Option C would require export map migration (major).

## Risks

| Risk | Severity | Notes |
|------|----------|--------|
| Enabling treeshake with remaining cycles | **High** | Incomplete or reordered initialization; missing exports. |
| False confidence after icon fix only | **Medium** | 30 cycles still tie tokens/types/components. |
| Multi-entry build drift | **High** (Option C) | Version skew between entries. |

## Decision

_To be filled by the team._
