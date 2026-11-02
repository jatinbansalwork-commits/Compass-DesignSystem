# Focus states audit (priority components)

**Date:** 2026-10-28  
**Scope:** Report only — **no styling changes** (per ADR-006 and design approval gate).

## Token inventory

| Item | Finding |
|------|---------|
| Dedicated `theme.focusRing` token | **Not found** in `src/tokens` (no `focusRing` / `focus-ring` string) |
| Shared utilities | `getFocusRingStyles` + `focusRingColorTokens` under `src/utils/getFocusRingStyles/` |
| Native | `FocusRingWrapper` used from BaseInput native paths |

## Priority component matrix

“Input” = **`Input/BaseInput`** (TextInput, PasswordInput, etc. build on this).

| Component | `:focus-visible` / focus ring in source? | Mechanism | Gaps / notes |
|-----------|------------------------------------------|-----------|--------------|
| **Button** | Yes | `getFocusRingStyles` on `StyledBaseButton` / `StyledIconButton` | Token-based via helper |
| **Input (BaseInput)** | Yes | `getFocusRingStyles` in `BaseInput.tsx` / wrapper; snapshots show `.content-container` ring | Text fields: ring on container, not raw `:focus-visible` on `<input>` (known pattern) |
| **Dropdown** | Yes | `InputDropdownButton.web.tsx` — `:focus` + `:focus-visible` + `getFocusRingStyles` | Mixed `:focus` and `:focus-visible` on trigger |
| **Modal** | Partial | Floating UI focus management in `Modal.web.tsx`; close/actions inherit Button focus | No dedicated modal chrome ring; relies on child interactives + focus trap |
| **Drawer** | No matches in component tree | — | **Flag:** verify drawer panel close/focus trap vs visible ring on chrome |
| **DatePicker** | Yes (calendar cells) | `CalendarStyles.web.tsx` — `getFocusRingStyles` on cells | Trigger input follows BaseInput/Dropdown patterns |
| **AutoComplete** | No direct matches in `AutoComplete/` | Likely via **Dropdown/BaseInput** triggers under `Input/` | Audit trigger path in Storybook + a11y addon |
| **ActionList** | No matches in `ActionList/` | Selection/highlight styling; menu item focus may come from **BaseMenu** | **Flag:** keyboard roving tabindex — confirm visible focus on items |
| **SelectableCard** | No matches | Card selection state styling | **Flag:** selectable surface may lack `:focus-visible` ring |
| **FilterChip (Chip)** | Indirect | Snapshots show `:focus-visible + div` sibling ring pattern in Chip tests | Source styled files use hidden input + visual chip — ring on sibling |

## Interactive elements often missing explicit rings

- Overlay shells (Modal header/footer chrome, Drawer backdrop edges) when focus is trapped inside.
- List rows (ActionList, SelectableCard) where `isSelected` styling exists but **keyboard focus** ring is not grep-visible in component folder.
- Composite triggers (AutoComplete) where focus styles live in shared Input/Dropdown files, not the AutoComplete folder name.

## Pending design decision

Before implementing a global **`focusRing`** token:

1. Design must approve token value (color, width, offset).
2. Suggested starting point: `2px solid` primary border color with `outline-offset: 2px` (align with existing `getFocusRingStyles` behavior).
3. Once approved — one focused session can roll the helper + token through the 10 priority components above.
4. See **ADR-006** for full strategy (Option C end state, Option A incremental path).

**Do not implement focus style changes until design signs off.**
