import { favoritesRepository } from './favorites.repository';
import { AddFavoriteDto } from './favorites.types';
import { companyRepository } from '../company/company.repository';

export const favoritesService = {
    getUserFavorites: async (userId: string) => {
        const favorites = await favoritesRepository.findUserFavorites(userId);
        return favorites.map(f => f.company);
    },

    addFavorite: async (userId: string, data: AddFavoriteDto) => {
        const company = await companyRepository.findById(data.companyId);
        if (!company) {
            throw new Error('Компания не найдена');
        }

        const existing = await favoritesRepository.findFavorite(userId, data.companyId);
        if (existing) {
            throw new Error('Компания уже в избранном');
        }

        const favorite = await favoritesRepository.addFavorite(userId, data);
        return favorite.company;
    },

    removeFavorite: async (userId: string, companyId: string) => {
        const favorite = await favoritesRepository.findFavorite(userId, companyId);
        if (!favorite) {
            throw new Error('Компания не найдена в избранном');
        }

        await favoritesRepository.removeFavorite(userId, companyId);
        return { success: true };
    },

    checkFavorite: async (userId: string, companyId: string) => {
        return favoritesRepository.isFavorite(userId, companyId);
    },
};