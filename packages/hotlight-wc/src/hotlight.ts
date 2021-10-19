import { Config, Actions, Context } from "./typings";

import engine from "./search";

/*
import { underscore } from "../../utils/utils";
import { HotlightConfig, HotlightAction } from "../hotlight-modal/hotlight-modal";
*/

const defaultConfig = {
  isOpen: false,
  //stayOpened: false,
  query: "",
  maxHits: 20,
  placeholder: "What do you need?",

  debug: false,
  
  sources: {},
};

export class Modal extends HTMLElement {
  constructor() {
    super();    
    this.component = this
      .attachShadow({
        mode: 'open'
      })

    this.component.appendChild(template.content.cloneNode(true));

    this._config = defaultConfig;

    this.context = {
      query: "",
      level: 0,
      parents: [],
      actions: [],
      activeActionIndex: 0
    };

    this.isOpen = this._config.isOpen;

    this.hotlight = this.shadowRoot.querySelector(".hotlight");
    this.container = this.shadowRoot.querySelector(".container");
    //this.modal = this.shadowRoot.querySelector(".modal-container");

    this.container.addEventListener("click", (e: MouseEvent) => {
      if(e.target === this.container) {
        this.close();
      }
    });

    this.debugElement = this.shadowRoot.querySelector(".debug");

    this.input = this.shadowRoot.querySelector("hotlight-input");
    this.input.setAttribute("placeholder", this._config.placeholder);
    this.input.addEventListener("keyup", this.search.bind(this));
    this.input.addEventListener("keydown", this.skip.bind(this));

    this.results = this.shadowRoot.querySelector("hotlight-results");
    this.setResults(this.context.actions);
    this.results.addEventListener("hover-hit", (e: CustomEvent) => {
      this.activateAction(e.detail);
    });

    this.engine = engine([
      { title: "parent", trigger: "/" },
      { title: "jonas", trigger: "/" },
      { title: "kalle", trigger: "/" },
      { title: "documentation", trigger: "/" },
      { title: "whatsup", trigger: "/" },
    ]);

    window.addEventListener("keydown", (e) => {
      if(e.key === "k" && e.metaKey) {
        this.toggle();
        e.preventDefault();
      }
    });
    
    window.addEventListener("hotlight:open", () => {
      this.launch();
    });
    window.addEventListener("hotlight:close", () => {
      this.close();
    });
  }

  private _config: Config;
  private context: Context;
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
      this.debugElement.innerHTML = "<div>" + JSON.stringify(this.context) + "</div>";
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
    const c = { ...defaultConfig, ...value };
    this._config = c;
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
      if (this.context.query) {
        //this.input.value = this.context.query);
      }
    }
  }

  debug() {
    this._config.debug = true;
  }

  skip(e: KeyboardEvent) {
    const { activeActionIndex } = this.context;

    const doNothing = ["Meta", "Tab", "Shift", "ArrowLeft", "ArrowRight", "Escape"];
    if(doNothing.includes(e.key)) {
      return
    }

    const skip = ["Enter"];
    if(skip.includes(e.key)) {
      e.preventDefault();
      return
    } else if(e.key === "Backspace" &&
      this.input.value === "" &&
      this.context.parents.length > 0
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

    this.context.query = this.input.value;
  }

  search(e: KeyboardEvent) {
    const skip = ["ArrowRight", "ArrowLeft"];
    if(skip.includes(e.key)) {
      return
    }

    if(e.key === "Escape") {
      e.preventDefault();
      if(
        this.context.query === "" &&
        this.context.parents.length === 0
      ) {
        this.close();
        return
      } else {
        this.setInputValue("");
        this.setResults([]);
      }
    }

    this.renderContext();

    const prevent = ["ArrowUp", "ArrowDown", "Enter", "Meta"];
    if(prevent.includes(e.key)) {
      e.preventDefault();
    } else {
      const hits: Actions = this.engine.search(this.input.value.trim());
      this.setResults(hits);
    }
  };

  setResults(actions: Actions) {
    this.context.actions = actions;
    this.results.actions = actions;

    if(actions.length > 0) {
      this.activateAction(0);
    }
  }

  setInputValue(value: string) {
    this.context.query = "";
    this.input.value = "";
  }

  activateAction(index: number) {
    const { actions } = this.context;
    if (index < actions.length && index > -1) {
      this.context.activeActionIndex = index;
      this.results.activeIndex = index;
    }
  }
}

const template = document.createElement("template");
template.innerHTML = `
  <div class="hotlight hidden">
    <div class="container">
      <div class="modal">
        <hotlight-input></hotlight-input>
        <hotlight-results></hotlight-results>
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

    <div class="debug"></div>

    <div class="backdrop" />
  </div>

  <style>
    .hidden {
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
      border: 1px solid #888;
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

    .hotlight-logo {
      color: white;
      margin: 5px 10px;
      /*display: flex;*/
      align-self: flex-end;
    }
  </style>
`;
