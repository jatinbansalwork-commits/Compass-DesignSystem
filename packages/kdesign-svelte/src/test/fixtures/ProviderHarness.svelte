<script lang="ts">
  import KdesignProvider from '../../components/kdesign-provider/KdesignProvider.svelte';
  import Button from '../../components/button/Button.svelte';
  import Badge from '../../components/badge/Badge.svelte';
  import Checkbox from '../../components/checkbox/Checkbox.svelte';
  import Switch from '../../components/switch/Switch.svelte';
  import TextInput from '../../components/text-input/TextInput.svelte';
  import type { ComponentDefaults, DefaultSize } from '../../components/defaults';
  import type { KdesignAdapters, KdesignAdaptersOverride } from '../../adapters';
  import AdapterProbe from './AdapterProbe.svelte';

  interface Props {
    size?: DefaultSize;
    defaults?: ComponentDefaults;
    innerSize?: DefaultSize;
    innerDefaults?: ComponentDefaults;
    adapters?: KdesignAdapters;
    innerAdapters?: KdesignAdaptersOverride;
    buttonSize?: 'xsmall' | 'small' | 'medium' | 'large';
  }

  let {
    size,
    defaults,
    innerSize,
    innerDefaults,
    adapters,
    innerAdapters,
    buttonSize,
  }: Props = $props();
</script>

<KdesignProvider {size} {defaults} {adapters}>
  <Button testID="button" size={buttonSize}>Pay</Button>
  <TextInput label="Email" testID="input" />
  <Checkbox testID="checkbox">Save</Checkbox>
  <Switch accessibilityLabel="Dark mode" testID="switch" />
  <Badge testID="badge">New</Badge>
  <KdesignProvider size={innerSize} defaults={innerDefaults} adapters={innerAdapters}>
    <Button testID="inner-button">Cancel</Button>
    <AdapterProbe />
  </KdesignProvider>
</KdesignProvider>
