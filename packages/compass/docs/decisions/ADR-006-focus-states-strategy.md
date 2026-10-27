# ADR-006: Focus states strategy

**Status:** Proposed  
**Date:** 2026-10-27  
**Owner:** 

## Context

Compass uses **styled-components** and **design tokens**, not SCSS modules — a static “grep all focus styles” audit does not map cleanly to one file type.

Track A added **AUDIT** comments on interactive elements where focus affordances were visibly missing or inconsistent. A repo-wide pass touching styled definitions across **~100+** components is **high visual regression risk**.

The codebase already includes focus-ring utilities (e.g. `src/utils/getFocusRingStyles/`, `focusRingColorTokens`) used on native; web components apply focus inconsistently.

**Storybook addon-a11y** can surface focus and contrast issues interactively but is not yet a hard CI gate.

## Options

### Option A — Incremental PR-by-PR focus fixes

Add `:focus-visible` (or shared helper) only in components touched for other reasons; PR template checklist item.

**Trade-offs:** **Low** blast radius; slow coverage; inconsistent until complete. **Low** risk per PR.

### Option B — Audit-driven CI gate

Run addon-a11y (or axe) in CI; fail on violations; fix all before next major.

**Trade-offs:** Forces completeness; **High** upfront fix cost; flaky tests if stories incomplete. **Medium** CI maintenance.

### Option C — Token-driven global focus ring

Define **`theme.focusRing`** (or extend existing focus ring tokens) and a **shared styled helper / mixin** (web + native alignment). Optionally ESLint rule: interactive styled components must use helper.

**Trade-offs:** One token update refreshes all rings; **Medium** design + eng effort upfront; **Low** ongoing drift. Requires design sign-off on ring width, color, and offset.

## Recommendation

**Option C as the end state** for visual and accessibility consistency. **Option A as the immediate path** while Option C is designed (token spec + `getFocusRingStyles` / web equivalent API).

Defer **Option B** until Storybook coverage and flake budget support it; use addon-a11y locally in the interim.

### Illustrative token + mixin shape (non-binding)

```ts
// theme extension (illustrative)
focusRing: {
  width: '2px',
  offset: '2px',
  color: { primary: '...', neutral: '...' },
}
```

```ts
// styled helper (illustrative)
export const focusRingStyles = css<{ $variant?: 'primary' | 'neutral' }>`
  &:focus-visible {
    outline: ${({ theme }) => theme.focusRing.width} solid
      ${({ theme, $variant }) => theme.focusRing.color[$variant ?? 'primary']};
    outline-offset: ${({ theme }) => theme.focusRing.offset};
  }
`;
```

Align with existing `focusRingColorTokens` in `getFocusRingStyles` where possible.

### Priority components (first audit / fix wave)

Most user-facing and keyboard-heavy:

1. Button  
2. Input  
3. Dropdown  
4. Modal  
5. Drawer  
6. DatePicker  
7. AutoComplete  
8. ActionList  
9. SelectableCard  
10. FilterChip  

## Migration path

1. Design + a11y review: focus ring spec → theme tokens.
2. Implement web `focusRingStyles` helper; document usage in AGENTS.md / contribution guide.
3. Pilot on **Button** and **Input**; Chromatic diff.
4. Option A: require checklist on PRs touching interactive styled code until helper adoption is wide.
5. Option C complete: codemod or lint rule to flag raw `:focus` without `:focus-visible` or helper.
6. Optional later: enable addon-a11y CI (Option B) on `storybook:build`.

**Consumers:** No API changes unless new theme tokens are required in custom themes (document additive tokens).

## Risks

| Risk | Severity | Notes |
|------|----------|--------|
| Visual regression on bulk apply | **High** | Mitigate with phased rollout + Chromatic. |
| Double outlines (browser + custom) | **Medium** | Standardize on `:focus-visible`; reset `outline: none` only with replacement. |
| RN/web parity drift | **Medium** | Single token source; platform-specific wrappers. |

## Decision

_To be filled by the team._
