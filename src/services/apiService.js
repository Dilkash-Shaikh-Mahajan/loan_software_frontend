import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
// const API_URL =
//   process.env.NEXT_PUBLIC_API_URL ||
//   "https://loan-software-backend.onrender.com";

const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor to attach auth token
api.interceptors.request.use((config) => {
  let token = null;
  if (typeof window !== "undefined") {
    token = sessionStorage.getItem("auth_token");
  }
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
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("auth_token");
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

export const updateUserStatus = async (id, status) => {
  const { data } = await api.put(`/api/users/${id}/status`, { status });
  return data;
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

export const reopenCustomerFeedback = async (id) => {
  const { data } = await api.put(`/api/customers/${id}/reopen`);
  return data;
};

export const updateCustomer = async (id, payload) => {
  const { data } = await api.put(`/api/customers/${id}`, payload);
  return data;
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

// Analytics API Endpoints
export const fetchVisitOutcomesAnalytics = async (params = {}) => {
  const { data } = await api.get("/api/analytics/visit-outcomes", { params });
  return data.success && data.data ? data.data : [];
};

export const fetchAgentFeedbackAnalytics = async (params) => {
  const response = await api.get("/api/analytics/agent-feedbacks", { params });
  return response.data.data; // array of agent feedback counts
};

export const fetchAgentFeedbackStacked = async (params) => {
  const response = await api.get("/api/analytics/agent-feedback-stacked", {
    params,
  });
  return response.data.data; // array of stacked agent feedback
};

export const fetchDashboardStats = async () => {
  const response = await api.get("/api/analytics/dashboard-stats");
  return response.data.data; // { activeCases, resolvedCases }
};
