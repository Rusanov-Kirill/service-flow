import { z } from 'zod';

export const companySchema = z.object({
    name: z.string().min(2, 'Название компании должно содержать минимум 2 символа'),
    slug: z.string()
        .min(2, 'Slug должен состоять минимум из 2 символов')
        .regex(/^[a-z0-9-]+$/, 'Только латиница, цифры и дефисы'),
    description: z.string().optional(),
    tags: z.array(z.string()).min(1, 'Выберите хотя бы один тег'),
    timezone: z.string().min(1, 'Выберите часовой пояс'),
    city: z.string().min(2, 'Город обязателен'),
    currency: z.string().min(1, 'Выберите валюту'),
    address: z.string().optional(),
    logo: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email('Неверный формат email').optional(),
    website: z.string().optional(),
    taxationType: z.enum(['SELF_EMPLOYED', 'SOLE_PROPRIETOR', 'LEGAL_ENTITY']),
    bookingLeadDays: z.number().int().min(1).max(365),
    workScheduleType: z.enum(['FIVE_TWO', 'EVERY_DAY', 'CUSTOM']),
    slotInterval: z.number().int().min(5).max(1440),
    defaultStartTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    defaultEndTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    customWorkDays: z.array(z.any()).optional(),
    holidays: z.array(z.date()),
    autoConfirmBooking: z.boolean(),
    paymentMethods: z.enum(['CASH', 'PREPAYMENT', 'BOTH']),
});

export const memberScheduleSchema = z.object({
    memberScheduleType: z.enum(['FIVE_TWO', 'TWO_TWO', 'CUSTOM']),
    memberStartWorkTime: z.string(),
    memberEndWorkTime: z.string(),
    memberStartWorkDay: z.string().optional(),
    memberCustomWorkSchedule: z.array(
        z.object({
            dayOfWeek: z.number(),
            startWorkTime: z.string(),
            endWorkTime: z.string(),
        })
    ).optional(),
});

export const updateCompanySchema = companySchema.merge(memberScheduleSchema);
export type UpdateCompanyFormData = z.infer<typeof updateCompanySchema>;