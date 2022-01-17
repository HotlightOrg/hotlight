<script lang="ts">
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
      if(child) {
        let h = $search.index > -1 && child ? window.getComputedStyle(child).height : "0";
        const hInt = parseInt(h);

        style = `height: ${h}; transform: translateY(${hInt * $search.index}px)`;

        const offsetTop = child.offsetTop;
        const height = resultsRef.offsetHeight;
        const diffY = child.offsetTop - height;

        if(offsetTop >= height + resultsRef.scrollTop || offsetTop < resultsRef.scrollTop) {
          resultsRef.scrollTo({
            top: diffY + hInt,
            behaviour: "smooth"
          });
        }
      }
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
      <div id="active-hit" style="{style}"></div>
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
  margin-top: 10px;
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
  color: var(--hl-hit-color, rgba(50, 50, 50, 100%));
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
  color: var(--hl-hit-active-color, black);
}
#active-hit {
  display: flex;
  position: absolute;
  top: 0;
  z-index: 1;
  cursor: pointer;
  pointer-events: none;

  transition: transform 0.05s ease, color 0.1s ease;

  color: var(--hl-hit-active-color, black);
  background: var(--hl-hit-active-background, rgba(0, 0, 0, 5%));
  border-radius: var(--hl-hit-active-radius, 3px);

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
  color: var(--hl-underscore-color, rgba(0, 0, 0, 90%));
}
</style>
