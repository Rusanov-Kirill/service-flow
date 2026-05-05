import type { ClientService } from '@/entities/service';
import { apiClient } from '@/shared/api/client';

type CreateServiceDto = Omit<ClientService, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>;
type UpdateCompanyDto = Partial<Omit<ClientService, 'id' | 'createdAt' | 'updatedAt'>>;

export const serviceApi = {
    create: async (companyId: string, data: CreateServiceDto) => {
        const response = await apiClient.post(`/services/companies/${companyId}/services`, data);
        return response.data;
    },

    update: async (serviceId: string, data: UpdateCompanyDto) => {
        const response = await apiClient.patch(`/services/${serviceId}`, data);
        return response.data;
    },

    delete: async (serviceId: string) => {
        const response = await apiClient.delete(`/services/${serviceId}`);
        return response.data;
    },
};