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
const createAction = ({ type, payload, dispatch }) => (...args) =>
  dispatch({
    type,
    payload: payload || (args.length === 1 ? args[0] : args),
  });

/**
 * An async action is an object defined like below
 *
 * {
 *   someAsyncAction: {
 *     invocationType: 'async',
 *     type: 'MY_TYPE',
 *     fn: async () => ...
 *   },
 * }
 *
 * @param {*} param0
 */
const createAsyncAction = ({
  type,
  errorTransform = (e) => e,
  dispatch,
  fn,
}) => async (...args) => {
  try {
    dispatch({
      type: `${type}_REQUESTED`,
      payload: args.length === 1 ? args[0] : args,
    });
    dispatch({ type: `${type}_SUCCEEDED`, payload: await fn(...args) });
    dispatch({ type: `${type}_DONE` });
  } catch (e) {
    dispatch({ type: `${type}_FAILED`, payload: await errorTransform(e) });
    dispatch({ type: `${type}_DONE` });
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
const createFnFunction = ({ dispatch, fn }) => (...args) =>
  dispatch(fn(...args));

export const createActions = (obj) => (dispatch) =>
  Object.entries(obj).reduce((a, [key, value]) => {
    // We were passed a function, automatically wrap it in dispatch
    // when it is invoked
    if (typeof value === 'function') {
      a[key] = createFnFunction({ dispatch, fn: value });
      return a;
    }

    const invocationType = value.invocationType || 'sync';
    const mergeDispatch = { ...value, dispatch };

    if (invocationType === 'async') {
      a[key] = createAsyncAction(mergeDispatch);
      return a;
    }

    // Default to a sync definition
    a[key] = createAction(mergeDispatch);
    return a;
  }, {});
