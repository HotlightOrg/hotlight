<script lang="ts">
	import { fade } from 'svelte/transition';

  import { search, config } from "../store";
  import { underscore } from "../utils";

  let resultsRef;

  const pick = () => {
    search.perform();
  }

  const activateHit = (index) => {
    search.choose(index);
  }

  let style;
  $: {
    if(resultsRef && resultsRef.children) {
      const child = resultsRef.children[$search.index];
      let h = $search.index > -1 && child ? window.getComputedStyle(child).height : "0";
      style = `height: ${h}; transform: translateY(${parseInt(h)*$search.index}px)`;
    }
  }
</script>

<svelte:options tag="hotlight-results" />
<span class="u"></span><!-- keep to keep the css class -->

<div id="list" class="enter-active">
  <div id="results" bind:this={resultsRef}>
    {#each $search.results as result, index}
      <div
        tabindex="0"
        class="hit"
        on:click|preventDefault={pick}
        on:mouseover={() => activateHit(index)}
        on:focus={() => activateHit(index)}
      >
        <div class="title" class:active={index === $search.index}>
          {@html underscore($search.query, result.title)}       
        </div>
        <div class="alias">
          {@html underscore($search.query, result.alias)}       
        </div>
        <span class="category"></span>
      </div>
    {/each}

    {#if $search.index > -1 && $search.results.length > 0}
      <div id="active-hit" style="{style}" transition:fade="{{ duration: $config.transitions ? 150 : 0 }}"></div>
    {/if}

  </div>

  {#if $search.chosenAction?.preview}
    <div id="preview">
      <div>
        {@html $search.preview}
      </div>
    </div>
  {/if}

</div>

<style>
#list {
  position: relative;
  display: flex;
  flex-direction: row;
}

#results {
  position: relative;
  width: 100%;
  max-height: 224px;
  overflow-y: auto;
}

#preview {
  width: 200px;
}

.hit {
  display: flex;
  align-items: center;
  position: relative;
  font-size: 16px;
  padding: 0 20px;
  cursor: pointer;
  color: var(--hl-hit-color, gray);
  height: 32px;

  transition: color 0.2s ease;
}
.alias {
  font-size: 14px;
  margin-left: 10px;
}
.enter-active .active {
  transition: none;
}

.active {
  color: var(--hl-active-hit-color, rgba(255, 255, 255, 70%));
}
#active-hit {
  display: flex;
  position: absolute;
  top: 0;
  z-index: 1;
  cursor: pointer;
  pointer-events: none;

  transition: transform 0.05s ease, color 0.1s ease;

  color: var(--hl-active-hit-color, white);
  background: var(--hl-active-hit-background, rgba(255, 255, 255, 10%));
  border-radius: var(--hl-active-hit-radius, 3px);
  height: 32px;
  width: calc(100% - 20px);
  margin: 0 10px;
}

.category {
  color: #999;
}

.u {
  text-decoration: var(--hl-underscore-decoration, none);
  font-weight: var(--hl-underscore-font-weight, normal);
  color: var(--hl-underscore-color, rgba(255, 255, 255, 90%));
}
</style>
