import { apiClient } from '@/shared/api/client';

export interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    data: {
        accessToken: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            emailVerified: boolean;
        };
    };
}

export interface UpdateProfileData {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    avatar?: string;
}

export const authApi = {
    register: (data: RegisterData) => {
        return apiClient.post<AuthResponse>('/auth/register', data);
    },

    login: (data: LoginData) => {
        return apiClient.post<AuthResponse>('/auth/login', data);
    },

    logout: () => {
        return apiClient.post('/auth/logout');
    },

    getMe: () => {
        return apiClient.get('/auth/me');
    },

    refresh: () => {
        return apiClient.post('/auth/refresh');
    },

    meWithToken: (token: string) => {
        return apiClient.get('/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    updateProfile: (data: UpdateProfileData) => {
        return apiClient.patch('/users/profile', data);
    },
};