import { CreateCustomerDto, CreateCustomerDbDto } from './customer.types';

import { prisma } from '../../shared/database/prisma';

export const customerRepository = {
    create: async (data: CreateCustomerDto) => {
        const createData: CreateCustomerDbDto = {
            ...data,
            totalBookings: 0,
            totalSpent: 0,
            averageCheck: 0,
            preferredServiceIds: data.preferredServiceIds || [],
            preferredStaffIds: data.preferredStaffIds || [],
            preferredWeekDays: data.preferredWeekDays || [],
            discountRate: data.discountRate ?? 0,
            status: data.status || 'active',
            blacklisted: data.blacklisted ?? false,
            blacklistReason: data.blacklistReason ?? null,
            notes: data.notes ?? null,
        };

        return prisma.customer.create({
            data: createData,
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    },
                },
            },
        });
    },

    update: async (id: string, data: Partial<Omit<CreateCustomerDto, 'userId' | 'companyId' | 'email'>>) => {
        return prisma.customer.update({
            where: { id },
            data: {
                preferredServiceIds: data.preferredServiceIds,
                preferredStaffIds: data.preferredStaffIds,
                preferredTimeOfDay: data.preferredTimeOfDay,
                preferredWeekDays: data.preferredWeekDays,
                discountRate: data.discountRate,
                status: data.status,
                blacklisted: data.blacklisted,
                blacklistReason: data.blacklistReason,
                notes: data.notes,
                updatedAt: new Date(),
            },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    },
                },
            },
        });
    },

    updatePreferences: async (
        id: string,
        preferences: {
            preferredServiceIds: string[];
            preferredStaffIds: string[];
            preferredWeekDays: number[];
        }
    ) => {
        return prisma.customer.update({
            where: { id },
            data: {
                preferredServiceIds: preferences.preferredServiceIds,
                preferredStaffIds: preferences.preferredStaffIds,
                preferredWeekDays: preferences.preferredWeekDays,
                updatedAt: new Date(),
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

    incrementTotalSpent: async (id: string, price: number) => {
        return prisma.customer.update({
            where: { id },
            data: {
                totalSpent: {
                    increment: price,
                },
            },
        });
    },

    findById: async (id: string) => {
        return prisma.customer.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    },
                },
            },
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
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    },
                },
            },
        });
    },

    getAllCustomersByCompanyId: async (companyId: string) => {
        return prisma.customer.findMany({
            where: { companyId },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    },
                },
            },
        })
    },

    getCustomerByEmail: async (companyId: string, email: string) => {
        return prisma.customer.findFirst({
            where: {
                companyId,
                email
            },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    },
                },
            },
        });
    },
};