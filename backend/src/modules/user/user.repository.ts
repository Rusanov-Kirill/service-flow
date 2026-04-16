import { prisma } from '../../shared/database/prisma';
import { User } from '@prisma/client';

export const userRepository = {
    findById: async (id: string): Promise<User | null> => {
        return prisma.user.findUnique({
            where: { id }
        });
    },

    update: async (id: string, data: Partial<User>): Promise<User> => {
        return prisma.user.update({
            where: { id },
            data
        });
    },

    getUserCompanies: async (userId: string) => {
        return prisma.company.findMany({
            where: { ownerId: userId },
            orderBy: { createdAt: 'desc' },
            include: {
                services: {
                    where: { isActive: true },
                },
            },
        });
    },
}