import React from 'react';
import ReactDOM from 'react-dom';

import axios from './lib/axios';
import './style.css';

import { App } from './components';

// Set up axios
axios();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);
