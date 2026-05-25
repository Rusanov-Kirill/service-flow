import { prisma } from '../../shared/database/prisma';
import { CreateServiceDto } from './service.types';

export const serviceRepository = {
    findById: async (id: string) => {
        return prisma.service.findUnique({
            where: { id },
        });
    },

    create: async (companyId: string, data: CreateServiceDto) => {
        return prisma.service.create({
            data: {
                companyId,
                name: data.name,
                description: data.description,
                duration: data.duration,
                price: data.price,
                currency: data.currency,
                cost: data.cost,
                isActive: data.isActive ?? true,
            },
        });
    },

    update: async (id: string, data: Partial<CreateServiceDto>) => {
        return prisma.service.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
                duration: data.duration,
                price: data.price,
                currency: data.currency,
                cost: data.cost,
                isActive: data.isActive,
            },
        });
    },

    delete: async (id: string) => {
        return prisma.service.delete({
            where: { id },
        });
    },

    findByCompany: async (companyId: string) => {
        return prisma.service.findMany({
            where: { companyId },
            orderBy: { createdAt: 'desc' },
        });
    },
}