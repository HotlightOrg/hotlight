import Component from './lib/component';
import store from './store/index';

export class Loading extends Component {
  private indicator: HTMLElement;
  //private loadingIndicatorDelay: number;

  constructor() {
    super({
      store,
      template
    });

    this.indicator = this.root.querySelector(".loading-indicator")!;
  }

  render(): void {
    const { loading } = store.state;

    if(loading) {
    //  this.loadingIndicatorDelay = window.setTimeout(() => {
        this.indicator.classList.remove("hidden");
    //  }, 700);
    } else {
      this.indicator.classList.add("hidden");
    //  window.clearTimeout(this.loadingIndicatorDelay);
    }
  }
}

const template = document.createElement("template");
template.innerHTML = `
  <div class="loading-indicator hidden"><span>.</span></div>
  <style>
    .loading-indicator {
      flex-grow: 1;
      font-size: 24px;
      transition: opacity 1s;
      opacity: 1;
      color: var(--hl-loading-color, #777);
    }
    .loading-indicator.hidden {
      opacity: 0;
    }
    .loading-indicator span {
      animation: flickerAnimation 1s infinite;
    }

    @keyframes flickerAnimation {
      0%   { opacity:1; }
      50%  { opacity:0; }
      100% { opacity:1; }
    }
  </style>
`;

