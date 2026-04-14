import { prisma } from '../../shared/database/prisma';
import { CreateServiceDto } from './service.types';

export const serviceRepository = {
    createMany: async (services: CreateServiceDto[]): Promise<void> => {
        if (services.length === 0) return;
        
        await prisma.service.createMany({
            data: services,
        });
    },
}