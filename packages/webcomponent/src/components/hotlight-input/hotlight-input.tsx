import { Component, Prop, Listen, Event, EventEmitter, h } from '@stencil/core';
import { HotlightConfig } from "../hotlight-modal/hotlight-modal";

@Component({
  tag: 'hotlight-input',
  styleUrl: 'hotlight-input.scss',
  shadow: false,
})
export class CommandInput {
  @Prop() config: HotlightConfig = {};
  private textInput?: HTMLInputElement;

  @Event({
    eventName: "commandk:query",
    bubbles: true,
    composed: true // bubble across shadow dom to dom for others to hook onto
  }) query: EventEmitter<string>;

  @Event({
    eventName: "commandk:close",
    bubbles: true
  }) close: EventEmitter;

  componentDidRender() {
    if(this.config.query) {
      this.textInput.value = this.config.query;
      this.query.emit(this.config.query);
    }
    if(!this.config.stayOpened) {
      this.textInput.focus();
    }
  }

  @Listen("keyup", { target: "window" })
  handleEscape(e: KeyboardEvent) {
    if(e.key === "Escape") {
      if(this.textInput.value === "") {
        this.close.emit();
      } else {
        this.query.emit("");
        this.textInput.value = "";
      }
    }
  }

  skip(e: KeyboardEvent) {
    const skip = ["ArrowUp", "ArrowDown", "Enter"];
    if(skip.includes(e.key)) {
      e.preventDefault();
    }
  }

  doQuery(e: KeyboardEvent) {
    if(e.key === "ArrowRight" || e.key === "ArrowLeft") {
      return
    }
    const skip = ["ArrowUp", "ArrowDown", "Enter"];
    if(skip.includes(e.key)) {
      e.preventDefault();
    } else {
      this.query.emit(this.textInput.value.trim());
    }
  }

  render() {
    return (
      <form role="search" novalidate>
        <input
          class="text-input"
          type="text"
          placeholder="What do you need?"
          ref={el => this.textInput = el as HTMLInputElement}
          onKeyUp={this.doQuery.bind(this)}
          onKeyDown={this.skip.bind(this)}
        />
      </form>
    )
  }
}
