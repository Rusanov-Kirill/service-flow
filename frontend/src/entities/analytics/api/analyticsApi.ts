import { apiClient } from '@/shared/api/client';

export const analyticsApi = {
    getFinance: async (companyId: string, startDate: string, endDate: string) => {
        const response = await apiClient.get('/analytics/finance', {
            params: { companyId, startDate, endDate }
        });
        return response.data;
    },

    getRevenue: async (companyId: string, startDate: string, endDate: string, period: string = 'day') => {
        const response = await apiClient.get('/analytics/revenue', {
            params: { companyId, startDate, endDate, period }
        });
        return response.data;
    },

    getTopServices: async (companyId: string, startDate: string, endDate: string, limit: number = 10) => {
        const response = await apiClient.get('/analytics/top-services', {
            params: { companyId, startDate, endDate, limit }
        });
        return response.data;
    },

    getStatusDistribution: async (companyId: string, startDate: string, endDate: string) => {
        const response = await apiClient.get('/analytics/status-distribution', {
            params: { companyId, startDate, endDate }
        });
        return response.data;
    },

    getPopularDays: async (companyId: string, startDate: string, endDate: string) => {
        const response = await apiClient.get('/analytics/popular-days', {
            params: { companyId, startDate, endDate }
        });
        return response.data;
    },

    getDashboardStats: async (companyId: string) => {
        const response = await apiClient.get('/analytics/dashboard', {
            params: { companyId }
        });
        return response.data;
    },
};