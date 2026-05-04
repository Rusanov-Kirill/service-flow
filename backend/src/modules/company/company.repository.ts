import { prisma } from '../../shared/database/prisma';
import { ROLE_PERMISSIONS } from '../../shared/utils/rolePermissions';
import type { CreateServiceDto } from '../service/service.types';
import type { CreateCompanyDto } from './company.types';

export const companyRepository = {
    createWithServices: async (
        companyData: CreateCompanyDto,
        servicesData: CreateServiceDto[]
    ) => {
        const formattedHolidays = companyData.holidays?.map(holiday => {
            const date = new Date(holiday);
            date.setUTCHours(0, 0, 0, 0);
            return date;
        }) || [];

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
                    isActive: true,
                    bookingLeadDays: companyData.bookingLeadDays,
                    workScheduleType: companyData.workScheduleType,
                    slotInterval: companyData.slotInterval,
                    defaultStartTime: companyData.defaultStartTime,
                    defaultEndTime: companyData.defaultEndTime,
                    customWorkDays: companyData.customWorkDays as any,
                    holidays: formattedHolidays,
                    autoConfirmBooking: companyData.autoConfirmBooking,
                    paymentMethods: companyData.paymentMethods,
                },
            });

            const ownerPermissions = ROLE_PERMISSIONS.owner;
            await tx.companyMember.create({
                data: {
                    userId: companyData.ownerId,
                    companyId: company.id,
                    role: 'owner',
                    permissions: ownerPermissions,
                    startWorkTime: companyData.defaultStartTime,
                    endWorkTime: companyData.defaultEndTime,
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

    update: async (id: string, data: Partial<CreateCompanyDto>) => {
        let formattedData = { ...data };
        let formattedHolidays: Date[] = [];

        if (data.holidays) {
            formattedHolidays = data.holidays?.map(holiday => {
                const date = new Date(holiday);
                date.setUTCHours(0, 0, 0, 0);
                return date;
            }) || [];
        };

        return prisma.company.update({
            where: { id },
            data: {
                name: formattedData.name,
                slug: formattedData.slug,
                description: formattedData.description,
                tags: formattedData.tags,
                timezone: formattedData.timezone,
                city: formattedData.city,
                currency: formattedData.currency,
                address: formattedData.address,
                logo: formattedData.logo,
                phone: formattedData.phone,
                email: formattedData.email,
                website: formattedData.website,
                bookingLeadDays: formattedData.bookingLeadDays,
                workScheduleType: formattedData.workScheduleType,
                slotInterval: formattedData.slotInterval,
                defaultStartTime: formattedData.defaultStartTime,
                defaultEndTime: formattedData.defaultEndTime,
                customWorkDays: formattedData.customWorkDays as any,
                holidays: formattedHolidays,
                autoConfirmBooking: formattedData.autoConfirmBooking,
                paymentMethods: formattedData.paymentMethods,
            },
            include: { services: true },
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

    findBySlug: async (slug: string) => {
        return prisma.company.findUnique({
            where: { slug },
            include: { services: true },
        });
    },
};