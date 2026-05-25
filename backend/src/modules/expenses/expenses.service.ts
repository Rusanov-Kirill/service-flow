import { expensesRepository } from './expenses.repository';
import { CreateExpenseDto, UpdateExpenseDto } from './expenses.types';
import { companyRepository } from '../company/company.repository';

const toNumber = (value: any): number => {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return parseFloat(value);
    if (value.toString) return parseFloat(value.toString());
    return 0;
};

export const expensesService = {
    create: async (data: CreateExpenseDto) => {
        const company = await companyRepository.findById(data.companyId);
        if (!company) {
            throw new Error('Компания не найдена');
        }
        
        return expensesRepository.create(data);
    },

    update: async (id: string, data: UpdateExpenseDto) => {
        const expense = await expensesRepository.findById(id);
        if (!expense) {
            throw new Error('Расход не найден');
        }
        
        return expensesRepository.update(id, data);
    },

    delete: async (id: string) => {
        const expense = await expensesRepository.findById(id);
        if (!expense) {
            throw new Error('Расход не найден');
        }
        
        await expensesRepository.delete(id);
        return { success: true };
    },

    findById: async (id: string) => {
        const expense = await expensesRepository.findById(id);
        if (!expense) {
            throw new Error('Расход не найден');
        }
        return expense;
    },

    findByCompanyId: async (companyId: string, startDate?: Date, endDate?: Date) => {
        const expenses = await expensesRepository.findByCompanyId(companyId, startDate, endDate);
        
        const total = expenses.reduce((sum, e) => sum + toNumber(e.amount), 0);
        
        return {
            expenses,
            total,
            count: expenses.length,
        };
    },

    getTotalByCompany: async (companyId: string, startDate?: Date, endDate?: Date) => {
        const total = await expensesRepository.getTotalByCompany(companyId, startDate, endDate);
        return toNumber(total);
    },

    getGroupedByCategory: async (companyId: string, startDate?: Date, endDate?: Date) => {
        const categories = await expensesRepository.getGroupedByCategory(companyId, startDate, endDate);
        
        const total = categories.reduce((sum, c) => sum + toNumber(c.total), 0);
        
        return {
            categories: categories.map(c => ({
                ...c,
                total: toNumber(c.total),
                percentage: total > 0 ? (toNumber(c.total) / total) * 100 : 0,
            })),
            total,
        };
    },
};