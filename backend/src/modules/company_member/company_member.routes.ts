import { Router } from 'express';
import { companyMemberController } from './company_member.controller';

const router = Router();

router.get('/user/:userId/company/:companyId', companyMemberController.getByUserId);
router.get('/:id', companyMemberController.getById);

router.get('/company/:companyId', companyMemberController.getAllByCompanyId);

router.post('/', companyMemberController.create);
router.patch('/:id', companyMemberController.update);
router.delete('/:id', companyMemberController.delete);

export default router;