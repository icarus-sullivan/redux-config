const { createReducer, createConstants, createActions } = require('./lib');

const reducer = createReducer([
  // post config
  {
    POST_VIEW: (state) => state,
    POST_DELETE: (state, { pid }) => ({
      ...state,
      posts: state.posts.filter(({ id }) => id !== pid),
    }),
  },

  // comment config
  {
    COMMENT_LIKED: (state) => ({
      ...state,
      liked: true,
    }),
    COMMENT_UPDATE: (state, { text }) => ({
      ...state,
      text,
    }),
    CLEAR_COMMENT: (state) => ({}),
  },
]);

console.log(
  'POST_VIEW',
  reducer({}, { type: 'POST_VIEW', payload: { foo: 'bar' } }),
);
console.log('COMMENT_LIKED', reducer({}, { type: 'COMMENT_LIKED' }));
