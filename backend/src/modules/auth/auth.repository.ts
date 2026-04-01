import { prisma } from '../../shared/database/prisma';
import { User, Session } from '@prisma/client';

type SessionWithUser = Session & { user: User };

export const authRepository = {
    findByEmail: async (email: string): Promise<User | null> => {
        return prisma.user.findUnique({
            where: { email }
        });
    },

    create: async (data: {
        email: string;
        passwordHash: string;
        firstName: string;
        lastName: string;
    }): Promise<User> => {
        return prisma.user.create({
            data: {
                email: data.email,
                passwordHash: data.passwordHash,
                firstName: data.firstName,
                lastName: data.lastName
            }
        });
    },

    createSession: async (data: {
        userId: string;
        refreshToken: string;
        expiresAt: Date;
    }): Promise<Session> => {
        return prisma.session.create({
            data: {
                userId: data.userId,
                refreshToken: data.refreshToken,
                expiresAt: data.expiresAt
            }
        });
    },

    findSessionByRefreshToken: async (refreshToken: string): Promise<SessionWithUser | null> => {
        return prisma.session.findUnique({
            where: { refreshToken: refreshToken },
            include: { user: true }
        });
    },

    deleteSession: async (refreshToken: string): Promise<void> => {
        await prisma.session.delete({
            where: { refreshToken: refreshToken }
        });
    },

    deleteAllUserSessions: async (userId: string): Promise<void> => {
        await prisma.session.deleteMany({
            where: { userId: userId }
        });
    }
};