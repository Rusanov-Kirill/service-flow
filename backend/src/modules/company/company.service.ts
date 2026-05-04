import { prisma } from '../../shared/database/prisma';
import { companyRepository } from './company.repository';
import type { CreateCompanyDto } from './company.types';
import type { CreateServiceDto } from '../service/service.types';
import { formatPhone } from '../../shared/utils/formatPhone';

export const companyService = {
    createWithServices: async (
        companyData: CreateCompanyDto,
        servicesData: CreateServiceDto[] = []
    ) => {
        const user = await prisma.user.findUnique({
            where: { id: companyData.ownerId },
        });

        if (!user) {
            throw new Error('Пользователь не найден');
        }

        const existingCompany = await prisma.company.findUnique({
            where: { slug: companyData.slug },
        });

        if (existingCompany) {
            throw new Error('Компания с таким slug уже существует');
        }

        const formattedCompanyData = {
            ...companyData,
            phone: companyData.phone ? formatPhone(companyData.phone) : companyData.phone,
        };

        return companyRepository.createWithServices(formattedCompanyData, servicesData);
    },

    update: async (id: string, data: Partial<CreateCompanyDto>) => {
        const company = await companyRepository.findById(id);

        if (!company) {
            throw new Error('Компания не найдена');
        }

        return companyRepository.update(id, data);
    },

    getAll: async () => {
        return companyRepository.findAll();
    },

    getById: async (id: string) => {
        const company = await companyRepository.findById(id);

        if (!company) {
            throw new Error('Компания не найдена');
        }

        return company;
    },

    getBySlug: async (slug: string) => {
        const company = await companyRepository.findBySlug(slug);

        if (!company) {
            throw new Error('Компания не найдена');
        }

        return company;
    },
};