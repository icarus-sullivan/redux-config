import { createReducer } from '../src';
import harness from './harness';

const MOCK_TYPE = 'TEST';
const MOCK_PAYLOAD = {
  injected: true,
};

const createConfig = (options) => ({
  ...options,
  mapping: {
    [MOCK_TYPE]: (state, payload) => ({
      ...state,
      ...payload,
    }),
  },
});

const runner = (config, expectation, initial) => () => {
  const reducer = createReducer(config);
  expect(reducer(initial, { type: MOCK_TYPE, payload: MOCK_PAYLOAD })).toEqual(
    expectation,
  );
};

harness(runner, [
  {
    description: 'Reduer',
    tests: [
      {
        name: 'mapping only',
        params: [createConfig(), MOCK_PAYLOAD, {}],
      },
      {
        name: 'initial value',
        params: [
          createConfig({
            initial: {
              existing: 'data',
            },
          }),
          {
            ...MOCK_PAYLOAD,
            existing: 'data',
          },
        ],
      },
      {
        name: 'namespace',
        params: [
          createConfig({
            namespace: 'profile',
          }),
          {
            profile: MOCK_PAYLOAD,
          },
          {},
        ],
      },
      {
        name: 'namespace, no initial, no existing state',
        params: [
          {
            namespace: 'profile',
            mapping: {
              MISSING: (s) => s,
            },
          },
          {
            profile: null,
          },
        ],
      },
      {
        name: 'no namespace, not initial, no existing state',
        params: [createConfig(), MOCK_PAYLOAD],
      },
      {
        name: 'namespace, with initial',
        params: [
          createConfig({
            namespace: 'profile',
            initial: {
              userId: '123',
            },
          }),
          {
            profile: {
              injected: true,
              userId: '123',
            },
          },
        ],
      },
      {
        name: 'multiple configs',
        params: [
          [
            createConfig({
              namespace: 'posts',
              initial: {
                id: -1,
              },
            }),
            createConfig({
              namespace: 'comments',
              initial: {
                id: -1,
                msg: 'Hello world',
              },
            }),
          ],
          {
            comments: {
              id: -1,
              msg: 'Hello world',
              ...MOCK_PAYLOAD,
            },
            posts: {
              id: -1,
              ...MOCK_PAYLOAD,
            },
          },
        ],
      },
    ],
  },
]);
