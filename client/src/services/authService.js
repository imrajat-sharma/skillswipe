import { api, googleAuthUrl } from "./http";
import { getApiErrorMessage } from "../utils/request";

const wrapAuthError = (error, fallback) => {
  throw new Error(getApiErrorMessage(error, fallback));
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get("/auth/me");
    return response.data.user;
  } catch (error) {
    if (error?.response?.status === 401) {
      return null;
    }

    wrapAuthError(error, "Unable to load the current user.");
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);
    return response.data.user;
  } catch (error) {
    wrapAuthError(error, "Unable to sign in.");
  }
};

export const register = async (payload) => {
  try {
    const response = await api.post("/auth/register", payload);
    return response.data.user;
  } catch (error) {
    wrapAuthError(error, "Unable to create account.");
  }
};

export const logout = async () => {
  try {
    const response = await api.post("/auth/logout");
    return response.data;
  } catch (error) {
    wrapAuthError(error, "Unable to sign out.");
  }
};

export const getGoogleAuthUrl = () => googleAuthUrl;

export const authService = {
  getCurrentUser,
  login,
  register,
  logout,
  getGoogleAuthUrl,
};

