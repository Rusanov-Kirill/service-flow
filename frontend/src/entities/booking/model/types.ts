export interface Booking {
    companyId: string;
    serviceId: string;
    startTime: Date;
    endTime: Date;
    totalPrice: number;
    status: BookingStatus;
}

export interface CreateCustomerDto {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
}

export interface UpdateBookingDto {
    startTime?: Date;
    endTime?: Date;
    status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    totalPrice?: number;
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';