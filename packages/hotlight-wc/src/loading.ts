import Component from './lib/component';
import store from './store/index';

export class Loading extends Component {
  constructor() {
    super({
      store,
      element: document.querySelector('hotlight-loading'),
      template
    });
  }

  render(): void {
    const { loading } = store.state;

    this.root.innerHTML = loading ? "yo" : "no";
  }
}

const template = document.createElement("template");
template.innerHTML = `<strong>What?</strong>`;

