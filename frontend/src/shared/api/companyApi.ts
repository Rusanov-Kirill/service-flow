import { apiClient } from './client';
import type { Company } from '@/entities/company';
import type { ClientService } from '@/entities/service';

export type CreateCompanyRequest = Omit<Company, 'id' | 'isActive' | 'createdAt' | 'updatedAt' | 'members'> & {
    services?: Omit<ClientService, 'id' | 'createdAt' | 'updatedAt'>[];
};

export const companyApi = {
    create: async (data: CreateCompanyRequest) => {
        const response = await apiClient.post('/companies', data);
        return response.data;
    },
};