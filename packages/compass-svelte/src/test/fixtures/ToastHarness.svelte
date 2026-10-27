<script lang="ts">
  import Klear360Provider from '../../components/blade-provider/Klear360Provider.svelte';
  import ToastContainer from '../../components/toast/ToastContainer.svelte';
</script>

<!-- The page's queue: tests show toasts with `showToast`. -->
<Klear360Provider testID="host">
  <main data-testid="page">Checkout</main>
  <ToastContainer testID="host-toasts" />
</Klear360Provider>
