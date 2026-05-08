import { Request, Response } from 'express';
import { companyMemberService } from './company_member.service';
import { createCompanyMemberSchema, updateCompanyMemberSchema } from './company_member.validation';

export const companyMemberController = {
    create: async (req: Request, res: Response): Promise<Response> => {
        try {
            const result = createCompanyMemberSchema.safeParse(req.body);

            if (!result.success) {
                const errorMessage = result.error?.issues?.[0]?.message || 'Ошибка валидации';
                return res.status(400).json({ error: errorMessage });
            }

            const member = await companyMemberService.create(result.data);

            return res.json({
                success: true,
                data: member
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                error: error.message
            });
        }
    },

    update: async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;

            if (!id || typeof id !== 'string') {
                return res.status(400).json({ error: 'Неверный формат id' });
            }

            const result = updateCompanyMemberSchema.safeParse(req.body);

            if (!result.success) {
                const errorMessage = result.error?.issues?.[0]?.message || 'Ошибка валидации';
                return res.status(400).json({ error: errorMessage });
            }

            const member = await companyMemberService.update(id, result.data);

            return res.json(member);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    },

    delete: async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;

            if (!id || typeof id !== 'string') {
                return res.status(400).json({ error: 'Неверный формат id' });
            }

            await companyMemberService.delete(id);

            return res.status(204).send();
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    },

    getById: async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;

            if (!id || typeof id !== 'string') {
                return res.status(400).json({ error: 'Неверный формат id' });
            }

            const member = await companyMemberService.getById(id);

            return res.json(member);
        } catch (error: any) {
            return res.status(404).json({ error: error.message });
        }
    },

    getByEmail: async (req: Request, res: Response): Promise<Response> => {
        try {
            const { companyId, email } = req.params;

            if (!companyId || typeof companyId !== 'string') {
                return res.status(400).json({ error: 'Неверный формат companyId' });
            }

            if (!email || typeof email !== 'string') {
                return res.status(400).json({ error: 'email обязателен' });
            }

            const member = await companyMemberService.getByEmail(companyId, email);

            return res.json(member);
        } catch (error: any) {
            return res.status(404).json({ error: error.message });
        }
    },

    getAllByCompanyId: async (req: Request, res: Response): Promise<Response> => {
        try {
            const { companyId } = req.params;

            if (!companyId || typeof companyId !== 'string') {
                return res.status(400).json({ error: 'Неверный формат companyId' });
            }

            const members = await companyMemberService.getAllByCompanyId(companyId);

            return res.json(members);
        } catch (error: any) {
            return res.status(404).json({ error: error.message });
        }
    },

    getByUserId: async (req: Request, res: Response): Promise<Response> => {
        try {
            const { companyId, userId } = req.params;

            if (!companyId || typeof companyId !== 'string') {
                return res.status(400).json({ error: 'Неверный формат companyId' });
            }

            if (!userId || typeof userId !== 'string') {
                return res.status(400).json({ error: 'Неверный формат userId' });
            }

            const member = await companyMemberService.getByUserId(companyId, userId);

            return res.json(member);
        } catch (error: any) {
            return res.status(404).json({ error: error.message });
        }
    },
};