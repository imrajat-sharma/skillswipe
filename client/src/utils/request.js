const DEFAULT_API_URL = "http://localhost:5000/api";

const rawApiBaseUrl = import.meta.env.VITE_API_URL || DEFAULT_API_URL;

const stripTrailingSlash = (value) => String(value || "").replace(/\/+$/, "");

export const apiBaseUrl = stripTrailingSlash(rawApiBaseUrl);
export const apiOrigin = apiBaseUrl.replace(/\/api$/, "") || apiBaseUrl;
export const googleAuthUrl = `${apiBaseUrl}/auth/google`;

const isFileList = (value) => typeof FileList !== "undefined" && value instanceof FileList;
const isBlobLike = (value) => typeof Blob !== "undefined" && value instanceof Blob;

const shouldSkipValue = (value) => value === undefined || value === null || value === "";

export const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (shouldSkipValue(value)) {
      return;
    }

    if (Array.isArray(value)) {
      const nextValue = value
        .map((item) => String(item).trim())
        .filter(Boolean)
        .join(",");

      if (nextValue) {
        searchParams.set(key, nextValue);
      }
      return;
    }

    if (value instanceof Date) {
      searchParams.set(key, value.toISOString());
      return;
    }

    if (typeof value === "object") {
      searchParams.set(key, JSON.stringify(value));
      return;
    }

    searchParams.set(key, String(value));
  });

  return searchParams.toString();
};

const appendMultipartValue = (formData, key, value) => {
  if (shouldSkipValue(value)) {
    return;
  }

  if (isFileList(value)) {
    Array.from(value).forEach((file) => {
      if (file) {
        formData.append(key, file);
      }
    });
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => appendMultipartValue(formData, key, item));
    return;
  }

  if (value instanceof Date) {
    formData.append(key, value.toISOString());
    return;
  }

  if (isBlobLike(value)) {
    formData.append(key, value);
    return;
  }

  if (typeof value === "object") {
    formData.append(key, JSON.stringify(value));
    return;
  }

  formData.append(key, String(value));
};

export const toFormData = (payload = {}) => {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    appendMultipartValue(formData, key, value);
  });

  return formData;
};

export const getApiErrorMessage = (error, fallback = "Request failed.") =>
  error?.response?.data?.message || error?.message || fallback;

export const normalizePagination = (pagination = {}) => ({
  page: 1,
  limit: 0,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
  ...pagination,
});

export const unwrapPagedResponse = (data, collectionKey) => ({
  items: Array.isArray(data?.[collectionKey]) ? data[collectionKey] : [],
  pagination: normalizePagination(data?.pagination),
  message: data?.message || "",
  raw: data || null,
});

export const normalizeSingleFile = (value) => {
  if (isFileList(value)) {
    return value[0] || null;
  }

  if (Array.isArray(value)) {
    return value[0] || null;
  }

  return value || null;
};

