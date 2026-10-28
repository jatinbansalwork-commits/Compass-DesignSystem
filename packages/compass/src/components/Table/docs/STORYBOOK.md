# Table — Storybook map

Open **Components → Table → Guide** in Storybook for the same overview in the UI.

| Section | Path | When to use |
| -------- | ----- | ------------ |
| **Guide** | `Components/Table/Guide` | Orientation — read this first |
| **Overview** | `Components/Table` | `Table` props playground (controls) |
| **Examples** | `Components/Table/Examples` | Common product recipes (sort, selection, sticky, loading, …) |
| **Examples/** *topic* | e.g. `…/Pagination`, `…/Sticky Columns`, `…/Edge Cases` | Deep dives on one scenario |
| **Parts** | `Components/Table/Parts/*` | One story file per building block (Header, Row, Toolbar, …) |
| **Features** | `Components/Table/Features/*` | Cross-cutting behavior (filtering, grouping, virtualized, …) |
| **Experience** | `Components/Table/Experience/CompassDataTable/*` | Optional Prime-style shell on top of the same filter/sort rules |

## Experience stories (order)

1. **01 Toolbar & Export** — global search, CSV export, empty states  
2. **02 Filters & Selection** — advanced filters, column toggle, multi-sort, modifier selection  
3. **03 Layout & Keyboard** — column reorder/resize, keyboard rows, no inline filter row with advanced filters  

## File layout (maintainers)

```
docs/
  TableCategoryGuide.stories.tsx   # Guide
  BasicTable.stories.tsx           # Components/Table
  TableExamples.stories.tsx        # Examples bundle
  CompassDataTablePhase*.stories.tsx
  APIStories/                      # Parts + Features (titles set in each file)
  *Example.stories.tsx             # Focused Examples/*
```

When adding a story, pick **one** section: Parts (single subcomponent), Features (one behavior), Examples (end-to-end recipe), or Experience (CompassDataTable).

### Newer Features stories

| Story | Path |
| ----- | ----- |
| Columns config | `Features/Columns Config` |
| Title + description cell | `Features/Title Description Cell` |
| Virtualized + filter + sticky | `Features/Virtualized Combined` |
| Grouping controlled expansion | `Features/Grouping` → Controlled expansion |
