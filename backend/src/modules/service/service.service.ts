import { serviceRepository } from './service.repository';
import { CreateServiceDto } from './service.types';

export const serviceService = {
    createMany: async (services: CreateServiceDto[]): Promise<void> => {
        if (services.length === 0) return;
        
        await serviceRepository.createMany(services);
    },
};