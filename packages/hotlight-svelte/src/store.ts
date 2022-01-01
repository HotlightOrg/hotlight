import { get, writable } from 'svelte/store';
import { readCache, readByQuery, writeCache } from "./cache";
import { validURLOrPathname } from "./utils";
import { F, score } from "./fuzzy";

interface ActionBase {
  title: string;
  alias?: string;
  description?: string;
  trigger: Trigger;
  [key: string]: any;
}

export type Action = ActionBase;
export type Actions = Action[];

export type ActionResults = Promise<Action[]> | Action[] | void;

type TriggerFunctionProps = {
  query: string;
  arg: (placeholder: string) => string;
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
  backdrop: boolean;
  maxHits: number;
}

function createConfig() {
  let configState: Config = {
    placeholder: "What are you looking for?",
    hidden: true,
    debug: true,
    configure: false,
    transitions: true,
    backdrop: false,
    theme: "auto",
    maxHits: 20
  };

  const { subscribe, update, set } = writable<Config>(configState);

  const close = () => {
    configState.hidden = true;
    search.clear();
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
    open,
    close
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
  { title: "Go to a website", trigger: () => "https://jonas.arnklint.com", preview: "<div style='background: red; color: white'>My homepage</div>" },
  { title: "Go to another website", trigger: () => "https://hotlight.dev" },
  { title: "Reload Window", trigger: () => location.reload() },
  { title: "Close Hotlight", trigger: ({ close }) => close() },
  { title: "Slow trigger", trigger: async () => await new Promise((resolve) => setTimeout(() => resolve("#slow"), 1000)) },
  { title: "fast trigger", trigger: () => "#fast" },
  { title: "Clear Hotlight", trigger: ({ clear }) => clear() },
  {
    title: "New Contact",
    alias: "Add Contact",// "Create Contact"],
    trigger: async ({ arg, preview, close }) => {
      const name = await arg("Name");
      console.log("received name", name);
      const email = await arg("Email");
      console.log("received email", email);
      const phone = await arg("Phone");
      console.log("received phone", phone);
      preview(`
        <div style="background-color: red">New contact created: ${name}, ${email}, ${phone}</div>
      `)
      location.hash = `#${[name, email, phone]}`;
      //close();
    }
  },
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
  placeholder: string;
  args: any[];
}
export function createSearch() {
  let searchStore = {
    query: "",
    sources,
    results: [],
    index: -1,
    action: null,
    loading: false,
    preview: null,
    placeholder: get(config).placeholder,
    args: []
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
      const hits = score(found, query);
      const transformed = hits.slice(0, get(config).maxHits ?? 20).map(hit => ({
        ...hit,
        alias: hit.alias || ""
      }));
      receiveActions(transformed);
    }
  }

  const receiveActions = (actions) => {
    searchStore.results = actions;
    set(searchStore);
    choose(0);
  }

  const loading = (isLoading: boolean) => {
    searchStore.loading = isLoading;
    set(searchStore);
  }

  const search = (value: string): void => {
    if(searchStore.args.length === 0) {
      searchStore.query = value;
      if(value === "") {
        searchStore.results = [];
      }

      set(searchStore);
      request(value);
    }
  }

  const goto = (urlOrPath: string) => {

  }

  const preview = (html: string) => {
    searchStore.preview = html;
    set(searchStore);
  }

  const close = () => {
    console.log(searchStore)
    searchStore.preview = "";
    searchStore.args = [];
    set(searchStore);
    config.close();
  }

  const clear = () => {
    searchStore = initialState;
    set(searchStore);
  };

  const arg = async (placeholder: string): Promise<string> => {
    searchStore.query = "";
    searchStore.results = [];
    searchStore.loading = false;
    searchStore.index = -1;
    searchStore.placeholder = placeholder;

    let r;
    const promise = new Promise<string>((resolve) => {
      r = resolve;
    });
    searchStore.args.push(r);
    set(searchStore);
    return promise;
  }

  const perform = async () => {
    const { index, query, results } = searchStore;
    const children = [];
    const action = results[index];

    if(searchStore.args.length > 0) {
      const lastResolve = searchStore.args.pop();
      set(searchStore);
      lastResolve(query);
      return;
    }

    if(action && action.trigger && children.length === 0) {
      loading(true);
      if(typeof action.trigger === "string" && validURLOrPathname(action.trigger)) {
        window.location.href = action.trigger;
      } else if(typeof action.trigger === "function") {
        const actionResult = await action.trigger({
          query,
          arg,
          preview,
          close,
          clear
        });

        if(typeof actionResult === "string" && validURLOrPathname(actionResult)) {
          window.location.href = actionResult;
        }

        searchStore.placeholder = get(config).placeholder;
        searchStore.query = "";
        searchStore.results = [];
        set(searchStore);
      }
      loading(false);
    }
  }
  
  const choose = (index: number) => {
    if(index < searchStore.results.length && index > -1) {
      searchStore.index = index;
      searchStore.preview = "";

      const hit = searchStore.results[index];
      if(hit.preview) {
        preview(hit.preview);
      }
      set(searchStore);
    }
  }

  return {
    subscribe,
    search,
    choose,
    perform,
    clear,
    set,
    close
  };
}

export const search = createSearch();