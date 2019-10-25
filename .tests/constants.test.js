import { createConstants, createAsyncEnum } from '../src';
import harness from './harness';

const runner = (config, expectation) => () =>
  expect(createConstants(config)).toEqual(expectation);

describe('Async Constant Enums', () => {
  it('creates expected', () => {
    expect(createAsyncEnum('TEST')).toEqual({
      DEFAULT: 'TEST',
      DONE: 'TEST_DONE',
      FAILED: 'TEST_FAILED',
      REQUESTED: 'TEST_REQUESTED',
      SUCCEEDED: 'TEST_SUCCEEDED',
    });
  });

  it('throws with invalid param', () => {
    expect(createAsyncEnum).toThrow();
  });
});

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
            invoccationType: 'async',
            namespace: 'accounts',
            verbs: ['list', 'update'],
          },
          {
            ACCOUNTS_LIST: createAsyncEnum('@ACCOUNTS/LIST'),
            ACCOUNTS_UPDATE: createAsyncEnum('@ACCOUNTS/UPDATE'),
          },
        ],
      },
    ],
  },
]);
