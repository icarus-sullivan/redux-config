const { actionCreator } = require('../../lib');

const dispatch = console.log;

const fetch = (arg) =>
  new Promise((resolve) => {
    setTimeout(() => resolve({ url: arg, data: {} }), 200);
  });

const fetchPage = actionCreator({
  invocation: 'async',
  type: 'PAGE',
  fn: (url) => fetch(url),
})(dispatch);

fetchPage('http://content.json');
