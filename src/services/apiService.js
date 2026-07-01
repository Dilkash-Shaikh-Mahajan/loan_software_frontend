import axios from "axios";
import Cookies from "js-cookie";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://loan-software-backend.onrender.com";

const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor to attach auth token
api.interceptors.request.use((config) => {
  const token = Cookies.get("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor to uniformly unpack error messages and handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("auth_token");
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }

    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  },
);

export const fetchAgents = async () => {
  const { data } = await api.get("/api/users");
  return data.success && data.data ? data.data : [];
};

export const fetchCustomers = async ({ page = 1, limit = 10, search = "" }) => {
  const { data } = await api.get("/api/customers", {
    params: {
      page,
      limit,
      ...(search && { search }),
    },
  });
  return data;
};

export const fetchFeedbacks = async (params = {}) => {
  const { data } = await api.get("/api/feedbacks", { params });
  return data.success && data.data ? data.data : [];
};

export const uploadCustomers = async (payload) => {
  const formData = new FormData();
  formData.append("agentId", payload.agentId);

  const fileToUpload =
    payload.excelFile instanceof File
      ? payload.excelFile
      : payload.excelFile[0];
  formData.append("excelFile", fileToUpload);

  const { data } = await api.post("/api/customers/upload", formData);
  return data;
};

export const getNotifications = async (userId) => {
  const { data } = await api.get("/api/notifications", { params: { userId } });
  return data.success && data.data ? data.data : [];
};

export const getUnreadNotificationCount = async (userId) => {
  const { data } = await api.get("/api/notifications/unread-count", {
    params: { userId },
  });
  return data.success ? data.data.count : 0;
};

export const markAllNotificationsRead = async (userId) => {
  const { data } = await api.put("/api/notifications/mark-all-read", {
    userId,
  });
  return data;
};

export const markNotificationAsRead = async (id) => {
  const { data } = await api.put(`/api/notifications/${id}/read`);
  return data;
};

export const login = async (credentials) => {
  const { data } = await api.post("/api/auth/login", credentials);
  return data;
};
