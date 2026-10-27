import overrideTheme from '../overrideTheme';
import { compassTheme } from '../';
import type { ThemeTokens } from '../../theme';
import cloneDeep from '~utils/lodashButBetter/cloneDeep';

const invalidOverridesObjectError = '[Compass: overrideTheme]: The overrides object is not valid';
const invalidBaseThemeError =
  '[Compass: overrideTheme]: The base theme provided is not a valid Compass theme';

describe('overrideTheme', () => {
  it('should return new theme based on overrides for compassTheme', () => {
    const overrides = {
      colors: {
        onLight: {
          surface: {
            background: {
              primary: {
                intense: 'someothercolor',
              },
            },
          },
          feedback: {
            background: {
              positive: {
                intense: 'someothercolor',
              },
            },
          },
        },
      },
    };

    const overridenTheme: ThemeTokens = cloneDeep(compassTheme);
    overridenTheme.colors.onLight.surface.background.primary.intense =
      overrides.colors.onLight.surface.background.primary.intense;
    overridenTheme.colors.onLight.feedback.background.positive.intense =
      overrides.colors.onLight.feedback.background.positive.intense;

    const overrideThemeResult = overrideTheme({ baseThemeTokens: compassTheme, overrides });
    expect(overrideThemeResult).toEqual(overridenTheme);
  });

  it('should return new theme based on overrides for bankingTheme', () => {
    const overrides = {
      colors: {
        onLight: {
          surface: {
            background: {
              primary: {
                intense: 'someothercolor',
              },
            },
          },
          feedback: {
            background: {
              positive: {
                intense: 'someothercolor',
              },
            },
          },
        },
      },
    };

    const overridenTheme: ThemeTokens = cloneDeep(compassTheme);
    overridenTheme.colors.onLight.surface.background.primary.intense =
      overrides.colors.onLight.surface.background.primary.intense;
    overridenTheme.colors.onLight.feedback.background.positive.intense =
      overrides.colors.onLight.feedback.background.positive.intense;

    const overrideThemeResult = overrideTheme({ baseThemeTokens: compassTheme, overrides });
    expect(overrideThemeResult).toEqual(overridenTheme);
  });

  it('should throw error when overrides object is invalid', () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
    const overrides = {
      colors: {
        onLight: {
          surface: {
            background: {
              primary: {
                // this will fail test since empty values are not allowed
                intense: '',
              },
            },
          },
          feedback: {
            background: {
              positive: {
                intense: 'someothercolor',
              },
            },
          },
        },
      },
    };

    expect(() => {
      overrideTheme({
        baseThemeTokens: compassTheme,
        overrides,
      });
    }).toThrowError(invalidOverridesObjectError);
    mockConsoleError.mockRestore();
  });

  it('should throw error when base theme is invalid', () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
    const invalidBaseTheme = {
      colors: {
        onLight: {
          surface: {
            background: {
              primary: {
                // this will fail test since empty values are not allowed
                intense: '',
              },
            },
          },
          feedback: {
            background: {
              positive: {
                intense: 'someothercolor',
              },
            },
          },
        },
      },
    };

    expect(() => {
      overrideTheme({
        // @ts-expect-error test the invalid base theme case
        baseThemeTokens: invalidBaseTheme,
        overrides: invalidBaseTheme,
      });
    }).toThrowError(invalidBaseThemeError);
    mockConsoleError.mockRestore();
  });
});
