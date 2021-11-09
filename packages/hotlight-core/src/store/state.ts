import { State } from "../typings";

let initialState: State = {
  level: 0,
  parents: [],
  actions: [],
  query: "",
  activeActionIndex: -1,
  loading: false,
  config: {
    initialQuery: "",
    maxHits: 20,
    placeholder: "What are you looking to do?",
    sources: {},
    debug: false
  }
};

export default initialState;
