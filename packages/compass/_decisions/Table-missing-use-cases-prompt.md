# `Table` — Missing Use Case Audit & Cursor Prompt (Compass)

Unlike the `CitedFieldRow` / `ResizableSplit` specs, this doc is scoped narrowly to **use
cases only** — `Table` already exists and is heavily built out. The goal is: don't touch
what's already shipped, only add what's genuinely missing.

**Source:** `packages/compass/src/components/Table/`  
**Decisions log:** `packages/compass/src/components/Table/_decisions/decisions.md` (when present)  
**Klear360 reference (feature parity target):** `packages/klear360/_decisions/Table-missing-use-cases-prompt.md`

---

## 0. Cursor prompt — paste this as-is

````
I need you to extend the Compass `Table` component's documented use cases — NOT rebuild,
refactor, or restyle anything that already exists. Read this file
(`Table-missing-use-cases-prompt.md`) in full first.

HARD RULE — do not override what already exists:
- §1 below lists all story-level use cases Compass `Table` already ships (Examples under
  `src/components/Table/docs/` and API under `src/components/Table/docs/APIStories/`).
  Do not rename, restructure, merge, or rewrite any of these — if you think one is wrong
  or outdated, stop and tell me instead of changing it.
- Do not touch `Table.web.tsx`, `Table.native.tsx`, or other component source files unless
  a missing use case genuinely requires a prop that doesn't exist yet (Tier B) — confirm
  with me before changing public API surface.
- If you're unsure whether something "already exists" under a different name, search first
  (`grep` / `find` across `src/components/Table/docs/`) rather than assuming it's missing.

STEP 1 — Confirm the gap list. §2 lists use cases still missing or deferred:
- **Tier A (docs-only):** capability exists in code — add Storybook examples only.
- **Tier B:** out of scope or needs product/engineering sign-off — do NOT build without confirmation.

STEP 2 — For each Tier A item confirmed, add ONE new story file (or a new export in a
sibling file if that matches neighbors). Naming: `TableXExample.stories.tsx` for Examples,
`TableXAPI.stories.tsx` for API. Match imports, `Meta`, `recipeStoryParameters`, and `play`
patterns from neighboring files.

Deliverables:
1. Tier A items added + file paths.
2. Tier A skipped + why (already exists elsewhere).
3. Tier B proposed approach, left unbuilt.
4. Confirm §1 existing use cases were not modified.
````

---

## 1. Already shipped — do not duplicate or rebuild

Counted per Storybook sidebar entry (`export const` in each `*.stories.tsx`), as of this audit.

**Total: 56 use cases** (21 Examples + 35 API)

### Examples — `src/components/Table/docs/` (21)

| File | Use cases |
| --- | --- |
| `BasicTable.stories.tsx` | Table |
| `TableExamples.stories.tsx` | BasicTable, TableWithCustomCellComponents, SortableTable, TableWithStickyHeaderAndFooter, TableWithStickyFirstColumn, SingleSelectableTable, MultiSelectableTableWithToolbar, MultiSelectableWithZebraStripes, TableWithDisabledRows, TableWithBackgroundColor, TableWithIsLoading, TableWithIsRefreshing, TableWithEditableCells |
| `TablePaginationExamples.stories.tsx` | TableWithClientSidePagination, TableWithServerSidePagination |
| `TablePersistedSortExample.stories.tsx` | PersistedSortRoundTrip |
| `TableCombinedStickyPaginationFilterExample.stories.tsx` | StickyFilterAndPagination |
| `TableDeepNestedGroupingExample.stories.tsx` | ThreeLevelShipmentHierarchy |
| `TableFooterTotalsExample.stories.tsx` | ColumnAggregateFooter |
| `TableKeyboardNavigationExample.stories.tsx` | KeyboardWalkthrough |

### API — `src/components/Table/docs/APIStories/` (35)

| File | Use cases |
| --- | --- |
| `TableAPI.stories.tsx` | Table |
| `TableBodyAPI.stories.tsx` | TableBodyStory |
| `TableCellAPI.stories.tsx` | TableCellStory |
| `TableCheckboxDisplayAPI.stories.tsx` | TableCheckboxDisplay |
| `TableEditableCellAPI.stories.tsx` | TableEditableCellStory |
| `TableFigmaExample.stories.tsx` | TableFigmaExample |
| `TableFooterAPI.stories.tsx` | TableFooterStory |
| `TableFooterCellAPI.stories.tsx` | TableFooterCellStory |
| `TableFooterRowAPI.stories.tsx` | TableFooterRowStory |
| `TableGrouping.stories.tsx` | BasicGrouping, TableGroupingWithSelection, TableGroupingWithDisabledRows |
| `TableHeaderAPI.stories.tsx` | TableHeaderStory |
| `TableHeaderCellAPI.stories.tsx` | TableHeaderCellStory |
| `TableHeaderRowAPI.stories.tsx` | TableHeaderRowStory |
| `TableHoverActions.stories.tsx` | TableHoverActions |
| `TableNesting.stories.tsx` | TableNesting, TableNestingWithSorting |
| `TablePaginationAPI.stories.tsx` | TablePaginationStory |
| `TableRowAPI.stories.tsx` | TableRowStory |
| `TableSpanning.stories.tsx` | RowSpan, ColumnSpan, HeaderSpan, FooterSpan, ColumnRowSpan, ColumnSpanWithSelection, ColumnSpanWithStickyFirstColumn, RowSpanWithStickyFirstColumn, RowColumnSpanWithStickyFirstColumn |
| `TableStripedRows.stories.tsx` | TableStripedSelection, TableStripedSelectionNoToolbarNoPagination, TableStripedHoverNoSelection |
| `TableToolbarAPI.stories.tsx` | TableToolbarStory |
| `TableToolbarActionsAPI.stories.tsx` | TableToolbarActionsStory |
| `VirtualizedTableAPI.stories.tsx` | VirtualizedTable |

Already covered in Compass (do not re-propose as Tier A): sticky first column, sticky
header/footer, client/server pagination, sortable columns, grouping (2-level), hover actions,
virtualized table, striped rows, spanning, editable cells, loading/refreshing.

### Compass vs Klear360 parity (optional porting — not Tier A here)

Klear360 ships additional Examples/API stories Compass does not yet mirror (e.g. column
filter row, trailing sticky columns, toolbar search API, combined virtualized features,
master showcase, wide dataset, selection across pages, multi-column sort recipes). Porting
those is a **separate docs backlog**, not “missing Tier A” from the original five-item list.

---

## 2. Missing / deferred use cases

### Tier A — **completed in Compass** (2026-10-28)

| # | Use case | Compass story |
| - | --- | --- |
| 1 | Persisted sort / query-param round-trip | `TablePersistedSortExample.stories.tsx` → `PersistedSortRoundTrip` |
| 2 | Filter + sticky + pagination (non-virtualized) | `TableCombinedStickyPaginationFilterExample.stories.tsx` → `StickyFilterAndPagination` (toolbar search + client filter; see note below) |
| 3 | 3+ level nested grouping | `TableDeepNestedGroupingExample.stories.tsx` → `ThreeLevelShipmentHierarchy` |
| 4 | Footer totals / aggregates | `TableFooterTotalsExample.stories.tsx` → `ColumnAggregateFooter` |
| 5 | Keyboard walkthrough | `TableKeyboardNavigationExample.stories.tsx` → `KeyboardWalkthrough` |

**Compass note (#2):** `TableProps` does not include Klear360’s `filterFunctions` / header
filter row yet. The combined-features story documents **toolbar `TextInput` + client-side
filtering** with `isFirstColumnSticky`, `isHeaderSticky`, and `TablePagination` until column
filters exist in Compass.

Future Tier A candidates (if product wants Klear360 parity in Storybook only):

- Header filter row + multiselect (`filterFunctions`, `filterConfig`)
- Trailing sticky columns (`trailingStickyColumnCount`)
- `VirtualizedTableCombinedFeaturesAPI`
- Multi-column sort + `initialSort` recipes (if `initialSort` is added to Compass `Table`)

### Tier B — needs sign-off (do not implement without decision)

| # | Use case | Notes |
| - | --- | --- |
| 6 | Column reordering (drag-and-drop) | Out of scope in Klear360 `decisions.md` |
| 7 | Column resizing | Out of scope |
| 8 | Column visibility toggle | Out of scope |
| 9 | Full editable rows (not cells) | Out of scope |
| 10 | `Table` on React Native | Use `List` on native |
| 11 | Full keyboard grid (roving tabindex) | Infrastructure project |
| 12 | Grouped multi-row headers + sticky header + column filters | Known sticky-offset gap |
| 13 | `isGrouped` + virtualization | Unsupported combination |
| 14 | Variable row heights in virtualized table | Known math/limitation |
| 15 | RTL layout | Unverified — audit first |

---

## 3. Summary

| | Count |
| --- | --- |
| Shipped use cases (do not modify) | 56 |
| Original Tier A (docs-only) | 5 — **done** |
| Tier B (sign-off required) | 10 |
| Klear360-only Example/API stories not yet in Compass | See §1 parity note |
