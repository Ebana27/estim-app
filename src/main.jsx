/* src\main.jsx */
import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/quicksand/400.css';
import '@fontsource/quicksand/600.css';
import '@fontsource/quicksand/700.css';
import App from './App';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container not found');
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
