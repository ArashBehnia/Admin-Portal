/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "",
});

// All requests go through our Next.js API routes which handle cookies
api.interceptors.request.use((config) => {
    // The Next.js API routes handle token injection via httponly cookies
    // No need to manually add Authorization header here
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes("/api/auth/")
        ) {
            originalRequest._retry = true;

            try {
                // Try to refresh via our API route
                const refreshRes = await axios.post("/api/auth/refresh");

                if (refreshRes.status === 200) {
                    return api(originalRequest);
                }
            } catch {
                // Refresh failed, redirect to login
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    },
);

export default api;
