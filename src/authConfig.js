// src/authConfig.js

export const msalConfig = {
    auth: {
      clientId: "YOUR_CLIENT_ID", // Replace with your Application (client) ID
      authority: "https://login.microsoftonline.com/common", // Use 'common' for multi-tenant apps
      redirectUri: window.location.origin, // Uses the current site URL as the redirect URI
    },
    cache: {
      cacheLocation: "sessionStorage", // or "localStorage"
      storeAuthStateInCookie: false,
    },
  };
  
  // Scopes for user access (minimal required scopes)
  export const loginRequest = {
    scopes: ["User.Read"]
  };
  