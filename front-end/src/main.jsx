import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { TokenProvider } from '../context/TokenContext.jsx'; // Adjust the path as necessary
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TokenProvider>
      <App />
    </TokenProvider>
  </React.StrictMode>,
);
