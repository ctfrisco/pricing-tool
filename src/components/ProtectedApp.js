
import React from 'react';
import { useIsAuthenticated } from '@azure/msal-react';
import App from '../App';
import Login from './Login';

const ProtectedApp = () => {
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-blue-900 mb-6 text-center">MSP Pricing Calculator</h1>
          <p className="text-gray-600 mb-6 text-center">Please sign in to access the calculator.</p>
          <div className="flex justify-center">
            <Login />
          </div>
        </div>
      </div>
    );
  }

  return <App />;
};

export default ProtectedApp;