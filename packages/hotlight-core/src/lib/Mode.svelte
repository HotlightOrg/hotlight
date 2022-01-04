<script lang="ts">
  import { config } from '../store';
  import { onMount, onDestroy } from 'svelte';

  let darkMode;
  const setMode = (changed) => {
    config.setEntry("mode", changed.matches ? "dark" : "light");
  }

  onMount(() => {
    darkMode = window.matchMedia("(prefers-color-scheme: dark)");
    if(darkMode.matches && $config.mode === "auto") {
      config.setEntry("mode", "dark");
    }
    darkMode.addEventListener("change", setMode);
  });
	
	onDestroy(() => {
    darkMode.removeEventListener("change", setMode);
  });
</script>

<svelte:options tag="hotlight-mode" />