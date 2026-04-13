import { z } from 'zod';

export const serviceSchema = z.object({
    name: z.string().min(2, 'Название должно состоять минимум из 2 символов'),
    description: z.string().optional(),
    duration: z.number()
        .min(1, 'Услуга должна занимать минимум 1 минуту')
        .max(525600, 'Услуга не может занимать более 525600 минут (1 год)'),
    price: z.number().min(0, 'Цена не может быть отрицательной'),
    currency: z.string(),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;

export interface Service extends ServiceFormData {
    id: string;
};