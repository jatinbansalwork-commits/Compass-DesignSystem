<script lang="ts">
  import { KdesignProvider, Button, Link, TextInput } from '../../index';
  import type { KdesignAdapters } from '../../index';
  import { stamp } from '../helpers';

  const FIELDS = ['line1', 'line2', 'city', 'state', 'pincode', 'landmark'];

  let log = $state<string[]>([]);

  function record(line: string) {
    log = [`${stamp()} ${line}`, ...log].slice(0, 30);
  }

  // KdesignProvider provides them to everything under it.
  const adapters: KdesignAdapters = {
    track: (event, payload) =>
      record(`track ${event} ${JSON.stringify(payload)}`),
    vibrate: (kind) => record(`vibrate.${kind}`),
    reportError: (error) => record(`reportError ${String(error)}`),
    navigate: (href) => {
      record(`navigate ${href}`);
      return true;
    },
  };
</script>

<div class="grid max-w-[760px] [grid-template-columns:1fr_1fr] gap-8">
  <KdesignProvider {adapters}>
    <div class="grid gap-3">
      {#each FIELDS as name (name)}
        <TextInput {name} label={name} isRequired={name !== 'landmark'} />
      {/each}
      <Button onClick={() => record('pressed Save address')}>Save address</Button>
      <Link href="/addresses">Saved addresses</Link>
    </div>
  </KdesignProvider>

  <section class="grid [align-content:start] gap-2">
    <h2 class="text-75 leading-50 font-medium">Adapter log</h2>
    <ul class="font-mono grid gap-1 text-25 leading-50 text-surface-gray-subtle">
      {#each log as line (line)}
        <li>{line}</li>
      {:else}
        <li>Edit a field, press the button or follow the link to see calls.</li>
      {/each}
    </ul>
  </section>
</div>
