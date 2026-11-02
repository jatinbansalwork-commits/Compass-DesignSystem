import kdesignUnoConfig from '@klearnow/kdesign-svelte/configs/uno';

// Kdesign's config: its token classes, the `d:` desktop variant at 62.5rem,
// and Kdesign's preflights.
export default {
  ...kdesignUnoConfig({ desktop: '62.5rem' }),
  content: {
    // The modules the build bundles, Kdesign's included: only the components
    // the app imports reach the CSS. Kdesign's class maps are plain `.ts`
    // (`styles.ts`), which the default pipeline does not read.
    pipeline: { include: [/\.(svelte|[jt]s)($|\?)/] },
  },
};
