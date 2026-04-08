import { api } from "./http";
import { buildQueryString, getApiErrorMessage } from "../utils/request";

const wrapMatchError = (error, fallback) => {
  throw new Error(getApiErrorMessage(error, fallback));
};

const buildUrl = (path, params) => {
  const query = buildQueryString(params);
  return query ? `${path}?${query}` : path;
};

export const getMatches = async (params = {}) => {
  try {
    const response = await api.get(buildUrl("/matches", params));
    return response.data;
  } catch (error) {
    wrapMatchError(error, "Unable to load matches.");
  }
};

export const getChatMatches = async (params = {}) => {
  try {
    const response = await api.get(buildUrl("/matches/chat", params));
    return response.data;
  } catch (error) {
    wrapMatchError(error, "Unable to load chat matches.");
  }
};

export const getMatch = async (matchId) => {
  try {
    const response = await api.get(`/matches/${matchId}`);
    return response.data.match;
  } catch (error) {
    wrapMatchError(error, "Unable to load match thread.");
  }
};

export const sendMatchMessage = async (matchId, content) => {
  try {
    const response = await api.post(`/matches/${matchId}/messages`, { content });
    return response.data.match;
  } catch (error) {
    wrapMatchError(error, "Unable to send message.");
  }
};

export const matchService = {
  getMatches,
  getChatMatches,
  getMatch,
  sendMatchMessage,
};

