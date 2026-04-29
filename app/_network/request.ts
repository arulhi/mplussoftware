// utils/request.ts
import { useAuthStore } from "@/store/authStore";
import axios, { AxiosResponse } from "axios";
import Cookies from "js-cookie";

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  maxRedirects: 5,
});

// Add interceptor for automatic token injection

client.interceptors.request.use(
  async (config) => {
    const res = await fetch("/api/auth/auth-check", { credentials: "include" });
    const data = await res.json();
    
    if (data.token) {
      config.headers.Authorization = `Bearer ${data.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const request = async (options: any) => {
  const onSuccess = (response: AxiosResponse) => response.data;

  const onError = async (error: any) => {
    if (error.response?.status === 401) {
      Cookies.remove("auth-token");
      await fetch("/api/auth/logout");
      useAuthStore.getState().setAuthenticated(false);
      return Promise.reject("Unauthorized: Token expired or invalid");
    }
    return Promise.reject(error.response?.data?.message || "An error occurred");
  };

  return client(options).then(onSuccess).catch(onError);
};

export default request;
