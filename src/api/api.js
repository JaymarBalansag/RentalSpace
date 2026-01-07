import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:8000/api",
  baseURL: import.meta.env.VITE_API_AUTH_URL ? import.meta.env.VITE_API_AUTH_URL : "http://localhost:8000/api",
  withCredentials: true, // include cookies (refresh_token)
});

// Request interceptor → attach token before each request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor → auto refresh token on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ⛔ Prevent infinite loop: don't retry refresh if the failing request IS refresh
    if (originalRequest.url.includes("/refresh")) {
      return Promise.reject(error);
    }

    const hasAuthHeader = originalRequest.headers?.Authorization?.startsWith("Bearer ");

    if (error.response?.status === 401 && hasAuthHeader && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await api.post("/refresh");
        const newToken = res.data.access_token;

        localStorage.setItem("access_token", newToken);
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

        return api.request(originalRequest); // retry original request
      } catch (err) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("userInfo");
        window.location.href = "/login"; // logout
      }
    }

    return Promise.reject(error);
  }
);

export default api;
