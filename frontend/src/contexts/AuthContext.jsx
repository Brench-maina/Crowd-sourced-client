/// contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

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
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load registered users and current user from localStorage
    const savedUsers = localStorage.getItem('registeredUsers');
    const savedUser = localStorage.getItem('user');
    
    if (savedUsers) {
      setRegisteredUsers(JSON.parse(savedUsers));
    }
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    setLoading(false);
  }, []);

  // Add this function to check if email is registered
  const isEmailRegistered = (email) => {
    return registeredUsers.some(user => user.email === email);
  };

  const signup = (userData) => {
    const newUser = {
      ...userData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    
    const updatedUsers = [...registeredUsers, newUser];
    setRegisteredUsers(updatedUsers);
    setUser(newUser);
    
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const login = (email, password) => {
    // Find user in registered users
    const foundUser = registeredUsers.find(
      u => u.email === email && u.password === password
    );
    
    if (foundUser) {
      // Don't store password in user state for security
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      return { success: true, user: userWithoutPassword };
    }
    
    return { success: false, error: 'Invalid credentials or user not registered' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    registeredUsers,
    login,
    signup,
    logout,
    isEmailRegistered, // Make sure this is included
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};