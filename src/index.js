
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ProtectedApp from './components/ProtectedApp';
import AuthProvider from './components/AuthProvider';

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <ProtectedApp />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
