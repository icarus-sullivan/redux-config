const createReducerImpl = ({ namespace, mapping, initial = null }) => {
  return (state, { type, payload }) => {
    const defaultHandler = (st) => st;
    const handler = mapping[type] || defaultHandler;
    if (namespace) {
      const s = state && state[namespace] ? state[namespace] : initial;

      return {
        ...state,
        [namespace]: handler(s, payload),
      };
    }

    const s = state || initial;
    return handler(s, payload);
  };
};

export const createReducer = (configs) => {
  const configurations = Array.isArray(configs) ? configs : [configs];

  const reducers = configurations.map(createReducerImpl);
  return (state, action) => reducers.reduce((s, fn) => fn(s, action), state);
};
