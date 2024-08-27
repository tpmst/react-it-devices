import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./security/Login"; // Ensure this path is correct
import PrivateRoute from "./security/PrivateRoute"; // Ensure this path is correct
import { AuthProvider } from "./security/AuthenticationContext"; // Ensure this path is correct
import HomePage from "./pages/Home/HomePage";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <HomePage></HomePage>
              </PrivateRoute>
            }
          />
          {/* Redirect any unknown routes to login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
