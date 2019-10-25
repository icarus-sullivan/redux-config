const { createAsyncEnum } = require('../../lib');

const constants = createAsyncEnum('COMMENT');

console.log(constants);
