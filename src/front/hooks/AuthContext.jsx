import React, { createContext, useContext, useState, useEffect } from "react";

// 1. Create the context
const AuthContext = createContext();

// 2. Create the provider component
export const AuthProvider = ({ children }) => {
  // State for authentication and user info
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null); // "customer" | "coach"
  const [membershipLevel, setMembershipLevel] = useState(null); // "basic" | "premium" | etc.

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      // Optionally, fetch user info here
      setIsAuthenticated(true);
      // Could set userType/membership from backend if needed
    }
  }, []);

  // Login function (simulate login)
  const login = ({ type, membership, token }) => {
    setIsAuthenticated(true);
    setUserType(type);
    setMembershipLevel(membership);
    if (token) localStorage.setItem("access_token", token);
  };

  // Logout function
  const logout = () => {
    setIsAuthenticated(false);
    setUserType(null);
    setMembershipLevel(null);
    localStorage.removeItem("access_token");
  };

  // Provide state and functions to children
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userType,
        membershipLevel,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 3. Custom hook for easy access
export const useAuth = () => useContext(AuthContext);
