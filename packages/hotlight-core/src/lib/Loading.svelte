
<script lang="ts">
  import { fade } from 'svelte/transition';
  import { search } from "../store";
</script>

<svelte:options tag="hotlight-loading" />

{#if $search.loading}
  <div
    data-testid="loading-indicator"
    transition:fade="{{ duration: 500 }}"
    class="loading-indicator"
  >
    <span>.</span>
  </div>
{/if}

<style>
  .loading-indicator {
    flex-grow: 1;
    font-size: 24px;
    color: var(--hl-loading-color, #777);
  }
  .loading-indicator span {
    animation: flickerAnimation 1s infinite;
  }

  @keyframes flickerAnimation {
    0%   { opacity:1; }
    50%  { opacity:0; }
    100% { opacity:1; }
  }
</style>