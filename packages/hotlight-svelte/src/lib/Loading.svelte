
<script lang="ts">
import { search } from "../store";
</script>

<svelte:options tag="hotlight-loading" />

<div class="loading-indicator" class:loading={$search.loading}><span>.</span></div>

<style>
  .loading-indicator {
    flex-grow: 1;
    font-size: 24px;
    transition: opacity 1s;
    color: #777;
    opacity: 0;
  }
  .loading-indicator.loading {
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