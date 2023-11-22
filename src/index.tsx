import React from 'react';
import ReactDOM from 'react-dom/client';
import { Buffer as ImportedBuffer } from 'buffer';

if (typeof window !== 'undefined') window.Buffer = window.Buffer ?? ImportedBuffer;

// components
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
