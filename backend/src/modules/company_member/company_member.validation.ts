import { z } from 'zod';

const customWorkScheduleSchema = z.object({
    dayOfWeek: z.number().min(1).max(7, 'День недели должен быть от 1 (пн) до 7 (вс)'),
    startWorkTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Неверный формат времени (HH:MM)'),
    endWorkTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Неверный формат времени (HH:MM)'),
}).refine(data => data.startWorkTime < data.endWorkTime, {
    message: 'Время начала должно быть меньше времени окончания',
});

export const createCompanyMemberSchema = z.object({
    userId: z.string().uuid('Неверный формат userId'),
    companyId: z.string().uuid('Неверный формат companyId'),
    role: z.enum(['owner', 'admin', 'manager', 'receptionist', 'member']),
    scheduleType: z.enum(['FIVE_TWO', 'TWO_TWO', 'CUSTOM']),
    startWorkTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Неверный формат времени (HH:MM)'),
    endWorkTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Неверный формат времени (HH:MM)'),
    startWorkDay: z.date().optional(),
    customWorkSchedule: z.array(customWorkScheduleSchema).optional(),
});

export const updateCompanyMemberSchema = z.object({
    role: z.enum(['owner', 'admin', 'manager', 'receptionist', 'member']).optional(),
    scheduleType: z.enum(['FIVE_TWO', 'TWO_TWO', 'CUSTOM']).optional(),
    startWorkTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Неверный формат времени (HH:MM)').optional(),
    endWorkTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Неверный формат времени (HH:MM)').optional(),
    startWorkDay: z.date().optional(),
    customWorkSchedule: z.array(customWorkScheduleSchema).optional(),
});