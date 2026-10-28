<br/>

<p align="center">
  <a href="https://design.klearnow.com"><strong>Compass Design System</strong></a>
</p>

<br/>

<p align="center">
  <a href="https://npmjs.org/package/@klearnow/compass-svelte"><img alt="Compass Svelte Version" src="https://img.shields.io/github/package-json/v/klearnow/compass?style=for-the-badge&labelColor=322&logo=npm&label=@klearnow/compass-svelte&color=darkred&filename=packages%2Fcompass-svelte%2Fpackage.json"></a> &nbsp;<a href="https://design.klearnow.com/"><img alt="Documentation design.klearnow.com" src="https://img.shields.io/badge/Documentation-design.klearnow.com-0648EF?style=for-the-badge&labelColor=0012AD&logo=readthedocs&logoColor=eee"/></a> &nbsp;<a href="https://github.com/klearnow/compass/tree/master/CONTRIBUTING.md"><img alt="Contributions Open" src="https://img.shields.io/badge/Contributions-Open-333333?style=for-the-badge&logo=github&logoColor=ffffff&labelColor=111111"/></a></p>

<h1 aria-hidden="true"></h1>

<br/>

Compass is the Design System that powers [Klearnow](https://klearnow.ai/). This package provides Compass components for [Svelte](https://svelte.dev/) applications.

## 🔗 Links

- [Docs](https://design.klearnow.com)
- [GitHub](https://github.com/klearnow/compass)
- [@klearnow/compass](https://github.com/klearnow/compass/tree/master/packages/compass) (React version)

## ✨ Features

- Built for **Svelte 5** with native runes and modern reactivity
- Uses **CSS Variables** for theming via `@klearnow/compass-core`
- Shares design tokens with React Compass via `@klearnow/compass-core`
- TypeScript support out of the box
- [White Labelling](https://design.klearnow.com/?path=/docs/guides-theming-theme-playground--docs)

## 📦 Installation

### Prerequisites

Before you install the package, make sure that you have:

- Node.js version >= 18.12.1
- Svelte version >= 5.56.10
- UnoCSS version >= 66

### Install the package

`svelte`, `unocss` and `@klearnow/i18nify-js` are peer dependencies, so install them with it:

```bash
# Using yarn
yarn add @klearnow/compass-svelte svelte unocss @klearnow/i18nify-js

# Using npm
npm install @klearnow/compass-svelte svelte unocss @klearnow/i18nify-js
```

> **Note:** `@klearnow/compass-core` (design tokens, CSS styles, and fonts) is automatically installed as a dependency. `@klearnow/i18nify-js` (>= 1.12.8) is a required peer dependency: Amount formats with it and PhoneNumberInput takes its dial codes, flags and number formats from it.

### Entry points

| Import                                                    | What                                  |
| --------------------------------------------------------- | ------------------------------------- |
| `@klearnow/compass-svelte/components`                       | The components, the overlays included |
| `@klearnow/compass-svelte/icons`                            | Compass's icons, as data (`IconSource`) |
| `@klearnow/compass-svelte/configs/uno`                      | The UnoCSS preset (`bladeUnoConfig`)  |
| `@klearnow/compass-svelte/configs/vite`, `/configs/webpack` | The icon-font plugin                  |
| `@klearnow/compass-svelte/configs/lint`                     | Class lint rules, for oxlint or ESLint |
| `@klearnow/compass-svelte/compass.css`                        | The fonts and base styles             |

### cx: compile Compass's CSS in your app

`@klearnow/compass-svelte/components` (cx) ships no prebuilt stylesheet: your build compiles
it with UnoCSS (`unocss` is a peer dependency) from Compass's config, so the
options you pass reach the output.

```ts
// uno.config.ts
import bladeUnoConfig from '@klearnow/compass-svelte/configs/uno';

export default {
  ...bladeUnoConfig({ desktop: '62.5rem' }), // the default
  // The bundled modules, Compass's `styles.ts` maps included: only the
  // components you import reach the CSS.
  content: { pipeline: { include: [/\.(svelte|[jt]s)($|\?)/] } },
};
```

Emit it with the UnoCSS plugin your bundler uses (`unocss/vite` on Vite 8,
`@unocss/webpack`). With `@unocss/postcss` and a `@unocss;` directive
instead, UnoCSS scans files: list Compass's source in `content.filesystem`
(`./node_modules/@klearnow/compass-svelte/src/**/*.{ts,svelte}`), which the
bundler plugins skip. Import Compass's plain stylesheet beside it:

```ts
import '@klearnow/compass-svelte/compass.css'; // opacity-blade-*; Tasa, Inter (woff2)
```

Compass sets no page defaults beyond a border reset: set the base font, the
box model and `font: inherit` on form controls in your app's CSS, or field
values and amounts fall back to the browser's serif (see
`packages/examples/svelte-app/src/app.css`).

Components are mobile first; their desktop styles are `d:` classes, and
`max-d:` is below it. Your markup uses the same variants.

#### Your own classes, without Tailwind

Pass your `tailwind.config.js` theme and Compass also generates Tailwind v3's
utilities from it, in one pass over your files and Compass's: colours with
`/50` and `*-opacity-*`, type, borders, shadows, rings, gradients, filters,
animations, `@apply`, and Tailwind's preflight reset. (`theme()` in a class or
in CSS is not read: write the value, `[--rim:hsl(var(--cta))]`.)

```ts
export default {
  ...bladeUnoConfig({
    desktop: '62.5rem',
    // tailwind.config.js's `theme`: keys replace Tailwind's defaults,
    // `extend` merges into them, a key may be a function of `theme()`.
    theme: {
      colors: { primary: { DEFAULT: 'hsl(var(--primary) / <alpha-value>)' } },
      fontSize: { sm: ['0.75rem', { lineHeight: '1rem' }] },
      extend: { spacing: { 19: '4.75rem' } },
    },
    presets: [{ theme: { extend: { boxShadow: { card: '…' } } } }],
    // addVariant's strings
    variants: { 'quick-buy': '[data-quick-buy="true"] &' },
    preflight: true, // the default with a theme
  }),
  content: { pipeline: { include: [/\.(svelte|[jt]s)($|\?)/] } },
};
```

- The defaults are Tailwind v3.4's scales, without its colour palette or
  breakpoints: name your colours; `d:` is the breakpoint.
- A class both define (`rounded-none`, `mx-auto`, `shadow-card`) is written
  once, as Compass defines it, at Tailwind's place in the stylesheet, so it
  wins and loses against your other classes as it did under Tailwind.
- The font classes are the exception: `font-normal`…`font-bold`, `font-sans`
  and `font-mono` are Compass's weights and faces (Inter, Menlo) until your
  theme sets the same key (`fontFamily.sans`, `fontWeight.medium`…); then
  yours wins, and Compass's text follows it.
- Transforms and filters compose through Compass's variables (`--blade-*`), so
  `grayscale brightness-0` keeps both.
- The preflight and Compass's resets are the `base` layer: `@unocss base;` puts
  them apart (in a cascade layer), `@unocss !base;` emits the rest.

#### Theming with CSS variables

Compass's colours and faces read compass-core's token variables, their light mode
values as the fallback, so nothing changes until you set one:

```css
.bg-interactive-primary-default {
  background-color: var(--interactive-background-primary-default, hsla(218, 89%, 51%, 1));
}
```

Set them anywhere up the tree (`:root`, a container) to theme the components
under it:

```css
:root {
  --interactive-background-primary-default: hsl(330 80% 45%);
  --interactive-text-on-primary-normal: #fff;
  --font-family-text: Georgia, serif;
}
```

| Variables                                                           |                                          |
| ------------------------------------------------------------------- | ---------------------------------------- |
| `--surface-{background,border,text,icon}-…`                         | 13, 5, 17, 17                            |
| `--feedback-{background,border,text,icon}-…`                        | 10 each                                  |
| `--interactive-{background,border,text,icon}-…`                     | 49, 38, 44, 44                           |
| `--popup-{background,border}-…`                                     | 8 each                                   |
| `--overlay-background-…`                                            | 2                                        |
| `--font-family-text`, `--font-family-heading`, `--font-family-code` | `font-sans`, `font-heading`, `font-mono` |

The full list of 285 colour variables is the snapshot of
`src/test/theme-variables.test.ts`. Composed values follow them too: a
button's frame and focus ring, `surface-raised`, the skeleton. `--data-*`
(charts) and the white and black bevels, sheens and elevation shadows stay
fixed. For a brand colour on primary buttons, compass-core's
`getPrimaryBrandCssVars({ bg })` (`@klearnow/compass-core/styles`) returns the
five fill and frame variables.

compass-core's `theme.css` (below) sets every variable to the _standard_ theme's
values, which the cx components already fall back to: there is no need to
import it. (It also sets the four tokens the standard theme leaves
`transparent`, which the components fall back to the neutral theme's for.)

### Overlays

`/components` exports one overlay per shape, each its own component over the
same runes (`createOverlay`: the layer stack, focus, Escape, back,
presence): `Modal` (the centred dialog), `BottomSheet`, `Drawer` (`side`),
`Popover` and `Menu`. Modal, BottomSheet and Drawer open from a bound
`isOpen`; Popover and Menu also from their trigger (`children`). Each
reports `onOpenChange` (the opens and closes it makes itself, not the
owner's `isOpen`), and all but Menu take `initialFocusRef`. There is no base component: an app's own overlay (one
that switches by screen, say) composes these.

CompassProvider renders the overlay host (the one scrim, the box modals
mount in, and a polite live region) after its content, in the nearest
positioned ancestor: put it inside the frame overlays must stay within. The
outermost provider hosts every overlay on the page. Toasts are the app's to
render, as in React: a `<ToastContainer />` inside the provider shows the
page's queue (what `showToast` adds to) and moves its toasts into the host; without one, no toast code ships. An app's back handler asks the open overlays first: `back()` returns
whether one handled it. Toasts are data: `showToast(toast, { cancelled })` returns a promise of
why the toast left, and `cancelled` resolving dismisses it. `cancelled` is a
plain `Promise<void>`, never an `AbortSignal` (older engines have none, and
a signal can't cross a bridge to a native host): `createCancel()` makes one
(`{ cancelled, cancel(), isCancelled }`). An overlay's panel
sets `--overlay-gutter` per layout (20px on a modal or a drawer, 16px on a
sheet, a popover or a menu; unset outside one): content on a bare body
pads its own rows by it (`px-[var(--overlay-gutter,0px)]`, ActionList's
`inset="overlay"`). A modal goes anywhere in the host through
`classes`: `<Modal classes={{ root: 'items-start justify-end p-6' }}>` sits
top right.

### Adapters

CompassProvider's `adapters` are the app's services. They are live: a
component reads them through getters, so an adapter the app swaps reaches
what is already mounted. An adapter left out is the enclosing provider's; `null` unsets it for the
subtree.

| Adapter            | What it does                                                                                                  |
| ------------------ | ------------------------------------------------------------------------------------------------------------- |
| `track`            | Analytics events; `field_change` sends `{ name }` only                                                        |
| `navigate`         | The app's router: every `href` (Link, a link Button, Card, a link row or tab) offers it plain internal clicks |
| `vibrate`          | Told what a press meant: `press`, `select` (Radio, Chip), `toggle` (Checkbox, Switch), `warning`              |
| `announce`         | Says a message politely; defaults to the host's live region (a Button starting and stopping loading)          |
| `locale`           | Amount's locale; i18nify's global state is the fallback                                                       |
| `form`             | The app's form (`FormAdapter`), below                                                                         |
| `presentDropdown`  | Shows a library dropdown (PhoneNumberInput's countries) the app's own way                                     |
| `readOTP`          | Reads a one-time code for OTPInput (an SMS retriever, WebOTP); cancelled on unmount, disable or a user edit; asked again when the owner resets `value` to `''` |
| `reportError`     | Errors the components catch                                                                                   |

Components pass `data-analytics-*` props to their element, as React's (a
toast takes them in `showToast`'s options).

### What the app brings

Compass ships UI parts. The headless hosts and flows around them are the app's,
and builds them on Compass's public entries: `/components`, and `/runes`,
the small set of runes an app composes its own hosts on (the layer stack,
`defineContext`, the presence timings, `phoneDigits`, `isPromise`), not
the whole runes layer:

| The app's                                                                                                      | What Compass gives it                                                                                                                                                  |
| -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| An opener (overlays opened from code, rendered by the app)                                                     | The overlay host CompassProvider renders, `ToastContainer` (`showToast`), back (`back()`), and `presentDropdown` to show a library dropdown its own way      |
| A form                                                                                                         | `adapters.form` (`FormAdapter`): what fields register with (a `FieldRecord` with its `element()` and `reveal()`) and show errors from, and what submit buttons submit |
| Its own composed components (an overlay that switches by screen, a searchable list, navigation, async content) | The parts they compose; provider defaults extend to them (`ComponentStyleProps` is an interface)                                                                     |

Compass is web only: a native renderer brings its own `.native.svelte` twins,
over the same classes.

Modal, BottomSheet and Drawer compose their content from Compass React's parts
— `ModalHeader`, `ModalBody`, `ModalFooter`, `BottomSheetHeader`, …,
`DrawerFooter` — each over its own classes, exported apart
(`resolveModalHeader()`, …) for a header of your own, wired by
`useModalHeader()`:

```svelte
<Modal bind:isOpen>
  <ModalHeader title="Remove card?" subtitle="Ending 1111" />
  <ModalBody>The card will be removed from this device.</ModalBody>
  <ModalFooter><Button color="negative">Remove</Button></ModalFooter>
</Modal>
```

### Lint the classes you write

`@klearnow/compass-svelte/configs/lint` is an ESLint-shaped plugin, `blade`, that
oxlint loads through `jsPlugins` and ESLint through its flat config:

```jsonc
// .oxlintrc.json
"jsPlugins": ["@klearnow/compass-svelte/configs/lint"],
"rules": {
  "blade/no-conflicting-classes": "error",
  "blade/no-interpolated-classes": "error",
  "blade/no-unknown-blade-class": "error",
  "blade/no-restyle": "error",
  "blade/prefer-token": "warn"
}
```

| Rule                      | Flags                                                                                                     |
| ------------------------- | --------------------------------------------------------------------------------------------------------- |
| `no-conflicting-classes`  | Two classes in one list that set one property (`px-2 px-4`): `cx` joins, it doesn't merge                  |
| `no-interpolated-classes` | A class built from pieces (`bg-${tone}`, `class="bg-{tone}"`), which no generator sees                     |
| `no-unknown-blade-class`  | A class in Compass's vocabulary that Compass doesn't define (`bg-surface-gray-mutd`); an app's own are left be |
| `prefer-token`            | An arbitrary length that is a spacing token (`p-[16px]` → `p-blade-5`)                                    |
| `no-restyle`              | A Compass component's `class` that restyles it rather than placing it                                       |

`no-restyle` is what `styleOverride` was: a Compass component's `class` places
it — margin, size, its part in a flex or grid parent, position, `hidden` —
or repoints a token (`[--interactive-background-primary-default:…]`); its
look is its props. Typography also takes its alignment, and Skeleton its
radius. An app widens it per component with class globs:
`["error", { "allow": { "Button": ["rounded-*"] } }]`. Every rule takes
`callees` (class calls, default `cx`, `cn`, `clsx`, `classNames`,
`twMerge`) and `sources` (where a tag counts as Compass's, default
`@klearnow/compass-svelte/components`).

oxlint hands a plugin only a `.svelte` file's `<script>`, so the rules read
the markup from disk; their reports sit on the script's first line with the
real `[line:col]` in the message. A component with no `<script>` never
reaches a plugin: `lintClasses(text, filename)` lints one directly.


<h1 aria-hidden="true"></h1>

<p align="center">Interested in working with us? Checkout our <a href="https://klearnow.ai/careers">Jobs Page</a> for open roles 🤗</p>
