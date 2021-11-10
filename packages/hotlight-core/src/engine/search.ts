import { F } from "./fuzzy";
import { Config, Engine, Actions, Context } from "../typings";
import { validURLOrPathname } from "../utils";
import { levenshteinDistance } from "./sort";
import { readByQuery, readCache, writeCache } from "./cache";
import store from "../store/index";

// this scores whats found. hotkeys should precede "normal" hits.
const score = (found: Actions, query: string) => {
  return found.map(hit => {
    let score = levenshteinDistance(query, hit.title);

    // exact hotkey match
    if(hit.hotkeys && hit.hotkeys === query) {
      score = -1;
    // hotkey included
    } else if(hit.hotkeys?.includes(query)) {
      score = 0;
    }

    return {
      ...hit,
      score
    }
  });
}

/*
const hotkeysFirst = (found, query) => {
  const sorted = score(found, query)
    .sort((a, b) => a.score > b.score ? 1 : -1);

  return sorted;
}

const actionsByParentTitle = (actions) => actions
  .reduce((prev, curr) => {
    if(!curr.parentTitle) {
      return prev;
    }

    return {
      ...prev,
      [curr.parentTitle]: (prev[curr.parentTitle] || []).concat(curr)
    }
  }, {})
  */


let initialContext: Context = {
  level: 0,
  parents: [],
  actions: [],
  query: "",
  activeActionIndex: 0,
  loading: false
};

const engine = (config: Config): Engine => {
  let context = { ...initialContext };

  let requests = 0;
  const request = (query: string) => {
    Object
      .keys(store.state.config.sources)
      .forEach(async source => {
        requests++;
        const cached = readCache(source, query);
        if(cached) {
          respond(source, query, cached);
        } else {
          let actions = await config.sources[source](query);
          respond(source, query, actions);
        }
      });
  }

  const respond = (source: string, query: string, actions: Actions) => {
    requests--;
    loading(requests > 0);

    writeCache(source, query, actions);

    if(store.state.query !== query) return;

    const currentResults = readByQuery(query);

    const fuzzy = F(currentResults, ['title', 'alias', 'description'])//, 'hotkey']);
    const found = fuzzy.search(query);
    //const hits = hotkeysFirst(found, query);
    const limited = found.slice(0, config.maxHits ?? 20);
    store.dispatch("receiveActions", limited);
  }

  const search = (query: string): void => {
    store.dispatch("search", query);
    loading(true);
    request(query);
  }

  const pick = async () => {
    loading(true);
    const children = [];//actionsByParentTitle[action.title];
    const action = store.state.actions[store.state.activeActionIndex];

    if(children.length === 0 && action.trigger) {
      if(typeof action.trigger === "string" && validURLOrPathname(action.trigger)) {
        window.location.href = action.trigger;
      } else if(typeof action.trigger === "function") {
        const results = await action.trigger(store.state.query, {}, store.state);
        if(typeof results === "string" && validURLOrPathname(results)) {
          window.location.href = results;
        }
      }
    }
    loading(false);
  }

  const back = () => {
    context.parents = context
      .parents
      .filter((_, index) => index !== context.parents.length - 1)

    context.level = context.level - 1;

    return { context }
  }

  const loading = (_loading: boolean) => {
    store.dispatch("loading", _loading);
  }

  return {
    search,
    pick,
    back,
    context
  }
}

export default engine;
