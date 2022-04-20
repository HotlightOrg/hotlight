import { getHintCharacters, depthNeeded } from "../hotkey-utils";

const hintsTemplate = document.createElement("template");
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
}
.hint {
  position: absolute;
  text-transform: var(--hl-hotkey-text-transform, uppercase);
  font-size: var(--hl-hotkey-font-size, 14px);
  background: var(--hl-hotkey-bg, rgba(0, 0, 0, 90%));
  color: var(--hl-hotkey-color, rgba(255, 255, 255, 100%));
  padding: var(--hl-hotkey-padding, 2px 5px);
  border-radius: var(--hl-hotkey-radius, 3px);
}
.hint .h {
  font-weight: var(--hl-hint-highlight-font-weight, bold);
  text-decoration: var(--hl-hint-highlight-text-decoration, underline);
}
</style>
`;

/*
 * Holds all hints, its injected top level, also the main component holding event handlers etc
 */
class HotlightHints extends HTMLElement {
  private root: ShadowRoot;
  private me: HTMLElement;
  private query: string;
  private hits: string[] = [];
  private currentHintableElements: {
    [hint: string]: Element;
  } = {};

  private scrollListener: EventListener;
  private mouseDownListener: EventListener;
  private keyDownListener: EventListener;

  constructor() {
    super();

    this.root = this.attachShadow({
      mode: "open",
    });

    this.root.appendChild(hintsTemplate.content.cloneNode(true));

    this.me = this.root.querySelector(".container");
    this.hide();

    let ticking = false;
    this.scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          this.positionHints();
          ticking = false;
        });

        ticking = true;
      }
    };

    this.mouseDownListener = () => {
      this.hide();
    };

    this.keyDownListener = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.ctrlKey || e.metaKey || e.key === "Tab") {
        this.hide();
        return;
      }

      if (e.key === "f" && !this.keepFocus(e.target)) {
        this.toggle();
        return;
      }

      if (this.isActive()) {
        const hits = this.search(e.key);
        if (hits && hits.length === 1) {
          this.execute(hits[0], e);
          this.hide();
        } else {
          this.query = ""; // reset if no match
        }
      } else if (!this.keepFocus(e.target)) {
        this.scroll(e);
      }

      this.positionHints();
    };
  }

  connectedCallback() {
    window.addEventListener("scroll", this.scrollListener);
    window.addEventListener("mousedown", this.mouseDownListener);
    window.addEventListener("keydown", this.keyDownListener);
  }

  detachedCallback() {
    window.removeEventListener("scroll", this.scrollListener);
    window.removeEventListener("mousedown", this.mouseDownListener);
    window.removeEventListener("keydown", this.keyDownListener);
  }

  hide() {
    this.me.style.display = "none";
    this.query = "";
    this.hits = [];
  }

  show() {
    this.me.style.display = "initial";
    this.positionHints();
  }

  isActive() {
    return this.me.style.display !== "none";
  }

  toggle() {
    if (this.isActive()) {
      this.hide();
    } else {
      this.show();
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

    switch (target.tagName.toLowerCase()) {
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
    const hits = Object.keys(this.currentHintableElements).filter((hint) =>
      hint.match(re)
    );
    this.hits = hits;
    return hits;
  }

  positionHints() {
    const all = this.querySelectorAll(
      "hotlight-hintszone a, hotlight-hintszone button, hotlight-hintszone input, hotlight-hintszone textarea, hotlight-hintszone [contenteditable]"
    );
    const onlyInViewAndEnabled = [...all].filter(
      (el) =>
        this.inView(el) &&
        typeof (el as HTMLElement).dataset["hintDisabled"] === "undefined"
    );

    const available = "asdghjklqweruio";
    const charsNeeded = depthNeeded(available, onlyInViewAndEnabled.length);

    this.me.innerHTML = "";

    const fragment = new DocumentFragment();

    this.currentHintableElements = onlyInViewAndEnabled.reduce(
      (prev, curr, index) => {
        const key = getHintCharacters(index, charsNeeded, available);

        const { x, y } = curr.getBoundingClientRect();

        if (
          (this.hits.length > 0 && this.hits.includes(key)) ||
          this.hits.length === 0
        ) {
          const highlight =
            this.hits.length !== 0
              ? `<span class="h">${this.query}</span>`
              : "";

          const hint = document.createElement("div");
          hint.className = "hint";
          hint.innerHTML = highlight + key.replace(this.query, "");
          hint.style.top = y + "px";
          hint.style.left = x + "px";
          fragment.appendChild(hint);
        }

        return {
          ...prev,
          [key]: curr,
        };
      },
      {}
    );

    this.me.appendChild(fragment);
  }

  keepFocus(el) {
    const input = el.tagName === "INPUT";
    const triggerable = ["checkbox", "radio", "submit", "reset"];

    if (
      input &&
      ((el.type && !triggerable.includes(el.type.toLowerCase())) || !el.type)
    ) {
      return true;
    }

    if (!!el.getAttribute("contentEditable")) return true;

    if (el.tagName === "TEXTAREA") return true;

    return false;
  }

  inView(el) {
    const rect = el.getBoundingClientRect();

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  scroll(e) {
    const scrollBy = {
      d: 400,
      u: -400,
      j: 100,
      k: -100,
    };
    if (Object.keys(scrollBy).includes(e.key)) {
      window.scrollBy({
        top: scrollBy[e.key],
        behavior: "smooth",
      });
    }
  }
}

customElements.define("hotlight-hints", HotlightHints);

const zoneTemplate = document.createElement("template");
zoneTemplate.innerHTML = `<slot></slot>`;

class HotlightHintszone extends HTMLElement {
  private root: ShadowRoot;

  constructor() {
    super();
    this.root = this.attachShadow({
      mode: "open",
    });

    this.root.appendChild(hintsTemplate.content.cloneNode(true));
  }
}

customElements.define("hotlight-hintszone", HotlightHintszone);
