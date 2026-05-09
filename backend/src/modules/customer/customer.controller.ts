import { Request, Response } from 'express';
import { customerService } from './customer.service';
import {
    findOrCreateCustomerSchema,
    findByUserAndCompanySchema,
    getAllCustomersByCompanyIdSchema,
    getCustomerByEmailSchema,
    updateCustomerSchema
} from './customer.validation';

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

    update: async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;

            const customerId = Array.isArray(id) ? id[0] : id;

            if (!customerId) {
                return res.status(400).json({
                    success: false,
                    error: 'ID клиента обязателен'
                });
            }

            const result = updateCustomerSchema.safeParse(req.body);

            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    error: result.error.issues[0]?.message || 'Ошибка валидации'
                });
            }

            const updatedCustomer = await customerService.update(customerId, result.data);

            return res.status(200).json({
                success: true,
                data: updatedCustomer
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

    getAllCustomersByCompanyId: async (req: Request, res: Response): Promise<Response> => {
        try {
            const result = getAllCustomersByCompanyIdSchema.safeParse({
                companyId: req.query['companyId'],
            });

            if (!result.success) {
                return res.status(400).json({
                    error: result.error.issues[0]?.message || 'Ошибка валидации'
                });
            }

            const { companyId } = result.data;
            const customers = await customerService.getAllCustomersByCompanyId(companyId);

            return res.status(200).json({
                success: true,
                data: customers
            });
        } catch (error: any) {
            if (error.message === 'Клиентов не найдено') {
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

    getCustomerByEmail: async (req: Request, res: Response): Promise<Response> => {
        try {
            const result = getCustomerByEmailSchema.safeParse({
                companyId: req.query['companyId'],
                email: req.query['email'],
            });

            if (!result.success) {
                return res.status(400).json({
                    error: result.error.issues[0]?.message || 'Ошибка валидации'
                });
            }

            const { companyId, email } = result.data;
            const customer = await customerService.getCustomerByEmail(companyId, email);

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