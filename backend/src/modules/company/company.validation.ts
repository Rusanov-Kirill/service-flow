import { z } from 'zod';
import { createServiceSchema } from '../service/service.validation';

const customWorkDaySchema = z.object({
    dayOfWeek: z.number().min(1).max(7, 'День недели должен быть от 1 (пн) до 7 (вс)'),
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Неверный формат времени (HH:MM)'),
    endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Неверный формат времени (HH:MM)'),
    slotInterval: z.number()
        .int('Интервал должен быть целым числом')
        .min(5, 'Минимальный интервал 5 минут')
        .max(1440, 'Максимальный интервал 1440 минут'),
}).refine(data => data.startTime < data.endTime, {
    message: 'Время начала должно быть меньше времени окончания',
});

export const createCompanySchema = z.object({
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
    logo: z.string().url('Неверный URL').optional().or(z.literal('')),
    phone: z.string().optional(),
    email: z.string().email('Неверный формат email'),
    website: z.string().url('Неверный URL').optional().or(z.literal('')),
    ownerId: z.string().uuid('Неверный формат ownerId'),
    services: z.array(createServiceSchema).optional(),
    taxationType: z.enum(['SELF_EMPLOYED', 'SOLE_PROPRIETOR', 'LEGAL_ENTITY']),
    bookingLeadDays: z.number()
        .int('Значение должно быть целым числом')
        .min(1, 'Минимум 1 день')
        .max(365, 'Максимум 365 дней'),
    workScheduleType: z.enum(['FIVE_TWO', 'EVERY_DAY', 'CUSTOM']),
    slotInterval: z.number()
        .int('Интервал должен быть целым числом')
        .min(5, 'Минимальный интервал 5 минут')
        .max(1440, 'Максимальный интервал 1440 минут'),
    defaultStartTime: z.string()
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Неверный формат времени (HH:MM)'),
    defaultEndTime: z.string()
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Неверный формат времени (HH:MM)'),
    customWorkDays: z.array(customWorkDaySchema).optional(),
    holidays: z.array(z.string()),
    autoConfirmBooking: z.boolean(),
    paymentMethods: z.enum(['CASH', 'PREPAYMENT', 'BOTH']),
}).refine(data => {
    if (data.workScheduleType === 'CUSTOM' && (!data.customWorkDays || data.customWorkDays.length === 0)) {
        return false;
    }
    return true;
}, {
    message: 'При выборе пользовательского графика необходимо указать хотя бы один день с особым расписанием',
    path: ['customWorkDays'],
});