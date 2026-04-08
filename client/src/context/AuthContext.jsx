/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { api, apiBaseUrl, googleAuthUrl } from "../services";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  const fetchCurrentUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      setAuthError('');
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCurrentUser(); }, []);

  const login = async (payload) => {
    try {
      const currentUser = await authService.login(payload);
      setUser(currentUser);
      setAuthError('');
      return currentUser;
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const register = async (payload) => {
    try {
      const currentUser = await authService.register(payload);
      setUser(currentUser);
      setAuthError('');
      return currentUser;
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    setLoading(true);
    await fetchCurrentUser();
  };

  const value = {
    api,
    user,
    loading,
    authError,
    setUser,
    login,
    register,
    logout,
    refreshUser,
    setAuthError,
    googleAuthUrl: googleAuthUrl || `${apiBaseUrl}/auth/google`,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
