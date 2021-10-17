import { Config, Actions } from "./typings";
import "./hotlight.css";

const defaultConfig = {
  isOpen: false,
  stayOpened: false,
  query: "",
  maxHits: 20,
  placeholder: "What do you need?",
  
  sources: {},
}

const template = document.createElement("template");
template.innerHTML = `
  <div class="hotlight hidden">
    <div class="backdrop" />
    <div id="toggle">TOGGLE</div>

    <hotlight-input></hotlight-input>
    <hotlight-results></hotlight-results>
    <hotlight-banner><hotlight-banner>
  </div>

  <style>
    .hidden {
      display: none;
    }
  </style>
`;

export class Modal extends HTMLElement {
  constructor() {
    super();    
    this.component = this
      .attachShadow({
        mode: 'open'
      })

    this.component.appendChild(template.content.cloneNode(true));

    this._config = defaultConfig;
    this._actions = [];

    this.isOpen = this._config.isOpen;

    this.container = this.shadowRoot.querySelector(".hotlight");
    //this.modal = this.shadowRoot.querySelector(".modal-container");
    //this.backdrop = this.shadowRoot.querySelector(".modal-container");
    this.results = this.shadowRoot.querySelector("hotlight-results");

    this.input = this.shadowRoot.querySelector("hotlight-input");
    this.input.setAttribute("placeholder", this._config.placeholder);
    this.input.addEventListener("keydown", (e) => {
      const all = Array.from(new Array(40)).map((x, i) => ({
        title: `title ${i} ${new Date().getTime()}`,
        trigger: "/"
      }));

      this.results.actions = all;
    });

    window.addEventListener("keydown", (e) => {
      if(e.key === "k" && e.metaKey) {
        this.toggle();
        e.preventDefault();
      }
    });
  }

  private _config: Config;
  private _actions: Actions;
  private container: HTMLDivElement;
  private input: HTMLElement;
  private results: HTMLElement;
  private component: any;

  private isOpen: boolean;

  toggle() {
    this.isOpen = !this.isOpen;
    if(this.isOpen) {
      this.container.classList.remove("hidden");
    } else {
      this.container.classList.add("hidden");
    }
    console.log("TOGGLE");
  }

  /*
  static get observedAttributes() {
    return ['value'];
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === 'value') {
      console.log(attrName, oldValue, newValue);
      this.value = parseInt(newValue, 10);
    }
  }
  */

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

  launch() {
    if(!this.isOpen) {
      this.toggle();
    }
  }
}
