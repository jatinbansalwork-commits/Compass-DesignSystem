import { describe, expect, it } from 'vitest';
import { compassTheme } from '~tokens/theme';
import { themeToCSSVariables, cssVariablesToInlineStyle } from '~utils/themeToCSSVariables';

describe('themeToCSSVariables', () => {
  const resolvedTheme = {
    colors: compassTheme.colors.onLight,
    elevation: compassTheme.elevation.onLight,
    border: compassTheme.border,
  };

  it('maps surface color tokens to theme.css variable names', () => {
    const vars = themeToCSSVariables(resolvedTheme);

    expect(vars['--surface-background-gray-subtle']).toBe(
      compassTheme.colors.onLight.surface.background.gray.subtle,
    );
    expect(vars['--surface-background-primary-intense']).toBe(
      compassTheme.colors.onLight.surface.background.primary.intense,
    );
    expect(vars['--interactive-background-primary-default']).toBe(
      compassTheme.colors.onLight.interactive.background.primary.default,
    );
  });

  it('normalizes onSea.onSubtle to --surface-text-on-sea-subtle', () => {
    const vars = themeToCSSVariables(resolvedTheme);

    expect(vars['--surface-text-on-sea-subtle']).toBe(
      compassTheme.colors.onLight.surface.text.onSea.onSubtle,
    );
    expect(vars['--surface-text-on-sea-on-subtle']).toBeUndefined();
  });

  it('maps elevation and border tokens with units', () => {
    const vars = themeToCSSVariables(resolvedTheme);

    expect(vars['--elevation-low-raised']).toBe(compassTheme.elevation.onLight.lowRaised);
    expect(vars['--border-radius-medium']).toBe(`${compassTheme.border.radius.medium}px`);
    expect(vars['--border-radius-round']).toBe(compassTheme.border.radius.round);
    expect(vars['--border-width-thin']).toBe(`${compassTheme.border.width.thin}px`);
  });

  it('maps resolved typography to theme.css font variables', () => {
    const vars = themeToCSSVariables({
      ...resolvedTheme,
      typography: compassTheme.typography.onDesktop,
    });

    expect(vars['--font-family-text']).toBe(compassTheme.typography.onDesktop.fonts.family.text);
    expect(vars['--font-size-200']).toBe(`${compassTheme.typography.onDesktop.fonts.size[200]}px`);
    expect(vars['--letter-spacing-25']).toBe(
      `${compassTheme.typography.onDesktop.letterSpacings[25]}%`,
    );
  });

  it('serializes variables to an inline style string', () => {
    const style = cssVariablesToInlineStyle({
      '--border-radius-medium': '16px',
      '--surface-background-primary-intense': 'hsla(160, 50%, 40%, 1)',
    });

    expect(style).toContain('--border-radius-medium:16px');
    expect(style).toContain('--surface-background-primary-intense:hsla(160, 50%, 40%, 1)');
  });
});
