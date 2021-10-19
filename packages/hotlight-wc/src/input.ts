import { Actions } from "./typings";

export class Input extends HTMLElement {
  constructor() {
    super();
    this.component = this
      .attachShadow({
        mode: 'open'
      })

    this.component.appendChild(template.content.cloneNode(true));

    this.input = this.component.getElementById("input");
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
  private _parents: Actions;

  get value() {
    return this.input.value;
  }

  set value(value: string) {
    this.input.value = value;
  }

  set parents(value: Actions) {
    this._parents = value;
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
  >
    <input
      id="input"
      type="text"
      class="text-input"
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
      color: white;
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
  </style>
`;
