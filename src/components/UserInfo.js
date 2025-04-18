// src/components/UserInfo.js

import React from 'react';
import { useMsal } from '@azure/msal-react';

const UserInfo = () => {
  const { instance, accounts } = useMsal();
  const user = accounts[0] || {};

  const handleLogout = () => {
    instance.logoutRedirect({
      postLogoutRedirectUri: window.location.origin,
    });
  };

  return (
    <div className="flex items-center">
      <span className="text-sm text-gray-200 mr-4">
        {user.name || user.username}
      </span>
      <button 
        onClick={handleLogout}
        className="text-xs bg-blue-900 hover:bg-blue-800 text-white font-medium py-1 px-2 rounded"
      >
        Sign Out
      </button>
    </div>
  );
};

export default UserInfo;