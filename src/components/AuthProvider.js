
import React from 'react';
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from '../authConfig';

// Initialize MSAL
const msalInstance = new PublicClientApplication(msalConfig);

// MsalProvider wraps your app and provides authentication context
const AuthProvider = ({ children }) => {
  return (
    <MsalProvider instance={msalInstance}>
      {children}
    </MsalProvider>
  );
};

export default AuthProvider;
