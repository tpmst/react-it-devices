import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

// Define the shape of the context state using TypeScript's interface
interface AuthContextType {
  authToken: string | null; // The authentication token, which can be null or a string
  login: (token: string) => void; // A function to log in the user by setting the auth token
  logout: () => void; // A function to log out the user by clearing the auth token
  isAuthenticated: boolean; // A boolean indicating whether the user is authenticated
}

// Create the AuthenticationContext with default values as undefined
// This context will be used to share authentication state across the application
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a custom hook to easily access the AuthContext
// This hook will be used in components to access authentication functions and state
export const useAuth = () => {
  const context = useContext(AuthContext); // Access the context
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
    // Throw an error if the hook is used outside of an AuthProvider
  }
  return context; // Return the context if it exists
};

// Create the provider component to manage the authentication state
// This component will wrap the entire application or specific parts to provide auth context
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // State to hold the authentication token, initially null
  const [authToken, setAuthToken] = useState<string | null>(null);

  // useEffect hook runs on component mount
  // Checks local storage for an existing token on initial load
  useEffect(() => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    if (token) {
      setAuthToken(token); // If a token exists, set it in the state
    }
  }, []); // Empty dependency array means this runs only once on mount

  // Function to log in the user
  // Stores the token in both state and localStorage
  const login = (token: string) => {
    localStorage.setItem("token", token); // Save the token to localStorage
    setAuthToken(token); // Update the state with the new token
  };

  // Function to log out the user
  // Clears the token from both state and localStorage
  const logout = () => {
    localStorage.removeItem("token"); // Remove the token from localStorage
    setAuthToken(null); // Clear the token from the state
  };

  // Determine if the user is authenticated
  // This is true if the authToken is not null
  const isAuthenticated = !!authToken; // Convert the authToken to a boolean

  // Provide the authentication state and functions to the children
  return (
    <AuthContext.Provider value={{ authToken, login, logout, isAuthenticated }}>
      {children}
      {/* Render the children components that are wrapped by this provider */}
    </AuthContext.Provider>
  );
};
