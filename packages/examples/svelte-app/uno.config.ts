import bladeUnoConfig from '@klearnow/klear360-svelte/configs/uno';

// Klear360's config: its token classes, the `d:` desktop variant at 62.5rem,
// and Klear360's preflights.
export default {
  ...bladeUnoConfig({ desktop: '62.5rem' }),
  content: {
    // The modules the build bundles, Klear360's included: only the components
    // the app imports reach the CSS. Klear360's class maps are plain `.ts`
    // (`styles.ts`), which the default pipeline does not read.
    pipeline: { include: [/\.(svelte|[jt]s)($|\?)/] },
  },
};
