# `Table` — Klear360 vs. Compass Gap Report (Task 2 result)

Output of Task 2 from `Table-universal-behavior-spec.md`'s Cursor prompt: a section-by-section
comparison of Klear360's `Table` behavior spec (§1–§11) against Compass's `Table` as actually
implemented in `packages/compass/src/components/Table`, cross-referenced with the Task 1
story inventory. Task 2 audit output; implementation progress tracked below.

---

## Implementation progress (parallel tracks)

| Track | Branch | Status |
| --- | --- | --- |
| **1 — Compass parity** | `compass/table-1-filtering-parity` | **Items 1–2 done** (filtering + sticky columns). Items 3–5 pending. |
| **2 — Klear360 backports** | `klear360/table-compass-story-backports` (worktree) | **Done** — 5 example stories under `packages/klear360/.../Table/docs/`. |

**Item 1 shipped:** `filterFunctions`, `filterConfig`, controlled/uncontrolled column + global filter props, auto header filter row, `TableToolbarSearch`, split `TableRowContext` / `TableDataContext`, filtered pipeline before sort/pagination, select-all scoped to visible filtered rows. Stories: `TableFilteringAPI`, `TableToolbarSearchAPI`.

**Item 2 shipped:** `stickyColumnCount` / `stickyColumnWidths`, `trailingStickyColumnCount` / `trailingStickyColumnWidths`, `isLastColumnSticky` shorthand, cumulative left/right sticky CSS (header z-index stack), **mobile disables all sticky columns** (`useIsMobile` → counts forced to 0), leaf-row header cell counting for grid width. Story: `TableStickyColumnsExample.stories.tsx`.

**Intentional divergence (not a silent TODO):** **`showBorderedCells` default** — Compass **`false`**, Klear360 types document **`true`**. Keeping Compass default unless product explicitly opts into a **breaking** alignment.

**Follow-up:** port Klear360 `describe('filtering')` unit tests from `Table.web.test.tsx` (not included yet).

---

## Summary

Compass and Klear360 share the same `@table-library` foundation (selection, sort hook,
pagination, tree, virtualization). Parity is strong on core JSX composition, selection modes,
client/server pagination, sticky header/footer, first-column sticky, density, spanning,
loading/refreshing, toolbar placement, and cell-level editing.

The largest gaps are Klear360's newer Table API surface: column filtering, multi-column sort
+ `initialSort`, N-column/trailing sticky + mobile fallback, declarative `columns`, group
expansion (`expandedRowIds` + chevron), and several chrome cells (`TableToolbarSearch`,
title/description cell, editable search cell). Compass compensates with documented consumer
patterns (toolbar filter, persisted sort, deep grouping stories) that Klear360 should treat
as backport candidates (see §3 below).

---

## 1. Gap / improvement table (by spec section)

Rating key: **QW** = quick win · **BR** = breaking change · **NEW** = new capability.

### §1 Data model & column definition

| Klear360 rule | Compass today | Proposed change | Rating |
| --- | --- | --- | --- |
| `data: { nodes }` with required `id` | Same | — | Aligned |
| JSX or `columns` config (mutually exclusive) | JSX only (children render prop); no `columns` | Port `TableColumnConfig` + build header/body from config | NEW |
| No column reorder/resize/hide | Same (manual grid/JSX only) | — | Aligned |
| Default column tracks `minmax(100px, 1fr)` + horizontal scroll | Same via `gridTemplateColumns` default in `Table.web.tsx` | — | Aligned |
| `gridTemplateColumns` overrides per-column width | Only via table-level `gridTemplateColumns` (no column config) | Comes with `columns` API | NEW |
| `columnCount` from leaf header row | `getTableHeaderCellCount` reads first `TableHeaderRow` only | Count leaf row for multi-row group headers; stack sticky offsets like Klear360 | NEW / QW |

### §2 Selection

| Klear360 rule | Compass today | Proposed change | Rating |
| --- | --- | --- | --- |
| `selectionType` default `'none'` | Same | — | Aligned |
| `multiSelectTrigger` `'row' \| 'checkbox'`, default `'row'` | Same | — | Aligned |
| `checkboxDisplay` `'always' \| 'on-hover'` | Same (`TableBody.web.tsx`) | — | Aligned |
| `defaultSelectedIds` + `onSelectionChange({ selectedIds, values })` | Same; `values` deprecated in types | — | Aligned |
| Controlled `selectedIds` prop | Not exposed — internal `useState` only | Add `selectedIds` + sync with row-select middleware | NEW (optional QW if additive) |
| Tree-aware parent→children selection when `isGrouped` | Same (`onToggleByIdRecursively`) | — | Aligned |
| Documented re-render scope (all mounted rows) | Same architecture; not documented in Compass decisions | Document parity with Klear360 §2/§9 | QW (docs) |

### §3 Sorting

| Klear360 rule | Compass today | Proposed change | Rating |
| --- | --- | --- | --- |
| Sortable when key ∈ `sortFunctions` | Same (`currentSortedState.sortableColumns` = keys of `sortFunctions`) | Fix JSDoc on `TableHeaderCell` (still mentions `sortableColumns` prop) | QW |
| Click cycles asc → desc → unsorted | Uses library `onToggleSort`; tests assert asc/desc via sort control; third "unsorted" not covered | Verify 3-state cycle matches Klear360; add test | QW |
| Shift-click multi-column sort + ordered `TableSortOrderEntry[]` | Single `sortKey` + `isSortReversed` in context/callback | Port Klear360 secondary-sort / apply-sort-entries | NEW |
| `initialSort: { sortKey, direction }` on mount | Missing | Port prop + apply on mount | NEW |
| `onSortChange({ sortKey, isSortReversed })` | Same shape (no multi-sort in callback) | Extend callback when multi-sort lands | NEW |

### §4 Filtering

| Klear360 rule | Compass today | Proposed change | Rating |
| --- | --- | --- | --- |
| `filterFunctions` enables column + auto header filter row | Not in `TableProps` | Port full filter pipeline from Klear360 | NEW |
| `filterConfig` dropdown/multiselect | Missing | Port with filter row | NEW |
| AND across column filters; OR for global | Missing | Port + document | NEW |
| Controlled triples: column + global filter values | Missing | Port `columnFilterValues` / `globalFilterValue` / callbacks | NEW |
| `TableToolbarSearch` wired to global filter | No export; stories use ad-hoc `TextInput` in toolbar (`StickyFilterAndPagination`) | Port component + props | NEW |
| Keyboard: filters are tab-only (no grid nav) | Same limitation | — | Aligned |

### §5 Pagination

| Klear360 rule | Compass today | Proposed change | Rating |
| --- | --- | --- | --- |
| `paginationType` `'client'` (default) vs `'server'` + required server props | Same; dev validation in `TablePagination.web.tsx` | — | Aligned |
| Shared defaults (`defaultPageSize` 10, pickers, mobile hide) | Same pattern via `Pagination` | — | Aligned |
| `pageSizeOptions` array (default `[10,25,50]`) | Missing; `defaultPageSize` typed `10 \| 25 \| 50` only | Add `pageSizeOptions` + widen page size typing | QW |
| Selection survives page changes (`selectedIds`) | Selection in table state; no dedicated story/test like Klear360 `SelectionAcrossPages` | Add story + test (behavior likely OK today) | QW |
| Large page sizes → prefer virtualization | Mentioned in JSDoc on `defaultPageSize` | — | Aligned |

### §6 Sticky header, footer, columns

| Klear360 rule | Compass today | Proposed change | Rating |
| --- | --- | --- | --- |
| `isHeaderSticky` / `isFooterSticky` default `false` | Same | — | Aligned |
| Virtualization forces sticky header | Same (`shouldHeaderBeSticky = isVirtualized \|\| …`) | — | Aligned |
| `isFirstColumnSticky` (+ checkbox 2nd column offset) | Same CSS in theme | — | Aligned |
| `stickyColumnCount` + `stickyColumnWidths[]` | Only first column | Port cumulative-left math | NEW |
| Trailing sticky (`isLastColumnSticky`, counts + widths) | Missing | Port + hover-actions coordination | NEW |
| Disable all sticky columns below `s` breakpoint | `isFirstColumnSticky` still on mobile; mobile only changes hover-actions column width | Port Klear360 `useIsMobile` → force counts to 0 | NEW |
| Multi-row header sticky top stacking (36px/row) | No `_stickyTopOffsetPx` on header rows | Port grouped-header sticky offsets | NEW |
| Filter row + grouped header + sticky known gap | N/A until filters exist | Port Klear360 decision + don't combine blindly | NEW (docs) |

### §7 Row density, spanning, headers

| Klear360 rule | Compass today | Proposed change | Rating |
| --- | --- | --- | --- |
| `rowDensity` default `'normal'`; header always compact 36px | Same; deprecated `rowDensity` on header row | — | Aligned |
| Single shared CSS grid; cell spanning props | Same stories/tests | — | Aligned |
| Multi-row headers; last row = leaf convention | Stories use multiple `TableHeaderRow`; grid column count may be wrong (§1) | Leaf-row column count + optional internal `_isLeafHeaderRow` | NEW |
| `showBorderedCells` default `true` (Klear360 types) | Default **`false`** in Compass (intentional; see Implementation progress) | No change unless product requests **BR** | **Intentional divergence** |
| `backgroundColor` token family | Same | — | Aligned |

### §8 Grouping & row expansion

| Klear360 rule | Compass today | Proposed change | Rating |
| --- | --- | --- | --- |
| `isGrouped` + tree-aware selection | Same | — | Aligned |
| `expandedRowIds` / `defaultExpandedRowIds` / `onExpandedRowIdsChange` | Missing; mount calls `tree.fns.onToggleAll({ ids: [] })` | Port controlled expansion; default all group ids expanded | NEW |
| Chevron in group header first cell; click stops propagation | No built-in chevron; `clickType: undefined` disables row-click tree toggle | Port Klear360 `TableBody` expand cell | NEW |
| Flat indent (no tree indent) | Same (`treeYLevel: undefined`) | — | Aligned |
| `isGrouped` + virtualization unsupported | Same underlying issue (flat virtual list) | Document + dev warning | QW |
| Manual nesting (`TableNesting` stories) | Compass-only pattern (app-owned expand + extra rows) | Keep as advanced pattern; don't conflate with `isGrouped` API | Note |

### §9 Virtualization

| Klear360 rule | Compass today | Proposed change | Rating |
| --- | --- | --- | --- |
| `TableVirtualizedWrapper` + required table height | Same | — | Aligned |
| Sticky header when virtualized | Same | — | Aligned |
| Fixed `rowHeight` only (variable height bug) | Same wrapper; index-1 adjustment in `TableBody.web.tsx` | Document fixed-height-only | QW (docs) |
| No overscan prop | Same | — | Aligned |
| Split context (appearance vs data slices) | Single large `TableContext` | Optional perf port from Klear360 | NEW (internal) |
| DOM nesting warning from library | Same class of issue | — | Aligned |

### §10 States & chrome

| Klear360 rule | Compass today | Proposed change | Rating |
| --- | --- | --- | --- |
| `isLoading` / `isRefreshing` | Same (skeleton vs overlay spinner) | — | Aligned |
| Distinct empty: no data vs filtered zero | Not built into either component; Klear360 has `TableEmptyStateExample` stories | Add same story pair to Compass; optional future `emptyState` slot | QW (stories) |
| Stripes, toolbar, overlay placement | Same | — | Aligned |
| Hover actions + trailing sticky coordination | Hover actions on mobile use `position: relative` / `1fr` column | Full parity needs trailing sticky (§6) | NEW |
| Cell editing primitives | `TableEditableCell` + dropdown cell | — | Aligned |
| `TableEditableSearchCell` | Missing | Port from Klear360 | NEW |
| `TableTitleDescriptionCell` + truncate/wrap | Missing | Port from Klear360 | NEW |

### §11 Out of scope / limitations

| Klear360 rule | Compass today | Proposed change | Rating |
| --- | --- | --- | --- |
| No column DnD reorder/resize/hide | Same | — | Aligned |
| No RN `Table` | Same (`Table.native` unavailable) | — | Aligned |
| No full keyboard grid | Same; Compass `KeyboardWalkthrough` story documents Tab-only | — | Aligned (Compass doc ahead) |
| RTL unaudited | Same | — | Aligned |

### Compass-only (not in Klear360 spec — scope differences, not "gaps")

| Behavior | Notes |
| --- | --- |
| `ListView` embedding (`useListViewContext`, transparent surface) | Compass product integration |
| `TableFigmaExample` light/dark | Visual regression |
| Heavy manual nesting stories | Alternative to `isGrouped` expansion |

---

## 2. Prioritized top 5 gaps to close first (Compass ← Klear360)

1. **Column filtering + global search API** (`filterFunctions`, `filterConfig`, controlled
   filter values, `TableToolbarSearch`) — unlocks the biggest behavioral delta vs. the spec
   and vs. Klear360 stories. Compass's `StickyFilterAndPagination` proves demand but forces
   every team to reimplement AND/OR rules and header UX themselves.
2. **Sticky column parity + mobile fallback** (`stickyColumnCount`/widths, trailing sticky,
   disable below `s`) — enterprise tables routinely freeze 2+ columns and an actions column.
   Compass today can freeze only the first data column, and keeps sticky on small viewports,
   which the spec explicitly rejects as unusable.
3. **Group expansion API** (`expandedRowIds`, chevron, default-all-expanded) — Compass's
   `isGrouped` is selection-ready but expansion is ambiguous (library tree +
   `onToggleAll({ ids: [] })`, no chevron). Aligning removes the need for one-off
   `TableNesting` state for the common "collapse shipment groups" case
   (`ThreeLevelShipmentHierarchy`).
4. **`initialSort` + shift-click multi-sort** — the low-level sort hook is already there;
   Klear360's layer is mostly state and header events. `PersistedSortRoundTrip` in Compass
   already shows apps pre-sorting data — `initialSort` makes that first-class and avoids
   remount hacks.
5. **Declarative `columns` config** (optional but high leverage) — large for one PR, but it
   standardizes width/sortable/filter wiring and fixes leaf-column counting for wide
   datasets. Can follow filters + sticky if smaller increments are preferred first
   (`pageSizeOptions` + empty-state stories + `SelectionAcrossPages` test are good
   quick-win fillers between those tracks).

---

## 3. Backport candidates: Compass patterns → Klear360 `Table`

Treat these as documentation / Storybook / test recipes, not Compass API gaps:

| Compass use case | File | Why backport to Klear360 |
| --- | --- | --- |
| `PersistedSortRoundTrip` | `docs/TablePersistedSortExample.stories.tsx` | Shows `onSortChange` → URL/localStorage + remount; complements Klear360 `initialSort` with real app persistence |
| `ThreeLevelShipmentHierarchy` | `docs/TableDeepNestedGroupingExample.stories.tsx` | Stress-test for deep `isGrouped` + spanning; good regression for expansion/chevron work |
| `StickyFilterAndPagination` | `docs/TableCombinedStickyPaginationFilterExample.stories.tsx` | Integration pattern: sticky header + first column + pagination + toolbar filter; still useful even with column filter rows (toolbar global-search variant) |
| `ColumnAggregateFooter` | `docs/TableFooterTotalsExample.stories.tsx` | Footer aggregates are app-owned in both systems; canonical recipe for sticky footer + amount/counts |
| `KeyboardWalkthrough` | `docs/TableKeyboardNavigationExample.stories.tsx` | Playwright `play` asserting Tab → sort control; baseline until full grid nav exists |

---

**Status: stopped before implementation, per spec.** Next decision: start on Compass parity
(suggested order in §2), Klear360 backports (stories/tests only, no API changes), or both in
parallel.
