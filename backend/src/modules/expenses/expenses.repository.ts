import { prisma } from '../../shared/database/prisma';
import { CreateExpenseDto, UpdateExpenseDto } from './expenses.types';

export const expensesRepository = {
    create: async (data: CreateExpenseDto) => {
        return prisma.expense.create({
            data: {
                companyId: data.companyId,
                amount: data.amount,
                category: data.category,
                description: data.description || null,
                date: data.date || new Date(),
            },
        });
    },

    update: async (id: string, data: UpdateExpenseDto) => {
        return prisma.expense.update({
            where: { id },
            data: {
                ...data,
                updatedAt: new Date(),
            },
        });
    },

    delete: async (id: string) => {
        return prisma.expense.delete({
            where: { id },
        });
    },

    findById: async (id: string) => {
        return prisma.expense.findUnique({
            where: { id },
        });
    },

    findByCompanyId: async (companyId: string, startDate?: Date, endDate?: Date) => {
        const where: any = { companyId };
        
        if (startDate || endDate) {
            where.date = {};
            if (startDate) where.date.gte = startDate;
            if (endDate) where.date.lte = endDate;
        }
        
        return prisma.expense.findMany({
            where,
            orderBy: { date: 'desc' },
        });
    },

    getTotalByCompany: async (companyId: string, startDate?: Date, endDate?: Date) => {
        const where: any = { companyId };
        
        if (startDate || endDate) {
            where.date = {};
            if (startDate) where.date.gte = startDate;
            if (endDate) where.date.lte = endDate;
        }
        
        const result = await prisma.expense.aggregate({
            where,
            _sum: {
                amount: true,
            },
        });
        
        return result._sum.amount || 0;
    },

    getGroupedByCategory: async (companyId: string, startDate?: Date, endDate?: Date) => {
        const where: any = { companyId };
        
        if (startDate || endDate) {
            where.date = {};
            if (startDate) where.date.gte = startDate;
            if (endDate) where.date.lte = endDate;
        }
        
        const results = await prisma.expense.groupBy({
            by: ['category'],
            where,
            _sum: {
                amount: true,
            },
            _count: {
                id: true,
            },
        });
        
        return results.map(r => ({
            category: r.category,
            total: r._sum.amount || 0,
            count: r._count.id,
        }));
    },
};