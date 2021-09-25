import { Component, Event, EventEmitter, h } from '@stencil/core';
//import { format } from '../../utils/utils';

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
  shadow: true,
})
export class MyComponent {
  @Event({
    eventName: 'commandk:open',
    bubbles: true
  }) open: EventEmitter<{}>;

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
