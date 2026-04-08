import axios from "axios";
import { apiBaseUrl, googleAuthUrl } from "../utils/request";

export const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

export { apiBaseUrl, googleAuthUrl };

export default api;

