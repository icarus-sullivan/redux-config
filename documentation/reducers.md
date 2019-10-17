[Home](https://github.com/icarus-sullivan/redux-config/blob/master/README.md)

# createReducer
Converts key-value mapping into a singular reducer. 

### Single Config
createReducer can accept an array of configurations, or a singluar config. When creating configuration for a reducer, it helps to think of each `key` as it would correspond to a `case: [key]` within a switch statement. 

```javascript
import { createReducer } from '@sullivan/redux-config';

const reducer = createReducer({
  mapping: {
    POST_VIEW: (state, payload) => ({
      ...state,
      ...payload,
    }),
    POST_DELETE: (state, { pid }) => ({
      ...state,
      posts: state.posts.filter(({ id }) => id !== pid),
    }),
  },
  initial: {
    static: 'content',
  },
});

const result = reducer(undefined, {
  type: 'POST_VIEW',
  payload: { foo: 'bar' },
});
console.log(result);
```

Output:
```bash
{ static: 'content', foo: 'bar' }
```

### Multiple Configs
In some cases it may be useful to create factories or isolated configurations depending on code structure and requirements. 

```javascript
import { createReducer } from '@sullivan/redux-config';

const reducer = createReducer([
  {
    namespace: 'posts',
    mapping: {
      POST_VIEW: (state, id) => ({
        ...state,
        viewing: id,
      }),
      POST_DELETE: (state, { pid }) => ({
        ...state,
        posts: state.posts.filter(({ id }) => id !== pid),
      }),
    },
  },
  {
    namespace: 'comments',
    mapping: {
      COMMENT_LIKED: (state) => ({
        ...state,
        liked: true,
      }),
      COMMENT_UPDATE: (state, { text }) => ({
        ...state,
        text,
      }),
      CLEAR_COMMENT: (state) => ({}),
    },
    initial: {
      text: 'What an awesome reducer!',
    },
  },
]);

const actions = [
  { type: 'POST_VIEW', payload: 'postId' },
  { type: 'COMMENT_LIKED' },
];
```

Output:
```bash
{ posts: { viewing: 'postId' },
  comments: { text: 'What an awesome reducer!' } }
{ posts: { viewing: 'postId' },
  comments: { text: 'What an awesome reducer!', liked: true } }
```

