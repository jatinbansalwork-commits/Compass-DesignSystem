# Table Storybook — controls, actions, accessibility, interactions

Canonical definitions live in [`tableStorybookMeta.ts`](./tableStorybookMeta.ts). Every new Table story must pick **one mode** below.

## Story modes

| Mode | Helper | Controls | Actions | a11y addon | `.play` |
| ----- | ------ | -------- | ------- | ---------- | ------- |
| **Playground** | `applyTableStoryMeta` / `withTableStoryMeta` | Expanded | `fn()` callbacks → Actions panel | Default rules | Optional (Basic Table) |
| **Recipe** | `applyTableRecipeMeta` / `withTableRecipeMeta` | Off | Off | Default rules | Rare |
| **Flagship recipe** | `applyTableFlagshipRecipeMeta` | On (`tableDefaultStoryArgs`) | Off | Default + manual review | Required smoke test |
| **Interaction suite** | `tableInteractionTestParameters` on meta | Off | Off | Off (test-runner) | Required |

### When to use which

- **Playground** — `Components/Table`, Parts, Features API stories: one prop or behavior at a time; wire `{...args}` into `Table`.
- **Recipe** — fixed demos (Guide, Examples bundle, Experience phases, sticky/pagination examples).
- **Flagship recipe** — product reference stories with `.play`: **All use cases**, **Design stress test**, **Invoice line items**, **Keyboard walkthrough**.
- **Interaction suite** — `Components/Interaction Tests/Table` only (`Table.test.stories.tsx`).

## Controls (playground)

Merged via `tableBehaviorArgTypes`, `tableLayoutArgTypes`, `tableFilteringArgTypes`, and `tableComposableArgTypes` (non-tunable props hidden).

Playground stories also inherit **`tableDefaultStoryArgs`** (same defaults as `Table.web.tsx`) so booleans/numbers show real control values instead of “Set boolean”. Docs table **Default** column comes from `argTypes.*.table.defaultValue`.

| Category | Props | Control |
| -------- | ----- | ------- |
| **Behavior** | `selectionType`, `multiSelectTrigger`, `checkboxDisplay`, `isGrouped` | select / boolean |
| **Layout** | `rowDensity`, `height`, `showBorderedCells`, `showStripedRows`, `isHeaderSticky`, `isFooterSticky`, `isFirstColumnSticky`, `stickyColumnCount`, `trailingStickyColumnCount`, `isLastColumnSticky` | select / boolean / number |
| **Filtering** | `showHeaderFilterRow`, `globalFilterValue` | boolean / text |
| **State** | `isLoading`, `isRefreshing` | boolean |
| **Data / composition** | `data`, `children`, `toolbar`, `pagination`, `sortFunctions`, `filterFunctions`, `filterConfig`, `columnFilterValues`, `columns`, `experienceApi`, `gridTemplateColumns`, `stickyColumnWidths`, `trailingStickyColumnWidths` | disabled (set in story) |

Styled props from `getStyledPropsArgTypes()` are available on playgrounds that spread `Table` root props.

## Actions (playground)

Default args (`tableCallbackStoryArgs`):

- `onSelectionChange` → `fn()`
- `onSortChange` → `fn()`
- `onGlobalFilterValueChange` → `fn()`
- `onColumnFilterValuesChange` → `fn()`
- `onExpandedRowIdsChange` → `fn()`

Captured by regex `TABLE_STORY_ACTIONS_ARG_TYPES_REGEX` (see meta file). Pagination stories should also spread `tablePaginationCallbackArgs` (`onPageChange`, `onPageSizeChange`).

Wire handlers in the story: `onSortChange={args.onSortChange}` or `{...args}` on `Table`.

## Accessibility (addon)

Default `tableA11yParameters` (all modes except interaction suite):

| Rule ID | Purpose |
| ------- | ------- |
| `color-contrast` | Text vs header/body/cell backgrounds |
| `label` | Form controls (filters, search, pagination) |
| `button-name` | Icon-only toolbar / sort / hover actions |
| `aria-required-attr` | Roles (`table`, `columnheader`, `row`, selection) |
| `aria-allowed-attr` | Supported ARIA attributes per role (footer uses `row`/`cell`, filter spacers strip grid ARIA on `presentation`) |
| `aria-valid-attr-value` | Sort buttons, expand/collapse |
| `nested-interactive` | Sort control inside `columnheader` (known pattern; fix in component if flagged) |

Override per story only with justification in a code comment.

**Manual checks (flagship recipes):** keyboard focus order in toolbar → header filters → body; sticky lanes don’t hide focus rings; selection announced (checkbox `VisuallyHidden` labels).

## Interactions (`.play`)

Use `@storybook/test`: `within`, `userEvent`, `expect`.

| Story | File | Minimum assertions |
| ----- | ---- | ------------------- |
| Basic Table | `BasicTable.stories.tsx` | Sort / selection smoke |
| All use cases | `TableAllUseCases.stories.tsx` | Heading, toolbar, row select → Export label |
| Design stress test | `TableDesignStress.stories.tsx` | Table visible, filter/search control present |
| Invoice line items | `TableLineItemsExample.stories.tsx` | Table + jump/search behavior |
| Keyboard walkthrough | `TableKeyboardNavigationExample.stories.tsx` | Focus table, arrow key row move |
| Interaction Tests | `Table.test.stories.tsx` | Sort, toolbar search, selection, wide grid |

Run automated suite:

```bash
yarn react:storybook   # port 9011
yarn test:react:interaction
```

## Checklist for new stories

1. Choose mode → call the matching `applyTable*Meta` before `export default`.
2. Playground: pass callback args into `Table`; don’t redefine composable argTypes.
3. Recipe: disable controls; keep a11y on unless interaction-only file.
4. Flagship: add `.play` with at least one user-visible assertion.
5. Document intent in `parameters.docs.description.story` (one short paragraph).
