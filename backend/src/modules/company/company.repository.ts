import { prisma } from '../../shared/database/prisma';
import type { CreateCompanyDto } from './company.types';
import type { CreateServiceDto } from '../service/service.types';

export const companyRepository = {
    createWithServices: async (
        companyData: CreateCompanyDto,
        servicesData: CreateServiceDto[]
    ) => {
        return prisma.$transaction(async (tx) => {
            const company = await tx.company.create({
                data: {
                    name: companyData.name,
                    slug: companyData.slug,
                    description: companyData.description || "",
                    tags: companyData.tags,
                    timezone: companyData.timezone,
                    city: companyData.city,
                    currency: companyData.currency,
                    address: companyData.address,
                    logo: companyData.logo,
                    phone: companyData.phone,
                    email: companyData.email,
                    website: companyData.website,
                    ownerId: companyData.ownerId,
                    isActive: true,
                    bookingLeadDays: companyData.bookingLeadDays,
                    workScheduleType: companyData.workScheduleType,
                    slotInterval: companyData.slotInterval,
                    defaultStartTime: companyData.defaultStartTime,
                    defaultEndTime: companyData.defaultEndTime,
                    customWorkDays: companyData.customWorkDays as any,
                    holidays: companyData.holidays,
                    autoConfirmBooking: companyData.autoConfirmBooking,
                    paymentMethods: companyData.paymentMethods,
                },
            });

            if (servicesData && servicesData.length > 0) {
                await tx.service.createMany({
                    data: servicesData.map(service => ({
                        ...service,
                        companyId: company.id,
                    })),
                });
            }

            return tx.company.findUnique({
                where: { id: company.id },
                include: { services: true },
            });
        });
    },

    findById: async (id: string) => {
        return prisma.company.findUnique({
            where: { id },
            include: { services: true },
        });
    },

    findAll: async () => {
        return prisma.company.findMany({
            orderBy: { createdAt: 'desc' },
            include: { services: true },
        });
    },

    findByOwnerId: async (ownerId: string) => {
        return prisma.company.findMany({
            where: { ownerId },
            orderBy: { createdAt: 'desc' },
            include: { services: true },
        });
    },

    findBySlug: async (slug: string) => {
        return prisma.company.findUnique({
            where: { slug },
            include: { services: true },
        });
    },
};