import { Request, Response } from 'express';
import { serviceService } from './service.service';
import { createServiceSchema, updateServiceSchema } from './service.validation';

export const serviceController = {
    create: async (req: Request, res: Response): Promise<Response> => {
        try {
            const { companyId } = req.params;
            if (!companyId || typeof companyId !== 'string') {
                return res.status(400).json({ error: 'companyId обязателен и должен быть строкой' });
            }

            const result = createServiceSchema.safeParse(req.body);
            if (!result.success) {
                const errorMessage = result.error.issues[0]?.message || 'Ошибка валидации';
                return res.status(400).json({ error: errorMessage });
            }

            const service = await serviceService.create(companyId, result.data);
            return res.status(201).json(service);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    },

    update: async (req: Request, res: Response): Promise<Response> => {
        try {
            const { serviceId } = req.params;
            if (!serviceId || typeof serviceId !== 'string') {
                return res.status(400).json({ error: 'serviceId обязателен' });
            }

            const result = updateServiceSchema.safeParse(req.body);
            if (!result.success) {
                const errorMessage = result.error.issues[0]?.message || 'Ошибка валидации';
                return res.status(400).json({ error: errorMessage });
            }

            const service = await serviceService.update(serviceId, result.data);
            return res.json(service);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    },

    delete: async (req: Request, res: Response): Promise<Response> => {
        try {
            const { serviceId } = req.params;
            if (!serviceId || typeof serviceId !== 'string') {
                return res.status(400).json({ error: 'serviceId обязателен' });
            }

            await serviceService.delete(serviceId);
            return res.status(204).send();
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    },

    getByCompany: async (req: Request, res: Response): Promise<Response> => {
        try {
            const { companyId } = req.params;
            if (!companyId || typeof companyId !== 'string') {
                return res.status(400).json({ error: 'companyId обязателен' });
            }

            const services = await serviceService.getByCompany(companyId);
            return res.json(services);
        } catch (error: any) {
            return res.status(404).json({ error: error.message });
        }
    },

    getById: async (req: Request, res: Response): Promise<Response> => {
        try {
            const { serviceId } = req.params;
            if (!serviceId || typeof serviceId !== 'string') {
                return res.status(400).json({ error: 'serviceId обязателен' });
            }

            const service = await serviceService.getById(serviceId);
            return res.json(service);
        } catch (error: any) {
            return res.status(404).json({ error: error.message });
        }
    },
};