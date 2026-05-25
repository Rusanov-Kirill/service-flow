import { Request, Response } from 'express';
import { expensesService } from './expenses.service';
import { createExpenseSchema, updateExpenseSchema, expenseIdSchema } from './expenses.validation';

export const expensesController = {
    create: async (req: Request, res: Response): Promise<Response> => {
        try {
            const result = createExpenseSchema.safeParse(req.body);
            
            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    error: result.error.issues[0]?.message || 'Ошибка валидации',
                });
            }
            
            const createData = {
                ...result.data,
                date: result.data.date ? new Date(result.data.date) : new Date(),
            };
            
            const expense = await expensesService.create(createData);
            return res.status(201).json({
                success: true,
                data: expense,
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    },

    update: async (req: Request, res: Response): Promise<Response> => {
        try {
            const idResult = expenseIdSchema.safeParse(req.params);
            if (!idResult.success) {
                return res.status(400).json({
                    success: false,
                    error: 'Неверный формат ID',
                });
            }
            
            const dataResult = updateExpenseSchema.safeParse(req.body);
            if (!dataResult.success) {
                return res.status(400).json({
                    success: false,
                    error: dataResult.error.issues[0]?.message || 'Ошибка валидации',
                });
            }
            
            const updateData: any = { ...dataResult.data };
            if (updateData.date) {
                updateData.date = new Date(updateData.date);
            }
            
            const expense = await expensesService.update(idResult.data.id, updateData);
            return res.json({
                success: true,
                data: expense,
            });
        } catch (error: any) {
            if (error.message === 'Расход не найден') {
                return res.status(404).json({
                    success: false,
                    error: error.message,
                });
            }
            return res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    },

    delete: async (req: Request, res: Response): Promise<Response> => {
        try {
            const idResult = expenseIdSchema.safeParse(req.params);
            if (!idResult.success) {
                return res.status(400).json({
                    success: false,
                    error: 'Неверный формат ID',
                });
            }
            
            await expensesService.delete(idResult.data.id);
            return res.json({
                success: true,
                message: 'Расход удалён',
            });
        } catch (error: any) {
            if (error.message === 'Расход не найден') {
                return res.status(404).json({
                    success: false,
                    error: error.message,
                });
            }
            return res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    },

    getById: async (req: Request, res: Response): Promise<Response> => {
        try {
            const idResult = expenseIdSchema.safeParse(req.params);
            if (!idResult.success) {
                return res.status(400).json({
                    success: false,
                    error: 'Неверный формат ID',
                });
            }
            
            const expense = await expensesService.findById(idResult.data.id);
            return res.json({
                success: true,
                data: expense,
            });
        } catch (error: any) {
            if (error.message === 'Расход не найден') {
                return res.status(404).json({
                    success: false,
                    error: error.message,
                });
            }
            return res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    },

    getByCompany: async (req: Request, res: Response): Promise<Response> => {
        try {
            const { companyId, startDate, endDate } = req.query;
            
            if (!companyId || typeof companyId !== 'string') {
                return res.status(400).json({
                    success: false,
                    error: 'companyId обязателен',
                });
            }
            
            const start = startDate ? new Date(startDate as string) : undefined;
            const end = endDate ? new Date(endDate as string) : undefined;
            
            const data = await expensesService.findByCompanyId(companyId, start, end);
            return res.json({
                success: true,
                data,
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    },

    getTotal: async (req: Request, res: Response): Promise<Response> => {
        try {
            const { companyId, startDate, endDate } = req.query;
            
            if (!companyId || typeof companyId !== 'string') {
                return res.status(400).json({
                    success: false,
                    error: 'companyId обязателен',
                });
            }
            
            const start = startDate ? new Date(startDate as string) : undefined;
            const end = endDate ? new Date(endDate as string) : undefined;
            
            const total = await expensesService.getTotalByCompany(companyId, start, end);
            return res.json({
                success: true,
                data: { total },
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    },

    getByCategory: async (req: Request, res: Response): Promise<Response> => {
        try {
            const { companyId, startDate, endDate } = req.query;
            
            if (!companyId || typeof companyId !== 'string') {
                return res.status(400).json({
                    success: false,
                    error: 'companyId обязателен',
                });
            }
            
            const start = startDate ? new Date(startDate as string) : undefined;
            const end = endDate ? new Date(endDate as string) : undefined;
            
            const data = await expensesService.getGroupedByCategory(companyId, start, end);
            return res.json({
                success: true,
                data,
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    },
};