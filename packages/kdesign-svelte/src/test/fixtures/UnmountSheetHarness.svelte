<script lang="ts">
  import KdesignProvider from '../../components/kdesign-provider/KdesignProvider.svelte';
  import BottomSheet from '../../components/bottom-sheet/BottomSheet.svelte';
  import BottomSheetBody from '../../components/modal-children/BottomSheetBody.svelte';

  interface Props {
    isMounted?: boolean;
    isOpen?: boolean;
  }

  let { isMounted = true, isOpen = true }: Props = $props();
</script>

<!-- An app that unmounts a sheet itself (a stack entry removed on a timer),
     open or mid-exit. -->
<KdesignProvider testID="host">
  <p>Page</p>
  {#if isMounted}
    <BottomSheet {isOpen} testID="sheet" closeLabel="Close">
      <BottomSheetBody>Countries</BottomSheetBody>
    </BottomSheet>
  {/if}
</KdesignProvider>
