import { prisma } from '../../shared/database/prisma';
import { companyMemberRepository } from './company_member.repository';
import { CreateCompanyMemberDto, UpdateCompanyMemberDto } from './company_member.types';

export const companyMemberService = {
    create: async (data: CreateCompanyMemberDto) => {
        const user = await prisma.user.findUnique({
            where: { id: data.userId },
        });

        if (!user) {
            throw new Error('Пользователь не найден');
        }

        const company = await prisma.company.findUnique({
            where: { id: data.companyId },
        });

        if (!company) {
            throw new Error('Компания не найдена');
        }

        const existingMember = await companyMemberRepository.findByUserId(data.companyId, data.userId);

        if (existingMember) {
            throw new Error('Пользователь уже является сотрудником этой компании');
        }

        return companyMemberRepository.create(data);
    },

    update: async (id: string, data: UpdateCompanyMemberDto) => {
        const existingMember = await companyMemberRepository.findById(id);

        if (!existingMember) {
            throw new Error('Сотрудник не найден');
        }

        if (existingMember.role === 'owner' && data.role && data.role !== 'owner') {
            throw new Error('Нельзя изменить роль владельца компании');
        }

        return companyMemberRepository.update(id, data);
    },

    delete: async (id: string) => {
        const existingMember = await companyMemberRepository.findById(id);

        if (!existingMember) {
            throw new Error('Сотрудник не найден');
        }

        if (existingMember.role === 'owner') {
            throw new Error('Нельзя удалить владельца компании');
        }

        return companyMemberRepository.delete(id);
    },

    getById: async (id: string) => {
        const member = await companyMemberRepository.findById(id);

        if (!member) {
            throw new Error('Сотрудник не найден');
        }

        return member;
    },

    getByEmail: async (companyId: string, email: string) => {
        return companyMemberRepository.findByEmail(companyId, email);
    },

    getAllByCompanyId: async (companyId: string) => {
        const company = await prisma.company.findUnique({
            where: { id: companyId },
        });

        if (!company) {
            throw new Error('Компания не найдена');
        }

        return companyMemberRepository.getAllCompanyMembers(companyId);
    },

    getByUserId: async (companyId: string, userId: string) => {
        const member = await companyMemberRepository.findByUserId(companyId, userId);

        if (!member) {
            throw new Error('Сотрудник не найден в этой компании');
        }

        return member;
    },
};