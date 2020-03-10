import { reducers } from '../../lib';
import harness from './harness';

const MOCK_TYPE = 'TEST';
const MOCK_PAYLOAD = {
  injected: true,
};

const runner = (initial, config, expectation) => () => {
  const reducer = reducers(config);
  expect(reducer(initial, { type: MOCK_TYPE, payload: MOCK_PAYLOAD })).toEqual(
    expectation,
  );
};

harness(runner, [
  {
    description: 'Reducer',
    tests: [
      {
        name: 'path',
        params: [
          null,
          {
            type: MOCK_TYPE,
            path: 'some.internal.src',
            fn: (d) => MOCK_PAYLOAD,
          },
          {
            some: {
              internal: {
                src: MOCK_PAYLOAD,
              },
            },
          },
        ],
      },
      {
        name: 'initial value',
        params: [
          {
            comments: [],
          },
          {
            type: MOCK_TYPE,
            path: 'comments',
            fn: (d) => [{ id: '1', comment: 'hello' }],
          },
          {
            comments: [{ id: '1', comment: 'hello' }],
          },
        ],
      },
      {
        name: 'missing type is ignored',
        params: [
          {},
          {
            type: 'IGNORE',
            path: 'comments',
            fn: (d) => null,
          },
          {},
        ],
      },
    ],
  },
]);
