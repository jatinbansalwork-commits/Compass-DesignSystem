<script lang="ts">
  import Klear360Provider from '../../components/blade-provider/Klear360Provider.svelte';
</script>

<Klear360Provider testID="outer">
  <div class="relative">
    <Klear360Provider testID="inner">
      <p>Embedded</p>
    </Klear360Provider>
  </div>
</Klear360Provider>
