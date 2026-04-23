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
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
        });

        await customerService.incrementTotalBookings(customer.id);

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
};