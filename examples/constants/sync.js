const { createConstants } = require('../../');

const constants = createConstants({
  namespace: 'post',
  verbs: ['view', 'navigate'],
});

console.log(constants);
