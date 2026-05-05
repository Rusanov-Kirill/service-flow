import { serviceRepository } from './service.repository';
import { CreateServiceDto } from './service.types';
import { companyRepository } from '../company/company.repository';

export const serviceService = {
    create: async (companyId: string, data: CreateServiceDto) => {
        const company = await companyRepository.findById(companyId);
        if (!company) throw new Error('Компания не найдена');

        return serviceRepository.create(companyId, data);
    },

    update: async (serviceId: string, data: Partial<CreateServiceDto>) => {
        const existing = await serviceRepository.findById(serviceId);
        if (!existing) throw new Error('Услуга не найдена');

        return serviceRepository.update(serviceId, data);
    },

    delete: async (serviceId: string) => {
        const existing = await serviceRepository.findById(serviceId);
        if (!existing) throw new Error('Услуга не найдена');

        return serviceRepository.delete(serviceId);
    },

    getByCompany: async (companyId: string) => {
        const company = await companyRepository.findById(companyId);
        if (!company) throw new Error('Компания не найдена');

        return serviceRepository.findByCompany(companyId);
    },

    getById: async (serviceId: string) => {
        const service = await serviceRepository.findById(serviceId);
        if (!service) throw new Error('Услуга не найдена');
        return service;
    },
};