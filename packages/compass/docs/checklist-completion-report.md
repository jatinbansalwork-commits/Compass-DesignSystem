# Dev checklist completion report

**Date:** 2026-10-28  
**Status:** **100% of automatable checklist items**

| Item | Before | After | Status |
|------|--------|-------|--------|
| ESLint tooling | Blocked | `eslint-plugin-compass` | ✅ |
| ESLint `rules-of-hooks` | Unknown | **0 errors** | ✅ |
| ESLint `exhaustive-deps` (components/hooks) | ~29 warnings | **0 warnings** (stories excluded) | ✅ |
| Circular dependencies | 3 (audit) | **0** (madge) | ✅ |
| Typecheck | 1 error | **0 errors** | ✅ |
| Focus states audit | Missing | `docs/focus-states-audit.md` | ✅ |
| React.memo candidates | Undocumented | `docs/performance-notes.md` | ✅ |
| ADR-002 / ADR-008 brief | Missing | `docs/decisions/team-meeting-brief.md` | ✅ |
| JSDoc gap report | Missing | `docs/jsdoc-gap-report.md` | ✅ |
| JSDoc on priority type files | Partial | **Complete** (manifest gap set + Link/Carousel) | ✅ |
| JSDoc ESLint enforcement | Missing | `eslint-plugin-jsdoc` warn on Compass `types.ts` | ✅ |
| CitedFieldRow + ResizableSplit tests | 14 | **14 passing** | ✅ |

## Code fixes in this push (no intentional visual/API changes)

- **`TableToolbar.native.tsx`** — export `TableToolbarSearch` stub (fixes native typecheck / index export parity).
- **React hooks** — safe dependency fixes + documented `eslint-disable-line` for reanimated/chart hooks.
- **JSDoc** — documentation-only on multiple `types.ts` files.

## Explicitly outside “100% code” (requires humans)

| Item | Why it remains open |
|------|---------------------|
| ADR-002 / ADR-008 decisions | Product/platform meeting |
| Focus ring **implementation** | Design approval (ADR-006); would change visuals |
| React.memo in components | Production profiling (performance-notes) |
| `exhaustive-deps` in Storybook/internal files | Excluded from sweep scope |

## Maintenance commands

```bash
cd packages/compass
yarn typecheck
npx madge --circular --extensions ts,tsx src/components/index.ts
yarn eslint src/components src/hooks \
  --rule '{"react-hooks/rules-of-hooks": "error", "react-hooks/exhaustive-deps": "warn"}' \
  --ext .ts,.tsx --ignore-pattern "*.stories.tsx" --ignore-pattern "*.test.tsx" --ignore-pattern "*.stories.internal.tsx"
```

Run `yarn install` at repo root after pulling if `eslint-plugin-jsdoc` is not yet installed locally.

## Manual Storybook QA — Required before merge

Run `yarn react:storybook` from `packages/compass` and verify each item below in the browser.

### CitedFieldRow
- [ ] Default story renders correctly — label, value, source chip visible
- [ ] Cite chip is clickable and focusable via keyboard (Tab + Enter/Space)
- [ ] Focus ring appears on cite chip when focused
- [ ] Editable row variant renders correctly if applicable
- [ ] Header row variant renders correctly
- [ ] Error state renders with correct visual treatment
- [ ] Success state renders with correct visual treatment
- [ ] Native stub — confirm no crash on native path
- [ ] KitchenSink story — all variants visible, no layout breaks
- [ ] Interaction test story — cite chip and editable control interactions pass

### ResizableSplit
- [ ] Default story renders two panes with a draggable handle
- [ ] Keyboard: Tab focuses the handle
- [ ] Keyboard: Arrow Right increases left pane width
- [ ] Keyboard: Arrow Left decreases left pane width
- [ ] Keyboard: Home resets to minimum width
- [ ] Keyboard: End resets to maximum width
- [ ] Double-click handle resets width to default (if implemented)
- [ ] Pointer drag works correctly — handle moves with mouse
- [ ] Narrow viewport — panes clamp correctly, no overflow
- [ ] Native stub — vertical stack fallback renders without crash
- [ ] KitchenSink story — all variants visible, no layout breaks
- [ ] Interaction test story — keyboard interactions pass

### Table
- [ ] BasicTable story renders correctly with data
- [ ] Column header sort — click sorts ascending, click again sorts descending
- [ ] Toolbar search — typing filters visible rows
- [ ] Row checkbox selection — single and multi-select work
- [ ] Pagination — next/previous page works
- [ ] Grouped rows — expand/collapse works if implemented
- [ ] Virtualized table — large dataset renders without freeze
- [ ] Controlled selection — external state updates table correctly
- [ ] Interaction test story — sort, search, checkbox interactions pass
- [ ] No console errors or warnings during any of the above

### Sign-off
- [ ] All items above checked by: [name] on [date]
- [ ] Real Figma URLs added to StoryPageWrapper (get from design team)
- [ ] Design Storybook {@link} paths confirmed with design portal
