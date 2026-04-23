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

    findById: async (id: string) => {
        const customer = await customerRepository.findById(id);
        if (!customer) {
            throw new Error('Клиент не найден');
        }
        return customer;
    },
};