<script lang="ts">
  import { resolveFieldCounter, type FieldSize } from './field';

  // Klear360's CharacterCounter: how much of `max` is used.
  interface Props {
    current: number;
    max: number;
    /** @default 'medium' */
    size?: FieldSize;
  }

  let { current, max, size = 'medium' }: Props = $props();
</script>

<span class={resolveFieldCounter(size)}>{current}/{max}</span>
