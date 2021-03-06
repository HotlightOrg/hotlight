import { get, writable } from 'svelte/store';
import { readCache, readByQuery, writeCache } from "./cache";
import { validURLOrPathname } from "./utils";
import { F, score } from "./fuzzy";

interface ActionBase {
  title: string;
  aliases?: string;
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
  mode: "light" | "dark" | "auto";
  backdrop: boolean;
  maxHits: number;
}

export const defaultConfig: Config = {
  placeholder: "What are you looking for?",
  hidden: true,
  debug: false,
  configure: false,
  transitions: true,
  backdrop: false,
  mode: "auto",
  maxHits: 20
};

function createConfig() {
  let configState = defaultConfig;

  const { subscribe, set } = writable<Config>(configState);

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
      (configState as Record<typeof key, ValueOf<Config>>)[key] = value;
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


type SearchState = {
  query: string;
  results: any[];
  index: number;
  action: any; // current action?
  chosenAction: any;
  loading: boolean;
  preview: string | null;
  placeholder: string;
  args: any[];
}
export function createSearch() {
  let searchStore = {
    query: "",
    sources: [],
    results: [],
    index: -1,
    action: null,
    chosenAction: null,
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

    if(searchStore.query !== query) return;

    const currentResults = readByQuery(query);
    if(currentResults) {
      writeCache(source, query, actions);
    }

    const fuzzy = F(currentResults, ["title", "aliases", "description"]);
    const found = fuzzy.search(query);

    if(found.length > 0 && query !== "") {
      const hits = found;
      const transformed = hits.slice(0, get(config).maxHits ?? 20).map(hit => ({
        ...hit,
        aliases: hit.aliases || ""
      }));
      receiveActions(transformed);
    }
  }

  const receiveActions = (actions) => {
    searchStore.results = actions;
    _choose(0);
    set(searchStore);
  }

  const loading = (isLoading: boolean) => {
    if(searchStore.loading !== isLoading) {
      searchStore.loading = isLoading;
      set(searchStore);
    }
  }

  const search = (value: string): void => {
    if(searchStore.args.length === 0) {
      searchStore.query = value;

      if(value === "") {
        searchStore.results = [];
        searchStore.chosenAction = null;
      }

      set(searchStore);
      request(value);
    }
  }

  const goto = (urlOrPath: string) => {

  }

  const _preview = (html: string) => {
    searchStore.preview = html;
  }

  const preview = (html: string) => {
    _preview(html);
    set(searchStore);
  }

  const escape = () => {
    if(searchStore.query.length === 0 && searchStore.args.length === 0) {
      return close();
    }

    if(searchStore.args.length > 0) {
      searchStore.args = [];
      searchStore.placeholder = get(config).placeholder;
    }
    if(searchStore.query.length > 0) {
      searchStore.query = "";
    }
    searchStore.chosenAction = null;
    set(searchStore);
  }

  const close = () => {
    searchStore.preview = "";
    searchStore.args = [];
    set(searchStore);
    config.close();
  }

  const clear = () => {
    searchStore = {
      ...initialState,
      sources: searchStore.sources
    };
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
        searchStore.chosenAction = null;
        searchStore.results = [];
        set(searchStore);
      }
      loading(false);
    }
  }

  const _choose = (index: number) => {
    const hit = searchStore.results[index];
    if(hit.preview) {
      _preview(hit.preview);
    }

    searchStore.index = index;
    searchStore.preview = "";
    searchStore.chosenAction = hit;
  }
  
  const choose = (index: number) => {
    if(index < searchStore.results.length && index > -1) {
      _choose(index);
      set(searchStore);
    }
  }

  const setSources = (sources) => {
    searchStore.sources = sources;
    set(searchStore);
  }

  return {
    subscribe,
    choose,
    perform,
    set,
    escape,

    search,
    clear,
    close,
    setSources
  };
}

export const search = createSearch();
