# `CitedFieldRow` — Component Spec

Portable reference for rebuilding or porting `CitedFieldRow` into another design system.
Covers purpose, prompt, style, dimensions, props, and use cases in one place.

**Source:** `packages/compass/src/components/CitedFieldRow/`

---

## 0. Cursor prompt — paste this as-is

Copy everything inside the fence below into Cursor as one prompt. Everything after
this section (§1–§6) is reference material the prompt links out to — Cursor should read
it, not re-derive it.

````
I'm porting a component called `CitedFieldRow` from the Compass design system into this
codebase. Full spec, prompt-level build instructions, dimensions, color tokens, props, and
use cases are in this file: `CitedFieldRow-component-spec.md` (pasted/attached alongside
this message). Read it in full before writing any code.

STEP 1 — Discover before building (do this first, report back, then stop and wait for me):
- Find this codebase's existing equivalent of a "labeled field row" or "field table" pattern
  (e.g. a definition list, key-value row, or similar). Tell me what already exists, its
  prop shape, and its styling approach (CSS-in-JS, CSS modules, Tailwind, etc.) so the new
  component matches local conventions instead of importing Compass's styling approach
  wholesale.
- Find this codebase's existing "chip"/"pill"/"badge" component, if one exists — the
  citation chip should reuse it rather than being hand-rolled, if a suitable one exists.
- Find this codebase's design tokens (or equivalent: theme object, CSS variables, Tailwind
  config) for: border colors, feedback/semantic colors (error/success/neutral/information),
  spacing scale, border radius, and typography scale. Map Compass's token names (listed in
  §3/§4 of the spec) to this codebase's nearest equivalents and show me the mapping before
  using it.
- Report back what you found. Do not write component code yet.

STEP 2 — Once I confirm the mapping, build the component scoped to ONLY this one concern
(don't also touch unrelated components or refactor other things you notice along the way):
- One `CitedFieldRow` row component + one `CitedFieldRow.Header` companion, per §1/§5 of
  the spec.
- Match the dimensions in §3 and the token mapping from Step 1 (not Compass's literal
  token names — your codebase's equivalents).
- Implement all props listed in §5 exactly as specified (names, types, defaults).
- Ship the "documented today" use cases in §6 as actual examples/stories/demos in
  whatever pattern this codebase uses for component examples (Storybook, a demo page,
  etc.) — one example per use case, not just a single kitchen-sink demo.

Decisions already made for you (don't re-ask, just follow):
- `source` stays a single object, not an array — multiple citations per field (spec §6,
  gap #18) is explicitly OUT of scope for this port.
- No loading/skeleton state (spec §6, gap #19) — out of scope for this port.
- No copy-to-clipboard (spec §6, gap #20) — out of scope for this port.
- The "doc" citation variant should use this codebase's neutral/gray semantic color, not
  primary/brand — this mirrors the Compass rationale in §4 ("no dedicated AI/document
  semantic color yet") and keeps it visually distinct from the "trace" variant's
  information/blue color.

Deliverables — when done, tell me:
1. The token mapping you used (Compass token → this codebase's token), as a table.
2. Which of the 6 "doc-only gap" use cases from §6 (items 12–17) you included as examples
   vs. skipped, and why.
3. Any place the local styling system genuinely couldn't replicate a dimension/style from
   §3/§4 exactly, and what you did instead.
4. File paths of everything you created or changed.

If you hit a genuine open question not covered above (something needing a product/business
decision, not an implementation detail) — stop and ask me directly rather than guessing.
````

---

## 1. Purpose

A label/value row for displaying a single extracted data field, with an optional **citation
chip** linking the value back to the source it was extracted from (a document page, or a
Track & Trace event). Built for AI-extraction products where a human needs to verify
*where a value came from*, not just see the value. Stacks with other `CitedFieldRow`s
(plus a `CitedFieldRow.Header`) inside a `Card` to form a "field table."

---

## 2. Build prompt (paste into another design system / AI coding agent)

```
Build a `CitedFieldRow` component: a two-column grid row (label | value) used to display
a single AI-extracted field with an optional citation back to its source.

Layout: CSS grid, columns `minmax(7.5rem, 42%) minmax(0, 1fr)` (label column | value
column), row height min 40px, 1px bottom border (and 1px right border between columns),
using the theme's subtle gray border color.

Label cell: padding 8px, subtle gray background, body/medium text. Muted text color when
the row has no `source` ("ungrounded").

Value cell: padding 4px(y) x 8px(x), white background by default. Single-line value text,
truncated with ellipsis if it overflows, tabular-nums for numeric alignment. Renders an
em dash in muted gray when the value is null/undefined/empty (never a blank cell - that
reads as a loading state). If `isEditable`, render the passed-in form control instead of
the value text.

Citation chip: pill-shaped button (border-radius: full), inline after the value, only
rendered if a `source` is provided. Contains a small solid dot + the source's label text.
Two color variants: `doc` (neutral background, bordered) for document-grounded values,
`trace` (blue "information" background, no border) for Track & Trace-grounded values.
An `isActive` state swaps both variants to one solid accent-filled treatment (white text
on primary-intense background) - used to show which citation is "currently being viewed."
Clicking the chip fires an `onCiteClick(source)` callback - the component does not scroll
to or highlight the source itself, that's the consumer's job.

States to support:
- Validation: `none | error | success` - error/success change the value cell's background
  and add a thick left accent border in the matching feedback color, plus inline helper
  text below the value (error text in red, success text in green with a check icon).
- Cite target: an `isCiteTarget` boolean that highlights the row (accent background +
  accent left border) to mark it as the field whose source is currently on-screen.
- Cite muted: an `isCiteMuted` boolean that dims the whole row to ~55% opacity, disables
  the citation chip, and makes the row `aria-disabled` + non-interactive - driven by a
  consumer-owned filter (e.g. "show only ungrounded fields"), not component state.

Accessibility: the value cell gets `aria-invalid` when in an error state and
`aria-describedby` pointing at the error/success text. The citation chip is a real
`<button>` with an accessible name (falls back to the source label) and a visible
focus ring.

Also build a companion `CitedFieldRow.Header` - same grid, renders "Field" / "Value" /
"Source" column labels (all overridable), with a flag to hide the Source column entirely
when no rows in the table have citations.
```

---

## 3. Dimensions

| Element | Value |
| --- | --- |
| Grid columns | `minmax(7.5rem, 42%) minmax(0, 1fr)` (label : value) |
| Row min height | `40px` |
| Label/value cell padding | Label: `8px` all sides · Value: `4px` vertical / `8px` horizontal |
| Row border (bottom + column divider) | `1px` solid, `surface.border.gray.subtle` |
| Validation accent border (left, value cell) | `thick` (border width token, error/success/cite-target only) |
| Citation chip padding | `4px` vertical / `8px` horizontal |
| Citation chip border radius | `max` (full pill) |
| Citation chip border width | `thin` (`1px`) — `trace` variant: `transparent` |
| Citation dot diameter | `6px` |
| Gap inside chip (dot ↔ label) | `2px` (spacing token `1`) |
| Gap between value and chip | `8px` (spacing token `3`) |
| Gap between value + helper text | `2px` (spacing token `1`) when validation hint shown |
| Value text | `body` / `small` size, `medium` weight (muted/`regular` weight when empty) |
| Label text | `body` / `medium` size, `regular` weight |
| Chip label text | `body` / `small` size, `medium` weight |
| Helper (error/success) text | `caption` / `small` size |
| Transition (hover tint, chip states) | `quick` duration, `standard` easing |

---

## 4. Style / color tokens

| State | Background | Border/accent | Text |
| --- | --- | --- | --- |
| Default value cell | `interactive.background.staticWhite.default` | — | `surface.text.gray.normal` |
| Empty value | same as default | — | `surface.text.gray.muted` |
| Error | `feedback.background.negative.subtle` | left: `interactive.border.negative.default` | `feedback.text.negative.intense` |
| Success | `feedback.background.positive.subtle` | left: `interactive.border.positive.default` | `feedback.text.positive.intense` |
| Cite target | `surface.background.primary.subtle` | left: `surface.border.primary.normal` | — |
| Row hover (value cell) | `surface.background.gray.subtle` | — | — |
| Label cell background | `surface.background.gray.subtle` | right: `surface.border.gray.subtle` | — |
| Chip — `doc` variant | `feedback.background.neutral.subtle` | `feedback.border.neutral.subtle` | `feedback.text.neutral.intense` |
| Chip — `trace` variant | `feedback.background.information.subtle` | `transparent` | `feedback.text.information.intense` |
| Chip — active (either variant) | `surface.background.primary.intense` | `surface.background.primary.intense` | `surface.text.staticWhite.normal` |
| Chip — disabled (cite-muted) | same as variant, opacity `0.55`-ish | — | — |
| Row — cite-muted | opacity `0.55`-ish, `pointer-events: none`, `aria-disabled` | — | — |

**Design rule:** `doc` is deliberately pinned to the neutral color family (not `primary`)
as a stopgap so it reads distinctly from `trace`'s blue "information" family — there's no
dedicated "AI/document" semantic color in the theme yet.

---

## 5. Props

### `CitedFieldRow`

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `label` | `string` | — | Field name, left column |
| `value` | `React.ReactNode` | — | Renders em dash when null/undefined/empty |
| `isEditable` | `boolean` | `false` | Swaps `value` for `control` |
| `control` | `React.ReactNode` | — | Editable form control; ignored unless `isEditable` |
| `source` | `{ label, variant?: 'doc' \| 'trace', isActive?, accessibilityLabel? }` | — | No `source` = "ungrounded" row (muted label, no chip) |
| `isCiteMuted` | `boolean` | `false` | Dims row, disables chip, `aria-disabled` |
| `isCiteTarget` | `boolean` | `false` | Highlights row as active citation target |
| `validationState` | `'none' \| 'error' \| 'success'` | `'none'` | Pairs with `errorText`/`successText` |
| `errorText` / `successText` | `string` | — | Shown under value/control |
| `onCiteClick` | `(source) => void` | — | Fired on chip click only (never hover) |

### `CitedFieldRow.Header`

| Prop | Type | Default |
| --- | --- | --- |
| `fieldColumnLabel` | `string` | `'Field'` |
| `valueColumnLabel` | `string` | `'Value'` |
| `sourceColumnLabel` | `string` | `'Source'` |
| `isSourceColumnVisible` | `boolean` | `true` |

---

## 6. Use cases

### Documented today (11)

| # | Use case | What it shows |
| - | --- | --- |
| 1 | FieldTable | Multiple rows stacked into a field table |
| 2 | WithHeader | Rows grouped under `CitedFieldRow.Header` |
| 3 | MissingValue | No value → em dash |
| 4 | Ungrounded | No source → no chip, muted label |
| 5 | CiteMuted | Filtered-out/disabled row state |
| 6 | CiteTarget | Row highlighted as active citation target |
| 7 | ValidationError | Error state + error text |
| 8 | ValidationSuccess | Success state + success text + check icon |
| 9 | Editable | Inline-editable value |
| 10 | EditableValidationError | Editable + error combined |
| 11 | AllStates | Every state in one showcase |

### Gap — supported by code, no dedicated story (quick wins)

| # | Use case | Why it's missing |
| - | --- | --- |
| 12 | Trace source variant (standalone) | Only shown incidentally inside FieldTable/WithHeader |
| 13 | Active source chip (standalone) | Only shown buried inside CiteTarget |
| 14 | Hidden Source column (`isSourceColumnVisible={false}`) | No story at all |
| 15 | Long/overflowing value (truncation) | No story demonstrates it |
| 16 | Non-text value (e.g. a `Badge`/`Chip` as the value) | `value: React.ReactNode` supports it, unshown |
| 17 | Custom column labels | Only default labels shown |

### Gap — would need new capability (real feature work)

| # | Use case | What's missing |
| - | --- | --- |
| 18 | Multiple citations per field | `source` is a single object, not an array |
| 19 | Loading/skeleton state | No prop distinguishes "still extracting" from "missing" |
| 20 | Copy-to-clipboard on value | Not supported |

**Total: 11 shipped, 9 candidate additions (6 docs-only, 3 need new props).**
