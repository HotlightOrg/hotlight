<script lang="ts">
  import { config } from "../store";

  const updateConfig = (e) => {
    const target = e.target as HTMLInputElement;
    switch(target.type) {
      case "checkbox":
        config.setEntry(target.name, target.checked);
        break;
      case "text":
        config.setEntry(target.name, target.value);
        break;
    }
  }
</script>

<svelte:options tag="hotlight-configurator" />

<div class="configurator">
  {#each Object.entries($config) as [key, value]}
    <div>
      <label for={key}>{key}</label>: 
      {#if typeof value === "boolean"}
        <input
          type="checkbox"
          checked={value}
          name={key}
          id={key}
          on:change|preventDefault={updateConfig}
        />
      {:else if typeof value === "string" || typeof value === "number"}
        <input
          type="text"
          value={value}
          name={key}
          id={key}
          on:keyup|preventDefault={updateConfig}
        />
      {/if}
    </div>
  {/each}
</div>

<style>
  .configurator {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    z-index: 1000;
  }
</style>