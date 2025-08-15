import axios from "axios";
const Http = import.meta.env.VITE_API_URL
const api = axios.create({
    baseURL: Http,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // same token you got from login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;