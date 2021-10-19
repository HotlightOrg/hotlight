const nestedProp = (object, path, list = []) => {
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

    value = object[firstSegment];
    if (value !== null && typeof value !== 'undefined') {
      if (!remain && (typeof value === 'string' || typeof value === 'number')) {
        list.push(value);
      } else if (Object.prototype.toString.call(value) === '[object Array]') {
        for (i = 0, length = value.length; i < length; i++) {
          nestedProp(value[i], remain, list);
        }
      } else if (remain) {
        nestedProp(value, remain, list);
      }
    }
  } else {
    list.push(object);
  }

  return list;
}

const firstLetterIndexes = (item: string, query: string) => {
  const match = query[0];

  return item
    .split('')
    .map((letter, index) => {
      if (letter !== match) {
        return -1;
      }

      return index;
    })
    .filter(index => index !== -1);
}

const nearestIndexesFor = (item, query) => {
  const letters = query.split('');
  let indexes = [];

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

      indexes[loopingIndex].push(index);

      index++;
    }
  });

  indexes = indexes.filter(letterIndexes => letterIndexes !== false);

  if (! indexes.length) {
    return false;
  }

  return indexes.sort((a, b) => {
    if (a.length === 1) {
      return a[0] - b[0];
    }

    a = a[a.length - 1] - a[0];
    b = b[b.length - 1] - b[0];

    return a - b;
  })[0];
}

const isMatch = (item: string, query: string) => {
  item = String(item);
  query = String(query);

  item = item.toLocaleLowerCase();
  query = query.toLocaleLowerCase();

  const indexes = nearestIndexesFor(item, query);

  if (!indexes) {
    return false;
  }

  // Exact matches first
  if (item === query) {
    return 1;
  }

  // If we have more than 2 letters, matches close to each other should be first.
  if (indexes.length > 1) {
    return 2 + (indexes[indexes.length - 1] - indexes[0]);
  }

  // Matches closest to the start of the string should be first.
  return 2 + indexes[0];
}

export const F = (actions, keys) => {

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
          const score = isMatch(propertyValues[z], query);

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

    // Sort by score
    results.sort((a, b) => a.score - b.score);

    return results.map(result => result.item);
  }

  return {
    search
  }
}

