import { CreateBookingDto, UpdateBookingDto } from './bookings.types';
import { prisma } from '../../shared/database/prisma';

export const bookingsRepository = {
    create: async (data: CreateBookingDto) => {
        return prisma.booking.create({
            data: {
                companyId: data.companyId,
                customerId: data.customerId,
                serviceId: data.serviceId,
                startTime: data.startTime,
                endTime: data.endTime,
                totalPrice: data.totalPrice,
                status: data.status,
            },
            include: {
                service: true,
                customer: true,
            },
        });
    },

    update: async (id: string, data: UpdateBookingDto) => {
        return prisma.booking.update({
            where: { id },
            data: {
                ...data,
                updatedAt: new Date(),
            },
            include: {
                service: true,
                customer: true,
            },
        });
    },

    findById: async (id: string) => {
        return prisma.booking.findUnique({
            where: { id },
        });
    },

    getBookedSlots: async (
        companyId: string,
        start: Date,
        end: Date,
        serviceId?: string
    ) => {
        return prisma.booking.findMany({
            where: {
                companyId,
                ...(serviceId && { serviceId }),
                startTime: {
                    gte: start,
                    lte: end,
                },
                status: {
                    notIn: ['cancelled', 'completed'],
                },
            },
            select: {
                startTime: true,
                endTime: true,
            },
        });
    },

    findAllCompanyBookings: async (companyId: string) => {
        return prisma.booking.findMany({
            where: { companyId },
            include: {
                customer: {
                    include: {
                        user: {
                            select: { firstName: true, lastName: true }
                        }
                    }
                },
                service: {
                    select: { name: true, duration: true }
                }
            }
        })
    },

    findAllUserBookings: async (userId: string) => {
        return prisma.booking.findMany({
            where: {
                customer: {
                    userId: userId
                }
            },
            include: {
                company: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        logo: true,
                    }
                },
                service: {
                    select: {
                        name: true,
                        duration: true
                    }
                },
                customer: {
                    select: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                            }
                        }
                    }
                }
            },
            orderBy: {
                startTime: 'asc'
            }
        });
    },
};