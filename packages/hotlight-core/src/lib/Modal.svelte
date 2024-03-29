<script lang="ts">
	import { fade } from 'svelte/transition';

  import { config, search } from "../store";
  import Loading from "./Loading.svelte";
  import Input from "./Input.svelte";
  import Debugger from "./Debugger.svelte";
  import Results from "./Results.svelte";
  import Mode from "./Mode.svelte";
  import Configurator from "./Configurator.svelte";

  // enables the component to have attributes that can be used to set config
  export let hidden: boolean = true;
  /*
  export let debug: boolean;
  export let transitions: boolean;
  export let theme: string;
  export let placeholder: string;
  */

  export const query = (query: string) => {
    search.search(query);
  }

  export const sources = (_sources) => {
    search.setSources(_sources);
  }

  export const open = () => config.open();
  export const close = () => search.close();

  $: {
    if(typeof hidden !== "undefined") {
      if(hidden) {
        search.close();
      } else {
        config.open();
      }
    }
  }

  // Exposed properties need to be reflected back when config is changed
  $: {
    hidden = $config.hidden;
  }

  $: if (document) document.body.style.overflowY = $config.hidden ? "auto" : "hidden";

  const toggle = () => {
    if(!$config.hidden) {
      search.close();
    } else {
      config.open();
    }
  }

  let containerRef;
  const closeByClick = (e: MouseEvent) => {
    if(e.target === containerRef) {
      search.close();
    }
  }

  const handleKeydown = (e) => {
    if(e.key === "k" && e.metaKey) {
      toggle();
      e.preventDefault();
    } else if(e.key === "Escape" && !$config.hidden && $search.query === "" && $search.args.length === 0) {
      search.close();
    }
  }


</script>

<svelte:window on:keydown={handleKeydown} />
<svelte:options tag="hotlight-modal" />

{#if !$config.hidden}
  <div class="hotlight" class:dark={$config.mode === "dark"}>
    <div
      class="container"
      on:click={closeByClick}
      bind:this={containerRef}
    >
      <div
        class="modal"
        transition:fade="{{ duration: $config.transitions ? 50 : 0 }}"
      >
        <hotlight-input />
        <!--<Input />-->
        <hotlight-results />
        <!--<Results />-->
        <div class="bottom-bar">
          <hotlight-loading />
          <!--<Loading />-->
          <a
            class="hotlight-logo"
            href="https://hotlight.dev"
            target="_blank"
            rel="noopener noreferrer"
          >
            Hotlight
          </a>
        </div>
      </div>
    </div>

    {#if $config.backdrop}
      <div class="backdrop" transition:fade="{{ duration: $config.transitions ? 50 : 0 }}"/>
    {/if}

  </div>
{/if}

<hotlight-mode />

{#if $config.debug}
  <hotlight-debugger />
  <!--<Debugger />-->
{/if}
{#if $config.configure}
  <hotlight-configurator />
  <!--<Configurator />-->
{/if}

<style>
  :host, .hotlight {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  }

  .backdrop {
    opacity: var(--hl-backdrop-opacity, 0.8);
    background: var(--hl-backdrop-background, white);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 50;

    transition: opacity 0.2s ease;
  }

  .container {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 100;
  }

  .modal {
    display: flex;
    flex-direction: column;
    margin: 10% auto;
    width: 100%;

    max-width: var(--hl-modal-max-width, 576px);
    border-radius: var(--hl-modal-radius, 5px);
    border: var(--hl-modal-border, 1px solid rgba(0, 0, 0, 10%));
    color: var(--hl-text-color, black);
    background: var(--hl-modal-background, white);
    min-height: 66px; /* because input field is not rendered at all times */

    /*box-shadow: var(--hl-modal-shadow, 0 1px 1px rgba(0, 0, 0, 0.11), 0 2px 2px rgba(0, 0, 0, 0.11), 0 4px 4px rgba(0, 0, 0, 0.11), 0 8px 8px rgba(0, 0, 0, 0.11), 0 16px 16px rgba(0, 0, 0, 0.11), 0 32px 32px rgba(0, 0, 0, 0.11));*/
    box-shadow: var(--hl-modal-shadow, none);

    transition: opacity 0.2s ease-out, transform 0.2s ease-out;

    opacity: 1;
    transform: scale(1); /* translateY(100px);*/
  }

  .bottom-bar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    line-height: 24px;
    font-size: 14px;
    margin: 5px 10px;
  }
  .hotlight-logo {
    font-size: 12px;
    text-decoration: none;
    color: var(--hl-text-color, black);
  }

  .dark {
    --hl-color-typeahead: var(--hl-dark-color-typeahead, rgba(255, 255, 255, 50%));
    --hl-clear-color: var(--hl-dark-clear-color, rgba(255, 255, 255, 60%));
    --hl-underscore-color: var(--hl-dark-underscore-color, rgba(255, 255, 255, 90%));
    --hl-backdrop-opacity: var(--hl-dark-backdrop-opacity, 0.8);
    --hl-backdrop-background: var(--hl-dark-backdrop-background, black);
    --hl-input-placeholder-color: var(--hl-dark-input-placeholder-color, white);
    --hl-modal-shadow: var(--hl-dark-modal-shadow, 0 1px 1px rgba(0, 0, 0, 0.11), 0 2px 2px rgba(0, 0, 0, 0.11), 0 4px 4px rgba(0, 0, 0, 0.11), 0 8px 8px rgba(0, 0, 0, 0.11), 0 16px 16px rgba(0, 0, 0, 0.11), 0 32px 32px rgba(0, 0, 0, 0.11));
    --hl-modal-background: var(--hl-dark-modal-background, black);
    --hl-modal-border: var(--hl-dark-modal-border, none);
    --hl-hit-active-background: var(--hl-dark-active-hit-background, rgba(255, 255, 255, 10%));
    --hl-hit-active-color: var(--hl-dark-hit-active-color, white);
    --hl-hit-color: var(--hl-dark-hit-color, gray);
    --hl-text-color: var(--hl-dark-text-color, rgba(255, 255, 255, 80%));
    --hl-loading-color: var(--hl-dark-loading-color, #777);
    --hl-input-border-bottom: var(--hl-dark-input-border-bottom, 1px solid rgba(255, 255, 255, 10%));
  }
</style>
