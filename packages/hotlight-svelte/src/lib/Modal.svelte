<script lang="ts">
	import { fade } from 'svelte/transition';

  import { config, search } from "../store";
  import Loading from "./Loading.svelte";
  import Input from "./Input.svelte";
  import Debugger from "./Debugger.svelte";
  import Results from "./Results.svelte";


  $: if (document) document.body.style.overflowY = $config.hidden ? "auto" : "hidden";

  const toggle = () => {
    if(!$config.hidden) {
      close();
    } else {
      open();
    }
  }

  const open = () => {
    config.show();
  }

  let containerRef;
  const closeByClick = (e: MouseEvent) => {
    if(e.target === containerRef) {
      close();
    }
  }

  const close = () => {
    config.hide();
  }

  const handleKeydown = (e) => {
    if(e.key === "k" && e.metaKey) {
      toggle();
      e.preventDefault();
    } else if(e.key === "Escape" && !$config.hidden && $search.query === "") {
      close();
    }
  }

</script>

<svelte:window on:keydown={handleKeydown} />
<svelte:options tag="hotlight-modal" />

{#if !$config.hidden}
  <div class="hotlight" >
    <div
      class="container"
      on:click={closeByClick}
      bind:this={containerRef}
    >
      <div
        class="modal"
        transition:fade="{{ duration: $config.transitions ? 150 : 0 }}"
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

    <div class="backdrop" transition:fade="{{ duration: $config.transitions ? 50 : 0 }}"/>

    {#if $config.debug}
      <hotlight-debugger />
      <!--<Debugger />-->
    {/if}
  </div>
{/if}

<style>
  .backdrop {
    opacity: var(--hl-backdrop-opacity, 0.8);
    background: var(--hl-backdrop-background, black);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 50;

    -webkit-transition: opacity 0.2s ease;
    -moz-transition: opacity 0.2s ease;
    -ms-transition: opacity 0.2s ease;
    -o-transition: opacity 0.2s ease;
    transition: opacity 0.2s ease;
  }

  .container {
    font-family: Helvetica, Arial, sans-serif;

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
    color: var(--hl-text-color, white);
    background: var(--hl-modal-background, black);
    min-height: 66px; /* because input field is not rendered at all times */

    box-shadow: var(--hl-modal-shadow, 0 1px 1px rgba(0, 0, 0, 0.11), 0 2px 2px rgba(0, 0, 0, 0.11), 0 4px 4px rgba(0, 0, 0, 0.11), 0 8px 8px rgba(0, 0, 0, 0.11), 0 16px 16px rgba(0, 0, 0, 0.11), 0 32px 32px rgba(0, 0, 0, 0.11));

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
    /*display: flex;*/
    text-decoration: none;
    color: white;
  }
</style>
