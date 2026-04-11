import { z } from 'zod';

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
});

export type CreateCompanyFormData = z.infer<typeof createCompanySchema>;