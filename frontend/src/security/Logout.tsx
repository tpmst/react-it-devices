import { useEffect, useState } from "react";

// Define a state variable to hold the authentication token
const [authToken, setAuthToken] = useState<string | null>(null);

// useEffect is a React hook that runs side effects in function components.
// This effect runs once when the component is mounted.
useEffect(() => {
  // Retrieve the token from local storage
  const token = localStorage.getItem("token");

  // If a token exists in local storage, update the authToken state with it
  if (token) {
    setAuthToken(token);
  }
}, []); // The empty dependency array means this effect runs only on mount

// Function to handle logout
export const handleLogout = () => {
  // Remove the token from local storage
  localStorage.removeItem("token");

  // Reset the authToken state to null, effectively logging the user out
  setAuthToken(null);
};
