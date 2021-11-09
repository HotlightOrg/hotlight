import { Component, State, Prop, Listen, Event, EventEmitter, h } from '@stencil/core';
import { HotlightConfig } from "../hotlight-modal/hotlight-modal";
import { HotlightContext } from "../../utils/fuzzy";

@Component({
  tag: 'hotlight-input',
  styleUrl: 'hotlight-input.scss',
  shadow: false,
})
export class CommandInput {
  @Prop() config: HotlightConfig = {};
  @State() context: HotlightContext = { level: 0, parents: [], actions: [] };
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

  @Event() goUp: EventEmitter;

  componentDidRender() {
    if(this.config.query) {
      this.textInput.value = this.config.query;
      this.query.emit(this.config.query);
    }
    if(!this.config.stayOpened) {
      this.textInput.focus();
    }
  }

  // when going down to a child action
  @Listen("commandk:clear", { target: "window" })
  handleClear({ detail }) {
    this.context = { ...detail };
    this.textInput.value = "";
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
    } else if(e.key === "Backspace" &&
      this.textInput.value === "" &&
      this.context.parents.length > 0
    ) {
      this.goUp.emit();
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
      <form
        role="search"
        novalidate
      >
        {this.context.parents.map(p => <hotlight-crumb label={p.title} />)}
        <input
          class="text-input"
          type="text"
          placeholder={this.config.placeholder}
          ref={el => this.textInput = el as HTMLInputElement}
          onKeyUp={this.doQuery.bind(this)}
          onKeyDown={this.skip.bind(this)}
        />
      </form>
    )
  }
}
