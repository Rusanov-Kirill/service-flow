import { prisma } from '../../shared/database/prisma';
import { customerRepository } from './customer.repository';
import { CreateCustomerDto } from './customer.types';

export const customerService = {
    findOrCreate: async (data: CreateCustomerDto) => {
        let customer = await customerRepository.findByUserAndCompany(
            data.userId,
            data.companyId
        );

        if (!customer) {
            customer = await customerRepository.create(data);
        }

        return customer;
    },

    incrementTotalBookings: async (customerId: string) => {
        return customerRepository.incrementTotalBookings(customerId);
    },

    incrementTotalSpent: async (customerId: string, servicePrice: number) => {
        return customerRepository.incrementTotalSpent(customerId, servicePrice);
    },

    findById: async (id: string) => {
        const customer = await customerRepository.findById(id);
        if (!customer) {
            throw new Error('Клиент не найден');
        }
        return customer;
    },

    findByUserAndCompany: async (userId: string, companyId: string) => {
        let customer = await customerRepository.findByUserAndCompany(
            userId,
            companyId
        );

        if (!customer) throw Error('Клиент не найден');

        return customer;
    },

    getAllCustomersByCompanyId: async (companyId: string) => {
        let customers = await customerRepository.getAllCustomersByCompanyId(companyId);

        if (!customers || customers.length === 0) throw Error("В данной компании клиентов не найдено");

        return customers;
    },

    updatePreferences: async (customerId: string) => {
        const bookings = await prisma.booking.findMany({
            where: {
                customerId: customerId,
                status: {
                    not: 'cancelled',
                },
            },
            select: {
                serviceId: true,
                startTime: true,
            },
        });

        if (bookings.length === 0) {
            return {
                preferredServiceIds: [],
                preferredStaffIds: [],
                preferredWeekDays: [],
            };
        }

        const serviceFrequency = new Map<string, number>();
        bookings.forEach(booking => {
            if (booking.serviceId) {
                serviceFrequency.set(
                    booking.serviceId,
                    (serviceFrequency.get(booking.serviceId) || 0) + 1
                );
            }
        });

        const preferredServiceIds = Array.from(serviceFrequency.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([serviceId]) => serviceId);

        /*
        const staffFrequency = new Map<string, number>();
        bookings.forEach(booking => {
            if (booking.companyMember?.userId) {
                staffFrequency.set(
                    booking.companyMember.userId,
                    (staffFrequency.get(booking.companyMember.userId) || 0) + 1
                );
            }
        });

        const preferredStaffIds = Array.from(staffFrequency.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([staffId]) => staffId);
        */

        const weekdayFrequency = new Map<number, number>();
        bookings.forEach(booking => {
            if (booking.startTime) {

                let dayOfWeek = booking.startTime.getDay();
                if (dayOfWeek === 0) dayOfWeek = 7;

                weekdayFrequency.set(
                    dayOfWeek,
                    (weekdayFrequency.get(dayOfWeek) || 0) + 1
                );
            }
        });

        let maxFrequency = 0;
        weekdayFrequency.forEach((count) => {
            if (count > maxFrequency) {
                maxFrequency = count;
            }
        });

        const preferredWeekDays = Array.from(weekdayFrequency.entries())
            .filter(([, count]) => count === maxFrequency)
            .map(([day]) => day)
            .sort((a, b) => a - b);

        const updatedCustomer = await customerRepository.updatePreferences(customerId, {
            preferredServiceIds,
            preferredStaffIds: [],
            preferredWeekDays,
        });

        return {
            preferredServiceIds,
            preferredStaffIds: [],
            preferredWeekDays,
            updatedCustomer,
        };
    },

    updatePreferencesAfterBooking: async (customerId: string) => {
        setImmediate(async () => {
            try {
                await customerService.updatePreferences(customerId);
            } catch (error) {
                console.error('Ошибка обновления предпочтений клиента:', error);
            }
        });
    },
};