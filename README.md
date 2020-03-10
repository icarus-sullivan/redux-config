![Downloads][link-download] ![Version][link-version] ![License][link-license]

# redux-config
Reduces boilerplate for redux into a simple configuration pattern


# Installation 

```bash
yarn add @sullivan/redux-config
# or
npm i --save @sullivan/redux-config
```

## Documentation
- [Constants][constant]
- [Actions][action]
- [Reducers][reducer]

## Example Usage

#### Constants
Let's start with the most common approach to creating a modularized redux architecture, constants. We know we want to fetch some posts and also have the ability to toggle visiblity. 

```javascript
import { constants } from '@sullivan/redux-config';

const { POST_FETCH, POST_TOGGLE } = constants([
  {
    invocation: 'async',
    namespace: 'post',
    verbs: ['fetch'],
  },
  {
    namespace: 'post',
    verbs: ['toggle'],
  },
]);
```

Since we are making an asynchronous call to get posts, so we will use the `async` invocation value to generate an enum for use later in our action and reducer.

#### Actions
Now we can make a couple action dispatchers that will use these constants. Keep in mind, our created action config will need to be initialized with the stores dispatch method. 

```javascript
import { actions } from '@sullivan/redux-config';

const { POST_FETCH, POST_TOGGLE } = // constants

const curriedActions = actions({
  fetchPosts: {
    type: POST_FETCH,
    invocation: 'async',
    fn: async () => [
      {
        id: '1',
        visible: true,
        comment: 'hello',
      },
      {
        id: '2',
        visible: true,
        comment: 'oh hi!',
      },
    ],
  },
  togglePostVisiblity: {
    type: POST_TOGGLE,
  },
});
```

The `async` invocation will handle specific states such as REQUESTED, SUCCEEDED, FAILED, and DONE automatically. Wheres the togglePostVisiblity will generate a function and dispatch our action type with whatever params are passed to it. 

#### Reducer
Now we want our reducers to update states based on our actions that are dispatched. We want to cover the basic cases, like posts responding, loading states, and the visibility toggle. 

```javascript 
import { reducers } from '@sullivan/redux-config';

const { POST_FETCH, POST_TOGGLE } = // constants

const reducer = reducers([
  {
    type: POST_FETCH.REQUESTED,
    path: 'posts.loading',
    fn: () => true,
  },
  {
    type: POST_FETCH.SUCCEEDED,
    path: 'posts.items',
    fn: (state, data) => data,
  },
  {
    type: POST_FETCH.DONE,
    path: 'posts.loading',
    fn: () => false,
  },

  {
    type: POST_TOGGLE,
    path: 'posts.items',
    fn: (state = [], { id }) =>
      state.map((it) => {
        if (id === it.id) {
          return {
            ...it,
            visible: !it.visible,
          };
        }
        return it;
      }),
  },
]);
```

Take note of the path used within the type configuration. When the reducer is ran, the state at that path will be used and passed to it. If the path doesn't exist it will be created for you. However, the initial value will not be set, so using a fallback initial value in the `fn` declaration is still suggests. 

#### Putting it together
```javascript
import { createStore, applyMiddleware } from 'redux';
import { constants, actions, reducers } from '@sullivan/redux-config';

const logger = (s) => (n) => (a) => {
  console.log('Action:', a);
  const response = n(a);

  console.log('State:', JSON.stringify(s.getState(), null, 2));
  return response;
};

const { POST_FETCH, POST_TOGGLE } = constants([
  {
    invocation: 'async',
    namespace: 'post',
    verbs: ['fetch'],
  },
  {
    namespace: 'post',
    verbs: ['toggle'],
  },
]);

const reducer = reducers([
  {
    type: POST_FETCH.REQUESTED,
    path: 'posts.loading',
    fn: () => true,
  },
  {
    type: POST_FETCH.SUCCEEDED,
    path: 'posts.items',
    fn: (state, data) => data,
  },
  {
    type: POST_FETCH.DONE,
    path: 'posts.loading',
    fn: () => false,
  },

  {
    type: POST_TOGGLE,
    path: 'posts.items',
    fn: (state = [], { id }) =>
      state.map((it) => {
        if (id === it.id) {
          return {
            ...it,
            visible: !it.visible,
          };
        }
        return it;
      }),
  },
]);

const curriedActions = actions({
  fetchPosts: {
    type: POST_FETCH,
    invocation: 'async',
    fn: async () => [
      {
        id: '1',
        visible: true,
        comment: 'hello',
      },
      {
        id: '2',
        visible: true,
        comment: 'oh hi!',
      },
    ],
  },
  togglePostVisiblity: {
    type: POST_TOGGLE,
  },
});

const store = createStore(reducer, {}, applyMiddleware(logger));

const createdActions = curriedActions(store.dispatch);

createdActions.fetchPosts().then(() => {
  createdActions.togglePostVisiblity({ id: '2' });
});
```

Output: 
```javascript
Action: { type: '@POST/FETCH_REQUESTED', payload: [] }
State: {
  "posts": {
    "loading": true
  }
}
Action: {
  type: '@POST/FETCH_SUCCEEDED',
  payload: [
    { id: '1', visible: true, comment: 'hello' },
    { id: '2', visible: true, comment: 'oh hi!' }
  ]
}
State: {
  "posts": {
    "loading": true,
    "items": [
      {
        "id": "1",
        "visible": true,
        "comment": "hello"
      },
      {
        "id": "2",
        "visible": true,
        "comment": "oh hi!"
      }
    ]
  }
}
Action: { type: '@POST/FETCH_DONE' }
State: {
  "posts": {
    "loading": false,
    "items": [
      {
        "id": "1",
        "visible": true,
        "comment": "hello"
      },
      {
        "id": "2",
        "visible": true,
        "comment": "oh hi!"
      }
    ]
  }
}
Action: { type: '@POST/TOGGLE', payload: { id: '2' } }
State: {
  "posts": {
    "loading": false,
    "items": [
      {
        "id": "1",
        "visible": true,
        "comment": "hello"
      },
      {
        "id": "2",
        "visible": false,
        "comment": "oh hi!"
      }
    ]
  }
}
```

[link-download]: https://img.shields.io/npm/dt/@sullivan/redux-config
[link-version]: https://img.shields.io/npm/v/@sullivan/redux-config.svg
[link-license]: https://img.shields.io/npm/l/@sullivan/redux-config.svg

[action]: https://github.com/icarus-sullivan/redux-config/blob/master/documentation/actions.md
[constant]: https://github.com/icarus-sullivan/redux-config/blob/master/documentation/constants.md
[reducer]: https://github.com/icarus-sullivan/redux-config/blob/master/documentation/reducers.md


## Changelog

**0.5.3**
- Expose the actionCreator for one-off actions