import { Request, Response } from 'express';
import { customerService } from './customer.service';
import { findOrCreateCustomerSchema } from './customer.validation';

export const customerController = {
    findOrCreate: async (req: Request, res: Response): Promise<Response> => {
        try {
            const result = findOrCreateCustomerSchema.safeParse(req.body);
            
            if (!result.success) {
                return res.status(400).json({ 
                    error: result.error.issues[0]?.message || 'Ошибка валидации'
                });
            }
            
            const customer = await customerService.findOrCreate(result.data);
            return res.json(customer);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    },
};