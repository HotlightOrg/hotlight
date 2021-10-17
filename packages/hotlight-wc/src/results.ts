import { Action, Actions } from "./typings";

export class Results extends HTMLElement {
  constructor() {
    super();
    this.component = this
      .attachShadow({
        mode: 'open'
      })

    this.component.appendChild(template.content.cloneNode(true));
    this.list = this.component.getElementById("list");  
    this.actionTemplate = actionTemplate;
  }

  renderItem(action: Action) {
    const item = this.actionTemplate.content.cloneNode(true) as HTMLElement;
    const title = item.querySelector("#title");
    title.innerHTML = action.title;
    return item;
  }

  set actions(value: Actions) {
    this._actions = value;
    this.renderItems(value);
  }

  get actions() {
    return this._actions;
  }

  renderItems(actions: Actions) {
    const frag = document.createDocumentFragment();
    actions.forEach(action => {
      frag.appendChild(this.renderItem(action));
    });

    if(this.list.children.length > 0) {
      this.list.innerHTML = '';
      this.list.appendChild(frag);
    } else {
      this.list.appendChild(frag);
    }
  }

  private component: any;
  private list: HTMLElement;
  private actionTemplate: HTMLTemplateElement;
  private _actions: Actions;
}

//const predefinedTemplate = document.body.querySelector("#hotlight-action") as HTMLTemplateElement;
//const actionTemplate = predefinedTemplate ? predefinedTemplate : document.createElement("template");
const actionTemplate = document.createElement("template");
actionTemplate.innerHTML = `
  <div class="yo">
    <div id="title" class="title"></div>
  </div>
`;

const template = document.createElement("template");
template.innerHTML = `
  <div id="list"></div>
`;
