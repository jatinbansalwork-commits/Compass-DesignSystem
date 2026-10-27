import { renderHook } from '@testing-library/react-hooks';
import { getMemoDependency, useMemoizedStyles } from '../BaseBox/useMemoizedStyles';
import compassLightTheme from '~components/CompassProvider/__tests__/compassLightTheme/compassLightTheme.web';
import { CompassProvider } from '~components/CompassProvider';
import { compassTheme } from '~tokens/theme';

const CompassThemeProvider = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  return (
    <CompassProvider themeTokens={compassTheme} colorScheme="light">
      {children}
    </CompassProvider>
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
        theme: { name: 'compassTheme', something: 'something' },
        colorScheme: 'light',
      }),
    ).toMatchInlineSnapshot(`"{"paddingLeft":"12px","display":"block"}-compassTheme-light"`);
  });
});

describe('useMemoizedStyles', () => {
  it('should return correct CSS styles', () => {
    const { result } = renderHook(
      () =>
        useMemoizedStyles({
          padding: 'spacing.10',
          margin: ['spacing.1', 'spacing.2'],
          theme: compassLightTheme,
        }),
      {
        wrapper: CompassThemeProvider,
      },
    );

    expect(JSON.stringify(result.current)).toMatchInlineSnapshot(
      `"{"padding":"48px","margin":"2px 4px"}"`,
    );
  });
});
