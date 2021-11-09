import Store from "../store/store";

type Props = {
  store?: Store;
  element?: HTMLElement;
  template?: HTMLTemplateElement;
}

//export default class Component {
export default class Component extends HTMLElement {
  protected render() {};
  protected element: HTMLElement;
  protected template: HTMLTemplateElement;
  protected root: ShadowRoot;

  constructor(props: Props = {}) {
    super();
    this.root = this
      .attachShadow({
        mode: "open"
      });

    this.root.appendChild(props.template.content.cloneNode(true));

    let self = this;

    // We're setting a render function as the one set by whatever inherits this base
    // class or setting it to an empty by default. This is so nothing breaks if someone
    // forgets to set it.
    //this.render = this.render || function() {};

    // If there's a store passed in, subscribe to the state change
    if(props.store instanceof Store) {
      props.store.events.subscribe("stateChange", () => self.render());
    }

    // Store the HTML element to attach the render to if set
    if(props.hasOwnProperty("element")) {
      this.element = props.element;
    }
  }
}

