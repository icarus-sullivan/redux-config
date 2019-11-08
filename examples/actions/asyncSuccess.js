const { createActions } = require('../../');

const dispatch = console.log;

const fetch = (arg) =>
  new Promise((resolve) => {
    setTimeout(() => resolve({ url: arg, data: {} }), 200);
  });

const actions = createActions({
  fetchPage: {
    invocationType: 'async',
    type: 'PAGE',
    fn: async (url) => fetch(url),
  },
});

const created = actions(dispatch);

created.fetchPage('http://content.json');
