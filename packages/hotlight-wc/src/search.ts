import { F } from "./fuzzy";
import { Action, Actions, Context } from "./typings";
import { validURLOrPathname, debounce } from "./utils";

const levenshteinDistance = (str1 = '', str2 = '') => {
  const track = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i += 1) {
    track[0][i] = i;
  }

  for (let j = 0; j <= str2.length; j += 1) {
    track[j][0] = j;
  }

  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1, // deletion
        track[j - 1][i] + 1, // insertion
        track[j - 1][i - 1] + indicator, // substitution
      );
    }
  }

  return track[str2.length][str1.length];
};


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

const hotkeysFirst = (found, query) => {
  const sorted = score(found, query)
    .sort((a, b) => a.score > b.score ? 1 : -1);

  return sorted;
}

let initialContext: Context = {
  level: 0,
  parents: [],
  actions: [],
  query: "",
  activeActionIndex: 0
};

const engine = (actions = [], config = null) => {
  let context = { ...initialContext };
  context.actions = actions
    .filter(action => action.parentTitle === undefined); // should be those without parentTitle?

  const actionsByParentTitle = actions
    .reduce((prev, curr) => {
      if(!curr.parentTitle) {
        return prev;
      }

      return {
        ...prev,
        [curr.parentTitle]: (prev[curr.parentTitle] || []).concat(curr)
      }
    }, {})

  let cache = {}, lastQuery = "";
  const writeCache = (sourceName: string, query: string, results: Actions) => {
    cache[sourceName] = {
      ...cache[sourceName],
      [query]: results
    }
  }
  const readCache = (sourceName: string, query: string) => {
    if(cache[sourceName] && cache[sourceName][query]) {
      return cache[sourceName][query];
    }

    return null;
  }

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

    return allRes.filter(x => x !== undefined && x !== null).flat();
  }

  const search = async (query: string): Promise<Action[]> => {
    const res = await fetchAnswer(query);
    const fuzzy = F(res, ['title', 'alias', 'description'])//, 'hotkey']);
    const found = fuzzy.search(query);
    //const hits = hotkeysFirst(found, query);

    return found.slice(0, config.maxHits ?? 20);
  }

  /*
   * level 0: all actions
   * pick action
   * if action has children
   *   level 1 actions = all actions with parentTitle == picked action
   * else if typeof action.trigger === "function"
   *   results = action.trigger(query, context)
   *   if typeof results === "array"
   *     level 1 actions = results
   *   // else void
   */
  const pick = (action: Action, query?: string) => {
    const children = actionsByParentTitle[action.title];

    if(!children && action.trigger) {
      if(typeof action.trigger === "string" && validURLOrPathname(action.trigger)) {
        window.location.href = action.trigger;
      } else if(typeof action.trigger === "function") {
        action.trigger(query, null, context);
      }
    }

    if(children) {
      context.parents = context.parents
        .filter(a => a.title !== action.title)
        .concat(action);
      context.actions = [...children];
      context.level = context.level + 1;
    } else {
      context.parents = [];
      context.actions = [];
      context.level = 0;
    }

    const keepOpen = !!children;
    const levelHits = context.actions.length < 10 ? context.actions : [];

    return {
      keepOpen,
      //levelHits,
      //context
    }
  }

  const back = () => {
    context.parents = context
      .parents
      .filter((_, index) => index !== context.parents.length - 1)

    context.level = context.level - 1;

    context.actions = actions;

    return { context }
  }

  const getContext = () => {
    return context;
  }

  return {
    search,
    pick,
    back,
    getContext
  }
}

export default engine;
