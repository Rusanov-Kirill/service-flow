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

    getAllUserCompanies: async (id: string) => {
        const members = await prisma.companyMember.findMany({
            where: { userId: id },
            include: {
                company: {
                    select: {
                        name: true,
                        slug: true,
                        city: true,
                        logo: true,
                    }
                }
            }
        });

        return members.map(m => m.company);
    },
}