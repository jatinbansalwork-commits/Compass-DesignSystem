<script lang="ts">
  import KdesignProvider from '../../components/kdesign-provider/KdesignProvider.svelte';
</script>

<KdesignProvider testID="outer">
  <div class="relative">
    <KdesignProvider testID="inner">
      <p>Embedded</p>
    </KdesignProvider>
  </div>
</KdesignProvider>
