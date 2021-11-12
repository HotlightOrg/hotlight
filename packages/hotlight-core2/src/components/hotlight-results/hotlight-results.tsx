import { Component, Prop, Listen, Event, EventEmitter, State, h } from '@stencil/core';
import engine, { HotlightContext } from "../../utils/fuzzy";
import { underscore } from "../../utils/utils";
import { HotlightConfig, HotlightAction } from "../hotlight-modal/hotlight-modal";
import {ResultLocation} from './ResultLocation';

@Component({
  tag: 'hotlight-results',
  styleUrl: 'hotlight-results.css',
  shadow: false,
})
export class HotlightResults {
  @Prop() config: HotlightConfig = {};
  @Prop() actions: HotlightAction[] = [];
  @State() hits: HotlightAction[] = [];
  @State() context: HotlightContext = { level: 0, parents: [], actions: [] };
  @State() index: number = 0;
  @State() query: string = "";
  private engine: any;
  private activeHit: HTMLDivElement;
  private results: HTMLDivElement;

  constructor() {
    this.engine = engine(this.actions);
  }

    /*
  @Watch('actions')
  setEngine(actions: HotlightAction[], prev: HotlightAction[]) {
    console.log('new actions', actions, 'prev', prev)
    this.engine = engine(actions);
  }
     */

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

  @Event({
    eventName: "commandk:clear",
    bubbles: true
  }) clearInput: EventEmitter<HotlightContext>;

  @Listen("keydown", {
    target: "document"
  })
  handleArrows(e: KeyboardEvent) {
    if(e.key === "Enter") {
      this.doTrigger();
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

    if(query === "" && this.context.level === 0) {
      this.hits = [];
    } else {
      const hits: HotlightAction[] = this.engine.search(query);
      if(this.config.maxHits) {
        this.hits = hits.filter((_, index) => index < this.config.maxHits);
      } else {
        this.hits = hits;
      }
    }

    this.query = query;
    this.index = 0;
    this.moveActiveHit(this.index);
  }

  @Listen("goUp", {
    target: "window"
  })
  handleGoUp() {
    const { context } = this.engine.back();
    this.context = context;
    this.clear();
  }

  doTrigger() {
    const doc = this.hits[this.index]; 
    if(!doc) {
      return
    }

    const { keepOpen, levelHits, context } = this.engine.pick(doc, this.query); // check if supposed to close?

    this.context = context;

    this.clear();
    if(!keepOpen) {
      this.trigger.emit(doc);
    }
    if(levelHits) {
      this.hits = levelHits;
      this.query = "";
      this.index = 0;
      this.moveActiveHit(this.index);
    }
  }

  clear() {
    this.index = 0;
    this.hits = [];
    this.clearInput.emit(this.context);
  }

  click() {
    this.doTrigger();
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
          .map(({ title, alias, category, hotkeys, trigger }, i) => (
            <div
              tabindex="0"
              class={`hit ${this.index === i ? "active" : ""}`}
              onMouseOver={this.hoverHit.bind(this, i)} 
              onClick={this.click.bind(this)}
            >
              <div innerHTML={underscore(this.query, title)} /> {alias} <span class="category">{category}</span> {hotkeys}
              <ResultLocation trigger={trigger} />
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
