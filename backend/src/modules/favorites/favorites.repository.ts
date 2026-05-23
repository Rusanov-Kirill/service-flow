import { prisma } from '../../shared/database/prisma';
import { AddFavoriteDto } from './favorites.types';

export const favoritesRepository = {
    findUserFavorites: async (userId: string) => {
        return prisma.favorite.findMany({
            where: { userId },
            include: {
                company: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        logo: true,
                        city: true,
                        tags: true,
                        description: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    },

    findFavorite: async (userId: string, companyId: string) => {
        return prisma.favorite.findUnique({
            where: {
                userId_companyId: {
                    userId,
                    companyId,
                },
            },
        });
    },

    addFavorite: async (userId: string, data: AddFavoriteDto) => {
        return prisma.favorite.create({
            data: {
                userId,
                companyId: data.companyId,
            },
            include: {
                company: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        logo: true,
                        city: true,
                        tags: true,
                        description: true,
                    },
                },
            },
        });
    },

    removeFavorite: async (userId: string, companyId: string) => {
        return prisma.favorite.delete({
            where: {
                userId_companyId: {
                    userId,
                    companyId,
                },
            },
        });
    },

    isFavorite: async (userId: string, companyId: string) => {
        const favorite = await prisma.favorite.findUnique({
            where: {
                userId_companyId: {
                    userId,
                    companyId,
                },
            },
        });
        return !!favorite;
    },
};