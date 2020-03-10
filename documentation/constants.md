[Home](https://github.com/icarus-sullivan/redux-config/blob/master/README.md)

# constants(config | config[]) => { key: string }
Creates dynamic constants, or multiple constants for project uniformity.

### config:
| key| value | required | description |
|--|--|--|--|
| invocation | string | no | Whether to create an async enum or not |
| namespace | string | yes | The prefix for the constants |
| verbs | string[] | yes | The suffix for the constants |


### Simple Constants
```javascript
const { constants } = require('@sullivan/redux-config');

const C = constants({
  namespace: 'test',
  verbs: ['run', 'finish'],
});

console.log(C);
```

Output:
```javascript
{ TEST_RUN: '@TEST/RUN', TEST_FINISH: '@TEST/FINISH' }
```

### Async Declarations 
Async constants will create an enum for use with asynchronouse actions. These constants are used to assist reducer state mangement when dispatched.

```javascript
import { constants } from '@sullivan/redux-config';

const C = constants({
  invocation: 'async',
  namespace: 'post',
  verbs: ['test'],
});

console.log(C);
```

Output:
```javascript
{
  POST_TEST: {
    DEFAULT: '@POST/TEST',
    REQUESTED: '@POST/TEST_REQUESTED',
    SUCCEEDED: '@POST/TEST_SUCCEEDED',
    FAILED: '@POST/TEST_FAILED',
    DONE: '@POST/TEST_DONE'
  }
}
```

### Namespaced Types
You don't need to choose async or sync invocations, you can define them within the same constants call. 

```javascript
import { constants } from '@sullivan/redux-config';

const C = constants([
  {
    namespace: 'post',
    verbs: ['view', 'navigate'],
  },
  {
    invocation: 'async',
    namespace: 'post',
    verbs: ['fetch'],
  },
]);

console.log(C);
```

Output:
```javascript
{
  POST_VIEW: '@POST/VIEW',
  POST_NAVIGATE: '@POST/NAVIGATE',
  POST_FETCH: {
    DEFAULT: '@POST/FETCH',
    REQUESTED: '@POST/FETCH_REQUESTED',
    SUCCEEDED: '@POST/FETCH_SUCCEEDED',
    FAILED: '@POST/FETCH_FAILED',
    DONE: '@POST/FETCH_DONE'
  }
}
```
