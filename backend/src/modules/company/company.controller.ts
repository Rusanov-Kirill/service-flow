import { Request, Response } from 'express';
import { companyService } from './company.service';
import { createCompanySchema } from './company.validation';

export const companyController = {
    createWithServices: async (req: Request, res: Response): Promise<Response> => {
        try {
            const result = createCompanySchema.safeParse(req.body);

            if (!result.success) {
                const errorMessage = result.error?.issues?.[0]?.message || 'Ошибка валидации';
                return res.status(400).json({
                    error: errorMessage
                });
            }

            const { services, ...companyData } = result.data;

            const company = await companyService.createWithServices(
                companyData,
                services || []
            );

            return res.status(201).json(company);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    },

    update: async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;

            if (!id || typeof id !== 'string') {
                return res.status(400).json({ error: 'Неверный формат id' });
            }

            const company = await companyService.update(id, req.body);

            return res.json(company);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    },

    getAll: async (_req: Request, res: Response): Promise<Response> => {
        try {
            const companies = await companyService.getAll();
            return res.json(companies);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    },

    getById: async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;

            if (!id || typeof id !== 'string') {
                return res.status(400).json({ error: 'Неверный формат ownerId' });
            }

            const company = await companyService.getById(id);
            return res.json(company);
        } catch (error: any) {
            return res.status(404).json({ error: error.message });
        }
    },

    getBySlug: async (req: Request, res: Response): Promise<Response> => {
        try {
            const { slug } = req.params;

            if (!slug || typeof slug !== 'string') {
                return res.status(400).json({ error: 'slug обязателен' });
            }

            const company = await companyService.getBySlug(slug);
            return res.json(company);
        } catch (error: any) {
            return res.status(404).json({ error: error.message });
        }
    },
};