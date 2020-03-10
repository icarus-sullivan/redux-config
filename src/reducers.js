import { update } from './mutation';

const impl = ({ type, path, fn }) => ({
  [type]: (state, payload) => update(state, path, (d) => fn(d, payload)),
});

export const reducers = (conf) => {
  const delegates = Array.isArray(conf) ? conf : [conf];

  const handlers = delegates.reduce(
    (a, b) => ({
      ...a,
      ...impl(b),
    }),
    {},
  );

  return (state, action) => {
    const handler = handlers[action.type];
    if (handler) {
      return handler(state, action.payload) || null;
    }
    return state || null;
  };
};
