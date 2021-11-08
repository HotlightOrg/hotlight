import { F } from "./fuzzy";
import { Engine, Action, Actions, Context } from "../typings";
import { validURLOrPathname } from "../utils";
import { levenshteinDistance } from "./sort";
import { readByQuery, readCache, writeCache } from "./cache";
import store from "../store/index";

// this scores whats found. hotkeys should precede "normal" hits.
const score = (found, query) => {
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

const engine = (config = null): Engine => {
  let context = { ...initialContext };
  /*
  context.actions = actions
    .filter(action => action.parentTitle === undefined); // should be those without parentTitle?
    */

  let lastQuery = "";

  const fetchSourceAnswer = async (query: string, sourceName: string) => {
    const source = config.sources[sourceName];

    const cache = readCache(sourceName, query);
    if(cache) {
      return cache;
    }

    let res;
    if(typeof source === "function") {
      res = source(query); // add context
    } else {
      if(typeof source.request === "function") {
        res = await source.request(query) // add context
      } else if (typeof source.request === "string") {
        res = await fetch(source.request + "?q=" + query);
      } else {
        res = await fetch(source.request);
      }
    }

    // after receiving response, is this 
    if(query !== lastQuery) {
      return null;
    }

    writeCache(sourceName, query, res);

    return res;
  }

  const fetchAnswer = async (query: string) => {
    lastQuery = query;

    const promises = Object
      .keys(config.sources)
      .map(key => fetchSourceAnswer(query, key))

    const allRes = await Promise.all(promises);
    //loading(false);

    return allRes.filter(x => x !== undefined && x !== null).flat();
  }

  //const lastResultsCount = {};
  let requests = 0;
  const request = (query: string) => {
    Object
      .keys(config.sources)
      .forEach(async source => {
        requests++;
        const cached = readCache(source, query);
        if(cached) {
          respond(source, query, cached);
        } else {
          const actions = await config.sources[source](query);
          respond(source, query, actions);
        }
      });
  }

  const respond = (source: string, query: string, actions: Actions) => {
    requests--;
    const isLoading = requests > 0;
    loading(isLoading);
    store.dispatch("loading", requests > 0);

    writeCache(source, query, actions);

    if(context.query !== query) return;

    const currentResults = readByQuery(query);

    const fuzzy = F(currentResults, ['title', 'alias', 'description'])//, 'hotkey']);
    const found = fuzzy.search(query);
    //const hits = hotkeysFirst(found, query);
    const limited = found.slice(0, config.maxHits ?? 20);
    context.actions = limited;

    window.dispatchEvent(
      new CustomEvent("hotlight:response", {
        detail: {
          results: limited,
          query: context.query
        }
      })
    );

  }

  const search = (query: string): void => {
    context.query = query;
    store.dispatch("loading", true);
    request(query);
  }

  const pick = async () => {
    store.dispatch("loading", true);
    loading(true);
    const children = [];//actionsByParentTitle[action.title];
    const action = context.actions[context.activeActionIndex];

    if(children.length === 0 && action.trigger) {
      if(typeof action.trigger === "string" && validURLOrPathname(action.trigger)) {
        window.location.href = action.trigger;
      } else if(typeof action.trigger === "function") {
        const results = await action.trigger(context.query, null, context);
        if(typeof results === "string" && validURLOrPathname(results)) {
          window.location.href = results;
        }
      }
    }
    store.dispatch("loading", false);

    loading(false);

    const keepOpen = !!children;
    //const levelHits = context.actions.length < 10 ? context.actions : [];

    return {
      keepOpen,
    }
  }

  const back = () => {
    context.parents = context
      .parents
      .filter((_, index) => index !== context.parents.length - 1)

    context.level = context.level - 1;

    return { context }
  }

  const activateActionIndex = (index: number): boolean => {
    if (index < context.actions.length && index > -1) {
      context.activeActionIndex = index;
      return true;
    }
    return false;
  }

  let loadingIndicatorDelay;
  const loading = (loading: boolean) => {
    context.loading = loading;
    if(loading) {
      loadingIndicatorDelay = window.setTimeout(() => context.loading = true, 200);
    } else {
      window.clearTimeout(loadingIndicatorDelay);
      context.loading = false;
    }
  }

  return {
    search,
    pick,
    back,
    activateActionIndex,
    context
  }
}

export default engine;
