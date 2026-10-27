<script lang="ts">
  import Klear360Provider from '../../components/blade-provider/Klear360Provider.svelte';
  import Button from '../../components/button/Button.svelte';
  import Badge from '../../components/badge/Badge.svelte';
  import Checkbox from '../../components/checkbox/Checkbox.svelte';
  import Switch from '../../components/switch/Switch.svelte';
  import TextInput from '../../components/text-input/TextInput.svelte';
  import type { ComponentDefaults, DefaultSize } from '../../components/defaults';
  import type { Klear360Adapters, Klear360AdaptersOverride } from '../../adapters';
  import AdapterProbe from './AdapterProbe.svelte';

  interface Props {
    size?: DefaultSize;
    defaults?: ComponentDefaults;
    innerSize?: DefaultSize;
    innerDefaults?: ComponentDefaults;
    adapters?: Klear360Adapters;
    innerAdapters?: Klear360AdaptersOverride;
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

<Klear360Provider {size} {defaults} {adapters}>
  <Button testID="button" size={buttonSize}>Pay</Button>
  <TextInput label="Email" testID="input" />
  <Checkbox testID="checkbox">Save</Checkbox>
  <Switch accessibilityLabel="Dark mode" testID="switch" />
  <Badge testID="badge">New</Badge>
  <Klear360Provider size={innerSize} defaults={innerDefaults} adapters={innerAdapters}>
    <Button testID="inner-button">Cancel</Button>
    <AdapterProbe />
  </Klear360Provider>
</Klear360Provider>
