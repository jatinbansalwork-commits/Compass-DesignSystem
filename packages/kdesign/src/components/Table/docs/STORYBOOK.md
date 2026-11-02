# Table — Storybook map

Open **Components → Table → Guide** in Storybook for the same overview in the UI.

| Section | Path | When to use |
| -------- | ----- | ------------ |
| **Guide** | `Components/Table/Guide` | Orientation — read this first |
| **Overview** | `Components/Table` | `Table` props playground (controls) |
| **Examples** | `Components/Table/Examples` | Common product recipes (sort, selection, sticky, loading, …) |
| **Examples/** *topic* | e.g. `…/Line Items`, `…/Pagination`, `…/Sticky Columns`, `…/Edge Cases`, `…/Design stress test` | Deep dives on one scenario |
| **Parts** | `Components/Table/Parts/*` | One story file per building block (Header, Row, Toolbar, …) |
| **Features** | `Components/Table/Features/*` | Cross-cutting behavior (filtering, grouping, virtualized, …) |
| **Experience** | `Components/Table/Experience/KdesignDataTable/*` | Optional Prime-style shell on top of the same filter/sort rules |

## Experience stories (order)

1. **01 Toolbar & Export** — global search, CSV export, empty states  
2. **02 Filters & Selection** — advanced filters, column toggle, multi-sort, modifier selection  
3. **03 Layout & Keyboard** — column reorder/resize, keyboard rows, no inline filter row with advanced filters  

## Layout, icons, spacing

See [`TABLE_LAYOUT.md`](./TABLE_LAYOUT.md) and `tokens.ts` (`tableIcons`, `tableHeaderBand`, `tableToolbar`, `tableHoverActions`).

## File layout (maintainers)

```
docs/
  TableCategoryGuide.stories.tsx   # Guide
  BasicTable.stories.tsx           # Components/Table
  TableExamples.stories.tsx        # Examples bundle
  KdesignDataTablePhase*.stories.tsx
  APIStories/                      # Parts + Features (titles set in each file)
  TableLineItemsExample.stories.tsx # Examples/Line Items (unpaginated invoice lines)
  *Example.stories.tsx             # Focused Examples/*
```

When adding a story, pick **one** section: Parts (single subcomponent), Features (one behavior), Examples (end-to-end recipe), or Experience (KdesignDataTable).

## Controls, Actions, Accessibility, Interactions

Full definitions: **[`STORYBOOK_STANDARDS.md`](./STORYBOOK_STANDARDS.md)** · implementation: [`tableStorybookMeta.ts`](./tableStorybookMeta.ts).

| Mode | Helper | Controls | Actions | a11y | `.play` |
| ----- | ------ | -------- | ------- | ---- | ------- |
| **Playground** | `applyTableStoryMeta` | Expanded (`tableStoryArgTypes`) | `fn()` → Actions panel | On | Optional |
| **Recipe** | `applyTableRecipeMeta` | Off | Off | On | — |
| **Flagship recipe** | `applyTableFlagshipRecipeMeta` | Off | Off | On | Required |
| **Interaction suite** | `tableInteractionTestParameters` | Off | Off | Off | Required |

**When adding a story:** pick one helper before `export default`; spread `tablePaginationCallbackArgs` on pagination API stories; do not duplicate `getStyledPropsArgTypes`.

## Design stress test

| What | Where |
| ----- | ----- |
| **Manual + `.play` harness** | `Components/Table/Examples/Design stress test` — 120 rows, 20 cols, sticky lane, filters, export |
| **Automated interaction suite** | `Components/Interaction Tests/Table` — sort, search, selection, wide grid smoke |
| **Run interaction tests** | Storybook on `:9011`, then `yarn test:react:interaction` (or `test-storybook --url http://127.0.0.1:9011`) |

**Manual checklist:** horizontal scroll reaches last column; sticky lane backgrounds cover scrolled cells; toolbar search ↔ Filters gap; pagination + selection; advanced Filters modal; column toggle/reorder after resize.

### Newer Features stories

| Story | Path |
| ----- | ----- |
| Columns config | `Features/Columns Config` |
| Title + description cell | `Features/Title Description Cell` |
| Virtualized + filter + sticky | `Features/Virtualized Combined` |
| Grouping controlled expansion | `Features/Grouping` → Controlled expansion |
