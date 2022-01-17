<script lang="ts">
  import { onMount } from "svelte";
  import { search } from "../store";

  onMount(() => input.focus());

  let input;

  let rest = "";
  $: {
    if($search.chosenAction) {
      const _rest = $search.chosenAction.title?.replace(new RegExp(`^${$search.query}`, "i"), "");
      if(_rest.length + $search.query.length !== $search.chosenAction.title.length) {
        rest = ` - ${_rest}`;
      } else {
        rest = _rest;
      }
    } else {
      rest = "";
    }
  }

  const skip = (e: KeyboardEvent) => {
    const doNothing = ["Meta", "Tab", "Shift", "ArrowLeft", "ArrowRight", "Escape", "Control"];
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
      search.escape();
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
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 32 32">
    <path stroke="#535358" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M28 27l-7.5-7.5"/>
    <circle r="9" stroke="#535358" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" transform="matrix(-1 0 0 1 14 13)"/>
  </svg>

  <div class="input-wrapper">
    <input
      data-testid="hotlight-input"
      on:keydown={skip}
      on:keyup={performSearch}
      bind:this={input}
      bind:value={$search.query}
      id="input"
      type="text"
      class="text-input"
      autocomplete="off"
      autocapitalize="none"
      autocorrect="off"
      spellcheck="false"
      placeholder={$search.placeholder}
    />

    <div class="typeahead">
      <span class="mirror">{$search.query}</span>
      {#if $search.args.length === 0}
        <span class="rest">{rest}</span>
      {/if}

      {#if $search.query !== ""}
        <button 
          class="clear"
          type="button"
          on:click|preventDefault={clear}
        >
          Clear (Esc)
        </button>
      {/if}
    </div>
  </div>
</form>

<style>
  * {
    box-sizing: border-box;
  }
  form {
    display: flex;
    margin: 0;
    border-bottom: var(--hl-input-border-bottom, 1px solid rgba(0, 0, 0, 10%));
  }
  .input-wrapper {
    width: 100%;
    position: relative;
    flex-direction: row;
  }
  svg {
    margin: 8px 5px 6px 10px;
  }
  input {
    flex-grow: 1;
    font-size: 16px;
    color: var(--hl-text-color, rgba(0, 0, 0, 80%));
    padding: 10px 10px 10px 0;
    border: none;
    background: transparent;
    white-space: pre;
  }
  input:placeholder {
    color: var(--hl-input-placeholder-color, black);
  }
  input:focus {
    outline: none;
  }

  .typeahead {
    position: absolute;
    padding: 10px 10px 10px 0;
    font-size: 16px;
    z-index: 0;
    left: 0;
    right: 0;
    top: 0;
    display: flex;
    flex-direction: row;
    pointer-events: none;
  }
  .mirror {
    opacity: 0;
    white-space: pre;
  }
  .rest {
    white-space: pre;
    color: var(--hl-color-typeahead, rgba(0, 0, 0, 50%));

    overflow: hidden;
    text-overflow: ellipsis;
  }

  .clear {
    display: inline-block;
    flex-shrink: 0;
    font-size: 16px;
    margin-left: auto;
    cursor: pointer;
    padding: 0 0 0 10px;
    background: transparent;
    border: none;
    color: var(--hl-clear-color, rgba(0, 0, 0, 60%));
  }
</style>
