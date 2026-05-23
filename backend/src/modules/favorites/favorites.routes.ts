import { Router } from 'express';
import { favoritesController } from './favorites.controller';
import { authMiddleware } from '../../shared/middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', favoritesController.getUserFavorites);
router.post('/', favoritesController.addFavorite);
router.delete('/:companyId', favoritesController.removeFavorite);
router.get('/check/:companyId', favoritesController.checkFavorite);

export default router;