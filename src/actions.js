import { asEnum } from './constants';

/**
 * A sync action is an object defined like below
 *
 * {
 *   someAction: {
 *     type: 'MY_TYPE',
 *   },
 * }
 *
 * It can also use static payload and should be defined:
 *
 * {
 *   someAction: {
 *     type: 'MY_TYPE',
 *     payload: {
 *       foo: 'bar',
 *     },
 *   },
 * }
 *
 * @param {*} param0
 */
const base = ({ type, payload, dispatch }) => (...args) =>
  dispatch({
    type,
    payload: payload || (args.length === 1 ? args[0] : args),
  });

/**
 * An async action is an object defined like below
 *
 * {
 *   someAsyncAction: {
 *     invocation: 'async',
 *     type: 'MY_TYPE',
 *     fn: async () => ...
 *   },
 * }
 *
 * @param {*} param0
 */
const asAsync = ({ type, errorTransform = (e) => e, dispatch, fn }) => async (
  ...args
) => {
  const ENUM = typeof type === 'object' ? type : asEnum(type);
  try {
    dispatch({
      type: ENUM.REQUESTED,
      payload: args.length === 1 ? args[0] : args,
    });
    dispatch({ type: ENUM.SUCCEEDED, payload: await fn(...args) });
    dispatch({ type: ENUM.DONE });
  } catch (e) {
    dispatch({ type: ENUM.FAILED, payload: await errorTransform(e) });
    dispatch({ type: ENUM.DONE });
  }
};

/**
 * An action declaration with the following syntax
 *
 * {
 *   someAction: (args, here, varaiable) => {
 *     type: 'MY_TYPE',
 *     payload: {
 *       args,
 *       here,
 *       variable
 *     }
 *   }
 * }
 *
 * @param {*} param0
 */
const asFunction = ({ dispatch, fn }) => (...args) => dispatch(fn(...args));

const impl = (value) => (dispatch) => {
  // We were passed a function, automatically wrap it in dispatch
  // when it is invoked
  if (typeof value === 'function') {
    return asFunction({ dispatch, fn: value });
  }

  const invoke = value.invocation || 'sync';
  const mergeDispatch = { ...value, dispatch };

  if (invoke === 'async') {
    return asAsync(mergeDispatch);
  }

  // Default to a sync definition
  return base(mergeDispatch);
};

const mergeActions = (src, dispatch) =>
  Object.entries(src).reduce((a, [key, value]) => {
    a[key] = impl(value)(dispatch);
    return a;
  }, {});

export const actions = (obj) => (dispatch) =>
  Array.isArray(obj)
    ? obj.reduce((a, b) => ({ ...a, ...mergeActions(b, dispatch) }), {})
    : mergeActions(obj, dispatch);
