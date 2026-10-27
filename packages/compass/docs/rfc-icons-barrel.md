# RFC: Icons barrel circular dependencies

## 1. Status

Proposed

## 2. Context

**Total circular dependency count (madge on `src/components/index.ts`):** `486` lines of output from:

```bash
npx madge --circular --extensions ts,tsx src/components/index.ts 2>/dev/null | wc -l
```

Of those, **`483`** are numbered cycle chains (`N) …`). **`453`** of the numbered chains reference `Icons/index.ts`.

**Madge on the icons barrel (`src/components/Icons/index.ts`):** **`453`** numbered circular chains (`486` lines total with `wc -l`).

**Top 5 cycle chains** (exact madge output on `src/components/Icons/index.ts`):

1. `AcceptPaymentsFilledIcon/AcceptPaymentsFilledIcon.tsx > index.ts > AcceptPaymentsFilledIcon/index.ts`
2. `index.ts > AcceptPaymentsIcon/index.ts > AcceptPaymentsIcon/AcceptPaymentsIcon.tsx`
3. `index.ts > AcceptPaymentsIcon/index.ts > AcceptPaymentsIcon/AcceptPaymentsIcon.tsx > useIconProps/index.ts > useIconProps/useIconProps.tsx`
4. `index.ts > ActivityIcon/index.ts > ActivityIcon/ActivityIcon.tsx`
5. `index.ts > AddressBookIcon/index.ts > AddressBookIcon/AddressBookIcon.tsx`

**Current icons barrel size:** **`455`** named icon re-exports (`export { default as …Icon }`) in `src/components/Icons/index.ts`, plus `export * from './types'`. The file is auto-generated (`scripts/icons/plop/iconReexports.ts.hbs`).

**Why the barrel causes cycles (plain English):**

Each icon component imports shared helpers such as `useIconProps` and types such as `IconComponent` from `..`, which resolves to `Icons/index.ts`. That barrel, in turn, re-exports every icon—including the file that is still loading. Separately, `useIconProps/useIconProps.tsx` imports `IconProps` from `..` (the same barrel). When madge walks the graph from `Icons/index.ts`, it sees: barrel → icon folder → icon implementation → `useIconProps` → barrel again. Hundreds of icons produce hundreds of structurally similar cycles; chain (3) above shows the `useIconProps` back-edge explicitly.

**Note on categories:** `Icons/index.ts` is a **single flat barrel**. There are no category sub-barrels in source today (only per-icon folders and a separate auto-generated `iconMap.ts` used for Storybook listing).

## 3. Options

### Option A — Subpath exports per icon category

- Remove the single `Icons/index.ts` barrel from the public graph (or stop re-exporting all icons from `@klearnow/compass/components`).
- Add **package.json `exports`** subpaths per category, e.g. `@klearnow/compass/icons/arrows`, `/icons/payment`, etc.

**Categories today:** None in `Icons/index.ts`. A rollout would need **new category index files** (likely generated), for example:

| Proposed subpath | Example icons (by naming convention) |
|------------------|--------------------------------------|
| `./icons/arrows` | `Arrow*`, `ArrowSquare*` |
| `./icons/alerts` | `Alert*`, `Bell*` |
| `./icons/payment` | `*Payment*`, `Bank*`, `Card*`, `AcceptPayments*` |
| `./icons/charts` | `*Chart*`, `BarChart*` |
| `./icons/brand` | `Klearnow*`, `AppleIcon`, `AndroidIcon`, … |
| `./icons/general` | Remaining icons |

**Example `package.json` additions** (illustrative — paths would be produced by codegen):

```json
{
  "exports": {
    "./icons/arrows": {
      "types": "./build/lib/web/production/components/Icons/categories/arrows.d.ts",
      "default": "./build/lib/web/production/components/Icons/categories/arrows.js"
    },
    "./icons/payment": {
      "types": "./build/lib/web/production/components/Icons/categories/payment.d.ts",
      "default": "./build/lib/web/production/components/Icons/categories/payment.js"
    },
    "./icons/alerts": {
      "types": "./build/lib/web/production/components/Icons/categories/alerts.d.ts",
      "default": "./build/lib/web/production/components/Icons/categories/alerts.js"
    }
  }
}
```

**Consumer migration:** Every `import { ArrowRightIcon } from '@klearnow/compass/components'` becomes a category subpath (or deep import). A codemod would map symbol → category via generated manifest, rewrite imports, and flag unknown symbols.

**Estimated cycle reduction:** Up to **`453`** icon-related chains that touch `Icons/index.ts` in the components graph, **if** the monolithic barrel is no longer pulled in by the main components entry and icons no longer import the full barrel.

**Consumer migration effort:** **High** (every icon import path changes).

---

### Option B — Lazy `iconMap` registry

- Icons self-register in a map at module load; consumers render `<Icon name="ArrowRight" />` instead of `import { ArrowRightIcon }`.
- Storybook already maintains a generated `iconMap.ts` (all icons imported statically today).

**Risks:** SSR/module order, tree-shaking, runtime validation for dynamic names.

**Estimated cycle reduction:** **All icon barrel cycles** if nothing static-imports the full barrel.

**Consumer migration effort:** **High** (API change, not just paths).

---

### Option C — Extract `useIconProps` to a standalone file

- Move `useIconProps` to `Icons/hooks/useIconProps.ts` (or equivalent) that imports **`IconProps` from `./types` only**, never from `Icons/index.ts`.
- Keep `Icons/index.ts` as-is for exports.
- No public API change for consumers.

**Estimated cycle reduction:** Breaks cycles whose chain includes `useIconProps/useIconProps.tsx → index.ts` (see chain 3 above). Madge shows **`1`** numbered chain on `src/components/index.ts` that names `useIconProps`; on the icons barrel run, **`1`** chain includes `useIconProps`. Fixing the hook removes that back-edge; **full** elimination of all **`453`** icon cycles additionally requires icons to stop importing types from `..` (barrel) or shrinking the barrel—see pilot results.

**Consumer migration effort:** **None**

## 4. Recommendation

**Recommend Option C first**, followed by a measured rollout (pilot → all icons → optional barrel split later if needed).

Option C targets the shared **`useIconProps → Icons/index.ts`** back-edge with **zero consumer migration** and low revert risk. Option A reduces cycles only at the cost of **high** migration and new export surface area for **455** icons. Option B is the highest risk (SSR, bundle shape, API break). Option C is **reversible** file-by-file and validates the hypothesis before any import-path or API change.

## 5. Migration path for recommended option (Option C)

1. Add `src/components/Icons/hooks/useIconProps.ts` importing `IconProps` from `../types` and `iconSizeMap` from `../useIconProps/iconSizeMap` (no barrel imports).
2. Point icon implementations at `../hooks/useIconProps` (codemod or scripted replace of `from '../useIconProps'`).
3. Leave `useIconProps/index.ts` re-exporting the new hook for backward compatibility until all call sites migrate, then delete the old implementation file.
4. Optionally change icon type imports from `..` to `../types` in a second pass to remove remaining `icon.tsx > index.ts` edges (chains 1, 2, 4, 5, …).
5. Re-run madge on `Icons/index.ts` and `components/index.ts`; run `yarn typecheck` and icon/unit tests.

**Tests to update:** Any unit test that mocked `useIconProps` path; icon snapshot tests unchanged if visuals unchanged.

## 6. Risks

| Risk | Level | Notes |
|------|-------|--------|
| Bundle order regression | **Low** (Option C) | Same symbols and entry points; only internal import paths change. **Medium** for Option A/B (new entry chunks). |
| SSR / hydration | **Low** (Option C) | No lazy registry. **Medium–High** for Option B (registration order). |
| Dynamic icon names | **Low** | Public API uses `IconComponent` references (e.g. `icon={ArrowRightIcon}` on `Button`), not string icon names. Storybook `iconMap` is docs-only. |
| Breaking consumers | **Low** (Option C) | No export changes. **High** (A/B). |

## 7. Owner

_(To be filled by the team)_

---

## Pilot result

**Icon piloted:** `AcceptPaymentsIcon` — it appears in **two** of the top five madge chains (chains 2 and 3) before the pilot, the most of any single icon in that set.

**Files touched:**

- Added `src/components/Icons/hooks/useIconProps.ts` (barrel-free: imports `IconProps` from `../types` only).
- Updated `src/components/Icons/AcceptPaymentsIcon/AcceptPaymentsIcon.tsx` to import from `../hooks/useIconProps`.

**Cycle count (`npx madge --circular --extensions ts,tsx src/components/Icons/index.ts`):**

| Metric | Before pilot | After pilot |
|--------|----------------|-------------|
| `wc -l` | 456 | 456 |
| Numbered chains (`N) …`) | 453 | 453 |

**Top chain change:** Chain 3 no longer ends in `AcceptPaymentsIcon → useIconProps → useIconProps.tsx`. It is now `ActivityIcon/ActivityIcon.tsx > useIconProps/...` (chain 4 in the after output). The **`useIconProps → Icons/index.ts`** edge remains for all other icons still importing `../useIconProps` and for `useIconProps/useIconProps.tsx` still importing `IconProps` from `..`.

**Typecheck (`yarn typecheck`):** **Fails** (exit 1) — **not caused by the pilot.** No errors reference `hooks/useIconProps` or `AcceptPaymentsIcon`. Failures are in unrelated files (e.g. Track C test files: `ListView.test.tsx`, `Spark.test.tsx`, `FilterChip` types). Web-only typecheck fails for the same pre-existing test typing issues.

**Regression tests (Priority 1):** **Pass** — 4/4 suites, 19 tests.

**Option C scale-up verdict:** **Mechanically safe** for the hook extraction (pilot compiles; no consumer API change). **Cycle count will not meaningfully drop** until (1) all icons use `hooks/useIconProps`, (2) `useIconProps/useIconProps.tsx` is removed or re-export-only without importing `..`, and (3) icon files import types from `../types` instead of `..`. **New risk discovered:** one-icon pilot is insufficient to move madge totals; metrics should track “chains containing `useIconProps/useIconProps.tsx`” or eliminate the old hook module in the same rollout batch.

---

## Rollout result (Track B full rollout)

**Migration script (Step 1):** Replaced `from '../useIconProps'` → `from '../hooks/useIconProps'` in per-icon folder `.ts`/`.tsx` files only.

| Action | Files updated |
|--------|----------------|
| Step 1 — `useIconProps` path | **453** (AcceptPaymentsIcon was already migrated in the pilot → **454** icon implementations on the new hook path) |
| Step 5 — `IconComponent` from `../types` | **454** |
| `Icons/index.ts` | **Not modified** |
| Files outside `src/components/Icons/` | **Not modified** by the scripts |

**Shim (Step 2):** `src/components/Icons/useIconProps/useIconProps.tsx` is re-export-only (`export { default, useIconProps } from '../hooks/useIconProps'`). Implementation lives in `src/components/Icons/hooks/useIconProps.ts` (imports `IconProps` from `../types`, `iconSizeMap` from `../useIconProps/iconSizeMap` — no barrel).

**Madge cycle counts** (`npx madge --circular --extensions ts,tsx`, numbered chains = lines matching `N) …`):

| Checkpoint | `Icons/index.ts` (numbered) | `Icons/index.ts` (`wc -l`) | `components/index.ts` (numbered) |
|------------|----------------------------|------------------------------|----------------------------------|
| Pilot baseline | 453 | 456 | 483 |
| Post Step 1 + Step 2 (hook + shim) | 452 | 455 | 482 |
| Chains mentioning `useIconProps/useIconProps.tsx` after Step 2 | **0** | — | — |
| Post Step 5 (`IconComponent` → `../types`) | **0** | 3 | **30** |

Post Step 1 + 2, madge totals barely moved because **~452** cycles were still `Icon.tsx > index.ts > Icon/index.ts` from `import type { IconComponent } from '..'`. Step 5 removed that barrel back-edge for icon implementations and cleared icon-barrel cycles.

**Remaining cycles (30 on `components/index.ts`):** Non-icon module graphs (examples from post-rollout madge): `ActionList/actionListUtils.ts ↔ ActionListItem`, `Badge` tokens/types, `Button/BaseButton`, `Card/types`, `Checkbox`/`Radio` groups, `Input/BaseInput`, `CompassProvider/index.ts ↔ useTheme`, `List`, `Spark/KlearGlass`, etc. **None** reference `Icons/index.ts`.

**Typecheck (Step 7, Icons filter):** `yarn tsc --noEmit --project tsconfig.json 2>&1 | grep "Icons/"` — **no errors in icon component implementations**. Reported lines are pre-existing Storybook typing (`Icons.stories.tsx`, `_KitchenSink.Icons.stories.tsx`, `@storybook/react-vite`); stories were not changed in this rollout.

**Test regression (Step 6, Priority 1):** **Pass** — 4/4 suites, **19/19** tests (`ActionList`, `AutoComplete`, `SelectableCard`, `Spark`). Jest exited non-zero due to **obsolete icon snapshot files** (unrelated renames); suites themselves passed.

**Shim deletion:** **Not safe to delete yet.** Consumers still import `~components/Icons/useIconProps` (e.g. `ChatMessage/ReasoningTraces.web.tsx`, `ReasoningTraces.native.tsx`, `Avatar/TrustedBadgeIcon.web.tsx`, `useIconProps/useIconProps.test.tsx`). Keep `useIconProps/index.ts` + shim until those paths migrate to `hooks/useIconProps` or a documented public export.

**Recommended next steps**

1. **Deprecation window:** Optionally codemod internal `~components/Icons/useIconProps` → `~components/Icons/hooks/useIconProps` (or export hook from package root if desired), then remove `useIconProps/useIconProps.tsx` shim.
2. **Option A (subpath exports):** **Lower priority** after this rollout — icon-related **453** barrel cycles are gone without consumer migration. Revisit Option A only if bundle size or tree-shaking requires splitting the flat `Icons/index.ts` export surface.
3. **Track B status:** **Complete** for Option C scope (hook extraction + icon internal imports). **Follow-up (optional):** shim removal after consumer audit; unrelated **30** component cycles are out of Track B scope.
