import { z } from 'zod';

export const findOrCreateCustomerSchema = z.object({
    userId: z.string().uuid('Неверный формат userId'),
    companyId: z.string().uuid('Неверный формат companyId'),
    email: z.string().email('Неверный формат email'),
});