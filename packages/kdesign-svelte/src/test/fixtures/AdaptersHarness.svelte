<script lang="ts">
  import type { KdesignAdapters } from '../../adapters';
  import KdesignProvider from '../../components/kdesign-provider/KdesignProvider.svelte';
  import Modal from '../../components/modal/Modal.svelte';
  import ModalHeader from '../../components/modal-children/ModalHeader.svelte';
  import type { Layers } from '../../runes/layer/layers';
  import LayersProbe from './LayersProbe.svelte';

  interface Props {
    adapters?: KdesignAdapters;
    isOpen?: boolean;
    onDismiss?: (event: { source: string }) => void;
    /** The provider's layers and back, from inside it. */
    onReady?: (layers: Layers, back: () => boolean) => void;
  }

  let { adapters, isOpen = $bindable(false), onDismiss, onReady }: Props = $props();
</script>

<KdesignProvider {adapters}>
  <p data-testid="page">Page</p>
  {#if onReady}<LayersProbe {onReady} />{/if}
  <Modal bind:isOpen {onDismiss} testID="modal">
    <ModalHeader title="Remove card?" />
  </Modal>
</KdesignProvider>
