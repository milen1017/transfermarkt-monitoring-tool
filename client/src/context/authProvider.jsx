import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a Context for the Auth State
const AuthContext = createContext();

// Provide AuthContext to the rest of the app
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check localStorage for token on initial load
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setIsAuthenticated(true);
      setToken(storedToken);
    }
  }, []);

  // Function to handle login
  const login = (token) => {
    setIsAuthenticated(true);
    setToken(token);
    localStorage.setItem('authToken', token); // Store token in localStorage
  };

  // Function to handle logout
  const logout = () => {
    setIsAuthenticated(false);
    setToken(null);
    localStorage.removeItem('authToken'); // Remove token from localStorage
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
