<script lang="ts">
  import Klear360Provider from '../../components/blade-provider/Klear360Provider.svelte';
  import Amount from '../../components/amount/Amount.svelte';

  interface Props {
    locale?: string;
    ownLocale?: string;
  }

  let { locale, ownLocale }: Props = $props();
</script>

<Klear360Provider adapters={{ locale }}>
  <Amount value={1234567} currency="INR" locale={ownLocale} testID="amount" />
</Klear360Provider>
