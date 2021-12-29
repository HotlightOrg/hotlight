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
      //this.doTrigger();
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
        // && store.state.parents.length === 0
      ) {
        config.hide();
        return
      } else {
        //this.engine.search("");
        search.reset();
      }
    }

    const prevent = ["ArrowUp", "ArrowDown", "Enter", "Meta"];
    if(prevent.includes(e.key)) {
      e.preventDefault();
    } else {
      const val = value.trim();
      //search.search(val);
      console.log("search", $search.query.trim());
      
      //this.engine.search(val);
    }
  };

</script>

<svelte:options tag="hotlight-input" />

<form
  role="search"
  novalidate
  autocomplete="off"
>
  <div id="parents-container"></div>
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
    placeholder={$config.placeholder}
  />
</form>

<style>
  form {
    display: flex;
    margin: 0;
  }
  input {
    flex-grow: 1;
    font-size: 18px;
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

  #parents-container {
    display: flex;
  }
  /*
  #parents-container.show div.parent:last-of-type {
    max-width: 100px;
    overflow: hidden;
  }
  .parent:last-of-type {
    max-width: 0;

    transition: max-width 0.2s;
  }
  .parent-inner {
    display: block;
    background: red;
    color: white;
    padding: 2px;
  }
  */
</style>
