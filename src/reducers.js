const _reducer = (mapping, initial = null) => (
  state = initial,
  { type, payload },
) => mapping[type](state, payload) || state;

// TODO: fix this
const createReducerImpl = ({ namespace, mapping, initial = null }) => (
  state = initial,
  { type, payload },
) => {
  try {
    const r = _reducer(mapping, initial);
    if (namespace) {
      console.log('namespaced', namespace, state);
      return {
        ...state,
        [namespace]: r(state[namespace], payload),
      };
    }
    return r(state, payload);
  } catch (err) {
    return state;
  }
};

export const createReducer = (configs) => {
  const configurations = Array.isArray(configs) ? configs : [configs];

  const reducers = configurations.map(createReducerImpl);
  return (state, action) => reducers.reduce((s, fn) => fn(s, action), state);
};
