import { Request, Response, NextFunction } from 'express';
import { prisma } from '../database/prisma'; 

export const checkCompanyOwner = async (req: Request, res: Response, next: NextFunction) => {
    const companyId = req.params['companyId'];
    const userId = (req as any).user.id;

    if (!companyId || typeof companyId !== 'string') {
        res.status(400).json({ error: 'Company ID is required' });
        return;
    };

    if (!userId || typeof userId !== 'string') {
        res.status(401).json({ error: 'User not authenticated' });
        return;
    };
    
    const company = await prisma.company.findFirst({
        where: { id: companyId, ownerId: userId }
    });
    
    if (!company) {
        res.status(403).json({ error: 'Access denied' });
        return;
    }
    
    next();
};