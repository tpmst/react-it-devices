import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthenticationContext"; // Import the useAuth hook to access authentication functions
import { useNavigate } from "react-router-dom"; // Import useNavigate to programmatically navigate between routes
import { API_BASE_URL } from "./config"; // Import the base URL for API requests

// Define the Login component using React Functional Component (FC)
const Login: React.FC = () => {
  // State variables to hold the form inputs and potential error messages
  const [username, setUsername] = useState(""); // State to hold the username input
  const [password, setPassword] = useState(""); // State to hold the password input
  const [error, setError] = useState(""); // State to hold any error messages

  const { login } = useAuth(); // Extract the login function from the AuthContext
  const navigate = useNavigate(); // Initialize useNavigate to redirect users after login

  // Function to handle the login form submission
  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent the default form submission behavior

    try {
      // Send a POST request to the login endpoint with the username and password
      const response = await axios.post(`${API_BASE_URL}/login`, {
        username,
        password,
      });

      const { token } = response.data; // Extract the token from the response

      // Call the login function from the context to store the token
      login(token);

      // Navigate to the home page after successful login
      navigate("/home");
    } catch (error) {
      // If the login fails, set an error message to be displayed
      setError("Invalid username or password");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow-md">
      {/* Login Form Title */}
      <h2 className="text-2xl font-bold mb-4">Login</h2>

      {/* Form Element that handles submission */}
      <form onSubmit={handleLogin}>
        {/* Username Input Field */}
        <div className="mb-4">
          <label className="block mb-2">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Update the username state on input change
            className="w-full p-2 border border-gray-300 rounded"
            required // Ensure this field is required
          />
        </div>

        {/* Password Input Field */}
        <div className="mb-4">
          <label className="block mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update the password state on input change
            className="w-full p-2 border border-gray-300 rounded"
            required // Ensure this field is required
          />
        </div>

        {/* Display Error Message if login fails */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Submit Button for the Form */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
