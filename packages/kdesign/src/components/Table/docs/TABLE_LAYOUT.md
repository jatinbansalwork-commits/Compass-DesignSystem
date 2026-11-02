# Table — layout, icons, and spacing

Single source of truth for table chrome lives in `../tokens.ts`. Do not hardcode `spacing.*` / icon sizes in Table subcomponents or stories unless documenting an exception.

## Band height (36px)

| Band | Token / constant |
| ----- | ----------------- |
| Header label row | `TABLE_HEADER_COMPACT_ROW_HEIGHT_PX` (`headerLayoutConstants.ts`) |
| Header filter row | Same |
| Toolbar row | `tableToolbar.minHeight` → `compactHeaderBandRowHeight` (= 36px) |

Toolbar vertical padding is `spacing.2` so `size="small"` (32px) controls fit the 36px band.

## Icons & controls (`tableIcons`)

| Use case | Size token | Value |
| -------- | ----------- | ----- |
| Toolbar search (collapsed), Filters, Columns, Reorder, Export | `tableIcons.control` | `small` (32px) |
| Header filter clear, column info (`TableHeaderTitleWithInfo`) | `tableIcons.control` | `small` |
| Row hover ghost icons | `tableIcons.rowHover` | `small` |
| Row hover text button (e.g. “View entry”) | `tableIcons.rowHoverTextButton` | `xsmall` |

Header sort affordance: `tableHeaderBand.sortIconSizePx` (20px SVG) + `sortHitAreaPadding` (`spacing.1`) with matching negative margin on the sort button.

## Header band (`tableHeaderBand`)

| Token | Value | Used for |
| ----- | ----- | -------- |
| `cellPaddingX` | `spacing.3` | Label row `TableHeaderCell` horizontal padding |
| `filterCellInsetX` | `spacing.2` | Filter row flush inputs (`marginX` on wrapper) |
| `sortIconGap` | `spacing.2` | Label ↔ sort icon |
| `titleInfoGap` | `spacing.1` | Title ↔ info icon |

Filter inputs: `BaseInput` / `SelectInput` with `size="small"` and `isTableInputCell`.

## Toolbar (`tableToolbar`)

| Token | Value |
| ----- | ----- |
| `padding` | `spacing.2` vertical; horizontal `tableHeaderBand.cellPaddingX` (`spacing.3`) on both sides |
| Wide tables | Toolbar wrapper uses `width: max-content; min-width: 100%` (same as the grid) so actions align with the table’s right edge |
| `titleBlockGap` | `spacing.3` |
| `actionsGap` / `childActionsGap` | `spacing.2` |
| Search widths | `searchMinWidth`, `searchDefaultWidth`, `searchMaxWidth`, collapsible variants |

## Row hover rail (`tableHoverActions`)

| Token | Value |
| ----- | ----- |
| `gap` | `spacing.2` |
| `paddingLeft` | `spacing.3` (base), `spacing.5` (m+) |
| `paddingRight` | `spacing.3` |

## Body cells (`tableRow`)

Horizontal padding remains `spacing.4` for compact / normal / comfortable body rows. Editable cell inset uses `spacing.2` (compact/normal) via `TableEditableCell`.

## Maintainers

When changing Figma spacing for tables, update `tokens.ts` first, then run Storybook **All use cases** and **Design stress test**.
