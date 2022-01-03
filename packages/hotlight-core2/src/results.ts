import Component from './lib/component';
import { Action, Actions } from "./typings";
import { underscore } from "./utils";
import store from "./store/index";

export class Results extends Component {
  constructor() {
    super({
      template,
      store
    });

    this.results = this.root.getElementById("results")!;
    this.activeHit = this.root.getElementById("active-hit")!;
    this.actionTemplate = actionTemplate;

    this.results.addEventListener("mouseover", (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if(target && target.classList.contains("hit") && target.parentNode) {
        const index = Array.from(target.parentNode.children).indexOf(target);
        store.dispatch("activateIndex", index);
      }
    });

    this.moveActiveHit(-1);
  }

  moveActiveHit(index: number) {
    if(index === -1) {
      this.activeHit.classList.add("hidden");
    } else {
      this.activeHit.classList.remove("hidden");
    }

    if(!store.state.actions) {
      return; // happens if a query is triggered from ie initialState before ref is there
    }

    const { top: resultsTop, height: resultsHeight } = this.results.getBoundingClientRect();
    const child = this.results.children[index];
    if(child) {
      const currentlyActive = this.results.querySelector(".active");
      if(currentlyActive) {
        currentlyActive.classList.remove("active");
      }
      child.classList.add("active");

      const { top } = child.getBoundingClientRect();
      const height = 32;

      const offset = resultsTop - top;

      if(top > resultsTop + resultsHeight) {
        this.results.scrollTo({ top: (height*index), behavior: "auto" });
      } else if(offset > 0) {
        this.results.scrollTo({ top: (height*index), behavior: "auto" });
      }

      if(this.activeHit) {
        this.activeHit.classList.remove("hidden");
        this.activeHit.style.transform = `translateY(${height*index}px)`;
        this.activeHit.style.height = `${height}px`; 
      }
    }
  }

  renderItem(action: Action, index: number) {
    const item = this.actionTemplate.content.cloneNode(true) as HTMLElement;
    const title = item.querySelector(".title");

    if(!title) return item;

    if(index === store.state.activeActionIndex) {
      title.classList.add("active");
    }
    title.innerHTML = underscore(store.state.query, action.title);

    return item;
  }

  renderItems(actions: Actions) {
    const frag = document.createDocumentFragment();
    actions.forEach((action, index) => {
      frag.appendChild(this.renderItem(action, index));
    });

    if(this.results.children.length > 0) {
      this.results.innerHTML = '';
      this.results.appendChild(frag);
    } else {
      this.results.appendChild(frag);
    }
    this.results.classList.remove("enter-active");
  }

  render() {
    this.moveActiveHit(store.state.activeActionIndex);
    this.renderItems(store.state.actions);
  }

  private results: HTMLElement;
  private activeHit: HTMLElement;
  private actionTemplate: HTMLTemplateElement;
}

const actionTemplate = document.createElement("template");
actionTemplate.innerHTML = `
  <div
    tabindex="0"
    class="hit"
  >
    <div class="title">
      Title       
    </div>
    <span class="category"></span>
  </div>
`;

const template = document.createElement("template");
template.innerHTML = `
  <div id="list" class="enter-active">
    <div id="results"></div>
    <div id="active-hit"></div>
  </div>

  <style>
    #list {
      position: relative;
    }

    .results {
      position: relative;
      max-height: 200px;
      overflow-y: auto;
    }

    .hit {
      display: flex;
      align-items: center;
      position: relative;
      font-size: 16px;
      padding: 0 20px;
      cursor: pointer;
      color: var(--hl-hit-color, gray);
      height: 32px;

      transition: color 0.2s ease;
    }
    .hit-inner {
      position: absolute;
      z-index: 10;
    }
    .enter-active .active {
      transition: none;
    }

    .active {
      color: var(--hl-active-hit-color, white);
    }
    #active-hit {
      display: flex;
      position: absolute;
      top: 0;
      z-index: 1;
      cursor: pointer;
      pointer-events: none;

      transition: transform 0.05s ease, color 0.1s ease;

      color: var(--hl-active-hit-color, white);
      background: var(--hl-active-hit-background, rgba(255, 255, 255, 10%));
      border-radius: var(--hl-active-hit-radius, 3px);
      height: 32px;
      width: calc(100% - 20px);
      margin: 0 10px;
    }
    #active-hit.hidden {
      background: rgba(255, 255, 255, 0);
    }

    .category {
      color: #999;
    }

    .u {
      text-decoration: var(--hl-underscore-decoration, underline);
      font-weight: var(--hl-underscore-font-weight, bold);
    }
  </style>
`;
