import { analyticsRepository } from './analytics.repository';
import { companyRepository } from '../company/company.repository';

const toNumber = (value: unknown): number => {
    if (value === null || value === undefined) return 0;

    return Number(value);
};

function getWeekNumber(date: Date): number {
    const d = new Date(date);

    d.setHours(0, 0, 0, 0);

    d.setDate(
        d.getDate() + 3 - ((d.getDay() + 6) % 7)
    );

    const week1 = new Date(d.getFullYear(), 0, 4);

    return (
        1 +
        Math.round(
            (
                (
                    d.getTime() -
                    week1.getTime()
                ) /
                86400000 -
                3 +
                ((week1.getDay() + 6) % 7)
            ) /
            7
        )
    );
}

export const analyticsService = {
    getFinanceAnalytics: async (companyId: string, startDate: Date, endDate: Date) => {
        const [bookings, expenses, totalCost] = await Promise.all([
            analyticsRepository.getCompletedBookings(companyId, startDate, endDate),
            analyticsRepository.getExpenses(companyId, startDate, endDate),
            analyticsRepository.getTotalCost(companyId, startDate, endDate),
        ]);

        const totalRevenue = bookings.reduce((sum, b) => sum + toNumber(b.totalPrice), 0);
        const totalExpenses = expenses.reduce((sum, e) => sum + toNumber(e.amount), 0);
        const grossProfit = totalRevenue - totalCost;
        const netProfit = grossProfit - totalExpenses;
        const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

        const company = await companyRepository.findById(companyId);

        let taxAmount: number | undefined;
        if (company?.taxationType === 'SELF_EMPLOYED') {
            taxAmount = totalRevenue * 0.04;
        } else if (company?.taxationType === 'SOLE_PROPRIETOR') {
            taxAmount = totalRevenue * 0.06;
        }

        const finalNetProfit = taxAmount ? netProfit - taxAmount : netProfit;

        return {
            totalRevenue: totalRevenue || 0,
            totalExpenses: totalExpenses || 0,
            totalCost: totalCost || 0,
            grossProfit: grossProfit || 0,
            netProfit: isNaN(finalNetProfit) ? 0 : finalNetProfit,
            profitMargin: isNaN(profitMargin) ? 0 : profitMargin,
            taxAmount: taxAmount || 0,
        };
    },

    getRevenueAnalytics: async (
        companyId: string,
        startDate: Date,
        endDate: Date,
        period: 'day' | 'week' | 'month' = 'day'
    ) => {
        const bookings =
            await analyticsRepository.getCompletedBookings(
                companyId,
                startDate,
                endDate
            );

        const map = new Map<
            string,
            {
                revenue: number;
                bookingsCount: number;
            }
        >();

        for (const booking of bookings) {
            const date = new Date(booking.startTime);

            let key = '';

            if (period === 'day') {
                key = date.toISOString().split('T')[0]!;
            }

            if (period === 'week') {
                key = `${date.getFullYear()}-W${getWeekNumber(date)}`;
            }

            if (period === 'month') {
                key = `${date.getFullYear()}-${String(
                    date.getMonth() + 1
                ).padStart(2, '0')}`;
            }

            const current = map.get(key) || {
                revenue: 0,
                bookingsCount: 0,
            };

            current.revenue += toNumber(
                booking.totalPrice
            );

            current.bookingsCount += 1;

            map.set(key, current);
        }

        const periodData = Array.from(map.entries())
            .map(([date, value]) => ({
                date,
                revenue: value.revenue,
                bookingsCount: value.bookingsCount,
            }))
            .sort((a, b) =>
                a.date.localeCompare(b.date)
            );

        const totalRevenue = periodData.reduce(
            (sum, item) => sum + item.revenue,
            0
        );

        const bookingsCount = periodData.reduce(
            (sum, item) => sum + item.bookingsCount,
            0
        );

        return {
            totalRevenue,

            bookingsCount,

            averageCheck:
                bookingsCount > 0
                    ? totalRevenue / bookingsCount
                    : 0,

            periodData,
        };
    },

    getTopServices: analyticsRepository.getTopServices,

    getStatusDistribution:
        analyticsRepository.getStatusDistribution,

    getPopularDays:
        analyticsRepository.getPopularDays,

    getDashboardStats:
        analyticsRepository.getDashboardStats,
};