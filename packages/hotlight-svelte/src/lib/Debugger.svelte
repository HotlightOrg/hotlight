<script lang="ts">
  import { config, search } from "../store";
</script>

<svelte:options tag="hotlight-debugger" />

<div class="debugger">
  <div class="store">
    <pre>
      {JSON.stringify($config, null, 2)}
    </pre>
  </div>
  <div class="store">
    <pre>
      {JSON.stringify($search, null, 2)}
    </pre>
  </div>
</div>

<style>
.debugger {
  max-height: 60vh;
  overflow-y: auto;
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
  font-size: 12px;
}
</style>
