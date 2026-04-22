import type { Company } from '@/entities/company';
import type { ClientService } from '@/entities/service';

import { apiClient } from './client';

export type CreateCompanyRequest = Omit<Company, 'id' | 'createdAt' | 'updatedAt' | 'isActive' | 'members' | 'services'> & {
    services?: Omit<ClientService, 'id' | 'createdAt' | 'updatedAt'>[];
};

export const companyApi = {
    create: async (data: CreateCompanyRequest) => {
        const response = await apiClient.post('/companies', data);
        return response.data;
    },

    getAll: async (): Promise<Company[]> => {
        const response = await apiClient.get('/companies');
        return response.data;
    },

    getByOwnerId: async (ownerId: string): Promise<Company[]> => {
        const response = await apiClient.get(`/companies/owner/${ownerId}`);
        return response.data;
    },

    getById: async (id: string): Promise<Company> => {
        const response = await apiClient.get(`/companies/${id}`);
        return response.data;
    },

    getBySlug: async (slug: string): Promise<Company> => {
        const response = await apiClient.get(`/companies/slug/${slug}`);
        return response.data;
    },
};