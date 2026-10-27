// The package's own UnoCSS config (Storybook, the tests): Compass's defaults.
// An app imports `bladeUnoConfig` from `@klearnow/compass-svelte/configs/uno`
// (`./uno/config.ts`) and spreads it into its own.
import bladeUnoConfig from './uno/config';

export default bladeUnoConfig();
