import { Request, Response } from 'express';
import { serviceService } from './service.service';
import { createServiceSchema } from './service.validation';

export const serviceController = {
    createMany: async (req: Request, res: Response): Promise<Response> => {
        try {
            const services = req.body.services;
            
            if (!services || !Array.isArray(services)) {
                return res.status(400).json({ error: 'Services must be an array' });
            }
            
            for (const service of services) {
                const result = createServiceSchema.safeParse(service);
                if (!result.success) {
                    return res.status(400).json({ 
                        error: `Invalid service data: ${result.error.message}` 
                    });
                }
            }
            
            await serviceService.createMany(services);
            return res.status(201).json({ message: 'Services created successfully' });
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    },
};