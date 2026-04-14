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
};