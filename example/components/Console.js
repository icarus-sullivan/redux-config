import React from 'react';

const Console = () => (
  <pre
    id="console"
    style={{
      background: '#333',
      color: '#fff',
      positon: 'fixed',
      bottom: 0,
      width: '100%',
      maxHeight: 400,
      overflowY: 'auto',
    }}
  />
);

export default Console;
