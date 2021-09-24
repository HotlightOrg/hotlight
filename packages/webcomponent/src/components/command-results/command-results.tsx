import { Component, Prop, Listen, Event, EventEmitter, State, h } from '@stencil/core';
import engine, { sources, docs, buildQuery } from "../../utils/lunr";

/*
type Doc = {
  title: string;
  alias: string;
  category: string;
}
 */

@Component({
  tag: 'command-results',
  styleUrl: 'command-results.css',
  shadow: true,
})
export class CommandResults {
  @State() hits: any[] = [];
  @State() grouped: any = {};
  @State() index: number = 0;
  private idx: any;

  componentWillLoad() {
    this.idx = engine;
  }

  @Event({
    eventName: "commandk:trigger",
    bubbles: true,
    composed: true //bubbles through shadow dom
  }) trigger: EventEmitter<{}>;

  @Listen("keydown", {
    target: "document"
  })
  handleArrows(e) {
    if(e.key === "Enter") {
      const doc = docs[this.hits[this.index].ref];
      this.trigger.emit(doc);
    }
    if(e.key === "ArrowUp") {
      if(this.index > 0) {
        this.index = this.index - 1;
      }
    } else if(e.key === "ArrowDown") {
      const max = this.hits.length;
      if(this.index < max - 1) {
        this.index = this.index + 1;
      }
    }
  }

  @Listen('commandk:query', {
    target: "window"
  })
  handleQuery({ detail }) {
    const query = buildQuery(detail);

    if(query === "") {
      this.hits = [];
      this.grouped = {};
    } else {
      const hits = this.idx.search(query);

      const objects = hits.map((key, i) => ({
        i,
        ...docs[key.ref],
        meta: key
      }));

      const grouped = objects.reduce((prev, curr) => {
        const score = curr.meta.score;
        const p = prev[curr.category];
        return {
          ...prev,
          [curr.category]: {
            //maxScore: !p?.maxScore ? score > p.maxScore ? score : p.maxScore,
            items: (prev[curr.category] ? prev[curr.category].items : []).concat(curr)
          }
        }
      }, {});

      this.index = 0;
      this.hits = hits;
      this.grouped = grouped;
    }
  }

  render() {
    console.log(this.grouped)
    return (
      <div>
        {Object
          .keys(this.grouped)
          .map(category => {
            return [
              <div>{category}</div>,
              this.grouped[category].items.map(hit => (
                <div class={`hit ${this.index === hit.i ? "active" : ""}`}>
                  {hit.title} {hit.ref} {hit.score}
                </div>
              ))
            ]
          })}
      </div>
    )
  }
}
