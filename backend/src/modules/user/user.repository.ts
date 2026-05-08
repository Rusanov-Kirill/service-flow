import { prisma } from '../../shared/database/prisma';
import type { UserCompaniesResponse } from './user.types';
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

    getUserByEmail: async (email: string) => {
        return prisma.user.findUnique({
            where: { email },
            select: { 
                id: true,
                firstName: true,
                lastName: true,
                avatar: true
            }
        });
    },

    getAllUserCompanies: async (id: string): Promise<UserCompaniesResponse[]> => {
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

        return members.map(member => ({
            ...member.company,
            role: member.role
        }));
    },
}