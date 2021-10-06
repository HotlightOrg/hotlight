import { F } from "./engine/search";
import { HotlightAction } from "../components/hotlight-modal/hotlight-modal";
import { validURLOrPathname } from "./utils";

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

const source = {
  category: "pull requests",
  fetch: async (query: string) => {
    const res = await fetch("https://api.begreet.com?query=" + query);
    console.log(res);
  }
}

export const sources = [source];

export const docs = {
  "0": {
    title: "n",
    alias: "",
    hotkey: "n",
    category: "greets"
  },
  "123": {
    title: "New Greet",
    alias: "",
    hotkey: "ng",
    category: "greets"
  },
  "1": {
    title: "kolle",
    alias: "",
    category: "document"
  },
  "2": {
    title: "ada",
    alias: "",
    category: "document"
  },
  "3": {
    title: "remove greet",
    alias: "delete",
    category: "action"
  },
  "4": {
    title: "publish greet",
    alias: "",
    category: "action"
  },
  "5": {
    title: "duplicate greet",
    alias: "",
    category: "document"
  },
  "6": {
    title: "help",
    alias: "? info",
    category: "document"
  },
  "7": {
    title: "send greet to someone",
    alias: "",
    category: "document"
  },
  "8": {
    title: "Draft feedback",
    alias: "",
    category: "greeting"
  },
  "9": {
    title: "Thank someone for feedback",
    alias: "",
    category: "greeting"
  },
  "10": {
    title: "Feedback document",
    alias: "",
    category: "document"
  },
  "11": {
    title: "How much time does this take you?",
    alias: "",
    category: "faq"
  },
  "12": {
    title: "Contact us",
    alias: "mail phone support",
    category: "document"
  },
  "13": {
    title: "New greet",
    alias: "create greet, add greet",
    category: "action"
  },
  "14": {
    title: "Find contact",
    hotkey: "fc",
    category: "contacts"
  }
}

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


export type HotlightContext = {
  level: number;
  parents: HotlightAction[];
  actions: HotlightAction[];
}

let initialContext: HotlightContext = {
  level: 0,
  parents: [],
  actions: []
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

  const search = (query: string): HotlightAction[] => {
    const fuzzy = F(context.actions, ['title', 'alias', 'hotkey']);
    const found = fuzzy.search(query);
    const hits = hotkeysFirst(found, query);
    return hits.slice(0, config?.maxHits || 20);
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
  const pick = (action: HotlightAction, query?: string): {
    keepOpen: boolean;
    levelHits: any[];
    context: any;
  } => {
    if(typeof action.trigger === "string" && validURLOrPathname(action.trigger)) {
      window.location.href = action.trigger;
    } else if(typeof action.trigger === "function") {
      action.trigger(query, context);
    }

    const children = actionsByParentTitle[action.title];

    if(children) {
      context.parents = context.parents.concat(action);
      context.actions = [...children];
      context.level = context.level + 1;
    }

    const keepOpen = !!children;
    const levelHits = context.actions.length < 10 ? context.actions : [];

    return {
      keepOpen,
      levelHits,
      context
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
