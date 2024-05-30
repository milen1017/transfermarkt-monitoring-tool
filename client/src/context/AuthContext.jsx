import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Attempted named import
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedToken = localStorage.getItem('authToken');
        console.log('Stored Token:', storedToken); // Debugging log
        if (storedToken) {
          const decodedToken = jwtDecode(storedToken); // Attempted usage
          const currentTime = Date.now() / 1000;
          console.log('Decoded Token:', decodedToken); // Debugging log

          if (decodedToken.exp > currentTime) {
            setIsAuthenticated(true);
            setUser(decodedToken); // Assuming the decoded token has user info
          } else {
            localStorage.removeItem('authToken');
            console.log('Token has expired. Removing token from localStorage.'); // Debugging log
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        localStorage.removeItem('authToken');
      }
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}api/auth/login`, { username, password }, { withCredentials: true });
      if (response.data) {
        const token = response.data.token;
        setIsAuthenticated(true);
        setUser(jwtDecode(token)); // Decode the token to get user info
        localStorage.setItem('authToken', token);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}api/auth/logout`, {}, { withCredentials: true });
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('authToken');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
