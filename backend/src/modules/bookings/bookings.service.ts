import { DateTime } from 'luxon';

import { bookingsRepository } from './bookings.repository';
import type { CreateBookingInput, UpdateBookingDto } from './bookings.validation';

import { companyRepository } from '../company/company.repository';
import { customerService } from '../customer/customer.service';
import { serviceRepository } from '../service/service.repository';

export const bookingsService = {
    create: async (data: CreateBookingInput) => {

        const company = await companyRepository.findById(data.companyId);

        if (!company) {
            throw new Error('Компания не найдена');
        }

        const service = await serviceRepository.findById(data.serviceId);

        if (!service) {
            throw new Error('Услуга не найдена');
        }

        let customer = await customerService.findOrCreate({
            userId: data.userId,
            companyId: data.companyId,
            email: data.email,
        });

        await customerService.incrementTotalBookings(customer.id);
        await customerService.incrementTotalSpent(customer.id, data.totalPrice);
        customerService.updatePreferencesAfterBooking(customer.id);

        return bookingsRepository.create({
            companyId: data.companyId,
            customerId: customer.id,
            serviceId: data.serviceId,
            startTime: data.startTime,
            endTime: data.endTime,
            totalPrice: data.totalPrice,
            status: data.status,
        });
    },

    update: async (id: string, data: UpdateBookingDto) => {
        const existingBooking = await bookingsRepository.findById(id);

        if (!existingBooking) {
            throw new Error('Бронирование не найдено');
        }

        return bookingsRepository.update(id, data);
    },

    getBookedSlots: async (companyId: string, date: string, serviceId?: string) => {
        const company = await companyRepository.findById(companyId);
        if (!company) throw new Error('Компания не найдена');

        const tz = company.timezone;
        const targetDate = DateTime.fromISO(date, { zone: tz }).startOf('day');
        const startUtc = targetDate.toUTC();
        const endUtc = targetDate.endOf('day').toUTC();

        const bookings = await bookingsRepository.getBookedSlots(
            companyId,
            startUtc.toJSDate(),
            endUtc.toJSDate(),
            serviceId
        );

        const DAY_END_HOUR = 20;
        const DAY_END_MINUTE = 0;

        const bookedSlotsList: string[] = [];

        for (const booking of bookings) {
            const startLocal = DateTime.fromJSDate(booking.startTime, { zone: 'utc' }).setZone(tz);
            let endLocal = DateTime.fromJSDate(booking.endTime, { zone: 'utc' }).setZone(tz);

            const endOfDay = targetDate.set({ hour: DAY_END_HOUR, minute: DAY_END_MINUTE });

            if (endLocal > endOfDay) endLocal = endOfDay;

            if (startLocal.equals(endLocal)) {
                bookedSlotsList.push(startLocal.toFormat('HH:mm'));
            } else {
                let current = startLocal;
                while (current <= endLocal) {
                    bookedSlotsList.push(current.toFormat('HH:mm'));
                    current = current.plus({ minutes: 30 });
                }
            }
        }

        return [...new Set(bookedSlotsList)];
    },

    findAllCompanyBookings: async (companyId: string) => {
        const bookings = await bookingsRepository.findAllCompanyBookings(companyId);

        if (!bookings) throw Error('Не найдено ни одной записи');

        return bookings;
    },

    findAllUserBookings: async (userId: string) => {
        const bookings = await bookingsRepository.findAllUserBookings(userId);

        if (!bookings || bookings.length === 0) {
            return [];
        }

        return bookings.map(booking => ({
            id: booking.id,
            totalPrice: booking.totalPrice,
            startTime: booking.startTime,
            status: booking.status,
            company: {
                id: booking.company.id,
                name: booking.company.name,
                slug: booking.company.slug,
                logo: booking.company.logo,
            },
            service: {
                name: booking.service.name,
                duration: booking.service.duration,
            }
        }));
    },
};