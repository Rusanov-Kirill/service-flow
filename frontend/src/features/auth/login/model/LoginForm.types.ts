import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email('Неверный формат email'),
    password: z
        .string()
        .min(8, 'Пароль должен состоять минимум из 8 символов')
        .regex(
            /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{}]*$/,
            'Пароль может содержать только английские буквы, цифры и символы !@#$%^&*()_+-=[]{}'
        )
});

export type LoginFormData = z.infer<typeof loginSchema>;