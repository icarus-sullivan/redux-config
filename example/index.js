import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import store from './redux/store';

import Console from './components/Console';
import Actions from './components/Actions';

render(
  <Provider store={store}>
    <div style={{ width: '100%', height: '100%' }}>
      <Actions />
      <Console />
    </div>
  </Provider>,
  document.body,
);
