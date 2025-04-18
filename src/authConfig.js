// src/authConfig.js

export const msalConfig = {
    auth: {
      clientId: "2c5c0cc5-68db-40b0-8ad2-d7970e042921", // Replace with your Application (client) ID
      authority: "https://login.microsoftonline.com/9af19650-d8b6-437a-903b-7e42b1c7757b/v2.0", // Tenant-specific authority URL
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
  