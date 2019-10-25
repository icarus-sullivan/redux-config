import { createActions, createAsyncEnum } from '../src';
import harness from './harness';

const MOCK_TYPE = 'TEST';
const ASYNC_TYPES = createAsyncEnum(MOCK_TYPE);

export const runner = (config, expectations, ...args) => async () => {
  const dispatch = jest.fn();
  const created = createActions({ action: config })(dispatch);

  await created.action(...args);

  expectations.forEach((expected, i) => {
    expect(dispatch.mock.calls[i][0]).toEqual(expected);
  });
};

harness(runner, [
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
            type: ASYNC_TYPES.DEFAULT,
            fn: async (arg) => ({
              success: true,
              arg,
            }),
          },
          [
            { type: ASYNC_TYPES.REQUESTED, payload: 'given argument' },
            {
              type: ASYNC_TYPES.SUCCEEDED,
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
            type: ASYNC_TYPES.DEFAULT,
            fn: async () => {
              throw new Error('failed');
            },
          },
          [
            { type: ASYNC_TYPES.REQUESTED, payload: 'some args' },
            {
              type: ASYNC_TYPES.FAILED,
              payload: new Error('failed'),
            },
            {
              type: ASYNC_TYPES.DONE,
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
            type: ASYNC_TYPES.DEFAULT,
            errorTransform: (err) => ({
              error: err.message,
              success: false,
            }),
            fn: async () => {
              throw new Error('nope');
            },
          },
          [
            { type: ASYNC_TYPES.REQUESTED, payload: [] },
            {
              type: ASYNC_TYPES.FAILED,
              payload: {
                error: 'nope',
                success: false,
              },
            },
            {
              type: ASYNC_TYPES.DONE,
            },
          ],
        ],
      },
    ],
  },
]);
