import { createStore, applyMiddleware } from 'redux';
import { constants, actions, reducers } from '../../lib';

describe('Integration', () => {
  it('works with redux', () => {
    expect.assertions(3);
    const Constants = constants([
      {
        invocation: 'async',
        namespace: 'comment',
        verbs: ['post'],
      },
      {
        namespace: 'comment',
        verbs: ['view'],
      },
    ]);

    const reducer = reducers([
      {
        type: Constants.COMMENT_POST.REQUESTED,
        path: 'comments.loading',
        fn: () => true,
      },
      {
        type: Constants.COMMENT_POST.SUCCEEDED,
        path: 'comments.data',
        fn: (state = [], post) => [...state, ...post],
      },
      {
        type: Constants.COMMENT_POST.DONE,
        path: 'comments.loading',
        fn: () => false,
      },
    ]);

    const actionCreator = actions({
      postComment: {
        invocation: 'async',
        type: Constants.COMMENT_POST.DEFAULT,
        fn: async (msg) => {
          return [
            {
              id: '111-111-111-111',
            },
          ];
        },
      },
    });

    const logger = ({ getState }) => (next) => (action) => {
      const returnVal = next(action);

      expect([getState(), action]).toMatchSnapshot();
      return returnVal;
    };

    const store = createStore(reducer, {}, applyMiddleware(logger));

    const actions = actionCreator(store.dispatch);

    actions.postComment('hello world');
  });
});
