import axios, { type InternalAxiosRequestConfig } from "axios";

export const api = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const raw = localStorage.getItem("auth_user");

    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      } catch (e) {}
    }

    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.request.use((config) => {
  const raw = localStorage.getItem("auth_user");

  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`;
      }
    } catch (e) {}
  }

  return config;
});
