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
 *     invoccationType: 'async',
 *     type: 'MY_TYPE',
 *     fn: async () => ...
 *   },
 * }
 *
 * @param {*} param0
 */
const createAsyncAction = ({ type, errorPayload, dispatch, fn }) => async (
  ...args
) => {
  try {
    dispatch({ type: `${type}_REQUESTED` });
    const res = await fn(...args);
    dispatch({ type: `${type}_RECEIVED`, payload: res });
  } catch (e) {
    dispatch({ type: `${type}_FAILED`, payload: errorPayload || e });
  } finally {
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
const createFnAcition = ({ dispatch, fn }) => (...args) =>
  dispatch(fn(...args));

export const createActions = (obj) => (dispatch) =>
  Object.entries(obj).reduce((a, [key, value]) => {
    // We were passed a function, automatically wrap it in dispatch
    // when it is invoked
    if (typeof value === 'function') {
      a[key] = createFnAcition({ dispatch, fn: value });
      return a;
    }

    const invoccationType = value.invoccationType || 'sync';
    const mergeDispatch = { ...value, dispatch };

    if (invoccationType === 'async') {
      a[key] = createAsyncAction(mergeDispatch);
      return a;
    }

    // Default to a sync definition
    a[key] = createAction(mergeDispatch);
    return a;
  }, {});
