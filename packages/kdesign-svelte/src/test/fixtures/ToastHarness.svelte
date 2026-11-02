<script lang="ts">
  import KdesignProvider from '../../components/kdesign-provider/KdesignProvider.svelte';
  import ToastContainer from '../../components/toast/ToastContainer.svelte';
</script>

<!-- The page's queue: tests show toasts with `showToast`. -->
<KdesignProvider testID="host">
  <main data-testid="page">Checkout</main>
  <ToastContainer testID="host-toasts" />
</KdesignProvider>
