import { Router } from 'express';
import { companyMemberController } from './company_member.controller';

const router = Router();

router.get('/:id', companyMemberController.getById);
router.post('/', companyMemberController.create);
router.put('/:id', companyMemberController.update);
router.delete('/:id', companyMemberController.delete);

export default router;