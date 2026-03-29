import { z } from 'zod';

export const registerSchema = z.object({
    firstName: z.string().min(2, 'Имя должно состоять минимум из 2 символов'),
    lastName: z.string().min(2, 'Фамилия должна состоять минимум из 2 символов'),
    email: z.string().email('Неверный формат email'),
    password: z
        .string()
        .min(8, 'Пароль должен состоять минимум из 8 символов')
        .regex(
            /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{}]*$/,
            'Пароль может содержать только английские буквы, цифры и символы !@#$%^&*()_+-=[]{}'
        )
});

export type RegisterFormData = z.infer<typeof registerSchema>;