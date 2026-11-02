<script lang="ts">
  import type { FormAdapter } from '../../runes/form/types';
  import KdesignProvider from '../../components/kdesign-provider/KdesignProvider.svelte';
  import CardGroupHarness from './CardGroupHarness.svelte';

  // CardGroupHarness under an app's form.
  let { form }: { form: FormAdapter } = $props();
</script>

<KdesignProvider adapters={{ form }}>
  <CardGroupHarness name="bank" />
</KdesignProvider>
