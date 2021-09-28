import { Component, Listen, Event, EventEmitter, State, h } from '@stencil/core';
import engine, { Hit } from "../../utils/fuzzy";

@Component({
  tag: 'command-results',
  styleUrl: 'command-results.css',
  shadow: false,
})
export class CommandResults {
  @State() hits: any[] = [];
  @State() index: number = 0;
  private engine: any;
  private activeHit: HTMLDivElement;
  private results: HTMLDivElement;

  componentWillLoad() {
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
      this.hits = hits;
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
    const { top: resultsTop, height: resultsHeight } = this.results.getBoundingClientRect();
    const child = this.results.children[index];
    

    /*
    var childPos = obj.offset();
    var parentPos = obj.parent().offset();
    var childOffset = {
      top: childPos.top - parentPos.top,
      left: childPos.left - parentPos.left
    }
     */

    if(child) {
      //(child as HTMLInputElement).focus();
      const { height, top } = child.getBoundingClientRect();

      const offset = resultsTop - top;
      console.log(child.scrollTop, height * index);

      if(top > resultsTop + resultsHeight) {
        this.results.scrollTo({ top: (height*index), behavior: "auto" });
      } else if(offset > 0) {
        //console.log('top is less than resultstop', top, resultsTop);
        //console.log(offset, resultsTop - offset);
        this.results.scrollTo({ top: (height*index), behavior: "auto" });
        //this.results.scrollTo({ top: resultsTop - offset, behavior: "auto" });
      }
      //
  //*/

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
