import { prisma } from '../../shared/database/prisma';
import { CreateCompanyMemberDto, UpdateCompanyMemberDto } from './company_member.types';
import { ROLE_PERMISSIONS } from '../../shared/utils/rolePermissions';

export const companyMemberRepository = {
    create: async (data: CreateCompanyMemberDto) => {
        const permissions = ROLE_PERMISSIONS[data.role];

        const formattedDate = data.startWorkDay ? (() => {
            const date = new Date(data.startWorkDay);
            date.setUTCHours(0, 0, 0, 0);
            return date;
        })() : undefined;

        return prisma.companyMember.create({
            data: {
                userId: data.userId,
                companyId: data.companyId,
                role: data.role,
                permissions: permissions,
                scheduleType: data.scheduleType,
                startWorkTime: data.startWorkTime,
                endWorkTime: data.endWorkTime,
                startWorkDay: formattedDate,
                customWorkSchedule: data.customWorkSchedule as any,
            }
        });
    },

    update: async (id: string, data: UpdateCompanyMemberDto) => {
        let updateData: any = { ...data };

        if (data.role) {
            updateData.permissions = ROLE_PERMISSIONS[data.role];
        }

        if (data.startWorkDay) {
            const date = new Date(data.startWorkDay);
            date.setUTCHours(0, 0, 0, 0);
            updateData.startWorkDay = date;
        }

        if (data.customWorkSchedule) {
            updateData.customWorkSchedule = data.customWorkSchedule as any;
        }

        return prisma.companyMember.update({
            where: { id },
            data: updateData,
        });
    },

    delete: async (id: string) => {
        return prisma.companyMember.delete({
            where: { id },
        });
    },

    findByEmail: async (companyId: string, email: string) => {
        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true, email: true }
        });

        if (!user) {
            throw new Error('Пользователь с таким email не найден');
        }

        const member = await prisma.companyMember.findUnique({
            where: {
                userId_companyId: {
                    userId: user.id,
                    companyId: companyId
                }
            },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                        avatar: true
                    }
                }
            }
        });

        if (!member) {
            throw new Error('Сотрудник не найден в этой компании');
        }

        return member;
    },

    findByUserId: async (companyId: string, userId: string) => {
        return prisma.companyMember.findUnique({
            where: {
                userId_companyId: {
                    userId: userId,
                    companyId: companyId
                }
            },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                        avatar: true,
                        phoneNumber: true,
                    }
                }
            },
        });
    },

    findById: async (id: string) => {
        return prisma.companyMember.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                        avatar: true,
                        phoneNumber: true,
                    }
                },
                company: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    }
                }
            },
        });
    },

    getAllCompanyMembers: async (companyId: string) => {
        return prisma.companyMember.findMany({
            where: { companyId },
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                        avatar: true
                    }
                }
            },
        });
    },
};