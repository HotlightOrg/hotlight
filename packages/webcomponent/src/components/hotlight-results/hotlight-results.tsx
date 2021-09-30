import { Component, Prop, Listen, Event, EventEmitter, State, h } from '@stencil/core';
import engine, { Hit } from "../../utils/fuzzy";
import { HotlightConfig } from "../hotlight-modal/hotlight-modal";

@Component({
  tag: 'hotlight-results',
  styleUrl: 'hotlight-results.css',
  shadow: false,
})
export class HotlightResults {
  @Prop() config: HotlightConfig = {};
  @State() hits: any[] = [];
  @State() index: number = 0;
  private engine: any;
  private activeHit: HTMLDivElement;
  private results: HTMLDivElement;

  constructor() {
    this.engine = engine;
  }

  componentWillRender() {
    if(this.activeHit) {
      if(this.hits.length === 0) {
        this.activeHit.classList.add("hidden");
      } else {
        this.activeHit.classList.remove("hidden"); 
      }
    }
  }

  @Event({
    eventName: "commandk:trigger",
    bubbles: true,
    composed: true //bubbles through shadow dom
  }) trigger: EventEmitter<{}>;

  @Listen("keydown", {
    target: "document"
  })
  handleArrows(e: KeyboardEvent) {
    if(e.key === "Enter") {
      const doc = this.hits[this.index];
      this.trigger.emit(doc);
    }
    if(e.key === "ArrowUp") {
      if(this.index > 0) {
        this.index = this.index - 1;
      }
      e.preventDefault(); // no scroll
      this.moveActiveHit(this.index);
    } else if(e.key === "ArrowDown") {
      const max = this.hits.length;
      if(this.index < max - 1) {
        this.index = this.index + 1;
      }
      e.preventDefault(); // no scroll
      this.moveActiveHit(this.index);
    }
  }

  @Listen('commandk:query', {
    target: "window"
  })
  handleQuery({ detail }) {
    const query = detail;

    if(query === "") {
      this.hits = [];
    } else {
      const hits: Hit[] = this.engine.search(query);
      if(this.config.maxHits) {
        this.hits = hits.filter((_, index) => index < this.config.maxHits);
      } else {
        this.hits = hits;
      }
    }
    this.index = 0;
    this.moveActiveHit(this.index);
  }

  click() {
    const doc = this.hits[this.index]; 
    this.trigger.emit(doc);
  }

  hoverHit(index: number) {
    this.index = index;
    this.moveActiveHit(index);
  }

  moveActiveHit(index: number) {
    if(!this.results) {
      return; // happens if a query is triggered from ie initialState before ref is there
    }

    const { top: resultsTop, height: resultsHeight } = this.results.getBoundingClientRect();
    const child = this.results.children[index];

    if(child) {
      //const { height, top } = child.getBoundingClientRect();
      const { top } = child.getBoundingClientRect();
      const height = 32;

      const offset = resultsTop - top;

      if(top > resultsTop + resultsHeight) {
        this.results.scrollTo({ top: (height*index), behavior: "auto" });
      } else if(offset > 0) {
        this.results.scrollTo({ top: (height*index), behavior: "auto" });
      }

      if(this.activeHit) {
        this.activeHit.style.transform = `translateY(${height*index}px)`;
        this.activeHit.style.height = `${height}px`; 
      }

    }
  }

  renderInner() {
    return [
      <div
        class="results"
        ref={el => this.results = el as HTMLDivElement}
      >
        {this
          .hits
          .map(({ title, alias, category, hotkey }, i) => (
            <div
              tabindex="0"
              class={`hit ${this.index === i ? "active" : ""}`}
              onMouseOver={this.hoverHit.bind(this, i)} 
              onClick={this.click.bind(this)}
            >
              {title} {alias} {category} {hotkey}
            </div>
          ))}
        <div
          class="active-hit"
          ref={el => this.activeHit = el as HTMLDivElement}
        />
      </div>,
    ]
  }

  render() {
    return (
      <div class="results-wrapper">
        {this.renderInner()}
      </div>
    )
  }
}
