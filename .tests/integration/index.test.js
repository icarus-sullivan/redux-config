import { createStore, applyMiddleware } from 'redux';
import { createConstants, createActions, createReducer } from '../../lib';

describe('Integration', () => {
  it('works with redux', () => {
    expect.assertions(3);
    const Constants = createConstants([
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

    const reducer = createReducer({
      namespace: 'comments',
      mapping: {
        [Constants.COMMENT_POST.REQUESTED]: (state) => ({
          loading: true,
        }),
        [Constants.COMMENT_POST.SUCCEEDED]: (state, post) => ({
          ...post,
        }),
        [Constants.COMMENT_POST.DONE]: (state) => ({
          ...state,
          loading: false,
        }),
      },
    });

    const actionCreator = createActions({
      postComment: {
        invocation: 'async',
        type: Constants.COMMENT_POST.DEFAULT,
        fn: async (msg) => {
          return {
            success: true,
            id: '111-111-111-111',
          };
        },
      },
    });

    const logger = ({ getState }) => (next) => (action) => {
      const returnVal = next(action);

      expect([ getState(), action]).toMatchSnapshot();
      return returnVal;
    };

    const store = createStore(reducer, {}, applyMiddleware(logger));

    const actions = actionCreator(store.dispatch);

    actions.postComment('hello world');
  });
});
