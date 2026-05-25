import { apiClient } from '@/shared/api/client';
import type { 
    Expense, 
    CreateExpenseDto, 
    UpdateExpenseDto, 
    ExpensesResponse, 
    CategoryStats 
} from '../model/types';

interface ApiResponse<T> {
    success: boolean;
    data: T;
}

export const expensesApi = {
    create: async (data: CreateExpenseDto): Promise<ApiResponse<Expense>> => {
        const response = await apiClient.post('/expenses', data);
        return response.data;
    },

    update: async (id: string, data: UpdateExpenseDto): Promise<ApiResponse<Expense>> => {
        const response = await apiClient.patch(`/expenses/${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<ApiResponse<null>> => {
        const response = await apiClient.delete(`/expenses/${id}`);
        return response.data;
    },

    getById: async (id: string): Promise<ApiResponse<Expense>> => {
        const response = await apiClient.get(`/expenses/${id}`);
        return response.data;
    },

    getByCompany: async (companyId: string, startDate?: string, endDate?: string): Promise<ApiResponse<ExpensesResponse>> => {
        const params: any = { companyId };
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        
        const response = await apiClient.get('/expenses/company', { params });
        return response.data;
    },

    getTotal: async (companyId: string, startDate?: string, endDate?: string): Promise<ApiResponse<{ total: number }>> => {
        const params: any = { companyId };
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        
        const response = await apiClient.get('/expenses/company/total', { params });
        return response.data;
    },

    getByCategory: async (companyId: string, startDate?: string, endDate?: string): Promise<ApiResponse<{ categories: CategoryStats[]; total: number }>> => {
        const params: any = { companyId };
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        
        const response = await apiClient.get('/expenses/company/categories', { params });
        return response.data;
    },
};