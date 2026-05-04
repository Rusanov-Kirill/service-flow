import { Router } from 'express';
import { companyController } from './company.controller';
import { companyMemberController } from '../company_member/company_member.controller';

const router = Router();

router.get('/slug/:slug', companyController.getBySlug);

router.get('/:companyId/members', companyMemberController.getAllByCompanyId);
router.get('/:companyId/members/email/:email', companyMemberController.getByEmail);
router.get('/:companyId/members/user/:userId', companyMemberController.getByUserId);

router.patch('/:id', companyController.update);
router.get('/:id', companyController.getById);
router.get('/', companyController.getAll);
router.post('/', companyController.createWithServices);

export default router;