import type { Actions } from "./store";

type Cache = {
  [key: string]: any;
}

let cache: Cache = {};
export const writeCache = (sourceName: string, query: string, results: Actions) => {
  cache[sourceName] = {
    ...cache[sourceName],
    [query]: results
  }
}

export const readCache = (sourceName: string, query: string) => {
  if(cache[sourceName] && cache[sourceName][query]) {
    return cache[sourceName][query];
  }

  return null;
}

export const readByQuery = (query: string): Actions => {
  return Object
    .keys(cache)
    .map(source => cache[source] && cache[source][query] ? cache[source][query] : [])
    .flat()
}
