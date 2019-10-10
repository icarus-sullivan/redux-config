const { createConstants, createConfigActions } = require('./lib');


const Constants = createConstants({
  invocationType: 'async',
  scope: 'entity',
  verbs: [
    'create',
    'delete',
  ]
});


console.log('constants', Constants);

const actions = createConfigActions({
  testInvoke: {
    type: Constants.ENTITY_CREATE,
    invocationType: 'async',
    fn: (...args) => {

      return { args, foo : 'bar' };
    }
  },
})(console.log);


actions.testInvoke('passed');