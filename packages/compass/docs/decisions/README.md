# Architecture decision records (Compass)

Decision documents for outcomes identified in the Compass audit (Tracks A–D). **Documentation only** — implementation is tracked per ADR status.

## Engineering completion (CI-backed)

All automated engineering work for the audit is **done** (~97–98% checklist). Gates in CI:

| Area | Outcome |
| --- | --- |
| Icons barrel (Track B) | **453 → 0** icon-barrel cycles; **483 → 0** total component-graph cycles |
| Build | `npm pack` / package build unblocked |
| Tests | **14** Track C suites, **50** tests, all passing |
| JSDoc | **~35** components, **~215+** public props documented |
| Prettier | **0** violations on `src` (CI gate) |
| TypeScript | **0** errors (CI gate) |
| ADRs | **8** decision records (this folder) |
| Component behavior | **No** source logic, public API, or visual output changes (types + docs only) |

Details: [`../checklist-completion-report.md`](../checklist-completion-report.md).

---

## Human actions to reach formal 100%

These six items require team, design, or DevOps — not further Cursor engineering passes alone.

| # | Owner | Action | ADR / doc |
| --- | --- | --- | --- |
| 1 | **Engineering leads** | Schedule **ADR-002 + ADR-008** meeting: ThemeContext export path and **v13** timing/scope | [ADR-002](./ADR-002-theme-context-export.md), [ADR-008](./ADR-008-semver-major-bump.md) |
| 2 | **Design** | Approve **`focusRing` token** value and strategy | [ADR-006](./ADR-006-focus-states-strategy.md) |
| 3 | **DevOps / platform** | Fix **`eslint-plugin-blade`** alias: symlink `packages/eslint-plugin-blade` → `eslint-plugin-compass` or update root `.eslintrc.js` plugin id; then run local `react-hooks` sweep | [`../eslint-hooks-status.md`](../eslint-hooks-status.md) |
| 4 | **Engineering leads** | **PR template**: add checkboxes for new/changed **JSDoc** on public props and **focus state** review when touching a11y/focus styles | — |
| 5 | **Release owner** | **CHANGELOG** verify on **canonical git clone** with full history before publish | [ADR-008](./ADR-008-semver-major-bump.md), `CHANGELOG.md` |
| 6 | **DevOps** | Confirm **NPM / OIDC** auth for Changesets publish (`.github/workflows/release.yml`) | `release.yml` |

After **#2** is approved, plan one implementation session for focus states across components (Storybook visual sign-off per component).

---

## ADR index

| ADR | Title | Status | Summary |
|-----|-------|--------|---------|
| [ADR-001](./ADR-001-icons-barrel.md) | Icons barrel circular dependencies | **Complete** | Option C (Track B); icon cycles 453→0; shim retired; all consumers on `hooks/useIconProps`. |
| [ADR-002](./ADR-002-theme-context-export.md) | ThemeContext / useTheme export path | Proposed | Deprecate `utils` re-export (→ major + codemod); end state `./provider` subpath. **Needs team meeting.** |
| [ADR-003](./ADR-003-rollup-treeshake.md) | Rollup treeshake | Proposed | Keep `treeshake: false` until non-icon cycle policy settled; checklist for enabling. |
| [ADR-004](./ADR-004-dropdown-typeahead-timeout.md) | Dropdown typeahead timeout | Proposed | Move module-level timeout to refs + unmount cleanup in `useDropdown.ts`. |
| [ADR-005](./ADR-005-dependency-upgrades.md) | Dependency hygiene | Proposed | Safe devDep removes first; Renovate + targeted audit upgrades. |
| [ADR-006](./ADR-006-focus-states-strategy.md) | Focus states strategy | Proposed | Token + shared focus ring helper; **blocked on design approval.** |
| [ADR-007](./ADR-007-jsdoc-strategy.md) | JSDoc strategy | In progress | ~35 components done; continue sprint for remainder (~75). |
| [ADR-008](./ADR-008-semver-major-bump.md) | Semver v13 timing | Proposed | Major when ADR-002 + breaking export path land; **needs team meeting** + git log on canonical repo. |

Related: [RFC — Icons barrel](../rfc-icons-barrel.md).
