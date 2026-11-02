import type React from 'react';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';

type ResizableSplitProps = {
  /**
   * Exactly two `ResizableSplitPane` children - the first is the "start" pane (flexes to fill
   * remaining space), the second is the "end" pane (the one `width` controls). Order matters:
   * it also determines which pane is the ARIA separator's "primary" pane for Home/End (see
   * `minStartWidth`).
   */
  children: React.ReactNode;
  /**
   * The end pane's current width in pixels, or `null` to use the responsive default (see
   * `computeDefaultWidth`). This component doesn't persist the value itself - the consumer owns
   * storing/reading it (e.g. to `localStorage`), matching `onWidthChange`/`onResizeEnd` below.
   */
  width: number | null;
  /**
   * Updates the end-pane width backing `width`. Called on every keyboard step, when a pointer
   * drag *commits* (pointer up), and with `null` when the handle is double-clicked or reset.
   * Pointer drags do not call this on every move — the split applies visual updates
   * imperatively until release to avoid re-rendering heavy pane content each frame.
   */
  onWidthChange: (width: number | null) => void;
  /**
   * Fired when a drag or keyboard interaction completes — pointer up after a drag, or after a
   * single keyboard step. Prefer this for persisting width (e.g. `localStorage`). Not called
   * when `width` becomes `null` (double-click reset).
   */
  onResizeEnd?: (width: number) => void;
  /**
   * Computes the end pane's default width (px) from the split container's current total width,
   * used whenever `width` is `null`. Tracked via `ResizeObserver`, so it reacts to the container
   * resizing, not just the window. If omitted, defaults to a flat 40% of the container width.
   */
  computeDefaultWidth?: (containerWidth: number) => number;
  /**
   * Minimum width (px) the start pane is ever clamped to. Also the width the start pane is given
   * when Home is pressed on the handle (see the ARIA separator's "primary pane smallest size"
   * behavior) - the start pane is treated as the separator's primary pane.
   * @default 320
   */
  minStartWidth?: number;
  /**
   * Minimum width (px) the end pane is ever clamped to - also the width given to the end pane
   * when End is pressed on the handle.
   * @default 320
   */
  minEndWidth?: number;
  /**
   * Width (px) of the draggable handle column between the panes. Included in the clamping math
   * so the start pane never drops below `minStartWidth` purely because the handle's own width
   * ate the space.
   * @default 12
   */
  handleWidth?: number;
  /**
   * Arrow-key step size (px) per keypress on the handle.
   * @default 16
   */
  step?: number;
  /**
   * Accessible label for the handle (`role="separator"`). Required, since there's no visible text
   * label a `aria-labelledby` could point to by default.
   */
  accessibilityLabel: string;
} & TestID &
  DataAnalyticsAttribute;

type ResizableSplitPaneProps = {
  /** Pane content — first child is the start (flex) pane, second is the end (sized) pane. */
  children: React.ReactNode;
} & TestID &
  DataAnalyticsAttribute;

export type { ResizableSplitProps, ResizableSplitPaneProps };
