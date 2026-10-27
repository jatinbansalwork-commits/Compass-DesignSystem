# ADR-001: Icons barrel circular dependencies

**Status:** Complete  
**Date:** 2026-10-27  
**Owner:** 

## Context

`src/components/Icons/index.ts` is a flat auto-generated barrel (~455 icon re-exports). Before Track B, madge reported **453** of **483** numbered circular dependency chains on `src/components/index.ts` that involved `Icons/index.ts`. Each icon imported shared helpers and types from `..` (the barrel), and `useIconProps/useIconProps.tsx` imported `IconProps` from `..`, creating hundreds of structurally identical cycles.

Track B piloted and rolled out **Option C**: extract `useIconProps` to `hooks/useIconProps.ts` (barrel-free), migrate all icon implementations, point `IconComponent` types at `../types`, and replace the old hook file with a re-export shim.

**Rollout result:** Icon-barrel numbered cycles **453 → 0**. Full components graph numbered cycles **483 → 30** (remaining cycles are non-icon). Public `Icons/index.ts` exports and consumer import paths were unchanged.

The shim at `useIconProps/useIconProps.tsx` has been **retired** (2026-10-27). All internal consumers import from `hooks/useIconProps` directly; `useIconProps/index.ts` re-exports from the hook module for `iconSizeMap` co-location only. **Track B is fully closed.**

See also `docs/rfc-icons-barrel.md` (pilot + rollout sections).

## Options

### Option A — Subpath exports per icon category

Split the monolithic barrel into package.json subpaths (e.g. `@klearnow/klear360/icons/payment`). Requires new category index files and codegen.

**Trade-offs:** Highest consumer migration effort; best long-term bundle granularity if the flat barrel is removed from the main graph. **High** implementation and docs cost.

### Option B — Lazy `iconMap` registry

Icons register at load time; consumers use a dynamic `<Icon name="…" />` API instead of named imports.

**Trade-offs:** Breaks current static `IconComponent` usage; SSR/module-order and tree-shaking risks. **High** API and migration cost.

### Option C — Extract `useIconProps` + fix internal icon imports

Move the hook and types off the barrel; keep `Icons/index.ts` as the public export surface.

**Trade-offs:** **No** consumer API change; reversible file-by-file rollout. Full cycle elimination also required migrating `IconComponent` imports from `..` to `../types` (done in rollout Step 5).

## Recommendation

**Option C — accepted and complete** for the stated goal (eliminate icon-barrel cycles without consumer migration). Track B validated the RFC hypothesis: hook extraction alone only removed the `useIconProps → barrel` edge; clearing **453 → 0** required the additional `IconComponent` → `../types` pass.

**Option A** (subpath exports) is **no longer urgent** now that icon cycles are zero while keeping the flat barrel. Revisit only for bundle-size or tree-shaking policy (see ADR-003).

**Option B** remains a longer-term consideration if product requirements shift toward **dynamic icon names** at runtime rather than static `IconComponent` references.

## Migration path

### Completed (Track B)

1. Added `src/components/Icons/hooks/useIconProps.ts` (imports `../types`, `../useIconProps/iconSizeMap` only).
2. Migrated **453** icon files from `../useIconProps` to `../hooks/useIconProps` (**454** total including pilot).
3. Migrated **454** icon files from `import type { IconComponent } from '..'` to `../types`.
4. Replaced `useIconProps/useIconProps.tsx` with re-export shim (no barrel import).

### Completed — shim retirement (2026-10-27)

1. Migrated `ReasoningTraces.web.tsx`, `ReasoningTraces.native.tsx`, and `TrustedBadgeIcon.web.tsx` to `~components/Icons/hooks/useIconProps`.
2. Updated `useIconProps/useIconProps.test.tsx` to import from `../hooks/useIconProps`.
3. Deleted `useIconProps/useIconProps.tsx`; `useIconProps/index.ts` re-exports from `../hooks/useIconProps`.
4. Verified: zero imports of the old shim path; madge icon graph remains at **0** icon-barrel cycles.

## Risks

| Risk | Severity | Notes |
|------|----------|--------|
| Undocumented deep imports of old hook path in external apps | **Medium** | Shim deletion could break forks that imported internal paths; audit npm consumers or wait one major with changelog. |
| Reintroducing barrel imports in new icons | **Low** | Plop/templates should default to `../hooks/useIconProps` and `../types`. |
| Option A/B pursued prematurely | **Low** | Unnecessary migration cost while Option C already cleared cycles. |

## Decision

**Complete — Option C implemented in Track B; shim retired; all consumers migrated; Track B fully closed.**
