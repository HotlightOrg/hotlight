const template = document.createElement('template');
template.innerHTML = `
  <span class="hl-hotkey-wrapper">
    <span class="hl-hotkey-key"></span>
  </span>
  <slot></slot>
  <style>
    .hl-hotkey-wrapper {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
      position: relative;
      width: 0;
      height: 0;
    }
    .hl-hotkey-key {
      position: absolute;
      top: 0;
      left: 0;
      font-size: var(--hl-hotkey-font-size, 12px);
      background: var(--hl-hotkey-bg, rgba(0, 0, 0, 90%));
      color: var(--hl-hotkey-color, rgba(255, 255, 255, 100%));
      padding: var(--hl-hotkey-padding, 2px 5px);
      border-radius: var(--hl-hotkey-radius, 3px);
    }
  </style>
`;

const ATTRIBUTE = "key";
const STORE_NODE = document.body;
const STORE_DATA_KEY = "hotlightHotkeys";

export class Hotkey extends HTMLElement {
  private active = false;
  private root: ShadowRoot;
  private visualKey: HTMLElement;

  // to remove same listener instance with removeEventListener
  private listener: any;
  private deactivateListener: any;

  private key: string;
  private auto: boolean;

  constructor() {
    super();

    this.root = this
      .attachShadow({
        mode: "open"
      });

    this.root.appendChild(template.content.cloneNode(true));
    this.visualKey = this.root.querySelector(".hl-hotkey-key");

    const auto = this.getAttribute("auto");
    this.auto = !!auto;

    const key = this.getAttribute(ATTRIBUTE) || this.dataset[ATTRIBUTE];
    if(key) this.key = key.toLowerCase();

    this.render();
    this.toggle();

    this.listener = this.listen.bind(this);
    this.deactivateListener = this.deactivate.bind(this);
  }

  connectedCallback() {
    document.addEventListener("keydown", this.listener);
    document.addEventListener("click", this.deactivateListener);

    this.register();
  }

  attributeChangedCallback(_name: string, _oldValue: string, newValue: string) {
    this.key = newValue.toLowerCase();
    this.render();
  }

  static get observedAttributes() { return [ATTRIBUTE, `data-${ATTRIBUTE}`]; }

  disconnectedCallback() {
    document.removeEventListener("keydown", this.listener);
    document.removeEventListener("click", this.deactivateListener);
    this.deregister();
  }

  register() {
    const present = STORE_NODE.dataset[STORE_DATA_KEY];

    if(!present) {
      STORE_NODE.dataset[STORE_DATA_KEY] = [this.key].join(",");
    } else if(this.key) {
      const presentKeys = present.split(",")
      if(presentKeys.includes(this.key)) {
        console.warn(`Hotkey: ${this.key} is already in view`);
      } else {
        STORE_NODE.dataset[STORE_DATA_KEY] = [presentKeys, this.key].join(",");
      }
    }
  }

  deregister() {
    const present = STORE_NODE.dataset[STORE_DATA_KEY];
    STORE_NODE.dataset[STORE_DATA_KEY] = present
      .split(",")
      .filter(key => key !== this.key)
      .join(",");
  }

  deactivate() {
    this.active = false;
    this.toggle();
  }

  listen(e) {
    const tagName = e.target ? e.target.tagName.toLowerCase() : "";
    const key = e.key.toLowerCase();

    const contentEditable = e.target.getAttribute("contenteditable");
    const enabled = !["input", "textarea"].includes(tagName) && !contentEditable && !tagName.includes("-") // custom elements
    if(!enabled) return;

    if(key === this.key && !e.metaKey) {
      this.triggerTarget(e);
    }

    if(
      key === "f" &&
      !this.active
    ) {
      this.active = true;
    } else {
      this.active = false;
    }
    this.toggle();
  }

  toggle() {
    if(this.active) {
      this.visualKey.style.display = "inline";
    } else {
      this.visualKey.style.display = "none";
    }
  }

  render() {
    if(this.key && !this.auto) {
      this.visualKey.innerHTML = this.key;
    }
  }

  // first input, button or link
  triggerTarget(e) {
    const explicit = this.querySelector("[data-hotkey-target]");
    const vague = this.querySelector("input, button, a, textarea, [contenteditable]");

    const found = explicit || vague;
    if (!found) return;

    const contentEditable = found.getAttribute("contenteditable");
    if (!!contentEditable) {
      (found as HTMLElement).focus();
      e.preventDefault();
      return;
    }

    switch(found.tagName.toLowerCase()) {
      case "button":
      case "a":
        (found as HTMLElement).click();
        break;
      case "input":
      case "textarea":
        (found as HTMLElement).focus();
        e.preventDefault();
        break;
    }
  }
}

customElements.define("hotlight-hotkey", Hotkey);

/*
const actionsTemplate = document.createElement('template');
actionsTemplate.innerHTML = `
  <slot></slot>
`;

export class Actions extends HTMLElement {
  private root: ShadowRoot;

  constructor() {
    super();

    this.root = this
      .attachShadow({
        mode: "open"
      });

    this.root.appendChild(actionsTemplate.content.cloneNode(true));
  }

  connectedCallback() {
  }

  disconnectedCallback() {
  }
}
customElements.define("hotlight-actions", Actions);

*/
