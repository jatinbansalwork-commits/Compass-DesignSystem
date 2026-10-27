/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from 'react';

type PopupArrowProps = {
  /** Floating UI arrow context from `@floating-ui/react` (required for positioning). */
  context: any;
  /** Arrow width in pixels. */
  width: number;
  /** Arrow height in pixels. */
  height: number;
  /** SVG fill color for the arrow surface. */
  fillColor: string;
  /** Optional SVG stroke color. */
  strokeColor?: string;
  /** Optional SVG stroke width in pixels. */
  strokeWidth?: number;
  /** Optional inline styles merged onto the arrow element. */
  style?: React.CSSProperties;
};

export type { PopupArrowProps };
