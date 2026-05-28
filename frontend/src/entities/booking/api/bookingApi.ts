import { apiClient } from "@/shared/api/client";

import type { UpdateBookingDto, BookingStatus } from "../model/types";

type BookingCreateDto = {
    companyId: string;
    serviceId: string;
    startTime: Date;
    endTime: Date;
    totalPrice: number;
    status: BookingStatus;
    userId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
};

export interface BookingResponse {
    id: string;
    companyId: string;
    customerId: string;
    serviceId: string;
    startTime: string;
    endTime: string;
    status: BookingStatus;
    totalPrice: number;
    createdAt: string;
    updatedAt: string;
    customer: {
        id: string;
        userId: string | null;
        email: string;
        user?: {
            firstName?: string | null;
            lastName?: string | null;
            avatar?: string | null;
        } | null;
    };
    service: {
        id: string;
        name: string;
        duration: number;
        price: number;
        currency: string;
    };
}

export interface UserBooking {
    id: string;
    totalPrice: number;
    startTime: string;
    status: string;
    company: {
        id: string;
        name: string;
        slug: string;
        logo?: string | null;
    };
    service: {
        name: string;
        duration: number;
    };
}

interface BookingsResponse {
    success: boolean;
    data: BookingResponse[];
}

interface UserBookingsResponse {
    success: boolean;
    data: UserBooking[];
}

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

    getAllBookings: async (companyId: string): Promise<BookingsResponse> => {
        const response = await apiClient.get(`/bookings/${companyId}`, {
            params: { companyId }
        });
        return {
            success: response.data.success !== false,
            data: response.data.data || response.data
        };
    },

    getUserBookings: async (userId: string): Promise<UserBookingsResponse> => {
        const response = await apiClient.get(`/bookings/user/${userId}`);
        return response.data;
    },
};