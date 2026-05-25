import { prisma } from '../../shared/database/prisma';
import { BookingStatus } from '@prisma/client';

const toNumber = (value: unknown): number => {
    if (value === null || value === undefined) return 0;

    if (typeof value === 'number') return value;

    return Number(value);
};

export const analyticsRepository = {
    getCompletedBookings: async (
        companyId: string,
        startDate: Date,
        endDate: Date
    ) => {
        return prisma.booking.findMany({
            where: {
                companyId,
                status: BookingStatus.completed,
                startTime: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                service: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        cost: true,
                    },
                },
                customer: {
                    select: {
                        id: true,
                        email: true,
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                startTime: 'asc',
            },
        });
    },

    getExpenses: async (
        companyId: string,
        startDate: Date,
        endDate: Date
    ) => {
        return prisma.expense.findMany({
            where: {
                companyId,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            orderBy: {
                date: 'asc',
            },
        });
    },

    getExpensesSum: async (
        companyId: string,
        startDate: Date,
        endDate: Date
    ) => {
        const result = await prisma.expense.aggregate({
            where: {
                companyId,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            _sum: {
                amount: true,
            },
        });

        return toNumber(result._sum.amount);
    },

    getRevenueSum: async (
        companyId: string,
        startDate: Date,
        endDate: Date
    ) => {
        const result = await prisma.booking.aggregate({
            where: {
                companyId,
                status: BookingStatus.completed,
                startTime: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            _sum: {
                totalPrice: true,
            },
        });

        return toNumber(result._sum.totalPrice);
    },

    getTotalCost: async (
        companyId: string,
        startDate: Date,
        endDate: Date
    ) => {
        const bookings = await prisma.booking.findMany({
            where: {
                companyId,
                status: BookingStatus.completed,
                startTime: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            select: {
                service: {
                    select: {
                        cost: true,
                    },
                },
            },
        });

        return bookings.reduce((sum, booking) => {
            return sum + toNumber(booking.service?.cost);
        }, 0);
    },

    getTopServices: async (
        companyId: string,
        startDate: Date,
        endDate: Date,
        limit = 10
    ) => {
        const grouped = await prisma.booking.groupBy({
            by: ['serviceId'],

            where: {
                companyId,
                status: BookingStatus.completed,
                startTime: {
                    gte: startDate,
                    lte: endDate,
                },
            },

            _count: {
                serviceId: true,
            },

            _sum: {
                totalPrice: true,
            },

            orderBy: {
                _sum: {
                    totalPrice: 'desc',
                },
            },

            take: limit,
        });

        const services = await prisma.service.findMany({
            where: {
                id: {
                    in: grouped.map(item => item.serviceId),
                },
            },

            select: {
                id: true,
                name: true,
            },
        });

        const serviceMap = new Map(
            services.map(service => [service.id, service.name])
        );

        const totalRevenue = grouped.reduce((sum, item) => {
            return sum + toNumber(item._sum.totalPrice);
        }, 0);

        return grouped.map(item => {
            const revenue = toNumber(item._sum.totalPrice);

            return {
                serviceId: item.serviceId,
                serviceName:
                    serviceMap.get(item.serviceId) || 'Неизвестная услуга',

                bookingsCount: item._count.serviceId,

                revenue,

                percentage:
                    totalRevenue > 0
                        ? Number(((revenue / totalRevenue) * 100).toFixed(2))
                        : 0,
            };
        });
    },

    getStatusDistribution: async (
        companyId: string,
        startDate: Date,
        endDate: Date
    ) => {
        const grouped = await prisma.booking.groupBy({
            by: ['status'],

            where: {
                companyId,
                startTime: {
                    gte: startDate,
                    lte: endDate,
                },
            },

            _count: {
                status: true,
            },
        });

        const total = grouped.reduce((sum, item) => {
            return sum + item._count.status;
        }, 0);

        return grouped.map(item => ({
            status: item.status,
            count: item._count.status,

            percentage:
                total > 0
                    ? Number(
                          ((item._count.status / total) * 100).toFixed(2)
                      )
                    : 0,
        }));
    },

    getPopularDays: async (
        companyId: string,
        startDate: Date,
        endDate: Date
    ) => {
        const bookings = await prisma.booking.findMany({
            where: {
                companyId,
                status: BookingStatus.completed,
                startTime: {
                    gte: startDate,
                    lte: endDate,
                },
            },

            select: {
                startTime: true,
                totalPrice: true,
            },
        });

        const daysMap = new Map<
            number,
            {
                bookingsCount: number;
                revenue: number;
            }
        >();

        const dayNames: Record<number, string> = {
            0: 'Воскресенье',
            1: 'Понедельник',
            2: 'Вторник',
            3: 'Среда',
            4: 'Четверг',
            5: 'Пятница',
            6: 'Суббота',
        };

        for (const booking of bookings) {
            const day = booking.startTime.getDay();

            const current = daysMap.get(day) || {
                bookingsCount: 0,
                revenue: 0,
            };

            current.bookingsCount += 1;
            current.revenue += toNumber(booking.totalPrice);

            daysMap.set(day, current);
        }

        return Array.from(daysMap.entries()).map(([day, stats]) => ({
            dayOfWeek: day,
            dayName: dayNames[day],
            bookingsCount: stats.bookingsCount,
            revenue: stats.revenue,
        }));
    },

    getDashboardStats: async (companyId: string) => {
        const now = new Date();

        const monthStart = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        );

        const weekStart = new Date(now);

        const day = now.getDay();
        const diff = day === 0 ? 6 : day - 1;

        weekStart.setDate(now.getDate() - diff);
        weekStart.setHours(0, 0, 0, 0);

        const [
            monthRevenue,
            weekRevenue,
            totalCustomers,
            activeBookings,
        ] = await Promise.all([
            analyticsRepository.getRevenueSum(
                companyId,
                monthStart,
                now
            ),

            analyticsRepository.getRevenueSum(
                companyId,
                weekStart,
                now
            ),

            prisma.customer.count({
                where: {
                    companyId,
                },
            }),

            prisma.booking.count({
                where: {
                    companyId,

                    status: {
                        in: [
                            BookingStatus.pending,
                            BookingStatus.confirmed,
                        ],
                    },

                    startTime: {
                        gte: now,
                    },
                },
            }),
        ]);

        return {
            revenueThisMonth: monthRevenue,
            revenueThisWeek: weekRevenue,
            totalCustomers,
            activeBookings,
        };
    },
};