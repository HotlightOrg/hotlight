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

  set placeholder(value: string) {
    this.setAttribute("placeholder", value);
    this.input.setAttribute("value", value);
  }

  private component: any;
  private input: HTMLElement;
}

const template = document.createElement("template");
template.innerHTML = `
  <div>
    <input
      id="input"
      type="text"
    />
  </div>
`;
