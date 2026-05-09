import { Request, Response } from 'express';
import { customerService } from './customer.service';
import { findOrCreateCustomerSchema, findByUserAndCompanySchema } from './customer.validation';

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

    findByUserAndCompany: async (req: Request, res: Response): Promise<Response> => {
        try {
            const result = findByUserAndCompanySchema.safeParse({
                userId: req.query['userId'],
                companyId: req.query['companyId'],
            });

            if (!result.success) {
                return res.status(400).json({
                    error: result.error.issues[0]?.message || 'Ошибка валидации'
                });
            }

            const { userId, companyId } = result.data;
            const customer = await customerService.findByUserAndCompany(userId, companyId);

            return res.status(200).json({
                success: true,
                data: customer
            });
        } catch (error: any) {
            if (error.message === 'Клиент не найден') {
                return res.status(404).json({
                    success: false,
                    error: error.message
                });
            }
            return res.status(400).json({
                success: false,
                error: error.message
            });
        }
    },
};