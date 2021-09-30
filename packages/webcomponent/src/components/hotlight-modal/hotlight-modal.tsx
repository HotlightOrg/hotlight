import { Component, Listen, State, Prop, h } from '@stencil/core';
import { Hit } from "../../utils/fuzzy";


export type Source = (query: string) => Promise<Hit[]>;
  

export type HotlightConfig = {
  opened?: boolean;
  stayOpened?: boolean;
  query?: string;
  maxHits?: number;

  sources?: {
    [name: string]: Source;
  }

  //log?: boolean;

  //token?: string;
}

@Component({
  tag: 'hotlight-modal',
  styleUrl: 'hotlight-modal.css',
  shadow: true,
})
export class HotlightModal {
  @Prop() config: HotlightConfig = {};
  @State() opened: boolean;
  @State() pressing: string[] = [];
  private container?: HTMLDivElement;
  private modal?: HTMLDivElement;
  private backdrop?: HTMLDivElement;

  componentWillRender() {
    if(!this.opened && this.backdrop) {
      this.backdrop.classList.add("hidden");
      this.modal.classList.add("hidden");
    }
  }

  componentDidRender() {
    if(this.opened) {
      this.backdrop.classList.remove("hidden");
      this.modal.classList.remove("hidden");
    }
  }

  componentWillLoad() {
    if(this.config.opened) {
      this.open();
    }
  }

  /*
  private press(key): void {
    this.pressing = this.pressing.concat(key);
  }

  private unpress(key): void {
    this.pressing = [...this.pressing.filter(_key => _key !== key)];
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
    /*
    if(!this.opened ) {
      return null;
    }
     */

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
          <hotlight-input config={this.config} />
          <hotlight-results config={this.config} />
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
    return [
      this.renderModal(),
      <div
        class="backdrop hidden"
        ref={el => this.backdrop = el as HTMLDivElement}
        onClick={this.close.bind(this)}
      />
    ];
  }
}
