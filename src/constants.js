const SPECIAL_CHARS_REGEX = /[^A-Z0-9_]/gi;

/**
 * Generates constants based off a scope, appending the verb in a
 * consistent manner.
 *
 * {
 *   scope: 'posts',
 *   verbs: ['navigated'],
 * }
 *
 * => { POSTS_NAVIGATED: '@POSTS/NAVIGATED' }
 *
 * @param {*} param0
 */
const createConstantsImpl = ({
  invoccationType = 'sync',
  scope,
  verbs = [],
}) => {
  const SCOPE = scope.toUpperCase();

  return verbs.reduce((a, b) => {
    const VERB = b.toUpperCase();
    const key = `${SCOPE}_${VERB}`.replace(SPECIAL_CHARS_REGEX, '_');
    const value = `@${SCOPE}/${VERB}`;

    if (invoccationType === 'async') {
      a[`${key}_REQUESTED`] = `${value}_REQUESTED`;
      a[`${key}_SUCCEEDED`] = `${value}_SUCCEEDED`;
      a[`${key}_FAILED`] = `${value}_FAILED`;
      a[`${key}_DONE`] = `${value}_DONE`;
    }

    a[key] = value;
    return a;
  }, {});
};

/**
 * Creates constants based on config, this is useful in cases where you want
 * to define both async and sync constants with a single call.
 *
 * [
 *   {
 *     invoccationType: 'async',
 *     scope: 'posts',
 *     verbs: ['created', 'deleted'],
 *   },
 *   {
 *     scope: 'posts',
 *     verbs: ['navigated'],
 *   }
 * ]
 * @param {*} config
 */
export const createConstants = (config) =>
  Array.isArray(config)
    ? config.reduce((a, b) => ({ ...a, ...createConstantsImpl(b) }), {})
    : createConstantsImpl(config);
