# ADR-002: ThemeContext and useTheme export path

**Status:** Proposed  
**Date:** 2026-10-27  
**Owner:** 

## Context

`ThemeContext` and `useTheme` are implemented under `src/components/CompassProvider/` but are **re-exported from `@klearnow/compass/utils`** via:

```ts
export { default as useTheme, ThemeContext } from '~components/CompassProvider/useTheme';
```

(in `src/utils/index.ts`, with historical PR discussion links in that file).

The documented mental model for consumers is **`@klearnow/compass/components`** (provider + theme) or a future dedicated provider entry. **`utils`** is intended for non-UI helpers (spacing, motion, platform). Exporting a React context from `utils` blurs UI vs utility boundaries and encourages hooks-in-utils import patterns in app code.

Removing the `utils` re-export without a migration would be a **breaking change** for any consumer that imports `useTheme` from `@klearnow/compass/utils`. No codemod exists yet.

## Options

### Option A — Keep utils re-export permanently

Document `@klearnow/compass/utils` as a **supported** public path for `useTheme` / `ThemeContext` alongside `components`.

**Trade-offs:** Zero migration cost; perpetuates ambiguous package boundaries; harder to tree-shake or document “UI vs utils” clearly. **Low** short-term risk, **Medium** long-term maintainability cost.

### Option B — Deprecate utils re-export; remove on major with codemod

- Next **minor:** JSDoc/`@deprecated` on utils exports; dev-only runtime warning optional.
- Document preferred import from `@klearnow/compass/components`.
- Next **major:** Remove utils re-export; ship codemod `utils/useTheme` → `components`.

**Trade-offs:** Clear migration story; requires semver major and consumer comms. **Medium** execution cost, **Low** technical risk if codemod is thorough.

### Option C — Dedicated `@klearnow/compass/provider` subpath

Add `package.json` `exports` entry (e.g. `./provider`) exporting `CompassProvider`, `useTheme`, `ThemeContext`, and related types only. Deprecate both `utils` and ambiguous deep paths for these symbols.

**Trade-offs:** Cleanest public surface; requires build/export map work and dual deprecation (utils + any legacy paths). **Medium–High** implementation cost, **Low** consumer confusion once migrated.

## Recommendation

Adopt **Option B as the first step**, with **Option C as the end state** when export maps are ready.

Option B delivers a predictable deprecation window without blocking current consumers. Option C aligns with how design systems typically expose “app shell” APIs separately from tokens and low-level utils. Option A should be rejected unless the team explicitly accepts permanent dual paths.

**Suggested timeline (illustrative):**

- **v12.x minor:** Deprecation notices + docs; no removal.
- **v13.0:** Remove utils re-export; codemod; optionally introduce `./provider` if not already shipped in a prior minor.

## Migration path

1. **Document** canonical imports in README and Storybook: `import { useTheme, CompassProvider } from '@klearnow/compass/components'`.
2. **Mark deprecated** in `src/utils/index.ts` (comment + TypeScript `@deprecated` on re-exports when types allow).
3. **Codemod outline:** AST transform replacing `@klearnow/compass/utils` imports of `useTheme` / `ThemeContext` with `@klearnow/compass/components` (or `./provider` later); run on internal monorepos first.
4. **Major release:** Remove lines from `src/utils/index.ts`; verify `utils.d.ts` build output; changelog breaking entry.
5. **Optional (Option C):** Add `./provider` export in `package.json`, generate d.ts/js entries in Rollup build, mirror in native entry if applicable.

**Consumers:** Any app importing `useTheme` from `utils` must switch paths once per major bump.

## Risks

| Risk | Severity | Notes |
|------|----------|--------|
| Missed external consumers on utils path | **High** | Silent runtime failures if removal without codemod/comms. |
| Duplicate exports during deprecation | **Low** | Tree size unchanged; document “prefer components”. |
| `./provider` export drift from components barrel | **Medium** | Requires CI check that both export the same implementation. |

## Decision

_To be filled by the team._
