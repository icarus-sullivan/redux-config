const { createActions } = require('../../lib');

const dispatch = console.log;

const fetch = (arg) =>
  new Promise((resolve) => {
    setTimeout(() => resolve({ url: arg, data: {} }), 200);
  });

const actions = createActions({
  fetchPage: {
    invocation: 'async',
    type: 'PAGE',
    fn: (url) => fetch(url),
  },
});

const created = actions(dispatch);

created.fetchPage('http://content.json');
