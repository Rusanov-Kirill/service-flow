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
};