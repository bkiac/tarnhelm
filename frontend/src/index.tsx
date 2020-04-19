import React from 'react';
import ReactDOM from 'react-dom';

import { App, WebSocketProvider } from './components';

ReactDOM.render(
  <React.StrictMode>
    <WebSocketProvider uri={process.env.REACT_APP_WEBSOCKET_URI || ''}>
      <App />
    </WebSocketProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
