import React from 'react';
import ReactDOM from 'react-dom';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from './authConfig';
import ProtectedApp from './components/ProtectedApp';
import './index.css';

const msalInstance = new PublicClientApplication(msalConfig);

ReactDOM.render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <ProtectedApp />
    </MsalProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
