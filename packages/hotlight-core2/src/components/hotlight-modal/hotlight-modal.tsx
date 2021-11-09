import { Host, Component, Listen, State, Prop, h } from '@stencil/core';
import { HotlightContext } from "../../utils/fuzzy";

const initialConfig: HotlightConfig = {
  opened: false,
  stayOpened: false,
  query: null,
  maxHits: 10,

  placeholder: "What do you need?",

  sources: {}
}

export type Source = (query: string) => Promise<HotlightAction[]>;

export type HotlightConfig = {
  opened?: boolean;
  stayOpened?: boolean;
  query?: string;
  maxHits?: number;

  placeholder?: string;

  sources?: {
    [name: string]: Source;
  }

  //log?: boolean;

  //token?: string;
}

export type Trigger = (query: string, context: HotlightContext) => void | string;

export type HotlightAction = {
  title: string;
  alias?: string;
  description?: string;
  hotkeys?: string;
  category?: string;
  trigger: Trigger; // if it's a url it will be redirected
  parentTitle?: string; // if this is a sub page
}

@Component({
  tag: 'hotlight-modal',
  styleUrl: 'hotlight-modal.css',
  shadow: true,
})
export class HotlightModal {
  @Prop() config: HotlightConfig = initialConfig;
  @Prop() actions: HotlightAction[] = [];
  @State() opened: boolean;
  @State() hidden: boolean;
  private container?: HTMLDivElement;
  private modal?: HTMLDivElement;
  private backdrop?: HTMLDivElement;

  componentDidRender() {
    if(this.opened) {
      document.body.style.overflowY = "hidden";
      this.container?.classList.remove("hidden");
      this.backdrop?.classList.remove("hidden");
      this.modal?.classList.remove("hidden");
    } else {
      setTimeout(() => {
        document.body.style.overflowY = "auto";
      }, 300); // approx the transition time
      this.container?.classList.add("hidden");
      this.backdrop?.classList.add("hidden");
      this.modal?.classList.add("hidden");
    }
  }

  componentWillLoad() {
    if(this.config.opened) {
      this.open();
    }
  }

    /*
  set config(val) {
    if(val) {
      this.setAttribute('config', {
        ...initialConfig,
        val
      });
    }
  }

  mergeDefault(newVal: HotlightConfig, oldVal: HotlightConfig) {
    console.log(newVal, oldVal);
    //this.config = { ...initialConfig, ...newVal };
    console.log(this.config);
  }
     */

  @Listen('keydown', { target: 'window' })
  handleOpen(e: KeyboardEvent) {
    if(e.key === "k" && e.metaKey) { // cmd/ctrl + k
      this.toggle();
      e.preventDefault();
    }
  }

  @Listen('commandk:trigger', { target: 'window' })
  handleTriggerEvent() {
    this.close();
  }

  // other can trigger open with custom event
  @Listen('commandk:open', { target: 'window' })
  handleOpenEvent() {
    this.open();
  }

  // other can trigger close with custom event
  @Listen('commandk:close', { target: 'window' })
  handleCloseEvent() {
    this.close();
  }

  @Listen('close')
  handleClose() {
    this.close();
  }

  handleClick(e: MouseEvent) {
    if(e.target === this.container) {
      this.close();
    }
  }

  private toggle(): void {
    if(this.opened) {
      this.close();
    } else {
      this.open();
    }
  }

  private open(): void {
    this.opened = true;
    this.hidden = false;
  }

  private close(): void {
    if(this.config.stayOpened) {
      setTimeout(() => {
        this.open();
      }, 1000);
    } 

    this.opened = false;
  }

  renderModal() {
    return (
      <div
        class="modal-container"
        ref={el => this.container = el as HTMLDivElement}
        onClick={this.handleClick.bind(this)}
      >
        <div
          class="modal hidden"
          ref={el => this.modal = el as HTMLDivElement}
          aria-modal="true"
        >
          <div class="input-wrapper">
            {this.opened ? [
              <hotlight-input
                config={this.config}
              />
              ,
              <hotlight-results
                config={this.config}
                actions={this.actions}
              />
            ] : null}
          </div>
          <a
            class="hotlight-logo"
            href="https://hotlight.dev"
            target="_blank"
            rel="noopener noreferrer"
          >
            Hotlight
          </a>
        </div>
      </div>
    )
  }

  render() {
    return (
      <Host>
        {this.renderModal()}
        <div
          class="backdrop hidden"
          ref={el => this.backdrop = el as HTMLDivElement}
          onClick={this.close.bind(this)}
        />
      </Host>
    );
  }
}

