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

export default nestedProp;
