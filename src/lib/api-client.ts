const API_URL = import.meta.env.VITE_BACKEND || "";

export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("auth");
    localStorage.removeItem("user_email");
    window.dispatchEvent(new Event("unauthorized_api_call"));
    throw new Error("Unauthorized");
  }

  return response;
};
