/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  const getErrorMessage = (error, fallback) =>
    error?.response?.data?.message || error?.message || fallback;

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data.user);
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
      const response = await api.post('/auth/login', payload);
      setUser(response.data.user);
      setAuthError('');
      return response.data.user;
    } catch (error) {
      const message = getErrorMessage(error, 'Unable to sign in.');
      setAuthError(message);
      throw new Error(message);
    }
  };

  const register = async (payload) => {
    try {
      const response = await api.post('/auth/register', payload);
      setUser(response.data.user);
      setAuthError('');
      return response.data.user;
    } catch (error) {
      const message = getErrorMessage(error, 'Unable to create account.');
      setAuthError(message);
      throw new Error(message);
    }
  };

  const logout = async () => {
    await api.post('/auth/logout');
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
    googleAuthUrl: `${apiBaseUrl}/auth/google`,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
