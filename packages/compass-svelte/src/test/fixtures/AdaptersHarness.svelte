<script lang="ts">
  import type { Klear360Adapters } from '../../adapters';
  import Klear360Provider from '../../components/blade-provider/Klear360Provider.svelte';
  import Modal from '../../components/modal/Modal.svelte';
  import ModalHeader from '../../components/modal-children/ModalHeader.svelte';
  import type { Layers } from '../../runes/layer/layers';
  import LayersProbe from './LayersProbe.svelte';

  interface Props {
    adapters?: Klear360Adapters;
    isOpen?: boolean;
    onDismiss?: (event: { source: string }) => void;
    /** The provider's layers and back, from inside it. */
    onReady?: (layers: Layers, back: () => boolean) => void;
  }

  let { adapters, isOpen = $bindable(false), onDismiss, onReady }: Props = $props();
</script>

<Klear360Provider {adapters}>
  <p data-testid="page">Page</p>
  {#if onReady}<LayersProbe {onReady} />{/if}
  <Modal bind:isOpen {onDismiss} testID="modal">
    <ModalHeader title="Remove card?" />
  </Modal>
</Klear360Provider>
