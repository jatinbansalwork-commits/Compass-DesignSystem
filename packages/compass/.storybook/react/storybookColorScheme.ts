import type { ColorSchemeNamesInput } from '../../src/tokens/theme';
import { getColorScheme } from '../../src/utils/getColorScheme/getColorScheme.web';

type StorybookGlobals = Record<string, unknown>;

const readGlobalValue = (value: unknown): string | undefined => {
  if (typeof value === 'string') {
    return value;
  }

  if (value && typeof value === 'object' && 'value' in value) {
    const nested = (value as { value?: unknown }).value;
    return typeof nested === 'string' ? nested : undefined;
  }

  return undefined;
};

export const getColorSchemeFromGlobals = (
  globals: StorybookGlobals | undefined,
): ColorSchemeNamesInput => {
  const raw = readGlobalValue(globals?.colorScheme);
  if (raw === 'light' || raw === 'dark' || raw === 'system') {
    return raw;
  }
  return 'light';
};

export const getResolvedColorScheme = (globals: StorybookGlobals | undefined): 'light' | 'dark' =>
  getColorScheme(getColorSchemeFromGlobals(globals));
