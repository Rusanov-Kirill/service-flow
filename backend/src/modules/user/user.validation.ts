import { z } from 'zod';

export const updateProfileSchema = z.object({
    firstName: z.string().min(2, 'Имя должно состоять минимум из 2 символов').optional(),
    lastName: z.string().min(2, 'Фамилия должна состоять минимум из 2 символов').optional(),
    phoneNumber: z
        .string()
        .regex(/^(\+7|8)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/, 'Неверный формат телефона')
        .optional()
        .or(z.literal('')),
    avatar: z.string().url('Неверный URL').optional().or(z.literal('')),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;