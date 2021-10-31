// src/hotlight.ts
var defaultConfig = {
  isOpen: false,
  stayOpened: false,
  query: "",
  maxHits: 20,
  placeholder: "What do you need?",
  sources: {}
};
var template = document.createElement("template");
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
var Modal = class extends HTMLElement {
  constructor() {
    super();
    this.component = this.attachShadow({
      mode: "open"
    });
    this.component.appendChild(template.content.cloneNode(true));
    this._config = defaultConfig;
    this._actions = [];
    this.isOpen = this._config.isOpen;
    this.container = this.shadowRoot.querySelector(".hotlight");
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
      if (e.key === "k" && e.metaKey) {
        this.toggle();
        e.preventDefault();
      }
    });
  }
  toggle() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.container.classList.remove("hidden");
    } else {
      this.container.classList.add("hidden");
    }
    console.log("TOGGLE");
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
  launch() {
    if (!this.isOpen) {
      this.toggle();
    }
  }
};
export {
  Modal
};
