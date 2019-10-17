import { createActions } from '@sullivan/redux-config';
import * as Constants from './constants';

export default createActions({
  createPost: {
    type: Constants.POST_CREATE,
    invoccationType: 'async',
    fn: async () =>
      new Promise((resolve) => {
        setTimeout(
          () => resolve({ id: 'postId', text: 'How is it going?' }),
          1200,
        );
      }),
  },
  clearFilter: {
    type: Constants.FILTER_CLEAR,
  },
});
