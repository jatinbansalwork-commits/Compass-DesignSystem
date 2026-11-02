<script lang="ts">
  import KdesignProvider from '../../components/kdesign-provider/KdesignProvider.svelte';
  import Amount from '../../components/amount/Amount.svelte';

  interface Props {
    locale?: string;
    ownLocale?: string;
  }

  let { locale, ownLocale }: Props = $props();
</script>

<KdesignProvider adapters={{ locale }}>
  <Amount value={1234567} currency="INR" locale={ownLocale} testID="amount" />
</KdesignProvider>
