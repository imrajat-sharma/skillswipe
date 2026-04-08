import { api } from "./http";
import { buildQueryString, getApiErrorMessage } from "../utils/request";

const wrapSwipeError = (error, fallback) => {
  throw new Error(getApiErrorMessage(error, fallback));
};

const buildUrl = (path, params) => {
  const query = buildQueryString(params);
  return query ? `${path}?${query}` : path;
};

export const getDiscoverQueue = async (params = {}) => {
  try {
    const response = await api.get(buildUrl("/swipe/discover", params));
    return response.data;
  } catch (error) {
    wrapSwipeError(error, "Unable to load discover profiles.");
  }
};

export const getNextProfiles = async (params = {}) => {
  try {
    const response = await api.get(buildUrl("/swipe/next", params));
    return response.data;
  } catch (error) {
    wrapSwipeError(error, "Unable to load the next discover profiles.");
  }
};

export const getSwipeFilters = async () => {
  try {
    const response = await api.get("/swipe/filters");
    return response.data.filters;
  } catch (error) {
    wrapSwipeError(error, "Unable to load swipe filters.");
  }
};

export const sendSwipeAction = async ({ targetId, direction }) => {
  try {
    const response = await api.post("/swipe/action", { targetId, direction });
    return response.data;
  } catch (error) {
    wrapSwipeError(error, "Unable to process swipe action.");
  }
};

export const swipeService = {
  getDiscoverQueue,
  getNextProfiles,
  getSwipeFilters,
  sendSwipeAction,
};

