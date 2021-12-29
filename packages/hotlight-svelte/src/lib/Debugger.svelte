<script lang="ts">
  import { config, search } from "../store";
</script>

<svelte:options tag="hotlight-debugger" />

<div class="debugger">
  <div class="store">
    {JSON.stringify($config)}
  </div>
  <div class="store">
    {JSON.stringify($search)}
  </div>
</div>

<style>
.debugger {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10000;
  background-color: white;
  border-top: 1px solid black;
}
.store {
  padding: 1rem;
  border-bottom: 1px solid black;
}
</style>
