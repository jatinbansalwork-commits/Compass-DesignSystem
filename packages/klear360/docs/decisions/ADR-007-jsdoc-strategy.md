# ADR-007: JSDoc strategy for component props

**Status:** Proposed  
**Date:** 2026-10-27  
**Owner:** 

## Context

Track A added **JSDoc only on PopupArrow props** as a sample pattern. **~100+** components still lack prop-level JSDoc.

A single mega-PR documenting every prop risks merge conflicts and review fatigue. **Storybook argTypes** document some props in stories but do not replace TypeScript-facing JSDoc for IDE hover text and API docs generation.

## Options

### Option A — Incremental via PR checklist

Require JSDoc on new or modified props in every PR touching public types.

**Trade-offs:** Steady progress; uneven coverage for years. **Low** risk.

### Option B — ESLint enforcement (`eslint-plugin-jsdoc`)

Rule requiring JSDoc on exported component props; fix violations opportunistically or in batches.

**Trade-offs:** Prevents regression; initial noise until baseline configured (warn → error). **Medium** setup.

### Option C — Prioritized sprint on top 20 components

Complete JSDoc for the most-imported components first.

**Trade-offs:** High visibility win; needs accurate import-frequency data.

## Recommendation

Combine **Option B** (enforcement, phased warn → error) with **Option C** (initial sprint on top components).

Use **Option A** as the ongoing contributor habit between sprint and full coverage.

### Import frequency command (audit)

Run from `packages/klear360` as specified in the audit:

```bash
grep -r "from '@klearnow/klear360'" ../../ --include="*.tsx" --include="*.ts" | grep -oP "(?<=import \{)[^}]+" | tr ',' '\n' | sort | uniq -c | sort -rn | head -20
```

**Actual output in this workspace** (2026-10-27; monorepo checkout under `Klear360-Master`; macOS `grep` without `-P` used equivalent parsing):

```
   1 Button
```

**Interpretation:** The local monorepo mirror contains **almost no external consumer** imports of `@klearnow/klear360` — only **one** counted symbol (`Button`). The audit command is **insufficient here** to rank the top 20 **consumer-facing** components.

**Supplementary analysis (internal `~components/` imports in `packages/klear360/src`)** — useful for **in-library** hot spots until consumer repos are scanned:

```
 994 Box
 489 Typography
 320 Icons
 261 Klear360Provider
 240 Button
 105 Input
  86 Link
  76 Form
  75 Badge
  71 Dropdown
  59 BaseMotion
  54 ActionList
  53 Amount
  42 Divider
  38 Tooltip
  34 Card
  27 BaseHeaderFooter
  25 BottomSheet
  23 Checkbox
  22 Alert
```

**Revised sprint shortlist for JSDoc (pending consumer data):** Button, Input, Dropdown, Typography/Text, Box, Link, Form, Badge, Card, ActionList, Modal, Drawer, Checkbox, Radio, Tooltip, Alert, Amount, AutoComplete, SelectableCard, FilterChip — merge internal counts with product “top surface” list from design/PM.

**Action:** Re-run the audit `grep` against **production application monorepos** that depend on `@klearnow/klear360` before locking the final top 20.

## Migration path

1. Agree JSDoc template (description, `@default`, `@deprecated` where applicable) from PopupArrow sample.
2. Sprint: document agreed top 20 prop interfaces / exported types.
3. Add `eslint-plugin-jsdoc` with `require-jsdoc` or `require-param-description` scoped to `src/components/**/types.ts` and prop type files.
4. PR template: “Public props documented?” checkbox.
5. Optional: generate API docs from TSDoc/JSDoc in future doc site.

**Consumers:** Better IDE IntelliSense; no runtime change.

## Risks

| Risk | Severity | Notes |
|------|----------|--------|
| Wrong top-20 list from sparse grep | **Medium** | Mitigate with consumer-repo scan (see above). |
| ESLint blocking PRs | **Low** | Start as warn. |
| JSDoc drift from types | **Medium** | Prefer JSDoc on same file as prop types; typecheck still source of truth. |

## Decision

_To be filled by the team._
