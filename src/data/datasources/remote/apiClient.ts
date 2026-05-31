import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ENV } from '../../../core/constants/env';
import { endpoints } from '../../../core/constants/endpoint';

export const apiClient = axios.create({
    baseURL: ENV.BASE_URL,
    timeout: ENV.API_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
        ...(ENV.EMULATOR === true && { "ngrok-skip-browser-warning": "true" }),
    },
});

// Attach access token to every request
apiClient.interceptors.request.use(
    config => {
        // Lazy import to avoid circular dependency (store → repo → apiClient)
        const { useAuthStore } = require('../../../core/store/authStore');
        const token = useAuthStore.getState().token;
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('[API]', config.method?.toUpperCase(), config.url, 'body:', JSON.stringify(config.data));
        return config;
    },
    error => Promise.reject(error),
);

// Auto-refresh token on 401 — queue concurrent requests during refresh
let isRefreshing = false;
let pendingQueue: Array<{
    resolve: (token: string) => void;
    reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null) => {
    pendingQueue.forEach(p => {
        if (token) p.resolve(token);
        else p.reject(error);
    });
    pendingQueue = [];
};

apiClient.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
        const status = error.response?.status;
        const isAuthEndpoint =
            originalRequest?.url?.includes(endpoints.auth.login) ||
            originalRequest?.url?.includes(endpoints.auth.register) ||
            originalRequest?.url?.includes(endpoints.auth.refresh);

        // Try to refresh on 401 (not for auth endpoints, and only once)
        if (status === 401 && originalRequest && !originalRequest._retry && !isAuthEndpoint) {
            if (isRefreshing) {
                // Wait for the in-flight refresh to finish, then retry
                return new Promise((resolve, reject) => {
                    pendingQueue.push({
                        resolve: (newToken: string) => {
                            if (originalRequest.headers) {
                                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                            }
                            resolve(apiClient(originalRequest));
                        },
                        reject,
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const { useAuthStore } = require('../../../core/store/authStore');
                const newToken: string = await useAuthStore.getState().refreshSession();
                processQueue(null, newToken);
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                }
                return apiClient(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                const { useAuthStore } = require('../../../core/store/authStore');
                useAuthStore.getState().logout();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        const message =
            (error.response?.data as { message?: string; error?: string })?.message ||
            (error.response?.data as { error?: string })?.error ||
            error.message ||
            'Something went wrong';
        return Promise.reject(new Error(message));
    },
);
