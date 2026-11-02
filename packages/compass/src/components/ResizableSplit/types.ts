import type React from 'react';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';
import type { ResizableSplitHandleSize } from './handleSizeTokens';

type ResizableSplitOrientation = 'horizontal' | 'vertical';

type ResizableSplitProps = {
  /**
   * Exactly two `ResizableSplitPane` children - the first is the "start" pane (flexes to fill
   * remaining space), the second is the "end" pane (the one `width` controls). Order matters:
   * it also determines which pane is the ARIA separator's "primary" pane for Home/End (see
   * `minStartWidth`).
   */
  children: React.ReactNode;
  /**
   * End-pane size in pixels along the split axis (`width` when horizontal, height when vertical),
   * or `null` for the responsive default.
   */
  width: number | null;
  /**
   * Updates the end-pane size backing `width`. Called on every keyboard step, when a pointer
   * drag *commits* (pointer up), and with `null` when the handle is double-clicked or reset.
   */
  onWidthChange: (width: number | null) => void;
  /**
   * Fired when a drag or keyboard interaction completes. Prefer this for persisting size
   * (e.g. `localStorage`). Not called when `width` becomes `null`.
   */
  onResizeEnd?: (width: number) => void;
  /**
   * @default 'horizontal'
   */
  orientation?: ResizableSplitOrientation;
  /**
   * Preset handle hit target and grip scale. Overridden by explicit `handleWidth` when set.
   * @default 'medium'
   */
  handleSize?: ResizableSplitHandleSize;
  /**
   * Default end-pane size from container size along the split axis (width or height).
   * Takes precedence over `computeDefaultWidth` when provided.
   */
  computeDefaultSize?: (containerSize: number) => number;
  /**
   * Default end-pane width when `orientation="horizontal"` and `width` is `null`.
   * @default 40% of container width
   */
  computeDefaultWidth?: (containerWidth: number) => number;
  /**
   * Default end-pane height when `orientation="vertical"` and `width` is `null`.
   * @default 40% of container height
   */
  computeDefaultHeight?: (containerHeight: number) => number;
  /**
   * Minimum start-pane size (px) along the split axis.
   * @default 320
   */
  minStartWidth?: number;
  /**
   * Minimum end-pane size (px) along the split axis.
   * @default 320
   */
  minEndWidth?: number;
  /**
   * Handle track size (px) along the split axis. Overrides `handleSize` when set.
   */
  handleWidth?: number;
  /**
   * Arrow-key step size (px) per keypress on the handle.
   * @default 16
   */
  step?: number;
  accessibilityLabel: string;
} & TestID &
  DataAnalyticsAttribute;

type ResizableSplitPaneProps = {
  children: React.ReactNode;
} & TestID &
  DataAnalyticsAttribute;

export type {
  ResizableSplitProps,
  ResizableSplitPaneProps,
  ResizableSplitOrientation,
  ResizableSplitHandleSize,
};
