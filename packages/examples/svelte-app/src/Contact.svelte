<script lang="ts">
  import { Icon, PhoneNumberInput, TextInput, Tooltip } from '@klearnow/klear360-svelte/components';
  import { InfoIcon } from '@klearnow/klear360-svelte/icons';

  let phone = $state('');
  let country = $state('IN');
  let card = $state('');
</script>

<section class="flex flex-col gap-4">
  <!-- The countries default to i18nify's; the list opens under the field. -->
  <PhoneNumberInput bind:value={phone} bind:country label="Mobile number" />
  <!-- `format` is Klear360's mask: the field places the spaces. -->
  <TextInput
    bind:value={card}
    label="Card number"
    format="#### #### #### ####"
    inputMode="numeric"
    placeholder="0000 0000 0000 0000"
  >
    {#snippet trailing()}
      <Tooltip content="We never store your card number">
        <button type="button" class="flex" aria-label="About your card number">
          <Icon source={InfoIcon} />
        </button>
      </Tooltip>
    {/snippet}
  </TextInput>
</section>
