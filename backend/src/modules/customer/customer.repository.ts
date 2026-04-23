import { CreateCustomerDto } from './customer.types';

import { prisma } from '../../shared/database/prisma';

export const customerRepository = {
    findById: async (id: string) => {
        return prisma.customer.findUnique({
            where: { id },
        });
    },

    findByUserAndCompany: async (userId: string, companyId: string) => {
        return prisma.customer.findUnique({
            where: {
                userId_companyId: {
                    userId,
                    companyId,
                },
            },
        });
    },

    create: async (data: CreateCustomerDto) => {
        return prisma.customer.create({
            data: {
                userId: data.userId,
                companyId: data.companyId,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
                totalBookings: 0,
            },
        });
    },

    incrementTotalBookings: async (id: string) => {
        return prisma.customer.update({
            where: { id },
            data: {
                totalBookings: {
                    increment: 1,
                },
            },
        });
    },
};