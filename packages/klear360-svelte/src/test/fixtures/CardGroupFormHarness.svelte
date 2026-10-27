<script lang="ts">
  import type { FormAdapter } from '../../runes/form/types';
  import Klear360Provider from '../../components/blade-provider/Klear360Provider.svelte';
  import CardGroupHarness from './CardGroupHarness.svelte';

  // CardGroupHarness under an app's form.
  let { form }: { form: FormAdapter } = $props();
</script>

<Klear360Provider adapters={{ form }}>
  <CardGroupHarness name="bank" />
</Klear360Provider>
