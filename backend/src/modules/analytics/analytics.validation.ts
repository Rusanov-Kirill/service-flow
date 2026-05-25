import { z } from 'zod';

export const dateRangeSchema = z.object({
    companyId: z.string().uuid('Неверный формат companyId'),
    startDate: z.string().min(1, 'startDate обязателен'),
    endDate: z.string().min(1, 'endDate обязателен'),
});

export const revenueFiltersSchema = z.object({
    companyId: z.string().uuid('Неверный формат companyId'),
    startDate: z.string().min(1, 'startDate обязателен'),
    endDate: z.string().min(1, 'endDate обязателен'),
    period: z.enum(['day', 'week', 'month']).default('day'),
});

export const topServicesSchema = z.object({
    companyId: z.string().uuid('Неверный формат companyId'),
    startDate: z.string().min(1, 'startDate обязателен'),
    endDate: z.string().min(1, 'endDate обязателен'),
    limit: z.coerce.number().min(1).max(50).default(10),
});