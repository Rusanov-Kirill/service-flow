import { randomBytes } from 'crypto';
import { hashPassword, comparePassword } from '../../shared/utils/bcrypt';
import { generateAccessToken, generateRefreshToken } from '../../shared/utils/jwt';
import { emailService } from '../../shared/utils/email.service';
import { authRepository } from './auth.repository';
import { AuthResponse } from './auth.types';
import { RegisterInput, LoginInput } from './auth.validation';

export const authService = {
    register: async (input: RegisterInput): Promise<AuthResponse> => {
        const existingUser = await authRepository.findByEmail(input.email);
        if (existingUser) {
            throw new Error('User already exists');
        }

        const passwordHash = await hashPassword(input.password);

        const user = await authRepository.create({
            email: input.email,
            passwordHash,
            firstName: input.firstName,
            lastName: input.lastName
        });

        const verificationToken = randomBytes(32).toString('hex');
        const verificationExpiresAt = new Date();
        verificationExpiresAt.setHours(verificationExpiresAt.getHours() + 24);

        await authRepository.updateVerificationToken(user.id, verificationToken, verificationExpiresAt);

        emailService.sendVerificationEmail(user.email, verificationToken).catch(err => {
            console.error('Failed to send verification email:', err);
        });

        const payload = { userId: user.id, email: user.email };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await authRepository.createSession({
            userId: user.id,
            refreshToken,
            expiresAt
        });

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName ?? '',
                lastName: user.lastName ?? '',
                emailVerified: user.emailVerified,
                avatar: user.avatar ?? '',
                phoneNumber: user.phoneNumber ?? '',
                lastLogin: user.lastLogin,
                createdAt: user.createdAt,
            }
        };
    },

    login: async (input: LoginInput): Promise<AuthResponse> => {
        const user = await authRepository.findByEmail(input.email);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        if (!user.passwordHash) {
            throw new Error('Account created via OAuth. Please use Google/GitHub login');
        }

        const isPasswordValid = await comparePassword(input.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        if (!user.emailVerified) {
            throw new Error('Please verify your email first');
        }

        await authRepository.updateLastLogin(user.id);

        const payload = { userId: user.id, email: user.email };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        await authRepository.deleteAllUserSessions(user.id);

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await authRepository.createSession({
            userId: user.id,
            refreshToken,
            expiresAt
        });

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName ?? '',
                lastName: user.lastName ?? '',
                emailVerified: user.emailVerified,
                avatar: user.avatar ?? '',
                phoneNumber: user.phoneNumber ?? '',
                lastLogin: user.lastLogin,
                createdAt: user.createdAt,
            }
        };
    },

    refresh: async (refreshToken: string): Promise<{ accessToken: string }> => {
        const session = await authRepository.findSessionByRefreshToken(refreshToken);
        if (!session) {
            throw new Error('Invalid refresh token');
        }

        if (session.expiresAt < new Date()) {
            await authRepository.deleteSession(refreshToken);
            throw new Error('Refresh token expired');
        }

        const payload = { userId: session.userId, email: session.user.email };
        const accessToken = generateAccessToken(payload);

        return { accessToken };
    },

    logout: async (refreshToken: string): Promise<void> => {
        await authRepository.deleteSession(refreshToken);
    },

    verifyEmail: async (token: string): Promise<AuthResponse> => {
        const user = await authRepository.verifyEmail(token);

        if (!user) {
            throw new Error('Invalid or expired verification token');
        }

        const payload = { userId: user.id, email: user.email };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await authRepository.createSession({
            userId: user.id,
            refreshToken,
            expiresAt
        });

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName ?? '',
                lastName: user.lastName ?? '',
                emailVerified: user.emailVerified,
                avatar: user.avatar ?? '',
                phoneNumber: user.phoneNumber ?? '',
                lastLogin: user.lastLogin,
                createdAt: user.createdAt,
            }
        };
    },

    resendVerification: async (email: string): Promise<void> => {
        const user = await authRepository.findByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }

        if (user.emailVerified) {
            throw new Error('Email already verified');
        }

        const verificationToken = randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        await authRepository.updateVerificationToken(user.id, verificationToken, expiresAt);
        await emailService.sendVerificationEmail(user.email, verificationToken);
    }
};