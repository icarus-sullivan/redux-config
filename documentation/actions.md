[Home](https://github.com/icarus-sullivan/redux-config/blob/master/README.md)

# actions(config | config[]) => Function
Configuration for actions can be done in multiple ways to make edge cases easier to handle. Note these actions are curried and will need to be passed a dispatch method. 

### config:
| key| value | required | 
|--|--|--|
| type | string \| enum | yes | 
| invocation | string | no | 
| fn | function | async only | 
| errorTransform | AsyncFunction | - |
| payload | any | static only |

** Note actions can also be normal functions, these will be wrapped in dispatch and invoked and should follow the normal `{ type, payload }` convention when applicable.

### Synchronous Declarations - Simple
Automatically wraps your defined function response into a dispatch call.

```javascript
import { actions } from '@sullivan/redux-config';

const dispatch = console.log;

const curried = actions({
 autoDispatch: (id) => ({
    type: 'VIEW_ID',
    payload: {
      id, 
    }
  }),
});

const created = curried(dispatch);

created.autoDispatch('123');
```

Output:
```bash
{ type: 'VIEW_ID', payload: { id: '123' } }
  ```

### Synchronous Declarations - Static
Creates a static action that does not receive params. 

```javascript
import { actions } from '@sullivan/redux-config';

const dispatch = console.log;

const curried = actions({
  navigate: {
    type: 'NAVIGATE',
    payload: {
      content: 'some-static-payload',
    }
  },
});

const created = curried(dispatch);

created.navigate();
```

Output:
```bash
{ type: 'NAVIGATE',
  payload: { content: 'some-static-payload' } }
  ```
  
  ### Synchronous Declarations - Dynamic Payload
If payload is missing in a static declaration, params are automatically passed in as the payload. Single params will be injected as the payload, but n>1 will be converted into an array.

```javascript
import { actions } from '@sullivan/redux-config';

const dispatch = console.log;

const curried = actions({
  autoPayload: {
    type: 'ENABLE',
  },
});

const created = curried(dispatch);

created.autoPayload(1, 2, 3);
created.autoPayload({ foo: 'bar' });
```

Output:
```bash
{ type: 'ENABLE', payload: [ 1, 2, 3 ] }
{ type: 'ENABLE', payload: { foo: 'bar' } }
  ```


### Async Declarations - Success
There is a lot of boilerplate surrounding requesting, receiving, failure and final states in async requests. Based off conventions for web request, dispatched actions are called automatically, and are derived from the initial type. 

```javascript
import { actions, constants } from '@sullivan/redux-config';
const dispatch = console.log;

const fetch = (arg) =>
  new Promise((resolve) => {
    setTimeout(() => resolve({ url: arg, data: {} }), 200);
  });

const { PAGE_FETCH } = constants({
  namespace: 'page',
  invocation: 'async',
  verbs: ['fetch'],
});

const curried = actions({
  fetchPage: {
    invocation: 'async',
    type: PAGE_FETCH,
    fn: async (url) => fetch(url),
  },
});

const created = curried(dispatch);

created.fetchPage('http://content.json');
```

Output:
```javascript
{ type: '@PAGE/FETCH_REQUESTED', payload: 'http://content.json' }
{
  type: '@PAGE/FETCH_SUCCEEDED',
  payload: { url: 'http://content.json', data: {} }
}
{ type: '@PAGE/FETCH_DONE' }
```

### Async Declarations - Overriding Errors
If there are cases in which we expect an error to occur and want to respond with a specific payload. We can add an `errorPayload` value during our declaration. The original error will be ignored and our error data will be dispatched.
```javascript

const curried = actions({
  fetchPage: {
    invocation: 'async',
    type: 'PAGE',
    errorTransform: (e) => ({
      error: e.message,
      override: true,
    }),
    fn: async () => {
      throw new Error('nope');
    },
  },
});

const created = curried(console.log);

created.fetchPage();
```

Output: 
```bash
{ type: 'PAGE_REQUESTED', payload: [] }
{ type: 'PAGE_FAILED',
  payload: { error: 'nope', override: true } }
{ type: 'PAGE_DONE' }
```



