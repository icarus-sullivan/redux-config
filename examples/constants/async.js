const { createConstants } = require('../../lib');

const constants = createConstants({
  invocationType: 'async',
  namespace: 'post',
  verbs: ['create', 'update', 'delete'],
});

console.log(constants);
