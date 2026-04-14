import { prisma } from '../../shared/database/prisma';
import { companyRepository } from './company.repository';
import type { CreateCompanyDto } from './company.types';
import type { CreateServiceDto } from '../service/service.types';

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
        
        return companyRepository.createWithServices(companyData, servicesData);
    },
};