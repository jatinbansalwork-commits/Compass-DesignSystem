# Performance notes (memo / useMemo)

**Date:** 2026-10-27  
**Status:** **Flagged — not implemented**

## Policy

Per audit checklist item 10, memoization must be **evidence-based** (profiling or proven hot paths), not speculative. No React DevTools / production profiling data was available in this session.

## Candidates (hypothesis only — do not memoize without measurement)

| Component | Rationale | Status |
|-----------|-----------|--------|
| `ActionListItem` | Used in long lists inside Dropdown overlays; frequent re-renders on active index changes | **Deferred** — needs render-count profile |
| `ListItem` | Same list pattern as ActionList | **Deferred** |
| `FilterChip` | Renders in filter bars with many siblings | **Deferred** |
| `Card` | Selectable grids; parent selection state updates | **Deferred** |
| `BaseInput` | High frequency in forms; many styled subcomponents | **Deferred** |

## Next steps

1. Profile Storybook or a representative app route with React Profiler (Dropdown + ActionList open, keyboard navigation).
2. If a child re-renders > N times per keystroke without prop changes, wrap that export in `React.memo` and re-run Track C + Chromatic.
3. Document before/after commit counts in this file.

## Changes made this session

None to component memoization.
