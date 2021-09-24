import { Component, Prop, Listen, Event, EventEmitter, State, h } from '@stencil/core';

@Component({
  tag: 'command-input',
  styleUrl: 'command-input.css',
  shadow: true,
})
export class CommandInput {
  @State() value: string;
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

  componentDidLoad() {
    this.textInput.focus();
  }

  @Listen("keyup", { target: "window" })
  handleEscape(e) {
    console.log("keyx", e.key);
    if(e.key === "Escape") {
      if(this.value === "") {
        this.close.emit();
      } else {
        this.query.emit("");
        this.value = "";
      }
    }
  }

  skip(e) {
    const skip = ["ArrowUp", "ArrowDown", "Enter"];
    if(skip.includes(e.key)) {
      e.preventDefault();
    }
  }

  blur(e) {
    //console.log(e, 'blur');
  }

  doQuery(e) {
    const skip = ["ArrowUp", "ArrowDown", "Enter"];
    if(skip.includes(e.key)) {
      e.preventDefault();
    } else {
      this.query.emit(e.target.value.trim());
    }
  }

  render() {
    return (
      <input
        class="text-input"
        type="text"
        value={this.value}
        ref={el => this.textInput = el as HTMLInputElement}
        onKeyUp={this.doQuery.bind(this)}
        onKeyDown={this.skip.bind(this)}
        onBlur={this.blur.bind(this)}
      />
    )
  }
}
