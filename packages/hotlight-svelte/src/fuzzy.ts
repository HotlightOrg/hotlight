import type { Action, Actions } from "./store";

type Value = Value[] | Obj | string | null | number;
type Obj = { [key: string]: Obj | string | null | number };

export const nestedProp = (obj: Obj, path: string, list: Value[] = []) => {
  let firstSegment: string;
  let remain;
  let dotIndex;
  let i;
  let value;
  let length;

  if (path) {
    dotIndex = path.indexOf('.');

    if (dotIndex === -1) {
      firstSegment = path;
    } else {
      firstSegment = path.slice(0, dotIndex);
      remain = path.slice(dotIndex + 1);
    }

    value = obj[firstSegment as keyof Action];
    if (value !== null && typeof value !== 'undefined') {
      if (!remain && (typeof value === 'string' || typeof value === 'number')) {
        list.push(value);
      } else if (Array.isArray(value)) {
        if(typeof remain !== "undefined") {
          for (i = 0, length = value.length; i < length; i++) {
            nestedProp(value[i], remain, list);
          }
        }
      } else if (remain) {
        nestedProp(value as Obj, remain, list);
      }
    }
  } else {
    list.push(obj);
  }

  return list;
}

export const firstLetterIndexes = (item: string, query: string) => {
  const match = query[0];

  return item
    .split('')
    .reduce((prev, curr, i) => curr === match ? prev.concat(i) : prev, [] as number[]);
}

type Index = boolean | number[];
//type Indexes = Index[];
type Indexes = Index[];
export const nearestIndexesFor = (item: string, query: string) => {
  const letters = query.split('');
  let indexes: Indexes = [];

  const firstIndexes = firstLetterIndexes(item, query);

  firstIndexes.forEach((startingIndex, loopingIndex) => {
    let index = startingIndex + 1;

    indexes[loopingIndex] = [startingIndex];

    for (let i = 1; i < letters.length; i++) {
      const letter = letters[i];

      index = item.indexOf(letter, index);

      if (index === -1) {
        indexes[loopingIndex] = false;

        break;
      }

      (indexes[loopingIndex] as number[]).push(index);

      index++;
    }
  });

  indexes = indexes.filter(letterIndexes => letterIndexes !== false);

  if (!indexes.length) return false;

  return indexes.sort((a, b) => {
    if (Array.isArray(a) && a.length === 1) {
      return a[0] - (b as number[])[0];
    }

    if(Array.isArray(a) && Array.isArray(b)) {
      const _a = a[a.length - 1] - a[0];
      const _b = b[b.length - 1] - b[0];
      return _a - _b;
    }

    return 0;
  })[0];
}

export const isMatch = (item: string, query: string) => {
  item = String(item);
  query = String(query);

  item = item.toLocaleLowerCase();
  query = query.toLocaleLowerCase();

  const indexes = nearestIndexesFor(item, query);

  if (typeof indexes === "boolean") {
    return false;
  }

  // Exact matches first
  if (item === query) {
    return 1;
  }

  // When more than 2 letters, matches close to each other should be first.
  if (Array.isArray(indexes) && indexes.length > 1) {
    return 2 + (indexes[indexes.length - 1] - indexes[0]);
  }

  // Match closest to the start of the string should be first.
  return 2 + indexes[0];
}

export const F = (actions: Obj[], keys: string[]) => {

  const search = (query = '') => {
    if (query === '') {
      return actions;
    }

    const results = [];

    for (let i = 0; i < actions.length; i++) {
      const item = actions[i];

      for (let y = 0; y < keys.length; y++) {
        const propertyValues = nestedProp(item, keys[y]);

        let found = false;

        for (let z = 0; z < propertyValues.length; z++) {
          const score = isMatch(String(propertyValues[z]), query);

          if (score) {
            found = true;

            results.push({ item, score });

            break;
          }
        }

        if (found) {
          break;
        }
      }
    }

    return results
      .sort((a, b) => {
        const s = a.score - b.score;
        return s
      })
      .map(result => result.item);
  }

  return {
    search
  }
}

export const score = (found: Actions, query: string) => {
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
  })
  .sort((a, b) => a.score > b.score ? 1 : -1);
}

/*
export const hotkeysFirst = (found, query) => {
  const sorted = score(found, query)
    .sort((a, b) => a.score > b.score ? 1 : -1);

  return sorted;
}
*/


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
