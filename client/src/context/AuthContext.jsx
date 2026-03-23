import { createContext, useContext, useEffect, useMemo, useState } from 'react';
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

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCurrentUser(); }, []);

  const login = async (payload) => {
    const response = await api.post('/auth/login', payload);
    setUser(response.data.user);
    return response.data.user;
  };

  const register = async (payload) => {
    const response = await api.post('/auth/register', payload);
    setUser(response.data.user);
    return response.data.user;
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
  };

  const refreshUser = async () => {
    setLoading(true);
    await fetchCurrentUser();
  };

  const value = useMemo(() => ({
    api,
    user,
    loading,
    setUser,
    login,
    register,
    logout,
    refreshUser,
    googleAuthUrl: `${apiBaseUrl}/auth/google`,
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
