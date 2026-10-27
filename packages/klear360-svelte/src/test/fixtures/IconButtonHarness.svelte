<script lang="ts">
  import IconButton from '../../components/icon-button/IconButton.svelte';
  import Klear360Provider from '../../components/blade-provider/Klear360Provider.svelte';
  import { CloseIcon } from '../../icons';

  interface Props {
    onClick?: (event: MouseEvent) => void | Promise<void>;
    type?: 'submit' | 'button';
    isDisabled?: boolean;
    isLoading?: boolean;
    emphasis?: 'intense' | 'subtle';
    isHighlighted?: boolean;
    size?: 'small' | 'medium' | 'large';
  }

  let { onClick, type, isDisabled, isLoading, emphasis, isHighlighted, size }: Props = $props();
</script>

<Klear360Provider testID="host">
<IconButton
  icon={CloseIcon}
  accessibilityLabel="Dismiss"
  {onClick}
  {type}
  {isDisabled}
  {isLoading}
  {emphasis}
  {isHighlighted}
  {size}
  loadingAnnouncement="Working"
  testID="dismiss"
  class="ml-2"
  data-analytics-action="dismiss"
/>
</Klear360Provider>
