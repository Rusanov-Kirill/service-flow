import axios from 'axios';

import { useAuthStore } from '@app/store/authStore';

import { authApi } from './authApi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const apiClient = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

let isRefreshing = false;

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes('/auth/refresh')
        ) {
            originalRequest._retry = true;

            if (!isRefreshing) {
                isRefreshing = true;

                try {
                    const response = await authApi.refresh();

                    const { accessToken, user } = response.data.data;

                    useAuthStore.getState().setAuth(accessToken, user);
                } catch (e) {
                    useAuthStore.getState().logout();
                    return Promise.reject(e);
                } finally {
                    isRefreshing = false;
                }
            }

            const token = useAuthStore.getState().accessToken;

            if (token) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return apiClient(originalRequest);
            }
        }

        return Promise.reject(error);
    }
);