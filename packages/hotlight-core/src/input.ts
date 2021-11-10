import { Actions } from "./typings";
import { log } from "./utils";

export class Input extends HTMLElement {
  constructor() {
    super();
    this.component = this
      .attachShadow({
        mode: 'open'
      })

    this.component.appendChild(template.content.cloneNode(true));

    //this.parentsContainer = this.component.getElementById("parents-container");
    this.input = this.component.getElementById("input");

  }

  private renderParents() {
    /*
    if(this.lastParentCount < this._parents.length) {
      this.parentsContainer.classList.remove("show");
    }
    this.lastParentCount = this._parents.length;
    const frag = document.createDocumentFragment();

    this._parents.forEach(action => {
      const item = parentTemplate.content.cloneNode(true) as HTMLElement;
      item.querySelector(".parent-inner")!.innerHTML = action.title;
      frag.appendChild(item);
    });

    this.parentsContainer.innerHTML = "";
    this.parentsContainer.appendChild(frag);
    setTimeout(() => {
      this.parentsContainer.classList.add("show");
    }, 0);
    */
  }

  clear() {
    this.input.value = "";
  }

  set placeholder(value: string) {
    this.setAttribute("placeholder", value);
    this.input.setAttribute("value", value);
  }

  private component: any;
  private input: HTMLInputElement;
  //private parentsContainer: HTMLDivElement;
  //private _parents: Actions;
  //private lastParentCount: number;

  get value() {
    return this.input.value;
  }

  set value(value: string) {
    this.input.value = value;
  }

  set parents(value: Actions) {
    log(value)
    //this._parents = value;
    this.renderParents();
  }

  get parents() {
    return this.parents;
  }

  focus() {
    this.input.focus();
  }
}

const template = document.createElement("template");
template.innerHTML = `
  <form
    role="search"
    novalidate
    autocomplete="off"
  >
    <div id="parents-container"></div>
    <input
      id="input"
      type="text"
      class="text-input"
      autocomplete="off"
      spellcheck="false"
    />
  </div>

  <style>
    form {
      display: flex;
      margin: 0;
    }
    input {
      flex-grow: 1;
      font-size: 18px;
      color: var(--hl-text-color, rgba(255, 255, 255, 80%));
      padding: 10px;
      border: none;
      background: transparent;
    }
    input:placeholder {
      color: white;
    }
    input:focus {
      outline: none;
    }

    #parents-container {
      display: flex;
    }
    #parents-container.show div.parent:last-of-type {
      max-width: 100px;
      overflow: hidden;
    }
    .parent:last-of-type {
      max-width: 0;

      transition: max-width 0.2s;
    }
    .parent-inner {
      display: block;
      background: red;
      color: white;
      padding: 2px;
    }
  </style>
`;

const parentTemplate = document.createElement("template");
parentTemplate.innerHTML = `
  <div class="parent" style="padding: 10px; ">
    <span class="parent-inner"></span>
  </div>
`
