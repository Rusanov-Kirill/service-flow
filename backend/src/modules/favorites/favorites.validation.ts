import { z } from 'zod';

export const addFavoriteSchema = z.object({
    companyId: z.string().uuid('Неверный формат companyId'),
});

export type AddFavoriteInput = z.infer<typeof addFavoriteSchema>;

export const checkFavoriteSchema = z.object({
    companyId: z.string().uuid('Неверный формат companyId'),
});