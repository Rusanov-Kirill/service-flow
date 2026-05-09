import type { UpdateCustomerDto } from "@/entities/customer";
import { apiClient } from "@/shared/api/client";

export const customerApi = {
    getByUserAndCompanyIds: async (userId: string, companyId: string) => {
        const response = await apiClient.get('/customers/by-user-company', {
            params: { userId, companyId }
        });
        return response.data;
    },

    getAllCompanyCustomers: async (companyId: string) => {
        const response = await apiClient.get('/customers/all-by-company', {
            params: { companyId }
        });
        return response.data;
    },

    getByEmail: async (companyId: string, email: string) => {
        const response = await apiClient.get('/customers/by-email', {
            params: { companyId, email }
        });
        return response.data;
    },

    update: async (customerId: string, data: UpdateCustomerDto) => {
        const response = await apiClient.patch(`/customers/${customerId}`, data);
        return response.data;
    },
};