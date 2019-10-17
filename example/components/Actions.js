import React from 'react';
import { connect } from 'react-redux';

import actions from '../redux/actions';

const Actions = (props) => (
  <div style={{ display: 'flex' }}>
    {Object.entries(props).map(([key, value]) => {
      return (
        <button key={key} onClick={() => value()} style={{ marginRight: 16 }}>
          {key}
        </button>
      );
    })}
  </div>
);

export default connect(
  undefined,
  actions,
)(Actions);
