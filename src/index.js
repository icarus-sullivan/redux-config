import "core-js/stable";
import "regenerator-runtime/runtime";

export const InvocationType = {
  SYNC: 'sync',
  ASYNC: 'async',
}

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

const createAction = ({ type, dispatch }) => (...args) =>
  dispatch({
    type,
    payload: args.length === 1 ? args[0] : args,
  });

export const createConfigActions = obj => dispatch =>
  Object.entries(obj).reduce((a, [key, value]) => {
    const { invocationType = InvocationType.SYNC } = value;
    const mergeDispatch = { ...value, dispatch };
    if (invocationType === InvocationType.SYNC) {
      a[key] = createAction(mergeDispatch);
    } else if (invocationType === InvocationType.ASYNC) {
      a[key] = createAsyncAction(mergeDispatch);
    }
    return a;
  }, {});

  const SpecialCharactersCheck = /[^A-Z0-9\_]/gi;

export const createConstants = ({ invocationType = InvocationTypes.SYNC, scope, verbs = [] }) =>
  verbs.reduce((a, b) => {
    const SCOPE = scope.toUpperCase();
    const VERB = b.toUpperCase();
    const key = `${SCOPE}_${VERB}`.replace(SpecialCharactersCheck, '_');
    const value = `@${SCOPE}/${VERB}`;
    a[key] = value;
    if (invocationType === InvocationType.ASYNC) {
      a[`${key}_REQUESTED`] = `${value}_REQUESTED`;
      a[`${key}_RECEIVED`] = `${value}_RECEIVED`;
      a[`${key}_FAILED`] = `${value}_FAILED`;
      a[`${key}_DONE`] = `${value}_DONE`;
    }
    return a;
  }, {});


  export const createConfigReducer = config => (state, { type, payload }) => {
    const handler = config[type];
    if (handler) {
      return handler(state, payload);
    }
    return state;
  };
  
  export const combineConfigReducers = (...config) => {
    const mergedConfigs = config.reduce((a, b) => ({ ...a, ...b }), {});
  
    return (state, { type, payload }) => {
      const handler = mergedConfigs[type];
      if (handler) {
        return handler(state, payload);
      }
      return state;
    };
  };