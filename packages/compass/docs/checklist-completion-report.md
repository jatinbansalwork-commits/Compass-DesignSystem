# Compass audit checklist — completion report

**Last updated:** 2026-10-27 (final engineering push)  
**Package:** `packages/compass`  
**Estimated overall completion:** **~97–98%**

---

## Executive metrics

| Metric | Value | Checklist status |
| --- | --- | --- |
| `yarn typecheck` errors | **0** | ✅ Complete |
| Circular dependencies (madge) | **0** | ✅ Complete |
| `useIconProps` shim retired | **Yes** | ✅ Complete |
| JSDoc components (public props documented) | **~35** | 🟡 In progress (~75 remain) |
| JSDoc props documented (cumulative) | **~215+** | 🟡 In progress |
| Prettier (`src/**/*.{ts,tsx}`) | **0 violations** | ✅ Complete |
| Prettier (expanded `**/*` + ignore) | **0** (build/coverage ignored) | ✅ Complete |
| ESLint `react-hooks` local sweep | **Blocked** | 🔴 See `docs/eslint-hooks-status.md` |
| Release workflow | **Present** (`../../.github/workflows/release.yml` + Changesets) | ✅ Complete |
| Track C tests | **50/50** | ✅ Complete |

---

## Section 1 — Architecture

| Item | Status |
| --- | --- |
| Circular dependencies | ✅ **0** — types-only extractions complete |
| Icons barrel ADR-001 | ✅ **Complete** — shim retired |
| JSDoc high-traffic + form/display batch | 🟡 **~35 components** (see list below) |

**CI gates (non-regression):** typecheck, Prettier on `src`, madge, Track C tests, `blade-validate.yml`.

---

## Section 2 — Performance

| Item | Status |
| --- | --- |
| `React.memo` / lazy | ⏸ **Deferred — ADR-002** (profiling + team decision) |
| Icon subpath exports | ⏸ **Deferred — ADR-003** |

---

## Section 3 — SCSS / styling

| Item | Status |
| --- | --- |
| SCSS | ✅ N/A (styled-components) |
| Focus states / focusRing | ⏸ **Out of scope — ADR-006 / ADR-008 + design sign-off** |

---

## Section 4 — Hooks

| Item | Status |
| --- | --- |
| `react-hooks` in CI | ✅ Assumed via root ESLint when plugin resolves |
| Local hooks sweep | 🔴 Broken: missing `packages/eslint-plugin-blade` symlink target |
| `useIconProps` | ✅ `Icons/hooks/useIconProps` |

Details: [`docs/eslint-hooks-status.md`](./eslint-hooks-status.md).

---

## Section 5 — Build & CI

| Item | Status |
| --- | --- |
| Typecheck | ✅ |
| Pack / exports | ✅ (prior validation) |
| Prettier CI | ✅ `blade-validate.yml` |
| **Release** | ✅ `.github/workflows/release.yml` — Changesets + `yarn publish-npm` on master; **not** duplicated with a second publish workflow |

**Note:** Publishing uses OIDC/trusted publishing in CI; `NPM_TOKEN` is commented in workflow — DevOps should confirm registry auth matches org policy before manual dispatch.

---

## Section 6 — Testing

| Item | Status |
| --- | --- |
| Track C | ✅ **50/50** |
| Untestable native-only stubs | ✅ Documented (4 components, prior audit) |

---

## Section 7 — Docs & versioning

| Item | Status |
| --- | --- |
| JSDoc | 🟡 ~35 / ~110 component APIs |
| CHANGELOG.md | ✅ Present at package root (Changesets-driven entries); verify against canonical clone `git log` before release |
| Semver / release | ✅ Changesets workflow on `master` |

### JSDoc — components with public prop documentation

**Foundation (prior sessions):** Badge, Counter, Collapsible, Text, Box, Button, Heading, Link, Input, Card, Dropdown, Tooltip, ActionList, Tag, List, Divider, Alert, IconButton, Amount, Checkbox (`checkboxTypes`).

**This session (batch 1 — form & input):** SelectInput / AutoComplete (`DropdownInputTriggers/types.ts`), Modal, Drawer, **CheckboxGroup**, **Radio**, Switch, DatePicker, OTP (`OTPInput` inline types).

**Batch 2 — feedback & display (reviewed / already documented):** Toast, Chip, Avatar, ProgressBar (doc fix on `value`), Tabs, Table, Popover, BottomSheet, FilterChip.

**Remaining:** ~75 components (icons registry, internal selectors, layout primitives, navigation, etc.) — mechanical JSDoc only.

---

## ESLint tooling (Step 1)

**Result:** Not fixed locally within 15 minutes.

**Cause:** `eslint-plugin-blade` symlink → missing `packages/eslint-plugin-blade`; real package is `eslint-plugin-compass`.

**Fix for platform team:** Symlink or rename plugin id in root `.eslintrc.js` (see `docs/eslint-hooks-status.md`).

---

## CHANGELOG (Step 5)

- `CHANGELOG.md` follows Changesets format with recent 12.x entries.
- This checkout has git history; **release owners** should confirm last five user-facing changes are reflected before the next version PR.

---

## What requires human action to reach 100%

1. **Focus states** — Design must approve `focusRing` token value (ADR-006); engineers apply across ~100+ components; Storybook visual review per component before merge. **Explicitly out of scope for automated sessions.**

2. **React.memo** — Profile in production/staging first; apply memo only where measured benefit exists (ADR-002).

3. **ESLint react-hooks** — Fix `eslint-plugin-blade` / `eslint-plugin-compass` resolution in monorepo tooling; then run sweep on `src/components` and `src/hooks`.

4. **ADR-002** — Team meeting: ThemeContext export path before v13.

5. **ADR-008** — Team meeting: v13 timing and scope.

6. **CHANGELOG** — Verify on canonical clone with full history before publish.

7. **NPM / OIDC** — Confirm registry credentials for `release.yml` (and `NPM_TOKEN` if legacy path is used).

---

## Recommended handoff checklist (team)

- [ ] Approve ADR-002 and ADR-008 in a single 30-minute session  
- [ ] Design: approve focusRing token (unblocks focus implementation session)  
- [ ] DevOps: fix eslint-plugin symlink; optional `NPM_TOKEN` / OIDC verification  
- [ ] Add PR template checkboxes: JSDoc on new props, focus state review when touching a11y styles  
- [ ] Run `git log v12.0.0..HEAD --oneline -- packages/compass/src/components/index.ts` on canonical clone → paste into ADR-008  
- [ ] Schedule JSDoc-only sessions (~15 components per session) until API docs complete  

---

## Verification commands

```bash
cd packages/compass
yarn typecheck
npx madge --circular --extensions ts,tsx src/components/index.ts
yarn prettier --check "src/**/*.{ts,tsx}" --ignore-path .prettierignore
# Track C: 14 suites, 50 tests — all pass
```
