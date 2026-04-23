import { z } from 'zod';

const bookingStatusEnum = z.enum(['pending', 'confirmed', 'completed', 'cancelled']);

export const createBookingSchema = z.object({
    companyId: z.string().uuid('Неверный формат companyId'),
    serviceId: z.string().uuid('Неверный формат serviceId'),
    startTime: z.string().datetime().transform(str => new Date(str)),
    endTime: z.string().datetime().transform(str => new Date(str)),
    totalPrice: z.number()
        .min(0, 'Цена не может быть отрицательной')
        .max(100_000_000, 'Цена не может превышать 100 000 000'),
    status: bookingStatusEnum.default('pending'),

    userId: z.string().uuid('Неверный формат userId'),
    firstName: z.string().min(1, 'Имя обязательно'),
    lastName: z.string().min(1, 'Фамилия обязательна'),
    email: z.string().email('Неверный формат email'),
    phone: z.string().optional(),
});

export const updateBookingSchema = z.object({
    startTime: z.string().datetime().transform(str => new Date(str)).optional(),
    endTime: z.string().datetime().transform(str => new Date(str)).optional(),
    status: bookingStatusEnum.optional(),
    totalPrice: z.number()
        .min(0, 'Цена не может быть отрицательной')
        .max(100_000_000, 'Цена не может превышать 100 000 000')
        .optional(),
});

export const bookingIdSchema = z.object({
    id: z.string().uuid('Неверный формат ID'),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingDto = z.infer<typeof updateBookingSchema>;