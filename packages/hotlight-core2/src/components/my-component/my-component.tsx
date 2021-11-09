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
  tag: 'hotlight-launcher',
  styleUrl: 'hotlight-launcher.css',
  shadow: true,
})
export class HotlightLauncher {
  @Event({
    eventName: 'commandk:open',
    bubbles: true
  }) open: EventEmitter<{}>;
  
  render() {
    return (
      <div>
        <hotlight-modal />
        <button onClick={() => {
          this.open.emit() //.emit.bind(this)
        }}>Open!</button>
        
      </div>
    )
  }
}
