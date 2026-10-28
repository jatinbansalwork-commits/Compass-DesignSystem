# CitedFieldRow

A row component for displaying a labelled field value with an optional citation source chip. Used in customs entry forms and data review flows where the origin of a value needs to be traceable.

## Import

```tsx
import { CitedFieldRow } from '@klearnow/compass/components';
```

## Props

### `CitedFieldRow`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — (required) | Field name shown in the left column. |
| `value` | `React.ReactNode` | — | Field value in the right column. Empty, `null`, or `undefined` renders an em dash in muted text. |
| `isEditable` | `boolean` | `false` | When `true`, renders `control` instead of `value`. |
| `control` | `React.ReactNode` | — | Editable control (e.g. `TextInput`) when `isEditable` is `true`. Ignored otherwise. |
| `source` | `CitedFieldRowSource` | — | Citation metadata; renders a chip after the value. Omitted when ungrounded (no chip, muted label). Hidden while `isEditable` is `true`. |
| `isCiteMuted` | `boolean` | `false` | Dims the row and disables the citation chip (consumer-driven filter state). |
| `isCiteTarget` | `boolean` | `false` | Highlights the value cell when this row is the active citation target. |
| `validationState` | `'none' \| 'error' \| 'success'` | `'none'` | Validation styling and hint text for the value cell. |
| `errorText` | `string` | — | Message shown when `validationState` is `'error'`. |
| `successText` | `string` | — | Message shown when `validationState` is `'success'`. |
| `onCiteClick` | `(source: CitedFieldRowSource) => void` | — | Fired when the citation chip is clicked. |
| `testID` | `string` | — | Test identifier forwarded to the row root. |
| Styled props | `StyledPropsCompass` | — | Compass layout/styling props accepted by `Box` (margin, padding, etc.). |

### `CitedFieldRowSource`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — (required) | Visible chip label (e.g. `"BOL p1"`). |
| `variant` | `'doc' \| 'trace'` | `'doc'` | `doc`: document extraction (neutral chip). `trace`: Track & Trace (information/blue chip). |
| `isActive` | `boolean` | `false` | Filled chip when the cited source is currently on screen. |
| `accessibilityLabel` | `string` | — | Accessible name and tooltip; falls back to `label`. |

### `CitedFieldRow.Header`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `fieldColumnLabel` | `string` | `'Field'` | Header for the label column. |
| `valueColumnLabel` | `string` | `'Value'` | Header for the value column. |
| `sourceColumnLabel` | `string` | `'Source'` | Header aligned with citation chips. |
| `isSourceColumnVisible` | `boolean` | `true` | When `false`, hides the source column label. |
| `testID` | `string` | — | Test identifier for the header row. |
| Styled props | `StyledPropsCompass` | — | Compass layout/styling props. |

## Variants

Storybook recipes illustrate these states:

- **Default** — Playground row with document citation and column header.
- **FieldTable** — Multiple grounded rows (doc + trace variants).
- **WithHeader** — Card header plus column header and mixed grounded/ungrounded rows.
- **MissingValue** — Empty value renders em dash.
- **Ungrounded** — No `source`; muted label, no chip.
- **CiteMuted** — `isCiteMuted` dims a grounded row.
- **CiteTarget** — Active citation target styling on a row.
- **ValidationError** / **ValidationSuccess** — Feedback colors and hint text.
- **Editable** / **EditableValidationError** — In-place editing via `control`.
- **AllStates** — Combined modifiers with interactive chip selection.

## Accessibility

- Value cell uses `aria-invalid` when `validationState` is `'error'`.
- Validation hints use `aria-describedby` when error or success text is shown.
- Citation chip is a `<button>` with an accessible name (`accessibilityLabel` or `label`).
- Focus ring on the citation chip via `:focus-visible`.
- `isCiteMuted` sets `aria-disabled` on the row.

## Usage example

```tsx
<CitedFieldRow
  label="HTS Code"
  value="8471.30.0100"
  source={{ label: 'Invoice line 4' }}
  onCiteClick={(source) => openDocument(source)}
/>
```

## When to use

Use CitedFieldRow when displaying form field values that need a traceable source citation — customs entry data, extracted document values, AI-suggested field fills.

## When not to use

Do not use for simple read-only display without citation context — use `Text` or a plain layout instead.
