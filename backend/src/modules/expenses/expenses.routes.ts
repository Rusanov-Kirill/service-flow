import { Router } from 'express';
import { expensesController } from './expenses.controller';
import { authMiddleware } from '../../shared/middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', expensesController.create);
router.get('/company', expensesController.getByCompany);
router.get('/company/total', expensesController.getTotal);
router.get('/company/categories', expensesController.getByCategory);
router.get('/:id', expensesController.getById);
router.patch('/:id', expensesController.update);
router.delete('/:id', expensesController.delete);

export default router;