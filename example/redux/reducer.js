import { createReducer } from '@sullivan/redux-config';
import * as Constants from './constants';

export default createReducer([
  {
    namespace: Constants.POST_NAMESPACE,
    mapping: {
      [Constants.POST_CREATE_REQUESTED]: () => ({
        state: 'create requested',
        loading: true,
      }),
      [Constants.POST_CREATE_SUCCEEDED]: (state, post) => ({
        ...state,
        ...post,
        state: 'create successful',
      }),
      [Constants.POST_CREATE_FAILED]: (state, error) => ({
        ...state,
        error: error.message,
      }),
      [Constants.POST_CREATE_DONE]: (state) => ({
        ...state,
        state: 'create done',
        loading: false,
      }),
    },
    initial: {},
  },
  {
    namespace: Constants.FILTER_NAMESPACE,
    mapping: {
      [Constants.FILTER_CLEAR]: (state, options) => ({}),
    },
    initial: {},
  },
]);
