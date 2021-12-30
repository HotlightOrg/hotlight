import { get, writable } from 'svelte/store';
import { readCache, readByQuery, writeCache } from "./cache";
import { validURLOrPathname } from "./utils";
import { F } from "./fuzzy";

interface ActionBase {
  title: string;
  alias?: string;
  description?: string;
  trigger: Trigger;
  [key: string]: any;
}

export type Action = ActionBase; //ActionWithParent | ActionWithTrigger;// | (ActionWithTrigger & ActionWithParent);
export type Actions = Action[];

export type ActionResults = Promise<Action[]> | Action[] | void; // Card;

type TriggerFunctionProps = {
  query: string;
  arg: (placeholder: string) => string; //ArgumentResult;
  close: () => void;
  clear: () => void;
}
type TriggerFunction = ({ query, arg, close, clear }: TriggerFunctionProps) => Promise<Actions> | Actions | [string | null, string | null] | void;
type TriggerRedirectUrl = string;
export type Trigger = TriggerFunction | TriggerRedirectUrl;

type ValueOf<T> = T[keyof T];
type Config = {
  placeholder: string;
  hidden: boolean;
  debug: boolean;
  configure: boolean;
  transitions: boolean;
  theme: "light" | "dark" | "auto";
  maxHits: number;
}

function createConfig() {
  let configState: Config = {
    placeholder: "What are you looking for?",
    hidden: true,
    debug: true,
    configure: false,
    transitions: true,
    theme: "auto",
    maxHits: 20
  };

  const { subscribe, update, set } = writable<Config>(configState);

  const close = () => {
    configState.hidden = true;
    set(configState);
  }

  const open = () => {
    configState.hidden = false;
    set(configState);
  }

  const setEntry = (key: keyof Config, value: ValueOf<Config>) => {
    if(key && !!configState[key]) {
      configState[key] = value;
    }
    set(configState);
  }

  return {
    subscribe,
    setEntry,
    show: open,
    hide: close
  };
}

export const config = createConfig();

const actions = [
  { title: "Home", trigger: "/" },
  { title: "About", trigger: () => "/about" }
]
const source = () => {
  return actions;
}
const remoteActions = [
  { title: "Installing Hotlight", trigger: "/" },
  { title: "Getting started", trigger: () => "/" },
  { title: "Hotlight React", trigger: () => "/" },
  { title: "Hotlight Svelte", trigger: () => "/" },
  { title: "Go to a website", trigger: () => "https://jonas.arnklint.com" },
  { title: "Reload Window", trigger: () => location.reload() },
  { title: "Close Hotlight", trigger: ({ close }) => close() },
  { title: "Slow trigger", trigger: async () => await new Promise((resolve) => setTimeout(() => resolve("#slow"), 1000)) },
  { title: "fast trigger", trigger: () => "#fast" },
  { title: "Reset Hotlight", trigger: ({ reset }) => reset() },
  { title: "New Contact", trigger: async ({ arg }) => {
    const name = await arg("Name");
  }},
]

const remote = async (query) => {
  return await new Promise((resolve) => {
    setTimeout(() => {
      return resolve(remoteActions);
    }, 250 * Math.random());
  });
}

const source3 = async (query) => {
  const res = await fetch("https://31dgeh4x4m.execute-api.eu-west-1.amazonaws.com/hello?query=" + query)

  if(res.ok) {
    const { message } = await res.json();
    return message.hits.map(hit => ({
      title: "" + new Date().getTime() + hit.id,
      trigger: "/"
    }));
  } else {
    return [];
  }
}

const sources = [source, source3, remote];

type SearchState = {
  query: string;
  results: any[];
  index: number;
  action: any; // current action?
  loading: boolean;
  preview: string | null;
}
function createSearch() {
  let searchStore = {
    query: "",
    sources,
    results: [],
    index: -1,
    action: null,
    loading: false,
    preview: null
  };

  let initialState = { ...searchStore };

  const { subscribe, set } = writable<SearchState>(searchStore);

  let requests = 0;
  const request = (query: string) => {
    Object
      .keys(searchStore.sources)
      .forEach(async source => {
        requests++;
        loading(true);
        const cached = readCache(source, query);
        if(cached) {
          respond(source, query, cached);
        } else {
          try {
            let actions = await searchStore.sources[source](query);
            respond(source, query, actions);
          } catch (e) {
            respond(source, query, []);
            console.error(e);
          }
        }
      });
  }

  const respond = (source: string, query: string, actions: Actions) => {
    requests--;
    loading(requests > 0);

    writeCache(source, query, actions);

    if(searchStore.query !== query) return;

    const currentResults = readByQuery(query);

    const fuzzy = F(currentResults, ['title', 'alias', 'description']);
    const found = fuzzy.search(query);

    if(found.length > 0 && query !== "") {
      const limited = found.slice(0, get(config).maxHits ?? 20);
      receiveActions(limited);
    }
  }

  const receiveActions = (actions) => {
    searchStore.results = actions;
    searchStore.index = actions.length > 0 ? 0 : -1;
    set(searchStore);
  }

  const loading = (isLoading: boolean) => {
    searchStore.loading = isLoading;
    set(searchStore);
  }

  const search = (value: string): void => {
    searchStore.query = value;
    set(searchStore);
    request(value);
  }

  // async
  const arg = (placeholder: string) => {
    console.log(placeholder)
  }

  const goto = (urlOrPath: string) => {

  }

  const preview = (html: string) => {
    searchStore.preview = html;
    set(searchStore);
  }

  const close = () => {
    config.hide();
  }

  const reset = () => set(initialState);

  const perform = async () => {
    const { index, query, results } = searchStore;
    const children = [];//actionsByParentTitle[action.title];
    const action = results[index];

    if(action && action.trigger && children.length === 0) {
      loading(true);
      if(typeof action.trigger === "string" && validURLOrPathname(action.trigger)) {
        window.location.href = action.trigger;
      } else if(typeof action.trigger === "function") {
        const actionResult = await action.trigger({
          query: searchStore.query,
          arg,
          close,
          reset
        });
        if(typeof actionResult === "string" && validURLOrPathname(actionResult)) {
          window.location.href = actionResult;
        }
      }
      loading(false);
    }
  }
  
  const choose = (index: number) => {
    if(index < searchStore.results.length && index > -1) {
      searchStore.index = index;
      set(searchStore);
    }
  }

  return {
    subscribe,
    search,
    choose,
    perform,
    reset,
    set
  };
}

export const search = createSearch();

type HotlightState = {
  launched: boolean;
}
function createHotlight() {
  const store = writable({
    launched: false
  });

  return store;
}

export const hotlight = createHotlight();