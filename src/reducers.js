export const createReducer = (config) => {
  const configMap = Array.isArray(config)
    ? config.reduce((a, b) => ({ ...a, ...b }), {})
    : config;

  return (state, { type, payload }) => {
    const handler = configMap[type];
    if (handler) {
      return handler(state, payload);
    }
    return state || null;
  };
};
