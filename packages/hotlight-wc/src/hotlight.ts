import { Config, Actions } from "./typings";
import engine from "./engine/search";
import { config } from "./config";

export class Modal extends HTMLElement {
  constructor() {
    super();

    this.component = this
      .attachShadow({
        mode: 'open'
      })

    this.component.appendChild(template.content.cloneNode(true));

    this.config = config();
    this.isOpen = this._config.isOpen;

    this.hotlight = this.shadowRoot.querySelector(".hotlight");
    this.container = this.shadowRoot.querySelector(".container");

    this.container.addEventListener("click", (e: MouseEvent) => {
      if(e.target === this.container) {
        this.close();
      }
    });

    this.debugElement = this.shadowRoot.querySelector(".debug");
    this.loadingIndicator = this.shadowRoot.querySelector("hotlight-loading");
    this.updateLoading();

    this.input = this.shadowRoot.querySelector("hotlight-input");
    this.input.setAttribute("placeholder", this._config.placeholder);
    this.input.addEventListener("keyup", this.search.bind(this));
    this.input.addEventListener("keydown", this.skip.bind(this));

    this.results = this.shadowRoot.querySelector("hotlight-results");
    this.setResults("", this.engine.context.actions);
    this.results.addEventListener("hover-hit", (e: CustomEvent) => {
      this.activateAction(e.detail);
    });
    this.results.addEventListener("click", () => {
      this.engine.pick();
    });

    //this.l = new Loading();
    //this.l.render();

    window.addEventListener("keydown", (e) => {
      if(e.key === "k" && e.metaKey) {
        this.toggle();
        e.preventDefault();
      }
    });

    window.addEventListener("hotlight:response", (e) => {
      const { query, results } = e.detail;
      console.log(this.engine.context.loading)
      this.updateLoading();
      this.setResults(query, results);
      this.renderContext();
    });
    
    window.addEventListener("hotlight:open", () => {
      this.launch();
    });

    window.addEventListener("hotlight:close", () => {
      this.close();
    });
  }

  private _config: Config;
  private container: HTMLDivElement;
  private input: HTMLInputElement;
  private hotlight: HTMLElement;
  private results: HTMLElement;
  private debugElement: HTMLElement;
  private component: any;
  private engine: any;

  private isOpen: boolean;

  renderContext() {
    if(this._config.debug) {
      this.debugElement.innerHTML = "<div>" + JSON.stringify(this.engine.context) + "</div>";
    }
  }

  toggle() {
    if(this.isOpen) {
      this.close();
    } else {
      this.launch();
    }
  }

  set config(value) {
    this._config = config(value);
    this.engine = engine(this._config);
  }

  get config() {
    return this._config;
  }

  get open() {
    return this.isOpen;
  }

  close() {
    if(this.isOpen) {
      this.hotlight.classList.add("hidden");
      setTimeout(() => {
        document.body.style.overflowY = "auto";
      }, 300); // approx the transition time
      this.isOpen = false;
    }
  }

  launch() {
    if(!this.isOpen) {
      this.hotlight.classList.remove("hidden");
      document.body.style.overflowY = "hidden";
      this.isOpen = true;
      this.input.focus();
      if (this.engine.context.query) {
        this.input.value = this.engine.context.query;
      }
    }
  }

  debug() {
    this._config.debug = true;
  }

  skip(e: KeyboardEvent) {
    const { activeActionIndex } = this.engine.context;

    const doNothing = ["Meta", "Tab", "Shift", "ArrowLeft", "ArrowRight", "Escape"];
    if(doNothing.includes(e.key)) {
      return
    }

    if(e.key === "Enter") {
      this.doTrigger();
      e.preventDefault();
      return;
    }

    if(e.key === "Backspace" &&
      this.input.value === "" &&
      this.engine.context.parents.length > 0
    ) {
      //this.goUp.emit();
    }

    if(e.key === "ArrowUp") {
      this.activateAction(activeActionIndex - 1);
      e.preventDefault();
      return
    } else if(e.key === "ArrowDown") {
      this.activateAction(activeActionIndex + 1);
      e.preventDefault();
      return
    }

    this.renderContext();
  }

  search(e: KeyboardEvent) {
    const skip = ["ArrowRight", "ArrowLeft"];
    if(skip.includes(e.key)) {
      return
    }

    if(e.key === "Escape") {
      e.preventDefault();
      if(
        this.engine.context.query === "" &&
        this.engine.context.parents.length === 0
      ) {
        this.close();
        return
      } else {
        this.doSearch("");
        this.setInputValue("");
      }
    }

    const prevent = ["ArrowUp", "ArrowDown", "Enter", "Meta"];
    if(prevent.includes(e.key)) {
      e.preventDefault();
    } else {
      this.doSearch(this.input.value.trim());
    }
  };

  doSearch(query: string) {
    this.updateLoading();
    this.engine.search(query);
  }

  updateLoading() {
    const { loading } = this.engine.context;
    if(loading) {
      this.loadingIndicator.classList.remove("hidden")
    } else {
      this.loadingIndicator.classList.add("hidden")
    }
  }

  setResults(query: string, actions: Actions) {
    //this.context.actions = actions;
    this.results.query = query;
    this.results.actions = actions;

    if(actions.length > 0) {
      this.activateAction(0);
    }
  }

  setInputValue(value: string) {
    this.input.value = value;
  }

  activateAction(index: number) {
    if(this.engine.activateActionIndex(index)) {
      this.results.activeIndex = index;
    }
  }

  doTrigger() {
    this.updateLoading();
    this.engine.pick();
    this.updateLoading();
    this.input.parents = this.engine.context.parents;
  }
}

const template = document.createElement("template");
template.innerHTML = `
  <div class="hotlight hidden">
    <div class="container">
      <div class="modal">
        <hotlight-input></hotlight-input>
        <hotlight-results></hotlight-results>
        <div class="bottom-bar">
          <div class="loading-indicator"><span>.</span></div>
          <hotlight-loading></hotlight-loading>
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

    <div class="debug"></div>

    <div class="backdrop" />
  </div>

  <style>
    .hotlight.hidden {
      display: none;
    }

    .backdrop {
      opacity: 0.8;
      background: black;
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
    .container.hidden {
      pointer-events: none;
    }

    .modal {
      display: flex;
      flex-direction: column;
      margin: 10% auto;
      width: 100%;
      max-width: 576px;
      /*border: 1px solid rgba(255,255,255,10%);*/
      border-radius: 5px;
      background: black;
      color: white;
      min-height: 66px; /* because input field is not rendered at all times */

      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.11), 0 2px 2px rgba(0, 0, 0, 0.11), 0 4px 4px rgba(0, 0, 0, 0.11), 0 8px 8px rgba(0, 0, 0, 0.11), 0 16px 16px rgba(0, 0, 0, 0.11),
        0 32px 32px rgba(0, 0, 0, 0.11);

      transition: opacity 0.2s ease-out, transform 0.2s ease-out;

      opacity: 1;
      transform: scale(1); /* translateY(100px);*/
    }
    .modal.hidden {
      opacity: 0;
      transform: scale(0.98); /* translateY(0);*/
      pointer-events: none;
    }

    .bottom-bar {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      line-height: 24px;
      font-size: 14px;
      margin: 5px 10px;
    }
    .loading-indicator {
      flex-grow: 1;
      font-size: 24px;
      animation: flickerAnimation 1s infinite;
    }
    .loading-indicator.hidden span {
      visibility: hidden;
    }
    .hotlight-logo {
      font-size: 12px;
      /*display: flex;*/
      text-decoration: none;
      color: white;
    }

    @keyframes flickerAnimation {
      0%   { opacity:1; }
      50%  { opacity:0; }
      100% { opacity:1; }
    }
  </style>
`;
