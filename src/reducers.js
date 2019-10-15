export const createReducer = (config, initial = null) => {
  const configMap = Array.isArray(config)
    ? config.reduce((a, b) => ({ ...a, ...b }), {})
    : config;

  return (state = initial, { type, payload }) => {
    const handler = configMap[type];
    if (handler) {
      return handler(state, payload);
    }
    return state;
  };
};
