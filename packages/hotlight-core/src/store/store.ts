import PubSub from "../lib/pubsub";
import { constants } from "./actions";
import { State } from "../typings";
import { log } from "../utils";

type Key = keyof typeof constants;

type Payload = {
  [kye: string]: any;  
} | number | string | boolean;

type Props = {
  actions?: any;
  mutations?: any;
  state?: State;
}

export default class Store {
  actions = {};
  mutations = {};
  state: State = {};

  status = "resting";

  events = new PubSub();

  constructor(props: Props) {
    let self = this;

    if(props.hasOwnProperty("actions")) {
      self.actions = props.actions;
    }

    if(props.hasOwnProperty("mutations")) {
      self.mutations = props.mutations;
    }

    self.state = new Proxy((props.state || {}), {
      set: function(state, key: string, value) {

        if(state[key] !== value) {
          state[key] = value;

          log(`stateChange: ${key}: ${value}`);

          self.events.publish("stateChange", self.state);

          if(self.status !== "mutation") {
            console.warn(`You should use a mutation to set ${key}`);
          }

          self.status = "resting";
        }
        return true;
      }
    });
  }

  dispatch(actionKey: Key, payload: Payload): boolean {
    let self = this;
    if(typeof self.actions[actionKey] !== "function") {
      console.error(`Action "${actionKey} doesn't exist.`);
      return false;
    }

    self.status = "action";
    self.actions[actionKey](self, payload);
    return true;
  }

  commit(mutationKey: string, payload: Payload): boolean {
    let self = this;

    if(typeof self.mutations[mutationKey] !== "function") {
      log(`Mutation "${mutationKey}" doesn't exist`);
      return false;
    }

    self.status = "mutation";

    let newState = self.mutations[mutationKey](self.state, payload);
    self.state = Object.assign(self.state, newState);

    return true;
  }
}
