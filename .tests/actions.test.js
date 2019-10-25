import { createActions } from '../src';

const MOCK_TYPE = 'TEST';

export const test = (config, expectations, ...args) => async () => {
  const dispatch = jest.fn();
  const created = createActions({ action: config })(dispatch);

  await created.action(...args);

  expectations.forEach((expected, i) => {
    expect(dispatch.mock.calls[i][0]).toEqual(expected);
  });
};

export const run = (configuration) =>
  configuration.forEach(({ description, tests }) => {
    describe(description, () => {
      tests.forEach(({ name, params }) => {
        it(name, test(...params));
      });
    });
  });

run([
  {
    description: 'Static Actions',
    tests: [
      {
        name: 'action is curried automatically',
        params: [
          {
            type: MOCK_TYPE,
            payload: {
              test: 'data',
            },
          },
          [
            {
              payload: { test: 'data' },
              type: 'TEST',
            },
          ],
        ],
      },
      {
        name: 'no params',
        params: [
          {
            type: MOCK_TYPE,
          },
          [{ type: MOCK_TYPE, payload: [] }],
        ],
      },
      {
        name: 'single param',
        params: [
          {
            type: MOCK_TYPE,
          },
          [{ type: MOCK_TYPE, payload: 'argument' }],
          'argument',
        ],
      },
      {
        name: 'multiple params',
        params: [
          {
            type: MOCK_TYPE,
          },
          [{ type: MOCK_TYPE, payload: [1, 2, 3] }],
          1,
          2,
          3,
        ],
      },
    ],
  },
  {
    description: 'Synchronous Actions',
    tests: [
      {
        name: 'param mutation',
        params: [
          (id) => ({
            type: MOCK_TYPE,
            payload: {
              id: `test-${id}`,
            },
          }),
          [
            {
              payload: { id: 'test-mock-uuid' },
              type: 'TEST',
            },
          ],
          'mock-uuid',
        ],
      },
    ],
  },
  {
    description: 'Asynchronous Actions',
    tests: [
      {
        name: 'success',
        params: [
          {
            invoccationType: 'async',
            type: MOCK_TYPE,
            fn: async (arg) => ({
              success: true,
              arg,
            }),
          },
          [
            { type: `${MOCK_TYPE}_REQUESTED`, payload: 'given argument' },
            {
              type: `${MOCK_TYPE}_SUCCEEDED`,
              payload: { arg: 'given argument', success: true },
            },
            {
              type: `${MOCK_TYPE}_DONE`,
            },
          ],
          'given argument',
        ],
      },
      {
        name: 'normal error',
        params: [
          {
            invoccationType: 'async',
            type: MOCK_TYPE,
            fn: async () => {
              throw new Error('failed');
            },
          },
          [
            { type: `${MOCK_TYPE}_REQUESTED`, payload: 'some args' },
            {
              type: `${MOCK_TYPE}_FAILED`,
              payload: new Error('failed'),
            },
            {
              type: `${MOCK_TYPE}_DONE`,
            },
          ],
          'some args',
        ],
      },
      {
        name: 'error override',
        params: [
          {
            invoccationType: 'async',
            type: MOCK_TYPE,
            errorTransform: (err) => ({
              error: err.message,
              success: false,
            }),
            fn: async () => {
              throw new Error('nope');
            },
          },
          [
            { type: `${MOCK_TYPE}_REQUESTED`, payload: [] },
            {
              type: `${MOCK_TYPE}_FAILED`,
              payload: {
                error: 'nope',
                success: false,
              },
            },
            {
              type: `${MOCK_TYPE}_DONE`,
            },
          ],
        ],
      },
    ],
  },
]);
