[Home](https://github.com/icarus-sullivan/redux-config/blob/master/README.md)

# createReducer
Converts key-value mapping into a singular reducer. 

### Single Config
createReducer can accept an array of configurations, or a singluar config. When creating configuration for a reducer, it helps to think of each `key` as it would correspond to a `case: [key]` within a switch statement. 

```javascript
import { createReducer } from '@sullivan/redux-config';

const mockState = {};
const initialState = {};
const reducer = createReducer({
  POST_VIEW: (state, payload) => {
    console.log('POST_VIEW', state, payload);
    return state;
  },
  POST_DELETE: (state, { pid }) => ({
    ...state,
    posts: state.posts.filter(({ id }) => id !== pid),
  }),
}, initialState);

reducer(mockState, { type: 'POST_VIEW', payload: { foo: 'bar' } });
```

Output:
```bash
POST_VIEW {} { foo: 'bar' }
```

### Multiple Configs
In some cases it may be useful to create factories or isolated configurations depending on code structure and requirements. 

```javascript
import { createReducer } from '@sullivan/redux-config';


const reducer = createReducer([
  // post config
  {
    POST_VIEW: (state) => state,
    POST_DELETE: (state, { pid }) => ({
      ...state,
      posts: state.posts.filter(({ id }) => id !== pid),
    }),
  },

  // comment config
  {
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
]);

console.log(
  'POST_VIEW',
  reducer({}, { type: 'POST_VIEW', payload: { foo: 'bar' } }),
);
console.log('COMMENT_LIKED', reducer({}, { type: 'COMMENT_LIKED' }));
```

Output:
```bash
POST_VIEW {}
COMMENT_LIKED { liked: true }
```

