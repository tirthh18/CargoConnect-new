import { createContext, useContext, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore user on page refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  // Called after successful login
  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
  };

  const queryClient = useQueryClient();

  const logout = () => {
    queryClient.clear(); // Clear all cached queries

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };
  
  // Check if logged in
const isAuthenticated =user ? true : false;

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
  };

 return (
  <AuthContext.Provider value={value}>
    {!loading && children}
  </AuthContext.Provider>
);
};

export const useAuth = () => {
  return useContext(AuthContext);
};
