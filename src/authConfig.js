// src/authConfig.js

export const msalConfig = {
    auth: {
      clientId: "2c5c0cc5-68db-40b0-8ad2-d7970e042921", // Replace with your Application (client) ID
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
  