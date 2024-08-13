import React, { createContext, useState, useEffect, useContext } from "react";
import axiosInstance from "@/api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setAuthLoading(true);
        const response = await axiosInstance.get("/users/current-user");
        if (response.status === 200) {
          const user = response.data.data;
          setCurrentUser(user);
          setIsAuthenticated(true);
          // console.log(user)
        }
      } catch (error) {
        setIsAuthenticated(false);
        setCurrentUser(null);
      } finally {
        setAuthLoading(false);
      }
    };
    fetchCurrentUser();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
