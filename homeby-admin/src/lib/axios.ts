import axios from 'axios';

// The instruction mentioned VITE-ADMIN-API-URL, but Vite uses VITE_ prefix.
// We'll use import.meta.env.VITE_ADMIN_API_URL or fallback.
const api = axios.create({
  baseURL: import.meta.env.VITE_ADMIN_API_URL || 'https://admin-api.homeby.com.au',
});

// We can't directly use React Context inside an Axios interceptor file because hooks
// must be used inside components. But we can retrieve the token from some store or pass it.
// Since the instruction says "Store access-token and refresh-token in memory (React context)"
// and "Axios interceptor: All requests must include the Authorization header", a common pattern
// is to inject the token or handle it at the component level, OR export a setter for the token.
// For the demo, we'll keep a reference here.

let currentToken: string | null = null;

export const setApiToken = (token: string | null) => {
  currentToken = token;
};

api.interceptors.request.use((config) => {
  if (currentToken) {
    config.headers.Authorization = `Bearer ${currentToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 401 Unauthorized handling (token refresh logic mock)
    if (error.response?.status === 401) {
      // Logic for refresh would go here
      // if refresh fails, redirect to /login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
