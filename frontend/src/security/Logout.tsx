import { useEffect, useState } from "react";

const [authToken, setAuthToken] = useState<string | null>(null);

// On component mount, check if there's a token in local storage
useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    setAuthToken(token);
  }
}, []);

// Handle logout
export const handleLogout = () => {
  localStorage.removeItem("token"); // Remove token from local storage
  setAuthToken(null); // Reset authToken state
};
