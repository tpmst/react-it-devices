import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

// Define the shape of the context state
interface AuthContextType {
  authToken: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

// Create the AuthenticationContext with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Create the provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Check local storage for an existing token on initial load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
    }
  }, []);

  // Function to log in (store the token)
  const login = (token: string) => {
    localStorage.setItem("token", token);
    setAuthToken(token);
  };

  // Function to log out (remove the token)
  const logout = () => {
    localStorage.removeItem("token");
    setAuthToken(null);
  };

  // Determine if the user is authenticated
  const isAuthenticated = !!authToken;

  // Provide the authentication state and functions to the children
  return (
    <AuthContext.Provider value={{ authToken, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
