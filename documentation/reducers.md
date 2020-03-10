[Home](https://github.com/icarus-sullivan/redux-config/blob/master/README.md)

# reducers(config | config[]) => Function
Converts configuration into a single reducer.

### config:
| key| value | required | description |
|--|--|--|--|
| type | string | yes | The action type to respond to |
| path | string | no | An update path within state - created if not found |
| fn | function | yes | The function called when the action type is dispatched |

### Single Config
reducers can accept an array of configurations, or a singluar config. When creating configuration for a reducer, it helps to think of each `key` as it would correspond to a `case: [key]` within a switch statement. 

```javascript
import { reducers } from '@sullivan/redux-config';

const reducer = reducers([
  {
    type: 'TEST',
    path: 'some.deeply.nested[0].path',
    fn: (state, payload) => ({
      ...state,
      ...payload,
    }),
  },
]);

const result = reducer(undefined, {
  type: 'TEST',
  payload: { foo: 'bar' },
});
console.log(JSON.stringify(result, null, 2));
```

Output:
```javascript
{
  "some": {
    "deeply": {
      "nested": [
        {
          "path": {
            "foo": "bar"
          }
        }
      ]
    }
  }
}
```

### Multiple Configs
In some cases it may be useful to create factories or isolated configurations depending on code structure and requirements. 

```javascript
import { reducers } from '@sullivan/redux-config';

const reducer = reducers([
  {
    type: 'TEST',
    fn: () => ({
      initialized: true,
    }),
  },
  {
    type: 'POST_VIEW',
    path: 'post.items',
    fn: (state = [], id) => [...state, { id }],
  },
  {
    type: 'COMMENT_LIKED',
    path: 'comments',
    fn: (state) => ({
      ...state,
      liked: true,
    }),
  },
]);

const actions = [
  { type: 'TEST' },
  { type: 'POST_VIEW', payload: 'postId' },
  { type: 'COMMENT_LIKED' },
];
```

Output:
```javascript
{ initialized: true }
{ initialized: true, post: { items: [ [Object] ] } }
{
  initialized: true,
  post: { items: [ [Object] ] },
  comments: { liked: true }
}
```

