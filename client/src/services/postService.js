import { api } from "./http";
import {
  buildQueryString,
  getApiErrorMessage,
  normalizeSingleFile,
  toFormData,
} from "../utils/request";

const wrapPostError = (error, fallback) => {
  throw new Error(getApiErrorMessage(error, fallback));
};

const buildUrl = (path, params) => {
  const query = buildQueryString(params);
  return query ? `${path}?${query}` : path;
};

const appendFiles = (formData, key, value) => {
  const files = Array.isArray(value) ? value : [value];
  files
    .flatMap((item) => {
      const file = normalizeSingleFile(item);
      return file ? [file] : [];
    })
    .forEach((file) => formData.append(key, file));
};

export const getFeedPosts = async (params = {}) => {
  try {
    const response = await api.get(buildUrl("/posts", params));
    return response.data;
  } catch (error) {
    wrapPostError(error, "Unable to load feed posts.");
  }
};

export const createPost = async (payload = {}) => {
  try {
    const { images, ...rest } = payload;
    const formData = toFormData(rest);

    if (images !== undefined) {
      appendFiles(formData, "images", images);
    }

    const response = await api.post("/posts", formData);
    return response.data.post;
  } catch (error) {
    wrapPostError(error, "Unable to create post.");
  }
};

export const getPostComments = async (postId, params = {}) => {
  try {
    const response = await api.get(buildUrl(`/posts/${postId}/comments`, params));
    return response.data;
  } catch (error) {
    wrapPostError(error, "Unable to load comments.");
  }
};

export const likePost = async (postId) => {
  try {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
  } catch (error) {
    wrapPostError(error, "Unable to like post.");
  }
};

export const unlikePost = async (postId) => {
  try {
    const response = await api.delete(`/posts/${postId}/like`);
    return response.data;
  } catch (error) {
    wrapPostError(error, "Unable to unlike post.");
  }
};

export const commentOnPost = async (postId, content) => {
  try {
    const response = await api.post(`/posts/${postId}/comments`, { content });
    return response.data;
  } catch (error) {
    wrapPostError(error, "Unable to add comment.");
  }
};

export const sharePost = async (postId) => {
  try {
    const response = await api.post(`/posts/${postId}/share`);
    return response.data;
  } catch (error) {
    wrapPostError(error, "Unable to share post.");
  }
};

export const deletePost = async (postId) => {
  try {
    const response = await api.delete(`/posts/${postId}`);
    return response.data;
  } catch (error) {
    wrapPostError(error, "Unable to delete post.");
  }
};

export const postService = {
  getFeedPosts,
  createPost,
  getPostComments,
  likePost,
  unlikePost,
  commentOnPost,
  sharePost,
  deletePost,
};
