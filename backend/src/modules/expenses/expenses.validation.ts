import { z } from 'zod';

export const createExpenseSchema = z.object({
    companyId: z.string().uuid('Неверный формат companyId'),
    amount: z.number().positive('Сумма должна быть положительной'),
    category: z.enum(['advertising', 'rent', 'materials', 'salary', 'taxes', 'other']),
    description: z.string().nullable().optional(),
    date: z.string().optional(), 
});

export const updateExpenseSchema = z.object({
    amount: z.number().positive('Сумма должна быть положительной').optional(),
    category: z.enum(['advertising', 'rent', 'materials', 'salary', 'taxes', 'other']).optional(),
    description: z.string().nullable().optional(),
    date: z.string().optional(), 
});

export const expenseIdSchema = z.object({
    id: z.string().uuid('Неверный формат ID'),
});

export const getExpensesSchema = z.object({
    companyId: z.string().uuid('Неверный формат companyId'),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
});