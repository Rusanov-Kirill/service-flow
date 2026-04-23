import { z } from 'zod';

export const findOrCreateCustomerSchema = z.object({
    userId: z.string().uuid('Неверный формат userId'),
    companyId: z.string().uuid('Неверный формат companyId'),
    firstName: z.string().min(1, 'Имя обязательно'),
    lastName: z.string().min(1, 'Фамилия обязательна'),
    email: z.string().email('Неверный формат email'),
    phone: z.string().optional(),
});