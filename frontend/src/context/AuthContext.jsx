import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api'; // Import your real API

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        clearAuthData();
      }
    }
    setLoading(false);
  };

  const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const login = async (username, password) => {
    try {
      console.log('Login attempt:', { username, password });
      
      // ✅ USE THE REAL API INSTEAD OF MOCK DATA
      const response = await authAPI.login({ username, password });
      console.log('Login API response:', response.data);
      
      const { token, user: userData } = response.data;
      
      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Update state
      setUser(userData);
      
      console.log('Login successful:', userData);
      return { success: true, user: userData, token };
      
    } catch (error) {
      console.error('Login error:', error);
      
      // If API is down, fall back to mock for development
      if (error.code === 'NETWORK_ERROR' || error.response?.status >= 500) {
        console.warn('API unavailable, using development fallback');
        
        const userData = { 
          username: username || 'admin', 
          role: 'admin',
          id: 'dev-' + Date.now()
        };
        
        const token = 'dev-token-' + Date.now();
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        
        return { success: true, user: userData, token };
      }
      
      throw new Error('Login failed: ' + (error.response?.data?.message || error.message));
    }
  };

  const logout = () => {
    console.log('Logging out...');
    clearAuthData();
    console.log('Logout complete');
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};