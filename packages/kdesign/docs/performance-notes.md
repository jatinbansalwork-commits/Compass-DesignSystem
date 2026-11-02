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

## React.memo candidates (pending profiling)

Top components by **internal** `from '~components/…'` import frequency in `packages/kdesign/src` (2026-10-28):

| Rank | Component | Approx. internal references |
|------|-----------|----------------------------|
| 1 | Box | ~1519 |
| 2 | Button | ~840 |
| 3 | BaseBox | ~827 |
| 4 | Text | ~553 |
| 5 | Dropdown | ~536 |

Profile these first in production/staging before memoizing leaf components (ActionListItem, FilterChip, etc.).

### How to profile

1. Open Chrome DevTools → **Profiler** tab.
2. Record a typical session (open modal, fill form, keyboard through dropdown).
3. Find components that re-render without prop changes.
4. Apply `React.memo` only where measured benefit is **> ~5%** render time reduction.

### Current status

Deferred — no production profiling data available yet. Added to **ADR-002** backlog (memo policy) and this file.

## Changes made this session

None to component memoization.
