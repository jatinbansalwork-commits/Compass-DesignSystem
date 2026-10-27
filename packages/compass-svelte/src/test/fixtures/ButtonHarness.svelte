<script lang="ts">
  import Button from '../../components/button/Button.svelte';
  import Klear360Provider from '../../components/blade-provider/Klear360Provider.svelte';
  import type { Klear360Adapters } from '../../adapters';

  interface Props {
    onClick?: (event: MouseEvent) => void;
    type?: 'submit' | 'button';
    validateForm?: boolean;
    isDisabled?: boolean;
    isLoading?: boolean;
    loadingAnnouncement?: string;
    loadedAnnouncement?: string;
    variant?: 'primary' | 'secondary';
    color?: 'primary' | 'neutral' | 'positive' | 'negative';
    className?: string;
    href?: string;
    target?: string;
    adapters?: Klear360Adapters;
  }

  let {
    onClick,
    type = 'button',
    validateForm,
    isDisabled,
    isLoading = false,
    loadingAnnouncement,
    loadedAnnouncement,
    variant,
    color,
    className,
    href,
    target,
    adapters,
  }: Props = $props();
</script>

<Klear360Provider {adapters} testID="host">
  <Button
    {type}
    {validateForm}
    {onClick}
    {isDisabled}
    {isLoading}
    {loadingAnnouncement}
    {loadedAnnouncement}
    {variant}
    {color}
    {href}
    {target}
    class={className}
    testID="solo"
    data-analytics-action="pay"
  >
    Go
  </Button>
</Klear360Provider>
