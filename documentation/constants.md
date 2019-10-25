[Home](https://github.com/icarus-sullivan/redux-config/blob/master/README.md)

# createAsyncEnum(string)

```javascript
const { createAsyncEnum } = require('../../lib');

const constants = createAsyncEnum('COMMENT');

console.log(constants);
```

Output:
```bash
{ DEFAULT: 'COMMENT',
  REQUESTED: 'COMMENT_REQUESTED',
  SUCCEEDED: 'COMMENT_SUCCEEDED',
  FAILED: 'COMMENT_FAILED',
  DONE: 'COMMENT_DONE' }
```

# createConstants(config | config[]) => { key: string }
Creates dynamic constants, or multiple constants depending on invoccationType.

Config:
| key| value | required | default |
|--|--|--|--|
| invoccationType | string | - | 'sync' |
| namespace | string | yes | - |
| verbs | string[] | yes | - |

### Async Declarations 
Async constants will create 5 total values per verb. These constants are used in state mangement when async operations are called. 

```javascript
import { createConstants } from '@sullivan/redux-config';

const constants = createConstants({
  invoccationType: 'async',
  namespace: 'post',
  verbs: ['create', 'update', 'delete'],
});

console.log(constants);
```

Output:
```bash
{ POST_CREATE:
   { DEFAULT: '@POST/CREATE',
     REQUESTED: '@POST/CREATE_REQUESTED',
     SUCCEEDED: '@POST/CREATE_SUCCEEDED',
     FAILED: '@POST/CREATE_FAILED',
     DONE: '@POST/CREATE_DONE' },
  POST_UPDATE:
   { DEFAULT: '@POST/UPDATE',
     REQUESTED: '@POST/UPDATE_REQUESTED',
     SUCCEEDED: '@POST/UPDATE_SUCCEEDED',
     FAILED: '@POST/UPDATE_FAILED',
     DONE: '@POST/UPDATE_DONE' },
  POST_DELETE:
   { DEFAULT: '@POST/DELETE',
     REQUESTED: '@POST/DELETE_REQUESTED',
     SUCCEEDED: '@POST/DELETE_SUCCEEDED',
     FAILED: '@POST/DELETE_FAILED',
     DONE: '@POST/DELETE_DONE' } }
```

### Sync Declarations
Sync constants only create one value, but do so in a uniform format for consistency.

```javascript
import { createConstants } from '@sullivan/redux-config';

const constants = createConstants({
  namespace: 'post',
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
    namespace: 'post',
    verbs: ['view', 'navigate'],
  },
  {
    invoccationType: 'async',
    namespace: 'post',
    verbs: ['create'],
  },
]);

console.log(constants);
```

Output:
```bash
{ POST_VIEW: '@POST/VIEW',
  POST_NAVIGATE: '@POST/NAVIGATE',
  POST_CREATE:
   { DEFAULT: '@POST/CREATE',
     REQUESTED: '@POST/CREATE_REQUESTED',
     SUCCEEDED: '@POST/CREATE_SUCCEEDED',
     FAILED: '@POST/CREATE_FAILED',
     DONE: '@POST/CREATE_DONE' } }
```
