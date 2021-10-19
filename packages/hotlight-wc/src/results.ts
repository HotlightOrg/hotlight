import { Action, Actions } from "./typings";

export class Results extends HTMLElement {
  constructor() {
    super();
    this.component = this
      .attachShadow({
        mode: 'open'
      })

    this.component.appendChild(template.content.cloneNode(true));
    this.results = this.component.getElementById("results");  
    this.list = this.component.getElementById("list");  
    this.activeHit = this.component.getElementById("active-hit");  
    this.actionTemplate = actionTemplate;

    this.results.addEventListener("mouseover", (e: MouseEvent) => {
      if(e.target.classList.contains("hit")) {
        const index = Array.from(e.target.parentNode.children).indexOf(e.target);
        this.hoverHit(index);
      }
    });
  }

  renderItem(action: Action, index: number) {
    const item = this.actionTemplate.content.cloneNode(true) as HTMLElement;
    const title = item.querySelector(".title");
    if(index === this.activeIndex) {
      title.classList.add("active");
    }
    title.innerHTML = action.title;
    return item;
  }

  set actions(value: Actions) {
    this._actions = value;
    this.renderItems(value);
    if(value.length === 0) {
      this.moveActiveHit(-1);
    }
  }

  get actions() {
    return this._actions;
  }

  set activeIndex(value: number) {
    this.moveActiveHit(value);
  }

  hoverHit(index: number) {
    this.moveActiveHit(index);
    this.component.dispatchEvent(new CustomEvent("hover-hit", {
      detail: index,
      bubbles: true,
      composed: true
    }));
  }

  moveActiveHit(index: number) {
    if(index === -1) {
      this.activeHit.classList.add("hidden");
    }

    if(!this._actions) {
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
    }

    if(child) {
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
  }

  private component: any;
  private list: HTMLElement;
  private results: HTMLElement;
  private activeHit: HTMLElement;
  private actionTemplate: HTMLTemplateElement;
  private _actions: Actions;
}

//const predefinedTemplate = document.body.querySelector("#hotlight-action") as HTMLTemplateElement;
//const actionTemplate = predefinedTemplate ? predefinedTemplate : document.createElement("template");

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
    //<ResultLocation trigger={trigger} />

const template = document.createElement("template");
template.innerHTML = `
  <div id="list">
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
      color: grey;
      height: 32px;

      transition: color 0.1s ease;
    }
    .hit-inner {
      position: absolute;
      z-index: 10;
    }

    .active {
      color: white;
    }
    #active-hit {
      display: flex;
      position: absolute;
      top: 0;
      z-index: 1;
      cursor: pointer;
      pointer-events: none;

      transition: transform 0.05s ease, color 0.1s ease;

      background: rgba(255, 255, 255, 0.2);
      border-radius: 3px;
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

    /* underscoring matches */
    .u {
      text-decoration: underline;
      font-weight: bold;
    }
  </style>
`;
