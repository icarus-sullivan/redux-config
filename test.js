const { combineConstants, createConfigActions, createConfigReducer } = require('./lib');
const { createStore, combineReducers } = require('redux');

const mockDispatch = console.log;
const mockReducer = (type) => (state = {}) => {
  console.log('state', type, '=>', state);
  return state;
};


// Can define async and non-async together to be combined
// 
// For single configs use createConstants
const constants = combineConstants([
  {
    invocationType: 'async',
    scope: 'posts',
    verbs: ['create', 'update', 'delete'],
  },
  {
    scope: 'posts',
    verbs: ['navigate'],
  }
])


const actionCreator = createConfigActions({
  testInvoke: {
    type: constants.POSTS_CREATE,
    invocationType: 'async',
    fn: (...args) => {

      return { args, foo : 'bar' };
    }
  },
});


const reducer = createConfigReducer({
  [constants.POSTS_CREATE_REQUESTED]: mockReducer(constants.POSTS_CREATE_REQUESTED),
  [constants.POSTS_CREATE_RECEIVED]: mockReducer(constants.POSTS_CREATE_RECEIVED),
  [constants.POSTS_CREATE_FAILED]: mockReducer(constants.POSTS_CREATE_FAILED),
  [constants.POSTS_CREATE_DONE]: mockReducer(constants.POSTS_CREATE_DONE),
});


// redux specific below 
const store = createStore(reducer, {
  test: {},
});

const actions = actionCreator(store.dispatch);

actions.testInvoke('hi');