const SPECIAL_CHARS_REGEX = /[^A-Z0-9_]/gi;

export const createAsyncEnum = (value) => {
  if (!value) {
    throw new Error('value is invalid or undefined in createAsyncEnum');
  }

  return {
    DEFAULT: value,
    REQUESTED: `${value}_REQUESTED`,
    SUCCEEDED: `${value}_SUCCEEDED`,
    FAILED: `${value}_FAILED`,
    DONE: `${value}_DONE`,
  };
};

/**
 * Generates constants based off a namespace, appending the verb in a
 * consistent manner.
 *
 * {
 *   namespace: 'posts',
 *   verbs: ['navigated'],
 * }
 *
 * => { POSTS_NAVIGATED: '@POSTS/NAVIGATED' }
 *
 * @param {*} param0
 */
const createConstantsImpl = ({
  invocationType = 'sync',
  namespace,
  verbs = [],
}) => {
  const scope = namespace.toUpperCase();

  return verbs.reduce((a, b) => {
    const VERB = b.toUpperCase();
    const key = `${scope}_${VERB}`.replace(SPECIAL_CHARS_REGEX, '_');
    const value = `@${scope}/${VERB}`;

    a[key] = invocationType === 'async' ? createAsyncEnum(value) : value;
    return a;
  }, {});
};

/**
 * Creates constants based on config, this is useful in cases where you want
 * to define both async and sync constants with a single call.
 *
 * [
 *   {
 *     invocationType: 'async',
 *     namespace: 'posts',
 *     verbs: ['created', 'deleted'],
 *   },
 *   {
 *     namespace: 'posts',
 *     verbs: ['navigated'],
 *   }
 * ]
 * @param {*} config
 */
export const createConstants = (config) =>
  Array.isArray(config)
    ? config.reduce((a, b) => ({ ...a, ...createConstantsImpl(b) }), {})
    : createConstantsImpl(config);
