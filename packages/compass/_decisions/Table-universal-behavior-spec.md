# `Table` — Universal Behavior Specification & Cursor Prompt

This is the exhaustive behavioral spec for Klear360's `Table` — every action, every piece of
state, exact defaults, exact interaction rules, and every documented edge case/limitation —
written to be pasted into Cursor as a single source of truth for building (or auditing) a
**universal table** component elsewhere: one table primitive that correctly handles any
realistic number of rows/columns and any combination of the features below.

**Source:** `packages/klear360/src/components/Table/` (`types.ts`, `_decisions/decisions.md`)

---

## 0. Cursor prompt — paste this as-is

````
This is an audit task, not a build task — do not write or change any component code yet.
I want to understand Compass's `Table` as it exists today, and compare it against
Klear360's `Table` (the full behavioral spec is in §1–§11 of this file,
`Table-universal-behavior-spec.md`, attached alongside this message), to find concrete
improvement opportunities for Compass. Two tasks, in order. Do not skip ahead to Task 2
before finishing and reporting Task 1.

---

TASK 1 — Inventory Compass's own `Table` use cases and document how each one actually
behaves.

- Find every existing use case/example for Compass's `Table` (Storybook stories, a demo
  page, test fixtures used as de facto examples — whatever this codebase uses to showcase
  component usage). List every one you find, by file and name.
- For EACH use case, don't just name it — describe its actual behavior as implemented:
  what props/state it exercises, what happens on each user interaction it supports (click,
  hover, keyboard, resize, etc.), what the default/initial state looks like, and any
  edge case that use case specifically demonstrates (empty data, long content, error
  state, etc.). Read the actual component source behind each use case, not just the
  story's JSX — I want real behavior, not an assumption from the example's name.
- Organize the output as one table/list per use case: Use case name → file → behavior
  description (a few sentences, specific enough that someone who can't run Storybook would
  still know what it does).

Deliverable for Task 1: the full use-case inventory with behavior descriptions, nothing
else. Stop here and wait for me before Task 2.

---

TASK 2 — Compare Klear360's `Table` behavior rules (§1–§11 below) against what you found in
Task 1, and identify where Compass can improve by adopting Klear360's rules.

- Go section by section through §1 (data model) → §10 (states & chrome) of this file. For
  each behavior rule Klear360 defines, check whether Compass's `Table` has an equivalent,
  and if so, whether it follows the same rule or a different one. Call out every difference
  you find, not just the ones that look like bugs — a deliberately different Compass
  convention is still worth noting, even if it's not wrong.
- Specifically look for: missing default values (does Compass default something
  differently than Klear360's documented default, with no stated reason?), missing
  controlled/uncontrolled prop pairs (e.g. Klear360 always ships
  `value`/`defaultValue`/`onChange`-shaped triples — does Compass have gaps here?),
  missing combination rules (e.g. Klear360's exact AND/OR filter-combination rule in §4,
  or the cumulative sticky-column-width math in §6) that Compass either doesn't implement
  or implements inconsistently, and missing mobile/responsive fallbacks (e.g. §6's
  "sticky columns disabled below the `s` breakpoint" rule).
- For each gap you find, propose the specific Klear360 rule Compass should adopt, and rate
  it: quick win (prop/behavior tweak, no API break) vs. needs a breaking change vs. needs
  new capability entirely. Do NOT implement any of these yet — this is still a reporting
  task.
- §11 lists things Klear360 deliberately does NOT do (column reorder/resize, full row
  editing, RTL unaudited, etc.) — if Compass already does one of these, don't treat it as
  "Compass is ahead," just note it as a genuine difference in scope between the two systems.

Deliverable for Task 2: a gap/improvement table (Klear360 rule → Compass's current
behavior → proposed change → quick-win/breaking/new-capability rating), plus a short
prioritized list of which 3–5 improvements you'd tackle first and why. Still no code
changes — wait for my go-ahead before implementing anything from this list.
````

---

## 1. Data model & column definition

- **Row identity:** every row (`TableNode<Item>`) is the consumer's item type plus a required
  `id: string | number`. Data is passed as `{ nodes: TableNode<Item>[] }`, never a bare array.
- **Two mutually exclusive ways to define columns** — a component must support exactly one
  per table instance, never mixed:
  - **Hand-written JSX** via `children: (tableData) => <TableHeader>...<TableBody>...</TableBody></TableHeader>` — full control, used when cells need custom composition.
  - **Declarative `columns` config array** — each entry has `key`, `header`, `render(item, index)`, optional `width` (a `grid-template-columns` track, defaults to `minmax(100px, 1fr)`), `isSortable`, `textAlign`. Table builds the header row and body cells for you. An explicit table-level `gridTemplateColumns` always overrides a column's own `width`.
- **No column reordering, resizing, or hiding** — confirmed, deliberate exclusion (see §11).
- **Column count scaling:** the table must remain usable from 1 column to "wide dataset" (dozens of columns, horizontal scroll) — see `WideDataset`/`WithoutExplicitWidths` behavior: without explicit widths, columns fall back to equal-ish `minmax(100px, 1fr)` tracks and the table scrolls horizontally rather than compressing illegibly.
- **Row count scaling:** must remain usable from 0 rows (empty state, §10) up to tens of thousands (virtualization, §9). There is no hard cap enforced by the component itself — performance degrades gracefully only once virtualization or pagination is used; an un-virtualized, un-paginated table with very large row counts is the consumer's own risk.

## 2. Selection

- **`selectionType`:** `'none'` (default) | `'single'` | `'multiple'`.
- **`multiSelectTrigger`:** `'row'` (default — clicking anywhere on the row toggles selection) | `'checkbox'` (only the checkbox itself toggles selection; clicking elsewhere on the row does nothing).
- **`checkboxDisplay`:** `'always'` (default, fully backward compatible) | `'on-hover'` — row checkbox only renders on hover, but **stays visible once a row is selected** so it can be deselected. The header "select-all" checkbox is unaffected by this — always visible. Only relevant when `selectionType="multiple"`.
- **Controlled/uncontrolled:** `defaultSelectedIds` seeds uncontrolled state; `onSelectionChange({ values, selectedIds })` fires on every change — `values` is deprecated (only contains the current page's selected rows under server pagination), `selectedIds` is the recommended source of truth across client/server pagination.
- **Tree-aware selection:** when `isGrouped` is true, selecting a parent row automatically selects all its children.
- **Known re-render characteristic (not a bug, documented):** a row-selection click re-renders every currently-*mounted* row (bounded by virtualization's visible-rows cap when virtualization is on), not every row in the full dataset — true single-row isolation would need an external `useSyncExternalStore` subscription, which is explicitly out of scope.

## 3. Sorting

- **Enablement:** a column is sortable purely by having its key present in `sortFunctions` (a map of `sortKey -> (rows) => sortedRows`). No separate boolean prop toggles it on `TableHeaderCell`; `columns`-config columns use `isSortable`/`headerKey` to opt in to the same mechanism.
- **Click behavior:** clicking a sortable header cycles **ascending → descending → unsorted**.
- **Multi-column sort:** shift-click adds/toggles a column as an *additional* sort key without disturbing the current sort of other columns. `TableSortOrderEntry[]` order matters — index 0 is primary, index 1 secondary, etc.
- **Initial sort:** `initialSort: { sortKey, direction }` renders the table already sorted on mount, no click required; `sortKey` must exist in `sortFunctions`.
- **Callback:** `onSortChange({ sortKey, isSortReversed })` fires on every sort-state change.

## 4. Filtering

- **Enablement:** a column becomes filterable purely by having its `headerKey` present in `filterFunctions` (same "presence enables it" convention as sorting). A compact search input auto-renders in that column's header below the sort row — **no extra JSX needed**.
- **Picker type override:** `filterConfig[headerKey] = { type: 'dropdown' | 'multiselect', options }` swaps the default text input for a single-select dropdown or multiselect picker in that column's header. The column still needs a matching `filterFunctions` entry to actually filter.
- **Filter value shape:** `string` for a text column or a `dropdown` column; `string[]` for a `multiselect` column. A predicate used by a possibly-multiselect column should check `Array.isArray(filterValue)`, since the *same* predicate is reused for `globalFilterValue`, which is always plain text regardless of the column's own filter type.
- **Combination rule (exact):** column filters combine with **AND** (a row must satisfy every active column filter); the global filter then narrows further with **OR** across all filterable columns' predicates.
- **Controlled/uncontrolled:** `columnFilterValues`/`defaultColumnFilterValues`/`onColumnFilterValuesChange` for per-column filters; `globalFilterValue`/`defaultGlobalFilterValue`/`onGlobalFilterValueChange` for the global search, which lives in `TableToolbarSearch`.
- **Known, accepted gap:** full keyboard grid navigation (roving tabindex, arrow-key cell movement) is NOT implemented. Filter/search inputs are plain native `<input>`s reachable via standard Tab order only — this is tracked as a separate, larger infra piece, not part of filtering itself.

## 5. Pagination

- **Two mutually exclusive modes via `paginationType`:**
  - **`'client'` (default):** Table itself slices `data` into pages by `defaultPageSize`/page size picker selection. No extra props required.
  - **`'server'`:** Table does NOT slice data — it renders whatever's passed as-is. **Required** in this mode: `totalItemCount` (drives total page count) and `onPageChange({ page })` (consumer must fetch and re-pass data for the new page).
- **Shared controls (`TablePaginationCommonProps`):** `defaultPageSize` (default `10`), `currentPage` (passing it makes the page controlled), `pageSizeOptions` (default `[10, 25, 50]`), `showPageSizePicker` (default `true`, always hidden on mobile), `showPageNumberSelector` (default `false`, always hidden on mobile), `label` (default `Showing 1 to ${totalItems} Items`), `showLabel` (default `false`, always hidden on mobile).
- **Selection-across-pages:** selection state (via `selectedIds`, not the deprecated `values`) must survive a page change — this is a dedicated, tested use case (`SelectionAcrossPages`), not incidental.
- **Large page sizes:** the pagination prop's own doc comment explicitly recommends virtualization instead of a very large `defaultPageSize`/page-size option.

## 6. Sticky header, footer, and columns

- **`isHeaderSticky`** / **`isFooterSticky`:** both default `false`.
- **Leading sticky columns:** `isFirstColumnSticky` (shorthand for `stickyColumnCount={1}`, no extra width prop needed) or `stickyColumnCount` (N columns, requires `stickyColumnWidths: string[]` — one explicit pixel width per frozen column, in order, because sticky `left` offsets are computed as the **cumulative sum of widths of the columns before it**, never measured at render time).
- **Trailing sticky columns:** mirrors leading exactly — `isLastColumnSticky` / `trailingStickyColumnCount` + `trailingStickyColumnWidths`, anchored to `right` instead of `left`. Leading and trailing sticky are independent and composable (a table can freeze both sides at once).
- **Hover-actions interaction:** when a row's `hoverActions` is also present, trailing sticky columns compute their position to sit just to its left, not competing for the same `right: 0` slot.
- **Mobile fallback:** sticky columns (leading or trailing, any count) are **automatically disabled below the `s` breakpoint**, regardless of prop values — a frozen column that's reasonable on desktop can exceed an entire phone viewport once multiple columns are frozen, making the table unusable rather than merely cramped. Falls back to a plain horizontally-scrollable table, matching how other mobile degradations in this table already work.
- **Grouped multi-row headers + sticky:** each header row's cells get a stacked sticky `top` offset (36px per row, matching the fixed compact header row height) so a multi-row header's rows stick below each other, not overlapping at `top: 0`. Known narrow gap: the auto-injected filter row's own sticky offset is NOT adjusted for a preceding group-header row — don't combine grouped headers + `isHeaderSticky` + column filtering all three at once without flagging it.

## 7. Row density, spanning, and column headers

- **`rowDensity`:** `'compact' | 'normal' | 'comfortable'`, default `'normal'`. The header row itself is **always** a fixed compact height (36px) regardless of `rowDensity` — the per-row `rowDensity` prop on `TableHeaderRow` is deprecated and has no visual effect anymore.
- **Cell spanning:** any cell (header, body, or footer) can span rows/columns via `gridColumnStart`/`gridColumnEnd`/`gridRowStart`/`gridRowEnd` (1-based, CSS Grid semantics) — because the entire table (header, body, footer) shares **one continuous CSS grid** across all rows, not per-section grids.
- **Grouped multi-row column headers:** `TableHeader` accepts more than one `TableHeaderRow` child. By convention, **the last `TableHeaderRow` is always the leaf/column row** (the one that lines up 1:1 with body columns and `sortFunctions`/`filterFunctions` keys) — any row(s) before it are group-label rows using column spanning to group leaf columns under a shared label. No `gridRowStart`/`gridRowEnd` needed on either row type; a second header row auto-places into the next grid row exactly like a second body row would.
- **Bordered cells:** `showBorderedCells`, default `true`.
- **Background color:** per-table `backgroundColor` and per-cell `backgroundColor`, constrained to the `surface.background.gray.*` token family or `'transparent'`.

## 8. Grouping & row expansion

- **`isGrouped`:** default `false`. Enables parent/child row relationships AND tree-aware selection (§2).
- **Expansion state:** `expandedRowIds` (controlled) / `defaultExpandedRowIds` (uncontrolled, **defaults to every group-header row id** — i.e. all groups start expanded, matching the pre-expansion-feature "always fully expanded" look, so existing `isGrouped` tables with neither prop see no behavior change) / `onExpandedRowIdsChange(ids)`.
- **Disclosure control:** a chevron renders automatically inside a group-header row's first cell (no extra JSX) — rotates 90° when expanded (not a swapped icon), same rotate+transition convention used elsewhere in the design system (`TreeViewChevron`, `CollapsibleChevronIcon`). Clicking it stops propagation so it never also triggers row selection/row-click.
- **Indentation:** flat — nested levels are NOT visually indented in the shipped version; that's a deliberate, separate, not-yet-made visual decision.
- **Hard incompatibility:** `isGrouped` + virtualization (§9) together is an **unsupported combination** — a collapsed group's children still render in a virtualized list, because the virtualized row list is built from `tableData` directly, not the tree-aware/collapse-state-consulting output. Don't silently combine these; flag it.

## 9. Virtualization

- **Mechanism:** `TableVirtualizedWrapper` wraps the underlying table library's own windowing (built on `react-window`'s `VariableSizeList` + `react-virtualized-auto-sizer`) — renders only visible rows so performance stays flat into the thousands of rows.
- **Forced side effects:** enabling virtualization **forces header-sticky behavior on** regardless of `isHeaderSticky`'s own value, since the header always renders as a sticky overlay inside the virtualized scroll container, never as a normal scrollable row.
- **Required consumer setup:** the surrounding `Table` must have an explicit CSS `height` (e.g. `"500px"`) for the auto-sizer to have a viewport to measure against.
- **`rowHeight`:** fixed-height-only in practice — a genuinely variable `(item, index) => number` function hits a confirmed off-by-one in the underlying library's row-position math (every row's index gets shifted by one to make room for the header slot). Treat `rowHeight` as fixed-height-only until this is fixed upstream; don't silently "support" variable heights.
- **Not configurable:** overscan count — no prop forwards this to the underlying windowing library.
- **Known cosmetic issue:** a console DOM-nesting warning (`<div> cannot appear as a child of <table>`) from the auto-sizer library's own internals when used inside a real `<table>` element — pre-existing, doesn't break rendering, not introduced by this table's own code.
- **Re-render architecture (if replicating at this level of rigor):** split context into a row/appearance slice (selection, density, striping, expansion — read by every row/cell instance) and a data slice (sort/filter/pagination/tableData — read only by single-instance components like the header/toolbar/pagination). This bounds a sort/filter/page-change's React cost to the mounted row count, not the full dataset, when combined with virtualization capping mounted rows to the viewport. This does **not** achieve true single-row selection isolation (see §2) — don't claim it does.

## 10. States & chrome

- **Loading:** `isLoading`, default `false`.
- **Refreshing:** `isRefreshing`, default `false` — distinct from `isLoading` (data reload while the table stays visible/interactive, vs. an initial/blocking load).
- **Empty states:** two distinct cases — no data at all, vs. filters applied with zero matches. These read and look different (a true "no data" state shouldn't look like a defeated search).
- **Striped rows:** `showStripedRows`, default `false`. Composable with selection and hover.
- **Toolbar:** `toolbar` prop takes a `TableToolbar` element; `title`/`selectedTitle` default to `Showing 1 to ${totalItems} Items` / `${selectedRows.length} Items Selected`. `placement`: `'inline'` (default, part of normal layout above the header) or `'overlay'` (renders over the header instead). `TableToolbarActions` holds action buttons; `TableToolbarSearch` provides the global-search input wired to `globalFilterValue` (§4).
- **Hover actions:** a `hoverActions` element on `TableRow`, visible only on hover, rendered via its own separate `right: 0` sticky mechanism — coordinate with trailing sticky columns (§6) rather than competing with them.
- **Editable cells:** `TableEditableCell` (plain input), `TableEditableSearchCell` (adds a leading search icon + clear button, mirroring `SearchInput`), `TableEditableDropdownCell` (dropdown-backed). This is **cell-level** editing only — there is no full row-level edit mode (save/cancel per row); that's explicitly out of scope (§11).
- **Title/description cell:** `TableTitleDescriptionCell` — `title` (always visible) + optional `description`. `descriptionBehavior`: `'truncate'` (default, clamps to `descriptionLines` [default `2`], shows a tooltip with the full text on hover when actually cut off) or `'wrap'` (never clamps, row grows instead, no tooltip since nothing is hidden).

## 11. Deliberately out of scope / known limitations — do not build or "fix" without asking

These are confirmed product/design decisions or confirmed technical constraints, not
oversights. If your discovery or implementation work runs into one of these, report it and
wait rather than silently adding scope:

- Column reordering (drag-and-drop) — not enough use-cases identified
- Column resizing (drag to widen/narrow) — same
- Hiding/toggling column visibility — same
- Full row-level editable mode (vs. the supported cell-level editing, §10) — same
- `Table` on React Native — native apps use a `List` component instead, by design
- Full keyboard grid navigation (roving tabindex, arrow-key cell movement) — tracked as a real, separate future infra piece
- `isGrouped` + virtualization together — confirmed unsupported combination (§8)
- Variable (non-fixed) virtualized row heights — confirmed off-by-one bug, fixed-height-only for now (§9)
- Virtualization overscan tuning — not exposed, would require patching the underlying library
- Grouped multi-row headers + sticky header + column filtering, all three at once — known narrow sticky-offset gap (§6)
- RTL layout — never audited either way; don't assume support or non-support, verify first
- True single-row selection re-render isolation — would require replacing how rows read selection state entirely; explicitly deferred (§2, §9)
