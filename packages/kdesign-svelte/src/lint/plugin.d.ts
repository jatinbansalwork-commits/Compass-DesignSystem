/** Options every `kdesign/*` rule takes (`["error", { … }]`). */
export interface KdesignLintOptions {
  /** Calls whose string arguments are class lists. @default ['cx', 'cn', 'clsx', 'classNames', 'twMerge'] */
  callees?: string[];
  /** Where an imported markup tag counts as a Kdesign component. @default ['@klearnow/kdesign-svelte/components'] */
  sources?: string[];
  /** Per component, class globs its `class` may also take: `{ Button: ['rounded-*'] }`. */
  allow?: Record<string, string[]>;
}

export interface KdesignLintFinding {
  ruleId:
    | 'no-conflicting-classes'
    | 'no-interpolated-classes'
    | 'no-unknown-kdesign-class'
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
  options?: KdesignLintOptions,
): KdesignLintFinding[];

/** The recommended severities, keyed `kdesign/<rule>`. */
export declare const recommended: Record<`kdesign/${KdesignLintFinding['ruleId']}`, 'error' | 'warn'>;

/** The plugin, ESLint-shaped: oxlint's `jsPlugins` and ESLint's flat config both load it. */
declare const plugin: {
  meta: { name: 'kdesign' };
  rules: Record<KdesignLintFinding['ruleId'], { meta: object; create(context: unknown): object }>;
};
export default plugin;
