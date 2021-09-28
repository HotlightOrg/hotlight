import { Component, Listen, State, h } from '@stencil/core';

@Component({
  tag: 'command-modal',
  styleUrl: 'command-modal.css',
  shadow: true,
})
export class MyComponent {
  @State() opened: boolean;
  @State() pressing: string[] = [];
  private container?: HTMLDivElement;
  private backdrop?: HTMLDivElement;

  componentWillRender() {
    if(!this.opened && this.backdrop) {
      this.backdrop.classList.add("hidden");
      this.container.classList.add("hidden");
    }
  }
  componentDidRender() {
    if(this.opened) {
      this.backdrop.classList.remove("hidden");
      this.container.classList.remove("hidden");
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
    this.opened = !this.opened;
  }

  private open(): void {
    this.opened = true;
  }

  private close(): void {
    this.opened = false;
  }

  renderModal() {
    if(!this.opened) {
      return null;
    }

    return (
      <div
        class="modal-container hidden"
        ref={el => this.container = el as HTMLDivElement}
        onClick={this.handleClick.bind(this)}
      >
        <div
          class="modal"
          aria-modal="true"
        >
          <command-input />
          <command-results />
          <a
            href="https://commandk"
            target="_blank"
            rel="noopener noreferrer"
          >
            CommandK
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
