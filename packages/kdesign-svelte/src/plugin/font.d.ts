export declare const FONT_FAMILY: 'kdesign-icons';

export interface FontGlyph {
  name: string;
  /** A Private Use Area codepoint. */
  code: number;
  /** The icon's markup. */
  svg: string;
}

/** Builds the `kdesign-icons` font; the same glyphs always give the same bytes. */
export declare function buildFont(glyphs: FontGlyph[]): Promise<{ ttf: Buffer; woff2: Buffer }>;
