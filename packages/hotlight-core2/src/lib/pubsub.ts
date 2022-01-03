type Data = {
  [name: string]: any;
};
type Event = (data: Data) => void;
type Events = {
  [name: string]: Event[];
}

export default class PubSub {
  constructor() {
    this.events = {};
  }

  private events: Events;

  subscribe(event: string, callback: Event): number {
    let self = this;

    if(!self.events.hasOwnProperty(event)) {
      self.events[event] = [];
    }

    return self.events[event].push(callback);
  }

  publish(event: string, data: Data = {}): any[] {
    let self = this;

    if(!self.events.hasOwnProperty(event)) {
      return [];
    }

    const all = self.events[event];
    return all.map(callback => callback(data));
  }
}
