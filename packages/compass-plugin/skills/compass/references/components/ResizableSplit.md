# ResizableSplit

A controlled two-pane split layout with a draggable separator between a flexing start pane and a fixed-width end pane. Typical for document viewer + form, list + map, or preview + settings.

## Import

```tsx
import { ResizableSplit, ResizableSplitPane } from '@klearnow/compass/components';
```

## Props

### `ResizableSplit`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `React.ReactNode` | — (required) | Exactly two `ResizableSplitPane` children: start pane first, end pane second. |
| `width` | `number \| null` | — (required) | End pane width in pixels, or `null` for responsive default from `computeDefaultWidth`. |
| `onWidthChange` | `(width: number \| null) => void` | — (required) | Called on drag/keyboard resize with clamped width; `null` on double-click/Enter reset. |
| `onResizeEnd` | `(width: number) => void` | — | Fired once when drag or keyboard step completes (persist width here). Not called on reset to `null`. |
| `computeDefaultWidth` | `(containerWidth: number) => number` | 40% of container | Default end-pane width when `width` is `null`. |
| `minStartWidth` | `number` | `320` | Minimum start pane width; Home key moves end pane to max (start at min). |
| `minEndWidth` | `number` | `320` | Minimum end pane width; End key moves end pane to min. |
| `handleWidth` | `number` | `12` | Separator column width in pixels (included in clamp math). |
| `step` | `number` | `16` | Arrow-key step size in pixels. |
| `accessibilityLabel` | `string` | — (required) | Accessible name for the separator handle (no visible label). |
| `testID` | `string` | — | Test identifier on the split root. |

### `ResizableSplitPane`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `React.ReactNode` | — (required) | Pane content. |
| `testID` | `string` | — | Test identifier on the pane wrapper. |

## Variants

Storybook recipes:

- **Default** — Document viewer + form panel with responsive default width.
- **WithCustomMinWidths** — Custom `minStartWidth` / `minEndWidth`.
- **WithExplicitWidth** — Controlled width restored from storage (e.g. 600px).
- **ListAndMap** — List + map with custom default ratio and min widths.

## Accessibility

- Handle uses `role="separator"`, `aria-orientation="horizontal"`, and `aria-valuenow` / `min` / `max` / `valuetext` on a 0–100 scale (APG separator pattern).
- Keyboard: Arrow Left/Right resize by `step`; Home/End jump to extremes; Enter or double-click resets to default (`width` → `null`).
- Handle is focusable (`tabIndex={0}`) with visible focus styling.

## Usage example

```tsx
const [width, setWidth] = useState<number | null>(null);

<ResizableSplit
  width={width}
  onWidthChange={setWidth}
  onResizeEnd={(w) => localStorage.setItem('panelWidth', String(w))}
  accessibilityLabel="Resize list and detail panels"
>
  <ResizableSplitPane>{/* start */}</ResizableSplitPane>
  <ResizableSplitPane>{/* end */}</ResizableSplitPane>
</ResizableSplit>
```

## When to use

Use when two adjacent panels need user-controlled width and you can own persisted `width` state (e.g. localStorage).

## When not to use

Do not use for simple side-by-side layouts without resize — use `Box` grid/flex. On React Native, the component stacks panes vertically (no drag) until a native gesture implementation exists.
