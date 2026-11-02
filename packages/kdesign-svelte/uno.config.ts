// The package's own UnoCSS config (Storybook, the tests): Kdesign's defaults.
// An app imports `kdesignUnoConfig` from `@klearnow/kdesign-svelte/configs/uno`
// (`./uno/config.ts`) and spreads it into its own.
import kdesignUnoConfig from './uno/config';

export default kdesignUnoConfig();
