# ADR-004: Dropdown typeahead module-level timeout

**Status:** Proposed  
**Date:** 2026-10-27  
**Owner:** 

## Context

`src/components/Dropdown/useDropdown.ts` implements keyboard typeahead in `onComboType`. Module-level mutable state is used:

- **Lines 222–223:** `let searchTimeout: number;` and `let searchString = '';`
- **Lines 512–519:** timeout reset on keystroke; **500 ms** clears `searchString`
- **Line 516:** Track A **AUDIT** comment — timeout is cleared on the next keystroke but **not on unmount**

Because `searchTimeout` and `searchString` live at **module scope**, multiple dropdown instances share the same typeahead buffer and timer. That can cause cross-instance leakage in theory; the AUDIT focuses on **unmount** not clearing a pending timeout (potential stale callback / memory leak class issue).

Fixing this is **internal only** — no public Dropdown API change — but timing behavior must remain identical for users.

## Options

### Option A — Leave as-is with AUDIT comment

Accept module-level state; document known limitation.

**Trade-offs:** **Low** immediate effort; **Low–Medium** correctness risk in edge cases (rapid mount/unmount, multiple dropdowns). Severity rated low in audit because timeout is short (500 ms).

### Option B — `useRef` + `useEffect` cleanup inside the hook

Move `searchTimeout` and `searchString` into refs scoped to each hook invocation; `useEffect` return clears timeout on unmount.

**Trade-offs:** Correct React lifecycle pattern; **Low** UI risk if ref semantics mirror current behavior. Requires careful port of shared-state semantics (today module-level is arguably a bug for multi-instance).

### Option C — Dedicated `useTypeahead` hook

Extract typeahead into a reusable hook with lifecycle management and unit tests.

**Trade-offs:** Best long-term structure; **Medium** scope (Dropdown + tests + possible reuse in AutoComplete patterns). Higher review cost.

## Recommendation

**Option B** — move timeout and search string into **`useRef`**, add **`useEffect`** cleanup calling `clearTimeout` on unmount, and preserve the **500 ms** delay and keystroke reset logic in `onComboType`.

Option C is worthwhile if other components share the same pattern; not required for the AUDIT closure.

### Implementation notes (exact touch points)

| Location | Change |
|----------|--------|
| `useDropdown.ts` ~222–223 | Remove module-level `searchTimeout` / `searchString`; create refs inside `useDropdown`. |
| `onComboType` ~512–532 | Read/write `searchStringRef.current`; store timeout id in `searchTimeoutRef`; same `clearTimeout` / `setTimeout(..., 500)` logic. |
| New `useEffect` | On unmount: if `searchTimeoutRef.current` defined, `window.clearTimeout`. |

Remove or update the AUDIT comment once fixed.

### Test plan (behavior unchanged)

1. **Before change (baseline):** Document current behavior — type letters in closed/open listbox, focus moves to matching option; after 500 ms idle, next letter starts fresh search string.
2. **Add test:** Render Dropdown with typeahead enabled; simulate key presses; assert active index updates.
3. **Unmount test:** Mount, trigger typeahead (schedule timeout), unmount before 500 ms; assert no React warnings and timeout cleared (mock `window.setTimeout` / `clearTimeout` or use fake timers).
4. **Regression:** Existing Dropdown / AutoComplete-related tests in Priority suites.

## Migration path

1. Add unmount cleanup test (may fail on current code).
2. Implement Option B inside `useDropdown.ts` only.
3. Run Dropdown unit tests and Priority 1 regression subset touching overlays/lists.
4. Remove AUDIT comment.

**Consumers:** None — internal hook only.

## Risks

| Risk | Severity | Notes |
|------|----------|--------|
| Changing multi-instance typeahead sharing | **Medium** | Ref-per-instance may **fix** accidental shared state; verify product intent. |
| Timing drift | **Low** | Must keep 500 ms constant. |
| SSR / non-browser | **Low** | Guard `window` usage as today. |

## Decision

_To be filled by the team._
