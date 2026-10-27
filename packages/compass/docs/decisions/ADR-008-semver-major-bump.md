# ADR-008: Semver major bump (v13) timing

**Status:** Proposed  
**Date:** 2026-10-27  
**Owner:** 

## Context

**Current version:** `12.130.0` (from `package.json`).

Recent tracks:

| Track | Nature | Consumer impact |
|-------|--------|-----------------|
| A | Theme/typecheck fixes; AUDIT comments; additive `main`/`module`/`types` in package.json | Additive / internal |
| B | ~455 icon **internal** import path changes; `useIconProps` shim | **No** documented public API change; **possible** deep imports of `Icons/useIconProps` |
| C | Behavior tests (Priority 1/2) | Test-only in package |

**ADR-002** may remove `useTheme` from `utils` — **breaking** when executed.

**Shim deletion** (ADR-001) breaks undocumented internal path `~components/Icons/useIconProps`.

A **major bump** should bundle intentional breaking changes with a migration guide, not Track B internals alone.

### Public export history command (audit)

From `packages/compass`:

```bash
git log v12.0.0..HEAD --oneline --no-merges -- src/components/index.ts src/tokens/index.ts src/utils/index.ts 2>/dev/null | head -40
```

**Actual output in this workspace** (2026-10-27):

```
(empty — not a git repository in this checkout; command could not run)
```

**Action for the team:** Run the command in the canonical **github.com/klearnow/compass** clone with tag `v12.0.0` fetched. Review each commit for removed exports, renamed types, or changed signatures on the three barrels.

## Options

### Option A — Stay on v12

Continue minor/patch releases; document potentially breaking deep imports in CHANGELOG without major bump.

**Trade-offs:** **Low** friction; semver purists may disagree if utils path is removed without major. **Medium** communication risk.

### Option B — Cut v13

Major release when shim removal and ADR-002 deprecation complete; migration guide for export paths and any API changes found in git log review.

**Trade-offs:** Clear signal for breaking changes; requires migration guide + codemods. **Medium** consumer upgrade cost.

### Option C — Release channels

`v12-stable` maintenance vs `v13-next` for early adopters.

**Trade-offs:** **High** release engineering cost; useful only if large consumer base needs staggered adoption.

## Recommendation

**Option B** when **both** are true:

1. **ADR-001** shim retired (or explicitly deprecated one minor with removal in v13).  
2. **ADR-002** utils `useTheme` removal (or `./provider` migration) ships.

Until then, stay on **v12 minors/patches** (Option A) for Track B/C work — internal refactors only.

### Proposed v13 migration guide (minimum sections)

1. **Theme hooks:** `useTheme` / `ThemeContext` import path change (`utils` → `components` or `@klearnow/compass/provider`).
2. **Internal icon hook paths:** If any app imported `Icons/useIconProps`, switch to public icon APIs only.
3. **Export removals:** List from `git log v12.0.0..HEAD` review on `components/index.ts`, `tokens/index.ts`, `utils/index.ts`.
4. **Visual/token changes:** Any breaking token renames from brand refresh codemods (if included in v13 scope).

### Minimum CHANGELOG entries for v13

- **Breaking:** Removed `useTheme` and `ThemeContext` from `@klearnow/compass/utils`.
- **Breaking:** (If applicable) Removed internal re-export paths documented as unsupported.
- **Migration:** Link to codemod(s) and provider import examples.
- **Note:** Track B icon internal refactor **not** listed as breaking if public exports unchanged.

## Migration path

1. Complete ADR-001 shim retirement checklist.
2. Implement ADR-002 deprecation window (at least one minor on v12 with `@deprecated`).
3. Run git log review command on real repo; diff published `*.d.ts` between v12.0.0 and HEAD.
4. Branch `v13`; aggregate breaking commits; write migration guide.
5. Ship codemods; release v13.0.0; maintain v12 security patches if policy requires.

## Risks

| Risk | Severity | Notes |
|------|----------|--------|
| Major without consumer-ready codemod | **High** | Blocks upgrades. |
| Delaying major while breaking utils silently | **High** | If removal ships on minor. |
| v13 scope creep | **Medium** | Bundle only agreed breaking items. |

## Decision

_To be filled by the team._
