import { apiClient } from '@/shared/api/client';
import type { Company } from '@/entities/company';

interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

interface CheckFavoriteResponse {
    isFavorite: boolean;
}

export const favoritesApi = {
    getUserFavorites: async (): Promise<Company[]> => {
        const response = await apiClient.get<ApiResponse<Company[]>>('/favorites');
        return response.data.data;
    },

    addToFavorites: async (companyId: string): Promise<Company> => {
        const response = await apiClient.post<ApiResponse<Company>>('/favorites', { companyId });
        return response.data.data;
    },

    removeFromFavorites: async (companyId: string): Promise<void> => {
        await apiClient.delete(`/favorites/${companyId}`);
    },

    checkFavorite: async (companyId: string): Promise<boolean> => {
        const response = await apiClient.get<ApiResponse<CheckFavoriteResponse>>(`/favorites/check/${companyId}`);
        return response.data.data.isFavorite;
    },
};