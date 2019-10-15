# redux-config
![Downloads][link-download] ![Version][link-version] ![License][link-license]
Reduces boilerplate for redux into a simple configuration pattern


# Installation 

```bash
yarn add @sullivan/redux-config
# or
npm i --save @sullivan/redux-config
```

## Documentation

| Function | Description |
|--|--|
| [createConstants][constant] | Generates constants |
| [createActions][action] | Generates actions |
| [createReducer][reducer] | Converts object key-values into a reducer |

[link-download]: https://img.shields.io/npm/dt/@sullivan/redux-config
[link-version]: https://img.shields.io/npm/v/@sullivan/redux-config.svg
[link-license]: https://img.shields.io/npm/l/@sullivan/redux-config.svg

[action]: https://github.com/icarus-sullivan/redux-config/blob/master/documentation/actions.md
[constant]: https://github.com/icarus-sullivan/redux-config/blob/master/documentation/constants.md
[reducer]: https://github.com/icarus-sullivan/redux-config/blob/master/documentation/reducers.md

## Usage
Below is a simple example including redux usage:

```javascript
const { createStore, applyMiddleware } = require('redux');
const {
  createReducer,
  createConstants,
  createActions,
} = require('@sullivan/redux-config');

const Constants = createConstants([
  {
    invoccationType: 'async',
    scope: 'posts',
    verbs: ['create', 'update'],
  },
]);

const postActions = createActions({
  createPost: {
    type: Constants.POSTS_CREATE,
    invoccationType: 'async',
    fn: async (post) =>
      new Promise((resolve) => {
        setTimeout(() => resolve(post), 100);
      }),
  },
});

const postReducer = createReducer({
  [Constants.POSTS_CREATE_REQUESTED]: (state) => ({
    ...state,
    loading: true,
  }),
  [Constants.POSTS_CREATE_SUCCEEDED]: (state, post) => ({
    ...state,
    ...post,
  }),
  [Constants.POSTS_CREATE_FAILED]: (state, error) => ({
    ...state,
    error: error.message,
  }),
  [Constants.POSTS_CREATE_DONE]: (state) => ({
    ...state,
    loading: false,
  }),
});

// log changes
const logMiddleware = (store) => (next) => (action) => {
  console.log('dispatching', action);
  const result = next(action);
  console.log('next state', store.getState());
  return result;
};

const store = createStore(postReducer, applyMiddleware(logMiddleware));

// Allow our actions to dispatch to the store
const actions = postActions(store.dispatch);

// call our action
actions.createPost({
  userId: '123',
  username: '@sullivan',
  message: 'How is it going?',
});

// dispatching { type: '@POSTS/CREATE_REQUESTED' }
// next state { loading: true }
// dispatching { type: '@POSTS/CREATE_SUCCEEDED',
//   payload:
//    { userId: '123',
//      username: '@sullivan',
//      message: 'How is it going?' } }
// next state { loading: true,
//   userId: '123',
//   username: '@sullivan',
//   message: 'How is it going?' }
// dispatching { type: '@POSTS/CREATE_DONE' }
// next state { loading: false,
//   userId: '123',
//   username: '@sullivan',
//   message: 'How is it going?' }
```
