# Components missing JSDoc on props

**Generated:** 2026-10-28

## Summary

Many public props are documented on **implementation files** (e.g. `ProgressBar.tsx`) while `component-manifest.json` only scans `types.ts` — manifest `hasJSDoc: false` can be a **false negative**.

Strict scan: `types.ts` / `*.types.ts` with **zero** `/**` blocks but **> 0** optional props:

| Component | Props (approx.) | Types file |
|-----------|-----------------|------------|
| BaseMenu | 23 | `src/components/BaseMenu/types.ts` |
| Link (StyledBaseLink) | 11 | `src/components/Link/BaseLink/types.ts` |
| Carousel (Indicators) | 2 | `src/components/Carousel/Indicators/types.ts` |
| CompassProvider | 3 | `src/components/CompassProvider/types.ts` |
| Skeleton | 1+ | `src/components/Skeleton/types.ts` |

Manifest `hasJSDoc: false` (may have docs elsewhere):

- [ ] Alert
- [ ] BaseMenu
- [ ] Fade
- [ ] CompassProvider
- [ ] Morph
- [ ] Move
- [ ] ProgressBar (docs in `ProgressBar.tsx`)
- [ ] Skeleton
- [ ] Stagger

## This session — JSDoc added (types files)

Documentation-only updates on exported prop types:

- [x] CompassProvider
- [x] Skeleton
- [x] Alert (`StyledAlertProps`)
- [x] BaseMenu (`BaseMenuItemProps`)
- [x] Fade, Move, Morph, Stagger
- [x] ProgressBar (`ProgressBarFilledProps` / circular variant props in `types.ts`)

## ESLint JSDoc enforcement

- Root `package.json` includes **`eslint-plugin-jsdoc`** (run `yarn install` at repo root after pull).
- Root `.eslintrc.js` override: **`jsdoc/require-jsdoc` → warn** on `TSPropertySignature` in Compass `types.ts` / `*.types.ts` (see **ADR-007**).

## Recommended next steps

1. Extend manifest generator to count JSDoc on primary `.tsx` prop types, not only `types.ts`.
2. Batch remaining internal types (Link styled props, Carousel indicators).
3. After ADR-007 approval — enable `eslint-plugin-jsdoc` with `warn` on new/changed `types.ts` in `packages/compass`.
