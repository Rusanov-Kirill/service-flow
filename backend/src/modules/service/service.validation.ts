import { z } from 'zod';

export const createServiceSchema = z.object({
    name: z.string().min(2, 'Название должно состоять минимум из 2 символов'),
    description: z.string().optional(),
    duration: z.number()
        .min(1, 'Услуга должна занимать минимум 1 минуту')
        .max(525600, 'Услуга не может занимать более 525600 минут (1 год)'),
    price: z.number()
        .min(0, 'Цена не может быть отрицательной')
        .max(100_000_000, 'Цена не может превышать 100 000 000'),
    currency: z.string().default("RUB"),
    isActive: z.boolean().default(true),
});

export const updateServiceSchema = createServiceSchema.partial();