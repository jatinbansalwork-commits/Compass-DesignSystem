# Port all `Table` use cases from Klear360 to Compass

Goal: Compass `Table` Storybook should cover every use case Klear360 documents (**83**
sidebar entries: **41 Examples** + **42 API**). Discover what Compass already has, add
only gaps, do not duplicate or rename existing Compass stories.

**Source of truth (Klear360):**  
`/Users/jatinbansal/code/Klear360/.claude/worktrees/dev-environment-setup-e3f0fb/packages/klear360/src/components/Table/docs/`

**Target (Compass):**  
`packages/compass/src/components/Table/docs/` and `packages/compass/src/components/Table/docs/APIStories/`

**Related:** `Table-missing-use-cases-prompt.md` (original five Tier A items — **done** in Compass).

Both codebases use **`@table-library/react-table-library`** for the web `Table` implementation.

---

## 0. Cursor prompt — paste into Compass work

````
Port Klear360's 83 Table use cases into Compass Table Storybook. Read
`packages/compass/_decisions/Table-port-all-use-cases-to-Compass.md` in full (§1–§3 source
list, §5 gap mapping).

STEP 1 — Confirm §5 gap mapping is still accurate (search `src/components/Table/docs/`).
Report any changes, then wait for my go-ahead.

STEP 2 — After I confirm:
1. Category **(b)** — add stories only; no `Table` source changes.
2. Category **(c)** — propose Compass-native props/API first; wait for approval before
   component code. Do not copy Klear360 prop names blindly if Compass already has an equivalent.

Ground rules:
- Do not rename or rewrite existing Compass stories (category **(a)**).
- Match Compass story naming (`TableXExample.stories.tsx`, `Components/Table/Examples/...`).
- §4 intentionally excluded features — do not add without explicit ask.
- Compass-only stories (persisted sort, footer totals, etc.) stay; they are additive.

Deliverables after Step 2: list of new files, category (c) API changes (if any), and count
toward 83/83 coverage.
````

---

## 1. `Examples` — Klear360 use cases (41)

| # | Use case | What it demonstrates |
| - | --- | --- |
| 1 | Table | Minimal/default table setup |
| 2 | NarrowActionColumn | Narrow per-row action icons |
| 3 | ActionColumnWithMultipleIcons | Multiple action icons per row |
| 4 | AvatarLogoAndFlagCells | Avatars, logos, flags in cells |
| 5 | UnconstrainedImageBug | Regression: unconstrained image cells |
| 6 | TableDrivenByColumnsConfig | Columns from config array (`columns` prop) |
| 7 | CompactDensityMultilineGap | Compact density + multiline spacing |
| 8 | CompactDensityMultilineRecipe | Recipe: compact + multiline |
| 9 | CompactDensityBadgeSizeMismatch | Regression: badge size in compact rows |
| 10 | CompactDensityBadgeSizeRecipe | Recipe: badge size in compact rows |
| 11 | NoDataAtAll | Empty state — no data |
| 12 | NoResultsAfterFiltering | Empty state — filters, zero rows |
| 13 | BasicTable | General basic usage |
| 14 | TableWithCustomCellComponents | Custom components in cells |
| 15 | SortableTable | Column sorting |
| 16 | TableWithStickyHeaderAndFooter | Sticky header + footer |
| 17 | TableWithStickyFirstColumn | Leading sticky column |
| 18 | SingleSelectableTable | Single-row selection |
| 19 | MultiSelectableTableWithToolbar | Multi-select + toolbar |
| 20 | MultiSelectableWithZebraStripes | Multi-select + striped rows |
| 21 | TableWithDisabledRows | Disabled rows |
| 22 | TableWithBackgroundColor | Custom background colors |
| 23 | TableWithIsLoading | Loading skeleton |
| 24 | TableWithIsRefreshing | Refresh overlay |
| 25 | TableWithEditableCells | Inline editable cells |
| 26 | FullFeaturedTable | Many features combined |
| 27 | MixedFilterRow | Header filter row, mixed input types |
| 28 | StickyHeaderWithFrozenColumns | Sticky header + frozen columns + filters |
| 29 | LinkableCells | Link-style cells |
| 30 | MasterShowcase | Broad capability showcase |
| 31 | TableWithClientSidePagination | Client pagination |
| 32 | TableWithServerSidePagination | Server pagination |
| 33 | SelectionAcrossPages | Selection persists across pages |
| 34 | MultiColumnSort | Multi-column sort (shift-click) |
| 35 | Presort | Initial sort on mount (`initialSort`) |
| 36 | StickyColumns | Multi leading sticky columns |
| 37 | TrailingStickyColumns | Trailing sticky columns |
| 38 | TitleDescriptionTruncated | Title + description, truncated |
| 39 | TitleDescriptionWrapped | Title + description, wrapped |
| 40 | WideDataset | Many columns, explicit widths |
| 41 | WithoutExplicitWidths | Wide dataset, auto column widths |

---

## 2. `API` — Klear360 reference stories (42)

| # | Use case | What it demonstrates |
| - | --- | --- |
| 42 | Table (API) | `Table` props |
| 43 | TableBodyStory | `TableBody` |
| 44 | TableCellStory | `TableCell` |
| 45 | TableCheckboxDisplay | Checkbox display modes |
| 46 | TableEditableCellStory | `TableEditableCell` |
| 47 | TableFigmaExample | Figma-aligned example |
| 48 | TableFiltering | Column filtering |
| 49 | TableFilteringWithDropdown | Dropdown column filter |
| 50 | TableFilteringWithMultiselect | Multiselect column filter |
| 51 | TableFooterStory | `TableFooter` |
| 52 | TableFooterCellStory | `TableFooterCell` |
| 53 | TableFooterRowStory | `TableFooterRow` |
| 54 | BasicGrouping | Grouped expand/collapse |
| 55 | TableGroupingWithSelection | Grouping + selection |
| 56 | TableGroupingWithDisabledRows | Grouping + disabled rows |
| 57 | TableGroupingWithControlledExpansion | Controlled `expandedRowIds` |
| 58 | TableHeaderStory | `TableHeader` |
| 59 | TableHeaderCellStory | `TableHeaderCell` |
| 60 | TableHeaderRowStory | `TableHeaderRow` |
| 61 | TableHoverActions | Row hover actions |
| 62 | TableNesting | Nested rows |
| 63 | TableNestingWithSorting | Nesting + sort |
| 64 | TablePaginationStory | `TablePagination` |
| 65 | TableRowStory | `TableRow` |
| 66 | RowSpan | Row span |
| 67 | ColumnSpan | Column span |
| 68 | HeaderSpan | Header span |
| 69 | FooterSpan | Footer span |
| 70 | ColumnRowSpan | Row + column span |
| 71 | ColumnSpanWithSelection | Column span + selection |
| 72 | ColumnSpanWithStickyFirstColumn | Column span + sticky first column |
| 73 | RowSpanWithStickyFirstColumn | Row span + sticky first column |
| 74 | RowColumnSpanWithStickyFirstColumn | Row/column span + sticky first column |
| 75 | GroupedHeaders | Multi-row column header groups |
| 76 | TableStripedSelection | Striped + selection |
| 77 | TableStripedSelectionNoToolbarNoPagination | Striped + selection, minimal chrome |
| 78 | TableStripedHoverNoSelection | Striped + hover, no selection |
| 79 | TableToolbarStory | `TableToolbar` |
| 80 | TableToolbarActionsStory | `TableToolbarActions` |
| 81 | TableToolbarSearchStory | Toolbar global search |
| 82 | VirtualizedTable | Virtualized rows |
| 83 | CombinedFeatures (Virtualized) | Virtualized + sticky + filter + pagination |

---

## 3. Deliberately NOT in Klear360 — do not add to Compass without asking

- Column reordering, column resizing, column visibility toggle
- Full editable **rows** (cell editing only)
- `Table` on React Native (use `List`)

Also limited/unresolved in Klear360 (flag only; do not “fix” silently during port): roving
tabindex grid keyboard; grouped headers + sticky header + filters sticky bug; `isGrouped` +
virtualization; variable virtualized row heights; RTL unaudited.

---

## 4. Summary (Klear360 catalog)

| | Count |
| --- | --- |
| Examples | 41 |
| API | 42 |
| **Total catalog** | **83** |

---

## 5. STEP 1 — Compass gap mapping (2026-10-28)

**Compass today:** **56** story exports (21 Examples + 35 API), plus **5** Compass-only
Examples not in Klear360’s 83: `PersistedSortRoundTrip`, `StickyFilterAndPagination`,
`ThreeLevelShipmentHierarchy`, `ColumnAggregateFooter`, `KeyboardWalkthrough`.

**Legend:** **(a)** already in Compass · **(b)** capability exists, story missing · **(c)** feature/prop missing in Compass `Table` (port code + story)

### Examples (#1–41)

| # | Klear360 use case | Cat | Compass location / notes |
| - | --- | --- | --- |
| 1 | Table | a | `BasicTable.stories.tsx` → `Table`; also `TableExamples` → `BasicTable` |
| 2 | NarrowActionColumn | b | Pattern via `TableRow` + `IconButton` (see hover actions); dedicated story missing |
| 3 | ActionColumnWithMultipleIcons | b | Same |
| 4 | AvatarLogoAndFlagCells | b | Uses `Avatar`/images — no dedicated story |
| 5 | UnconstrainedImageBug | b | Regression story missing |
| 6 | TableDrivenByColumnsConfig | c | Klear360 `columns` prop + `TableColumnConfig` **not on Compass `TableProps`** |
| 7–10 | Compact density suite | b | `rowDensity="compact"` exists; four stories missing |
| 11 | NoDataAtAll | b | Empty `data.nodes`; story missing |
| 12 | NoResultsAfterFiltering | c/b | Needs filter API or app-level filter demo |
| 13 | BasicTable | a | `TableExamples.stories.tsx` → `BasicTable` |
| 14 | TableWithCustomCellComponents | a | `TableExamples` → `TableWithCustomCellComponents` |
| 15 | SortableTable | a | `TableExamples` → `SortableTable` |
| 16 | TableWithStickyHeaderAndFooter | a | `TableExamples` → `TableWithStickyHeaderAndFooter` |
| 17 | TableWithStickyFirstColumn | a | `TableExamples` → `TableWithStickyFirstColumn` |
| 18 | SingleSelectableTable | a | `TableExamples` → `SingleSelectableTable` |
| 19 | MultiSelectableTableWithToolbar | a | `TableExamples` → `MultiSelectableTableWithToolbar` |
| 20 | MultiSelectableWithZebraStripes | a | `TableExamples` → `MultiSelectableWithZebraStripes` |
| 21 | TableWithDisabledRows | a | `TableExamples` → `TableWithDisabledRows` |
| 22 | TableWithBackgroundColor | a | `TableExamples` → `TableWithBackgroundColor` |
| 23 | TableWithIsLoading | a | `TableExamples` → `TableWithIsLoading` |
| 24 | TableWithIsRefreshing | a | `TableExamples` → `TableWithIsRefreshing` |
| 25 | TableWithEditableCells | a | `TableExamples` → `TableWithEditableCells` |
| 26 | FullFeaturedTable | b/c | Showcase story missing; may need Klear360 filter/sticky props |
| 27 | MixedFilterRow | c | **`filterFunctions` / `filterConfig` not on Compass `TableProps`** |
| 28 | StickyHeaderWithFrozenColumns | c | Needs **`stickyColumnCount`** + filter row (Klear360) |
| 29 | LinkableCells | b | `Link` in cells — story missing |
| 30 | MasterShowcase | b/c | Story missing; depends on filter/sticky APIs |
| 31 | TableWithClientSidePagination | a | `TablePaginationExamples` → `TableWithClientSidePagination` |
| 32 | TableWithServerSidePagination | a | `TablePaginationExamples` → `TableWithServerSidePagination` |
| 33 | SelectionAcrossPages | b | Selection + pagination exist; dedicated story missing |
| 34 | MultiColumnSort | c | Klear360 multi-sort / shift-click **not in Compass types** |
| 35 | Presort | c | **`initialSort` not on Compass `TableProps`** |
| 36 | StickyColumns | c | **`stickyColumnCount` / `stickyColumnWidths` not in Compass** |
| 37 | TrailingStickyColumns | c | **`trailingStickyColumnCount` not in Compass** |
| 38 | TitleDescriptionTruncated | b | Typography pattern — story missing |
| 39 | TitleDescriptionWrapped | b | Story missing |
| 40 | WideDataset | b | `gridTemplateColumns` + wide layout — story missing |
| 41 | WithoutExplicitWidths | b | Story missing |

### API (#42–83)

| # | Klear360 use case | Cat | Compass location / notes |
| - | --- | --- | --- |
| 42 | Table (API) | a | `APIStories/TableAPI.stories.tsx` → `Table` |
| 43 | TableBodyStory | a | `TableBodyAPI.stories.tsx` |
| 44 | TableCellStory | a | `TableCellAPI.stories.tsx` |
| 45 | TableCheckboxDisplay | a | `TableCheckboxDisplayAPI.stories.tsx` |
| 46 | TableEditableCellStory | a | `TableEditableCellAPI.stories.tsx` |
| 47 | TableFigmaExample | a | `TableFigmaExample.stories.tsx` |
| 48 | TableFiltering | c | No **`filterFunctions`** on Compass |
| 49 | TableFilteringWithDropdown | c | No **`filterConfig` dropdown** |
| 50 | TableFilteringWithMultiselect | c | No **`filterConfig` multiselect** |
| 51–53 | Footer API trio | a | `TableFooter*API.stories.tsx` |
| 54–56 | Grouping (3) | a | `TableGrouping.stories.tsx` |
| 57 | TableGroupingWithControlledExpansion | c | **`expandedRowIds` / controlled tree** not exposed like Klear360 |
| 58–60 | Header API trio | a | `TableHeader*API.stories.tsx` |
| 61 | TableHoverActions | a | `TableHoverActions.stories.tsx` |
| 62–63 | Nesting (2) | a | `TableNesting.stories.tsx` |
| 64 | TablePaginationStory | a | `TablePaginationAPI.stories.tsx` |
| 65 | TableRowStory | a | `TableRowAPI.stories.tsx` |
| 66–74 | Spanning (9) | a | `TableSpanning.stories.tsx` (same export names) |
| 75 | GroupedHeaders | b/c | Multi-row header **pattern** possible in JSX; Klear360 dedicated story missing in Compass |
| 76–78 | Striped (3) | a | `TableStripedRows.stories.tsx` |
| 79–80 | Toolbar API (2) | a | `TableToolbar*API.stories.tsx` |
| 81 | TableToolbarSearchStory | c | **`TableToolbarSearch` component** — verify export in Compass; story missing |
| 82 | VirtualizedTable | a | `VirtualizedTableAPI.stories.tsx` |
| 83 | CombinedFeatures (Virtualized) | c | **`VirtualizedTableCombinedFeaturesAPI`** missing; may need filter + multi-sticky props |

### Roll-up

| Category | Examples (#1–41) | API (#42–83) | Total |
| --- | ---: | ---: | ---: |
| **(a)** Already in Compass | 18 | 28 | **46** |
| **(b)** Story only | 14 | 1 | **15** |
| **(c)** Needs Compass `Table` work first | 9 | 7 | **16** |
| **Klear360 catalog** | 41 | 42 | **83** |

*(46 + 15 + 16 = 77; remaining **6** Klear360 entries overlap Compass-only coverage or dual mapping — e.g. #1 vs #13 both map to basic table; adjust during Step 2 to avoid double-counting toward 83.)*

### Recommended Step 2 order

1. **Quick wins (b):** empty states, linkable cells, wide dataset, action columns, compact density recipes, `SelectionAcrossPages`, `GroupedHeaders` story, toolbar search story (if component exists).
2. **API parity (c):** port **`filterFunctions` / `filterConfig` / column filter row** from Klear360 (largest unlock for #27–28, #48–50, #83).
3. **Sticky parity (c):** `stickyColumnCount`, `stickyColumnWidths`, `trailingStickyColumnCount`.
4. **Sort parity (c):** `initialSort`, multi-column `sortFunctions` / shift-click behavior.
5. **Columns config (c):** `columns` + `TableColumnConfig` alternative to JSX children.
6. **Grouping (c):** controlled expansion API aligned with Klear360.

**Do not start Step 2 until product confirms priority** (full 83 vs filter/sticky subset first).

---

## 6. Compass-only stories (keep)

| Story | File |
| --- | --- |
| PersistedSortRoundTrip | `TablePersistedSortExample.stories.tsx` |
| StickyFilterAndPagination | `TableCombinedStickyPaginationFilterExample.stories.tsx` |
| ThreeLevelShipmentHierarchy | `TableDeepNestedGroupingExample.stories.tsx` |
| ColumnAggregateFooter | `TableFooterTotalsExample.stories.tsx` |
| KeyboardWalkthrough | `TableKeyboardNavigationExample.stories.tsx` |
