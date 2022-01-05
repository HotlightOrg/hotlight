
<script lang="ts">
  import { search } from "../store";
</script>

<svelte:options tag="hotlight-loading" />

<div
  data-testid="loading-indicator"
  class="loading-indicator"
  class:hidden={!$search.loading}
>
  <span>.</span>
</div>

<style>
  .loading-indicator.hidden {
    opacity: 0;
  }
  .loading-indicator {
    flex-grow: 1;
    font-size: 24px;
    color: var(--hl-loading-color, #777);
    transition: opacity 0.15s;
    opacity: 1;
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