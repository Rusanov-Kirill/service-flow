import { z } from 'zod';

export const addMemberSchema = z.object({
    email: z.string().email('Неверный формат email'),
    role:  z.enum(['owner', 'admin', 'manager', 'receptionist', 'member']),
});

export type AddMemberFormData = z.infer<typeof addMemberSchema>;