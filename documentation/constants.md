[Home](https://github.com/icarus-sullivan/redux-config/blob/master/README.md)

# createConstants
Creates dynamic constants, or multiple constants depending on invoccationType.

**createConstants(config | config[]) => { key: string }**

Options:

| key| value | required | default |
|--|--|--|--|
| invoccationType | string | - | 'sync' |
| scope | string | yes | - |
| verbs | string[] | yes | - |

### Async Declarations 
Async constants will create 5 total values per verb. These constants are used in state mangement when async operations are called. 

```javascript
import { createConstants } from '@sullivan/redux-config';

const constants = createConstants({
  invoccationType: 'async',
  scope: 'post',
  verbs: ['create', 'update', 'delete'],
});

console.log(constants);
```

Output:
```bash
{ POST_CREATE_REQUESTED: '@POST/CREATE_REQUESTED',
  POST_CREATE_SUCCEEDED: '@POST/CREATE_SUCCEEDED',
  POST_CREATE_FAILED: '@POST/CREATE_FAILED',
  POST_CREATE_DONE: '@POST/CREATE_DONE',
  POST_CREATE: '@POST/CREATE',
  POST_UPDATE_REQUESTED: '@POST/UPDATE_REQUESTED',
  POST_UPDATE_SUCCEEDED: '@POST/UPDATE_SUCCEEDED',
  POST_UPDATE_FAILED: '@POST/UPDATE_FAILED',
  POST_UPDATE_DONE: '@POST/UPDATE_DONE',
  POST_UPDATE: '@POST/UPDATE',
  POST_DELETE_REQUESTED: '@POST/DELETE_REQUESTED',
  POST_DELETE_SUCCEEDED: '@POST/DELETE_SUCCEEDED',
  POST_DELETE_FAILED: '@POST/DELETE_FAILED',
  POST_DELETE_DONE: '@POST/DELETE_DONE',
  POST_DELETE: '@POST/DELETE' }
```

### Sync Declarations
Sync constants only create one value, but do so in a uniform format for consistency.

```javascript
import { createConstants } from '@sullivan/redux-config';

const constants = createConstants({
  scope: 'post',
  verbs: ['view', 'navigate'],
});

console.log(constants);
```

Output:
```bash
{ POST_VIEW: '@POST/VIEW', POST_NAVIGATE: '@POST/NAVIGATE' }
```

### Multiple Declarations

```javascript
import { createConstants } from '@sullivan/redux-config';

const constants = createConstants([
  {
    scope: 'post',
    verbs: ['view', 'navigate'],
  },
  {
    invoccationType: 'async',
    scope: 'post',
    verbs: ['create'],
  },
]);

console.log(constants);
```

Output:
```bash
{ POST_VIEW: '@POST/VIEW',
  POST_NAVIGATE: '@POST/NAVIGATE',
  POST_CREATE_REQUESTED: '@POST/CREATE_REQUESTED',
  POST_CREATE_SUCCEEDED: '@POST/CREATE_SUCCEEDED',
  POST_CREATE_FAILED: '@POST/CREATE_FAILED',
  POST_CREATE_DONE: '@POST/CREATE_DONE',
  POST_CREATE: '@POST/CREATE' }
```
