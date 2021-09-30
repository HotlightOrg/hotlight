import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';
//yo
//import { debounce } from '../../utils/utils';

type Hit = {
  id: string;
  title: string;
  hotkeys?: string;
  alias?: string;
  description?: string;
}
type Source = (query: string) => Hit[];

export type Config = {
  launch: string;
  token?: string;
  sources: {
    [name: string]: Source;
  }
}

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
  shadow: true,
})
export class MyComponent {
  @Prop() config: Config;

  componentWillLoad() {
    console.log('will load')
    //this.parseConfig(this.config);
  }

  @Event({
    eventName: 'commandk:open',
    bubbles: true
  }) open: EventEmitter<{}>;
  
  /*
  @Watch('config')
  parseConfig(newValue: Config) {
    //console.log(typeof newValue, newValue);
    //if (newValue) this.myInnerObject = JSON.parse(newValue);
  }
   */

    /*
  @Listen('commandk:query', {
    target: "window"
  })
  async handleQuery({ detail }) {
    console.log(this.config.sources);
    if(detail !== "") {
      for (let [name, cb] of Object.entries(this.config.sources)) {
        const res = await cb(detail);
      }
    }
  }
     */

  render() {
    return (
      <div>
        <command-modal />
        <button onClick={() => {
          this.open.emit() //.emit.bind(this)
        }}>Open!</button>
        
      </div>
    )
  }
}
