# White Labelling - createTheme

You may want to use Compass with brands other than Klearnow.

To make this possible, Compass allows you to customize the theme of the components to match your brand with the `createTheme` function.

## API Reference

### `createTheme()`:

> Returns a `ThemeTokens` object that can be passed to `themeTokens` prop of `CompassProvider` to customize the branding of all components.

`createTheme()` accepts an object with the following keys:

#### `brandColor`:

- This is the primary color of your brand.
- `createTheme` will generate a color palatte using this brand color which will then be used across Compass components to match your brand.
- You can pass any valid CSS color value (rgb, hex or hsl) format to this key.

## Usage

If your application has multiple `CompassProvider` components, you can pass the `brandColor` to each of them to customize the branding of the components inside them.

```jsx
import { createTheme } from '@klearnow/compass/tokens';

const { theme: customThemeTokens } = createTheme({
  brandColor: '#83003D', // 'rgba(131, 0, 61)', 'hsl(332, 100%, 26%)' are also valid values
});

const Wrapper = () => {
  return (
    <CompassProvider themeTokens={customThemeTokens}>
      <App />
    </CompassProvider>
  );
};
```

### Light & Dark theme support

Custom branded themes also contain support for light and dark color schemes. You can pass the `colorScheme` prop to `CompassProvider` to switch between light and dark color schemes.

```jsx
// or colorScheme="light"
<CompassProvider themeTokens={customThemeTokens} colorScheme="dark">
  <App />
</CompassProvider>
```
