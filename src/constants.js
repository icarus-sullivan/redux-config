const SPECIAL_CHARS_REGEX = /[^A-Z0-9_]/gi;

export const asEnum = (value) => {
  if (!value) {
    throw new Error('value is invalid or undefined');
  }

  return {
    DEFAULT: value,
    REQUESTED: `${value}_REQUESTED`,
    SUCCEEDED: `${value}_SUCCEEDED`,
    FAILED: `${value}_FAILED`,
    DONE: `${value}_DONE`,
  };
};

const impl = ({ invocation = 'sync', namespace = '', verbs = [] }) => {
  const scope = namespace.toUpperCase();

  return verbs.reduce((a, b) => {
    const VERB = b.toUpperCase();
    const key = `${scope}_${VERB}`.replace(SPECIAL_CHARS_REGEX, '_');
    const value = `@${scope}/${VERB}`;

    a[key] = invocation === 'async' ? asEnum(value) : value;
    return a;
  }, {});
};

export const constants = (config) =>
  Array.isArray(config)
    ? config.reduce((a, b) => ({ ...a, ...impl(b) }), {})
    : impl(config);
