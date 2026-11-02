import { renderHook } from '@testing-library/react-hooks';
import { getMemoDependency, useMemoizedStyles } from '../BaseBox/useMemoizedStyles';
import kdesignLightTheme from '~components/KdesignProvider/__tests__/kdesignLightTheme/kdesignLightTheme.web';
import { KdesignProvider } from '~components/KdesignProvider';
import { kdesignTheme } from '~tokens/theme';

const KdesignThemeProvider = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  return (
    <KdesignProvider themeTokens={kdesignTheme} colorScheme="light">
      {children}
    </KdesignProvider>
  );
};

describe('getDependencyProp', () => {
  it('should return react usememo dependency prop', () => {
    expect(
      getMemoDependency({
        paddingLeft: '12px',
        display: 'block',
        id: 'yo',
        className: 'hi',
        children: 'wuuhuuu',
        // @ts-expect-error: we don't have to care about actual theme object. It is ignored in this function
        theme: { name: 'kdesignTheme', something: 'something' },
        colorScheme: 'light',
      }),
    ).toMatchInlineSnapshot(`"{"paddingLeft":"12px","display":"block"}-kdesignTheme-light"`);
  });
});

describe('useMemoizedStyles', () => {
  it('should return correct CSS styles', () => {
    const { result } = renderHook(
      () =>
        useMemoizedStyles({
          padding: 'spacing.10',
          margin: ['spacing.1', 'spacing.2'],
          theme: kdesignLightTheme,
        }),
      {
        wrapper: KdesignThemeProvider,
      },
    );

    expect(JSON.stringify(result.current)).toMatchInlineSnapshot(
      `"{"padding":"48px","margin":"2px 4px"}"`,
    );
  });
});
