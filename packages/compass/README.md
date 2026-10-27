<br/>
<p align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/klearnow/compass/refs/heads/master/branding/compass-original-dark-mode.min.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/klearnow/compass/refs/heads/master/branding/compass-original.min.svg">
  <img width="450px" alt="Compass Design System Logo" src="https://raw.githubusercontent.com/klearnow/compass/refs/heads/master/branding/compass-original.min.svg">
</picture>
</p>

<br/>

<p align="center">
  <a href="https://npmjs.org/package/@klearnow/compass"><img alt="Compass Latest Version" src="https://img.shields.io/npm/v/@klearnow/compass?style=for-the-badge&labelColor=322&logo=npm&label=@klearnow/compass&color=darkred"></a> &nbsp;<a href="https://design.klearnow.com/"><img alt="Documentation design.klearnow.com" src="https://img.shields.io/badge/Documentation-design.klearnow.com-0648EF?style=for-the-badge&labelColor=0012AD&logo=readthedocs&logoColor=eee"/></a> &nbsp;<a href="https://github.com/klearnow/compass/tree/master/CONTRIBUTING.md"><img alt="Contributions" src="https://img.shields.io/badge/Contributions-Open-333333?style=for-the-badge&logo=github&logoColor=ffffff&labelColor=111111"/></a></p>

<h1 aria-hidden="true"></h1>

<br/>

Compass is the design system for [Klearnow](https://klearnow.ai/) products.

## 🔗 Links

- [Docs](https://design.klearnow.com)
- [Installation](https://design.klearnow.com/?path=/docs/guides-installation--docs)

## 📦 Using the library in an app

### Install

Install the package and its peer dependencies (React 18+, `styled-components` 5, and web animation peers such as `framer-motion` as listed in `package.json`):

```bash
yarn add @klearnow/compass styled-components framer-motion
```

For React Native, also install the optional native peers (`react-native-reanimated`, `react-native-gesture-handler`, etc.) documented under `peerDependencies`.

### Import components and tokens

Use the published export map only (avoid deep imports into `build/lib/...` paths, which are internal and may change):

```tsx
import { Button, CompassProvider } from '@klearnow/compass/components';
import { compassTheme } from '@klearnow/compass/tokens';
```

### Styles and fonts

Compass styles components with **styled-components** and theme tokens—not SCSS modules. Load Inter (and optional brand fonts) in your app:

```tsx
import '@klearnow/compass/fonts.css';
```

Wrap your app with `CompassProvider`, passing `themeTokens` and an optional `colorScheme` (`light` | `dark` | `system`).

### Theming

- Default tokens: `compassTheme` from `@klearnow/compass/tokens`.
- Custom brand colors: use `createTheme` from the tokens package (see Storybook **Tokens** docs).
- `colorScheme` on `CompassProvider` switches `onLight` / `onDark` token surfaces.

### Accessibility

Components target WCAG-oriented patterns (focus rings, roles, keyboard support) where documented per component in Storybook. You are still responsible for page-level structure (landmarks, headings), live regions for async updates, and verifying contrast when overriding tokens or placing components on non-default backgrounds.

### Bundle size

Compass is built with **Rollup** using **`treeshake: false`** on each library entry (`components`, `tokens`, `utils`). Rollup bundles those entries separately, so cross-entry imports are invisible to the tree-shaker; disabling shake avoids dropping bindings that are still required at runtime (see comments in `rollup.config.mjs`).

**Trade-off:** published `build/lib/**` chunks are larger than a fully shaken graph; **your app bundler** (Webpack, Vite, etc.) should tree-shake when you import only what you use.

**Recommendation:** import from the documented export map only (`@klearnow/compass/components`, `/tokens`, `/utils`) and avoid deep paths under `build/lib/…`.

## ✨ Features

- Cross-Platform (React Web and React Native)
- White labelling and theming
- Accessible components
- Documented [API decisions](./src/components/Alert/_decisions/decisions.md)

<h1 aria-hidden="true"></h1>

<p align="center">Interested in working with us? See <a href="https://klearnow.ai/careers">Klearnow careers</a>.</p>
