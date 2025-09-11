import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";
import { normalizeScalars } from "../utils/num";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // auth header (skip login)
  const token = localStorage.getItem("access_token");
  if (token && config.url !== "/auth/login") {
    // ensure AxiosHeaders & set Authorization
    if (!config.headers) {
      config.headers = new AxiosHeaders();
    }
    // use the official setter when available
    (config.headers as AxiosHeaders).set?.("Authorization", `Bearer ${token}`);
    // fallback for older typings/runtime
    if (!(config.headers as AxiosHeaders).set) {
      (config.headers as any)["Authorization"] = `Bearer ${token}`;
    }
  }

  // append lang param
  config.params = { ...(config.params || {}), lang: "fa" };

  // normalize digits in params & data (skip FormData/binary)
  if (config.params) config.params = normalizeScalars(config.params);
  if (config.data && !(config.data instanceof FormData)) {
    config.data = normalizeScalars(config.data);
  }

  return config;
});

export default api;
