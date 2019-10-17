const createReducerImpl = (mapping, initial = null) => (
  state = initial,
  { type, payload },
) => {
  const handler = mapping[type];
  if (handler) {
    return handler(state, payload);
  }
  return state;
};

export const createReducer = (configs) => {
  const configurations = Array.isArray(configs) ? configs : [configs];

  const reducers = configurations.map(({ namespace, mapping, initial = null }) => {
    const reducer = createReducerImpl(mapping, initial);
    if (namespace) {
      return (state = initial, action) => ({
        ...state,
        [namespace]: reducer(state[namespace], action),
      });
    }

    return reducer;
  });

  return (state, action) => reducers.reduce((s, fn) => fn(s, action), state);
};
