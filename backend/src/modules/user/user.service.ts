import { userRepository } from './user.repository';
import { UpdateProfileInput, UserResponse } from './user.types';
import { formatPhone } from '../../shared/utils/formatPhone';

export const userService = {
    getProfile: async (userId: string): Promise<UserResponse> => {
        const user = await userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar,
            phoneNumber: user.phoneNumber,
            emailVerified: user.emailVerified,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            lastLogin: user.lastLogin,
        };
    },

    updateProfile: async (userId: string, input: UpdateProfileInput): Promise<UserResponse> => {
        const existingUser = await userRepository.findById(userId);
        if (!existingUser) {
            throw new Error('User not found');
        }

        const updateData: Partial<{
            firstName: string;
            lastName: string;
            phoneNumber: string;
            avatar: string;
        }> = {};

        if (input.firstName !== undefined) {
            updateData.firstName = input.firstName;
        }
        if (input.lastName !== undefined) {
            updateData.lastName = input.lastName;
        }
        if (input.phoneNumber !== undefined) {
            updateData.phoneNumber = input.phoneNumber ? formatPhone(input.phoneNumber) : '';
        }
        if (input.avatar !== undefined) {
            updateData.avatar = input.avatar;
        }

        if (Object.keys(updateData).length === 0) {
            throw new Error('No data to update');
        }

        const updatedUser = await userRepository.update(userId, updateData);

        return {
            id: updatedUser.id,
            email: updatedUser.email,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            avatar: updatedUser.avatar,
            phoneNumber: updatedUser.phoneNumber,
            emailVerified: updatedUser.emailVerified,
            role: updatedUser.role,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt,
            lastLogin: updatedUser.lastLogin,
        };
    },
};