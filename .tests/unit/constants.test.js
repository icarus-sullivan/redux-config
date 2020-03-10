import { constants, asEnum } from '../../lib/constants';
import harness from './harness';

const runner = (config, expectation) => () =>
  expect(constants(config)).toEqual(expectation);

it('missing async value throws', () => expect(asEnum).toThrow(Error));

harness(runner, [
  {
    description: 'Synchronous Constants',
    tests: [
      {
        name: 'empty when missing verbs',
        params: [
          {
            namespace: 'test',
          },
          {},
        ],
      },
      {
        name: 'normal config',
        params: [
          {
            namespace: 'test',
            verbs: ['navigated'],
          },
          {
            TEST_NAVIGATED: '@TEST/NAVIGATED',
          },
        ],
      },
      {
        name: 'multiple config',
        params: [
          [
            {
              namespace: 'post',
              verbs: ['view'],
            },
            {
              namespace: 'comment',
              verbs: ['view'],
            },
          ],
          {
            COMMENT_VIEW: '@COMMENT/VIEW',
            POST_VIEW: '@POST/VIEW',
          },
        ],
      },
    ],
  },
  {
    description: 'Asynchronous Constants',
    tests: [
      {
        name: 'creates enums',
        params: [
          {
            invocation: 'async',
            namespace: 'accounts',
            verbs: ['list', 'update'],
          },
          {
            ACCOUNTS_LIST: asEnum('@ACCOUNTS/LIST'),
            ACCOUNTS_UPDATE: asEnum('@ACCOUNTS/UPDATE'),
          },
        ],
      },
    ],
  },
]);
