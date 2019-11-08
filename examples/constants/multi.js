const { createConstants } = require('../../lib');

const constants = createConstants([
  {
    namespace: 'post',
    verbs: ['view', 'navigate'],
  },
  {
    invocationType: 'async',
    namespace: 'post',
    verbs: ['create'],
  },
]);

console.log(constants);
