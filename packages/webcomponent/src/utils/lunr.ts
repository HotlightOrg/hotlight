import lunr from "lunr";
//import config from "./config";

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

/*
const transformAll = (config) => {
  return Object
    .keys(config)
    .map(key => transformed(config[key]))
}

const transformed = (section) => {
  const kvs = Object.keys(section);
  const docs = kvs.map(key => ({
    "id": key,
    "title": key,
    "description": section[key].description,
    "category": section[key].category
  }));
}

*/

const source = {
  category: "pull requests",
  fetch: async (query: string) => {
    const res = await fetch("https://api.begreet.com?query=" + query);
    console.log(res);
  }
}

export const sources = [source];

export const docs = {
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
}

export const hotkeys = {
  "?": "help",
  "cmd+k": "CommandK"
}

export const buildQuery = (value: string): string | null => {
  if(!value || value?.length === 0) {
    return "";
  }

  const words = value.split(" ");
  //const avgLength = value.replace(" ", "").length / words.length;
  //const fuzz = Math.round(avgLength / 3);

  return words.map(word => `*${word}~1*`).join(" ");
}

const idx = lunr(function () {
  this.field('title')
  this.field('alias')
  //this.field('description')
  //this.field('hotkey')

  //const docs = transformAll(config);
  //console.log(docs)
  Object.keys(docs).forEach(doc => {
    this.add({
      "id": doc,
      "title": docs[doc].title,
      "alias": docs[doc].alias,
      "category": docs[doc].category
    })
  })
})

export default idx;
