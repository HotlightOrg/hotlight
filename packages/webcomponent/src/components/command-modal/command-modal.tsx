import { Component, Prop, Listen, Event, EventEmitter, State, h } from '@stencil/core';
import { format } from '../../utils/utils';

@Component({
  tag: 'command-modal',
  styleUrl: 'command-modal.css',
  shadow: true,
})
export class MyComponent {
  @State() opened: boolean;
  @State() pressing: string[] = [];
  private container?: HTMLDivElement;

  /**
   * The first name
   */
  @Prop() first: string;

  /**
   * The middle name
   */
  @Prop() middle: string;

  /**
   * The last name
   */
  @Prop() last: string;

  // Event called 'todoCompleted' that is "composed", "cancellable" and it will bubble up!
  /*
  @Event({
    eventName: 'todoCompleted',
    bubbles: true,
  }) todoCompleted: EventEmitter<Todo>;

  todoCompletedHandler(todo: Todo) {
    const event = this.todoCompleted.emit(todo);
    if(!event.defaultPrevented) {
      // if not prevented, do some default handling code
    }
  }

  @Listen('todoCompleted')
  todoCompletedHandler(event: CustomEvent<Todo>) {
    console.log('Received the custom todoCompleted event: ', event.detail);
  }
   */
  private press(key): void {
    this.pressing = this.pressing.concat(key);
  }

  private unpress(key): void {
    this.pressing = [...this.pressing.filter(_key => _key !== key)];
  }

  @Listen('keydown', { target: 'window' })
  handleOpen(e) {
    if(e.key === "k" && e.metaKey) {
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
  handleClose(e) {
    this.close();
  }

  handleClick(e) {
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

  render() {
    if(!this.opened) {
      return null;
    }

    return [
      <div
        class="modal-container"
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
      </div>,
      <div
        class="backdrop"
        onClick={this.close.bind(this)}
      />
    ];
  }
}
