const { createConstants } = require('../../lib');

const constants = createConstants({
  invoccationType: 'async',
  namespace: 'post',
  verbs: ['create', 'update', 'delete'],
});

console.log(constants);
