import { api } from "./http";
import { getApiErrorMessage, normalizeSingleFile, toFormData } from "../utils/request";

const wrapProfileError = (error, fallback) => {
  throw new Error(getApiErrorMessage(error, fallback));
};

export const getProfile = async () => {
  try {
    const response = await api.get("/profile");
    return response.data.user;
  } catch (error) {
    wrapProfileError(error, "Unable to load profile.");
  }
};

export const updateProfile = async (payload = {}) => {
  try {
    const { photo, ...rest } = payload;
    const formData = toFormData(rest);
    const file = normalizeSingleFile(photo);

    if (file) {
      formData.append("photo", file);
    }

    const response = await api.put("/profile", formData);
    return response.data.user;
  } catch (error) {
    wrapProfileError(error, "Unable to update profile.");
  }
};

export const profileService = {
  getProfile,
  updateProfile,
};

