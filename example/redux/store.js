import { createStore, applyMiddleware } from 'redux';
import reducer from './reducer';

const logger = (store) => (next) => (action) => {
  const output = document.getElementById('console');
  output.innerHTML += `<span style="color: yellow">dispatching</span> ${JSON.stringify(action, null, 2)}\n`;
  const result = next(action);
  output.innerHTML += `<span style="color: green">next state</span> ${JSON.stringify(
    store.getState(),
    null,
    2,
  )}\n`;
  output.scrollTop = output.scrollHeight;
  return result;
};

export default createStore(
  reducer,
  {
    filter: {
      open: true,
      hours: [8, 5],
    },
  },
  applyMiddleware(logger),
);
