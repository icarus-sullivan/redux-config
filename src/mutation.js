const OPENING_BRACKET = /\[/g;
const CLOSING_BRACKET = /\]/g;
const BEGINS_WITH_DOT = /^\./g;

const parse = (dot) =>
  dot
    .replace(OPENING_BRACKET, '.')
    .replace(CLOSING_BRACKET, '')
    .replace(BEGINS_WITH_DOT, '')
    .split('.');

const isIndex = (v) => {
  try {
    const p = Number.parseInt(v, 10);
    if (p > -1) {
      return true;
    }
  } catch (e) {
    return false;
  }
};

export const update = (src, dot, cb) => {
  // if src is null or dot path is invalid
  if (!src && (!dot || dot === '.')) {
    return cb(src);
  }

  if (!dot || dot === '.') {
    const assumedType = Array.isArray(src) ? [...src] : { ...src };
    return cb(assumedType);
  }

  const entries = parse(dot);
  const [first] = entries;
  const clone = isIndex(first) ? [...(src || [])] : { ...src };

  let i = 0;
  let current = clone;
  const len = entries.length;
  while (i < len) {
    const key = entries[i];
    const next = entries[i + 1];

    if (!next) {
      current[key] = cb(current[key]);
      break;
    }

    if (!current[key]) {
      current[key] = isIndex(next) ? [] : {};
    }

    current = current[key];
    i += 1;
  }

  return clone;
};
