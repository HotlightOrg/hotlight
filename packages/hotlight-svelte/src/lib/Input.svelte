<script lang="ts">
  import { onMount } from "svelte";
  import { config, search } from "../store";

  onMount(() => input.focus());

  let input;
  let value: string = "";

  const skip = (e: KeyboardEvent) => {
    const doNothing = ["Meta", "Tab", "Shift", "ArrowLeft", "ArrowRight", "Escape"];
    if(doNothing.includes(e.key)) {
      return
    }

    if(e.key === "Enter") {
      search.perform();
      e.preventDefault();
      return;
    }

    if(e.key === "ArrowUp") {
      search.choose($search.index - 1);
      e.preventDefault();
      return
    } else if(e.key === "ArrowDown") {
      search.choose($search.index + 1);
      e.preventDefault();
      return
    }
  }

  const performSearch = (e: KeyboardEvent) => {
    const skip = ["ArrowRight", "ArrowLeft"];
    if(skip.includes(e.key)) {
      return
    }

    if(e.key === "Escape") {
      e.preventDefault();
      if(
        $search.query === ""
      ) {
        search.close();
        return
      } else {
        search.search("");
      }
    }

    const prevent = ["ArrowUp", "ArrowDown", "Enter", "Meta"];
    if(prevent.includes(e.key)) {
      e.preventDefault();
    } else {
      search.search($search.query);
    }
  };

  const clear = () => {
    search.clear();
    input.focus();
  }

</script>

<svelte:options tag="hotlight-input" />

<form
  role="search"
  novalidate
  autocomplete="off"
>
  {#if $search.query !== ""}
    <button 
      class="clear"
      type="button"
      on:click|preventDefault={clear}
    >
      Clear
    </button>
  {/if}
  <input
    on:keydown={skip}
    on:keyup={performSearch}
    bind:this={input}
    bind:value={$search.query}
    id="input"
    type="text"
    class="text-input"
    autocomplete="off"
    spellcheck="false"
    placeholder={$search.placeholder}
  />
</form>

<style>
  form {
    position: relative;
    display: flex;
    margin: 0;
  }
  input {
    flex-grow: 1;
    font-size: 16px;
    color: var(--hl-text-color, rgba(255, 255, 255, 80%));
    padding: 10px;
    border: none;
    background: transparent;
  }
  input:placeholder {
    color: var(--hl-input-placeholder-color, white);
  }
  input:focus {
    outline: none;
  }
  .clear {
    font-size: 16px;
    cursor: pointer;
    position: absolute;
    right: 0;
    padding: 10px;
    background: transparent;
    border: none;
    color: var(--hl-clear-color, rgba(255, 255, 255, 60%));
  }
</style>
