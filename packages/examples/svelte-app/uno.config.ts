import bladeUnoConfig from '@klearnow/compass-svelte/configs/uno';

// Compass's config: its token classes, the `d:` desktop variant at 62.5rem,
// and Compass's preflights.
export default {
  ...bladeUnoConfig({ desktop: '62.5rem' }),
  content: {
    // The modules the build bundles, Compass's included: only the components
    // the app imports reach the CSS. Compass's class maps are plain `.ts`
    // (`styles.ts`), which the default pipeline does not read.
    pipeline: { include: [/\.(svelte|[jt]s)($|\?)/] },
  },
};
