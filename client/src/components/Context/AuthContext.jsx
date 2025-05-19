import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    // If there's a token in localStorage, fetch user data on app load
    const fetchUser = async () => {
      if (token) {
        try {
          const response = await fetch('http://localhost:8000/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            // Token might be invalid, clear it
            setToken(null);
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Error fetching user on init:', error);
          setToken(null);
          localStorage.removeItem('token');
        }
      }
    };

    fetchUser();
  }, [token]);

  const login = (userData, accessToken) => {
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem('token', accessToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const isLoggedIn = !!user && !!token;

  const value = {
    user,
    token,
    login,
    logout,
    isLoggedIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};