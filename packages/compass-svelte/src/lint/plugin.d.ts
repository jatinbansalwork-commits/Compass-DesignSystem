/** Options every `blade/*` rule takes (`["error", { … }]`). */
export interface CompassLintOptions {
  /** Calls whose string arguments are class lists. @default ['cx', 'cn', 'clsx', 'classNames', 'twMerge'] */
  callees?: string[];
  /** Where an imported markup tag counts as a Compass component. @default ['@klearnow/compass-svelte/components'] */
  sources?: string[];
  /** Per component, class globs its `class` may also take: `{ Button: ['rounded-*'] }`. */
  allow?: Record<string, string[]>;
}

export interface CompassLintFinding {
  ruleId:
    | 'no-conflicting-classes'
    | 'no-interpolated-classes'
    | 'no-unknown-blade-class'
    | 'prefer-token'
    | 'no-restyle';
  message: string;
  line: number;
  column: number;
}

/**
 * Lints a `.svelte` file's classes (markup and scripts) without a linter:
 * for the components oxlint never hands to a plugin (no `<script>`).
 */
export function lintClasses(
  text: string,
  filename?: string,
  options?: CompassLintOptions,
): CompassLintFinding[];

/** The recommended severities, keyed `blade/<rule>`. */
export declare const recommended: Record<`blade/${CompassLintFinding['ruleId']}`, 'error' | 'warn'>;

/** The plugin, ESLint-shaped: oxlint's `jsPlugins` and ESLint's flat config both load it. */
declare const plugin: {
  meta: { name: 'blade' };
  rules: Record<CompassLintFinding['ruleId'], { meta: object; create(context: unknown): object }>;
};
export default plugin;
