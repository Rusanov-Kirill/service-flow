import { prisma } from '../../shared/database/prisma';

export const serviceRepository = {
    findById: async (id: string) => {
        return prisma.service.findUnique({
            where: { id },
        });
    },
}