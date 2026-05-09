import { z } from 'zod';

export const findOrCreateCustomerSchema = z.object({
    userId: z.string().uuid('Неверный формат userId'),
    companyId: z.string().uuid('Неверный формат companyId'),
    email: z.string().email('Неверный формат email'),
    preferredServiceIds: z.array(z.string()).default([]),
    preferredStaffIds: z.array(z.string()).default([]),
    preferredTimeOfDay: z.enum(['morning', 'afternoon', 'evening']).nullable().default(null),
    preferredWeekDays: z.array(z.number().min(1).max(7)).default([]),
    discountRate: z.number().min(0).max(100).nullable().default(0),
    status: z.enum(['active', 'inactive', 'blocked']).default('active'),
    blacklisted: z.boolean().default(false),
    blacklistReason: z.string().nullable().default(null),
    notes: z.string().nullable().default(null),
});

export const updateCustomerSchema = z.object({
    preferredServiceIds: z.array(z.string()).default([]),
    preferredStaffIds: z.array(z.string()).default([]),
    preferredTimeOfDay: z.enum(['morning', 'afternoon', 'evening']).nullable().default(null),
    preferredWeekDays: z.array(z.number().min(1).max(7)).default([]),
    discountRate: z.number().min(0).max(100).nullable().default(0),
    status: z.enum(['active', 'inactive', 'blocked']).default('active'),
    blacklisted: z.boolean().default(false),
    blacklistReason: z.string().nullable().default(null),
    notes: z.string().nullable().default(null),
});

export const findByUserAndCompanySchema = z.object({
    userId: z.string().uuid('Неверный формат userId'),
    companyId: z.string().uuid('Неверный формат companyId'),
});

export const getAllCustomersByCompanyIdSchema = z.object({
    companyId: z.string().uuid('Неверный формат companyId'),
});

export const getCustomerByEmailSchema = z.object({
    companyId: z.string().uuid('Неверный формат companyId'),
    email: z.string().email('Неверный формат email'),
});