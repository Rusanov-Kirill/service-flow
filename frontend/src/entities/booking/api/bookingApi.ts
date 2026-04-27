import { apiClient } from "@/shared/api/client";

import type { Booking, CreateCustomerDto, UpdateBookingDto } from "../model/types";

type BookingCreateDto = Booking & CreateCustomerDto;

export const bookingApi = {
    create: async (data: BookingCreateDto) => {
        const response = await apiClient.post('/bookings', data);
        return response.data;
    },

    update: async (id: string, data: UpdateBookingDto) => {
        const response = await apiClient.patch(`/bookings/${id}`, data);
        return response.data;
    },

    getBookedSlots: async (companyId: string, date: string, serviceId?: string): Promise<string[]> => {
        const params = new URLSearchParams({ date });
        if (serviceId) params.append('serviceId', serviceId);

        const response = await apiClient.get(`/bookings/${companyId}/booked-slots?${params}`);
        return response.data;
    },
};