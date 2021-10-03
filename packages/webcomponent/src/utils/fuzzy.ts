import { F } from "./engine/search";

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

export type Hit = {
  ref: string;
  meta: {
    score: number;
  }
}

export type IDX = {
  search: (query: string) => Hit[];
}

export type Doc = {
  title: string;
  alias: string;
  category: string;
  meta?: {
    ref: string;
    score: number;
  }
}

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

export const hotkeys = {
  "?": "help",
  "cmd+k": "CommandK"
}

type NewHit = {
  id: string;
  title: string;
  alias: string;
  category: string;
  description?: string;
  hotkey?: string;
}

const actions: NewHit[] = Object.keys(docs)
  .map(doc => ({
    "id": doc,
    "title": docs[doc].title,
    "alias": docs[doc].alias,
    "category": docs[doc].category,
    "description": "yo",
    "hotkey": docs[doc].hotkey,
  }))

// this scores whats found. hotkeys should precede "normal" hits.
const score = (found, query) => {
  return found.map(hit => {
    let score = levenshteinDistance(query, hit.title);

    // exact hotkey match
    if(hit.hotkey && hit.hotkey === query) {
      score = -1;
    // hotkey included
    } else if(hit.hotkey?.includes(query)) {
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

const idx = {
  engine: (actions) => {
    const engine = F(actions, ['title', 'alias', 'hotkey'])
    return engine;
  },
  search: (str: string) => {
    const engine = F(actions, ['title', 'alias', 'hotkey'])
    const search = engine.search(str);

    return hotkeysFirst(search, str);
  }
}

export default idx;
