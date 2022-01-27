import { getHintCharacters, availableCharacters, depthNeeded } from "../hotkey-utils";

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

customElements.define("hotlight-hotkey-old", Hotkey);

/* KEYZONE */
const actionsTemplate = document.createElement('template');
actionsTemplate.innerHTML = `
  <span class="hotlight-keyzone">
    <slot></slot>
  </span>
  <style>
    .hotlight-keyzone {
      border-radius: 5px;
      outline: 2px dotted black;
      background: #f2f2f2;
    }
  </style>
`;

export class Keyzone extends HTMLElement {
  private root: ShadowRoot;
  private parentRoot: Node;
  private listener: any;
  private deactivateListener: any;
  private active: boolean;
  private alphabet: string[];

  constructor() {
    super();

    this.root = this
      .attachShadow({
        mode: "open"
      });

    this.parentRoot = this.getRootNode({ composed: true });

    this.root.appendChild(actionsTemplate.content.cloneNode(true));

    this.listener = this.listen.bind(this);
    
    this.active = false;

    const atoz = [...'abcdefghijklmnopqrstuvwxyz'];
    // a 
    this.alphabet = atoz.filter(x => x !== "f");
    /*
      .reduce((prev, curr, index) => {
       
      }, [])
      */

    this.parentRoot.KeyzoneKeys = this.parentRoot.KeyzoneKeys || this.alphabet;

    this.parentRoot.KeyzoneKeyz = this.parentRoot.KeyzoneKeyz || {
      keys: this.alphabet,
      register: (key: string | undefined, foundCount: number) => {
        if(key) {
          const index = this.parentRoot.KeyzoneKeyz.keys.indexOf(key);
          if(index === -1) {
            console.warn(`${key} key not available`);
          } else {
            return this.parentRoot.KeyzoneKeyz.keys.splice(index, 1);
          }
        }

        return this.parentRoot.KeyzoneKeyz.keys.shift();
      },
      deregister: (key: string) => {
        this.parentRoot.KeyzoneKeyz.keys.push(key);
      }
    }
    //this.listener = this.listen.bind(this);
    
    this.parentRoot.addEventListener("keydown", this.listener);

    //this.deactivateListener = this.deactivate.bind(this);
  }

  generateKeyRegistry(foundCount: number) {
    let alphabet = 'abcdefghijklmnopqrstuvwxyz';
    //const alphabet = [...];
    const digits = Math.log(foundCount) / Math.log(alphabet.length);
    //const times = Math.ceil(alphabet.length / foundCount);

    if (foundCount > 25) {
      return alphabet
    }
  }

  toggle(active?: boolean) {
    this.active = typeof active !== "undefined" ? active : !this.active;
    const event = new CustomEvent("hotlight:hotkey:toggle", {
      detail: {
        active: this.active
      }
    });
    this.parentRoot.dispatchEvent(event);
  }

  connectedCallback() {
  }

  disconnectedCallback() {
  }

  shouldActivate(e) {
    const contentEditable = e.target.getAttribute("contenteditable");
    const inputTypes = ["radiobutton", "checkbox"];
    if(inputTypes.includes(e.target.type)) return true;

    const enabled = !["INPUT", "TEXTAREA"].includes(e.target.tagName) && !contentEditable && !e.target.tagName.includes("-") // custom elements
    return enabled;
  }

  listen(e) {
    const key = e.key ? e.key.trim().toLowerCase() : null;
    if(!key || e.metaKey || e.ctrlKey) return;

    this.assignAll(e);

    if (key === "f" && this.shouldActivate(e)) {
      this.toggle(!this.active);
    } else if (key === "escape" && this.active) {
      this.toggle(false);
    } else if (this.shouldActivate(e)) {
      this.trigger(e);
      this.toggle(false);
    }
  }

  trigger(event) {
    const hotkey = this.querySelector(`[data-hotkey=${event.key.toLowerCase()}]`);
    if(!hotkey) return;

    switch(hotkey.tagName) {
      case "INPUT":
      case "TEXTAREA":
      case "DIV":
        hotkey.focus();
        event.preventDefault();
        break;
      case "BUTTON":
      case "A":
        hotkey.click();
        break;
    }
  }

  wrap(el, wrapper) {
    if (el && el.parentNode) {
      el.parentNode.insertBefore(wrapper, el);
      wrapper.appendChild(el);
    }
  }

  assignAll(event) {
    if(window.hotkeyActive == true) return;

    const taken = this.parentRoot.querySelectorAll("[data-hotkey]");
    const elements = this.parentRoot.querySelectorAll("hotlight-keyzone input:not([data-hotkey][data-hotkey-disabled]), hotlight-keyzone button:not([data-hotkey][data-hotkey-disabled]), hotlight-keyzone a:not([data-hotkey][data-hotkey-disabled]), hotlight-keyzone textarea:not([data-hotkey][data-hotkey-disabled]), hotlight-keyzone [contenteditable]:not([data-hotkey][data-hotkey-disabled])");
    const allFound = [...taken, ...elements];

    const takenChars = [...taken].map(el => el.dataset.hotkey);
    const available = availableCharacters("abcdefghijklmno", takenChars);
    console.log(available);

    this.assign(taken, takenChars, 1);
    this.assign(elements, available, allFound.length);

    window.hotkeyActive = true;
  }

  assign(elements, available, totalFound) {
    const charsNeeded = depthNeeded(available, totalFound);
    console.log(charsNeeded, available.length, totalFound)

    elements.forEach((el, i) => {
      const key = getHintCharacters(i, charsNeeded, available);

      const data = el.dataset;

      if(data.hotkey && el.parentNode.tagName !== "HOTLIGHT-KEY") {
        this.wrap(el, this.parentRoot.createElement("hotlight-key"));
        //el.parentNode.key = this.parentRoot.KeyzoneKeyz.register(data.hotkey, totalFound);
        el.parentNode.key = key;
        return;
      } else if(!data.hotkey) {
        this.wrap(el, this.parentRoot.createElement("hotlight-key"));
        data.hotkey = key;
        el.parentNode.key = data.hotkey;
      }

    });
  }



  /*
  pick(key: string | undefined, foundCount: number) {
    if(key) {
      const index = window.KeyzoneKeys.indexOf(key);
      if(index === -1) {
        console.warn(`${key} key not available`);
      } else {
        return window.KeyzoneKeys.splice(index, 1);
      }
    }

    return window.KeyzoneKeys.shift();
  }
  */
}
customElements.define("hotlight-keyzone", Keyzone);

const wrapperTemplate = document.createElement('template');
wrapperTemplate.innerHTML = `
  <span class="hotlight-hotkey-wrapper">
    <span class="hotlight-hotkey"></span>
  </span>
  <slot></slot>
  <style>
    .hotlight-hotkey-wrapper {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
      position: relative;
      width: 0;
      height: 0;
    }
    .hotlight-hotkey {
      position: absolute;
      top: 0;
      left: 0;
      text-transform: var(--hl-hotkey-text-transform, uppercase);
      font-size: var(--hl-hotkey-font-size, 12px);
      background: var(--hl-hotkey-bg, rgba(0, 0, 0, 90%));
      color: var(--hl-hotkey-color, rgba(255, 255, 255, 100%));
      padding: var(--hl-hotkey-padding, 2px 5px);
      border-radius: var(--hl-hotkey-radius, 3px);
    }
  </style>
`;

export class HotkeyWrapper extends HTMLElement {
  private root: ShadowRoot;
  private keyDisplay: HTMLElement;
  private listener: any;

  constructor() {
    super();
    this.root = this
      .attachShadow({
        mode: "open"
      });

    this.root.appendChild(wrapperTemplate.content.cloneNode(true));
    this.keyDisplay = this.root.querySelector(".hotlight-hotkey");
    this.listener = this.listen.bind(this);
  }

  connectedCallback() {
    document.addEventListener("hotlight:hotkey:toggle", this.listener);
  }
  disconnectedCallback() {
    this.getRootNode({ composed: true }).KeyzoneKeyz.deregister(this.keyDisplay.textContent);
    document.removeEventListener("hotlight:hotkey:toggle", this.listener);
  }

  listen(e) {
    this.keyDisplay.style.display = !!e.detail.active ? "block" : "none";
  }

  set key(val: string) {
    this.keyDisplay.innerText = val;
  }
}

customElements.define("hotlight-key", HotkeyWrapper);


const hintsTemplate = document.createElement('template');
hintsTemplate.innerHTML = `
<slot></slot>
<div class="container">
</div>
<style>
.container {
  position: fixed;
  pointer-events: none;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  border: 1px solid blue;
}
.hint {
  position: absolute;
  text-transform: var(--hl-hotkey-text-transform, uppercase);
  font-size: var(--hl-hotkey-font-size, 12px);
  background: var(--hl-hotkey-bg, rgba(0, 0, 0, 90%));
  color: var(--hl-hotkey-color, rgba(255, 255, 255, 100%));
  padding: var(--hl-hotkey-padding, 2px 5px);
  border-radius: var(--hl-hotkey-radius, 3px);
}
</style>
`;

/*
 * Holds all hints, its injected top level, also the main component holding event handlers etc
 */
class HotlightHints extends HTMLElement {
  private root: ShadowRoot;
  private me: Node;
  private query: string;
  private hits: string[] = [];
  private currentHintableElements: {
    [hint: string]: Element;
  } = {};

  constructor() {
    super();

    this.root = this
      .attachShadow({
        mode: "open"
      });
    this.root.appendChild(hintsTemplate.content.cloneNode(true));

    this.me = this.root.querySelector(".container");
    this.query = "";
    
    window.addEventListener("scroll", () => {
      this.positionHints();
    });

    window.addEventListener("keydown", (e) => {
      if(e.key === "Escape" || e.ctrlKey || e.metaKey) {
        this.hide();
        return;
      }

      if(e.key === "f") {
        this.toggle();
        return;
      }

      const hits = this.search(e.key);
      if(hits && hits.length === 1) {
        this.execute(hits[0], e);
        this.hide();
      }

      this.positionHints();
    });
  }

  hide() {
    this.me.style.display = "none";
    this.query = "";
    this.hits = [];
  }

  show() {
    this.me.style.display = "initial";
    this.findAll();
    this.positionHints();
  }

  toggle() {
    if(this.me.style.display === "none") {
      this.show();
    } else {
      this.hide();
    }
  }

  execute(el, e) {
    const target = this.currentHintableElements[el];

    const contentEditable = target.getAttribute("contentEditable");
    if (!!contentEditable) {
      (target as HTMLElement).focus();
      e.preventDefault();
      return;
    }

    switch(target.tagName.toLowerCase()) {
      case "button":
      case "a":
        (target as HTMLElement).click();
        break;
      case "input":
      case "textarea":
        (target as HTMLElement).focus();
        e.preventDefault();
        break;
    }

  }

  search(key: string) {
    this.query += key.toLowerCase();
    const re = new RegExp(`^${this.query}`);
    const hits = Object.keys(this.currentHintableElements).filter(hint => hint.match(re));
    console.log(hits, Object.keys(this.currentHintableElements), re);
    this.hits = hits;
    return hits;
  }

  positionHints() {
    const all = this.querySelectorAll("hotlight-keyzone2 a, hotlight-keyzone2 button, hotlight-keyzone2 input, hotlight-keyzone2 textarea, hotlight-keyzone2 [contenteditable]");
    const onlyInView = [...all].filter(el => this.inView(el));

    const available = "asdfghjklqweruio";
    const charsNeeded = depthNeeded(available, onlyInView.length);

    //this.currentHintableElements = onlyInView;

    this.me.innerHTML = "";

    const fragment = new DocumentFragment()

    this.currentHintableElements = onlyInView.reduce((prev, curr, index) => {
      const key = getHintCharacters(index, charsNeeded, available);

      const { x, y } = curr.getBoundingClientRect();

      if ((this.hits.length > 0 && this.hits.includes(key)) || this.hits.length === 0) {
        const hint = document.createElement("div");
        hint.className = "hint";
        hint.textContent = key;
        hint.style.top = y + "px";
        hint.style.left = x + "px";
        fragment.appendChild(hint);
      }

      return {
        ...prev,
        [key]: curr
      }
    }, {});

    //this.currentHintableElements.forEach((el, i) => {
    /*
    Object.entries(this.currentHintableElements).forEach(([hintChars, el], i) => {
      const key = getHintCharacters(i, charsNeeded, available);

    });
    */

    this.me.appendChild(fragment)
  }

  findAll() {
    //console.log("in view", onlyInView.length)
  }

  inView(el) {
    const rect = el.getBoundingClientRect();

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
}
customElements.define("hotlight-hints", HotlightHints);

const keyzoneTemplate = document.createElement('template');
keyzoneTemplate.innerHTML = `
<slot></slot>
`;

class HotlightKeyzone2 extends HTMLElement {
  private root: ShadowRoot;
  private parentRoot: Node;

  constructor() {
    super();

    this.parentRoot = this.getRootNode({ composed: true });
    this.root = this.attachShadow({ mode: "open" }); //mode: "closed" });
    this.root.appendChild(keyzoneTemplate.content.cloneNode(true));

    console.log(this.parentRoot.querySelector("hotlight-hints"))
  }


}
customElements.define("hotlight-keyzone2", HotlightKeyzone2);

