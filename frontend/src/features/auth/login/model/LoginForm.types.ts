import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email('Неверный формат email'),
    password: z.string().min(1, 'Введите пароль')
});

export type LoginFormData = z.infer<typeof loginSchema>;