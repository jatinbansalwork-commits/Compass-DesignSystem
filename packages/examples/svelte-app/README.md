# klear360-svelte example app

A Vite 8 + Svelte 5 checkout screen on `@klearnow/klear360-svelte`, set up the
way an app uses Klear360, with a bundle report.

```sh
npm install        # links the package from ../../klear360-svelte
npm run dev        # http://localhost:5173
npm run build      # dist/
npm run analyze    # dist/stats.html: what each module costs
npm run lint       # oxlint with Klear360's class lint
```

## What it shows

| File | Klear360 |
| --- | --- |
| `vite.config.ts` | `klear360Plugin()` (icons as one font of the glyphs used), `unocss/vite`, `@sveltejs/vite-plugin-svelte` |
| `uno.config.ts` | Klear360's UnoCSS config; the pipeline reads the bundled modules, Klear360's `styles.ts` included |
| `src/main.ts`, `src/app.css` | `blade.css`, the generated utilities, and the page defaults Klear360 leaves to the app (base font, box model) |
| `src/App.svelte` | `Klear360Provider`, the app's `<ToastContainer />` and `showToast`, a brand colour through a token variable, a lazily loaded chunk |
| `src/Summary.svelte` | `Collapsible` with a `Link` trigger and `CollapsibleChevron`, `Amount` |
| `src/Contact.svelte` | `PhoneNumberInput`, `TextInput` with `format`, `Tooltip`, an icon as a source (`<Icon source={InfoIcon} />`) |
| `src/PaymentMethods.svelte` | `CardGroup` of choices, a disabled row, a picked row revealing `content` |
| `src/Confirm.svelte` | `Modal` with its parts and `OTPInput`, loaded on the first Pay |
| `.oxlintrc.json` | `@klearnow/klear360-svelte/configs/lint`: classes that conflict, are built from pieces, misspell a Klear360 token, or restyle a Klear360 component |

## Bundle size

`Confirm.svelte` is imported on demand, so the Modal and its parts are a
chunk of their own: load the page with the Network tab open, then press Pay.
`npm run analyze` shows what each module adds; the icon font holds only the
glyphs the app imports.

The package is linked from the monorepo, so `vite.config.ts` dedupes
`svelte`: one runtime, the app's.
