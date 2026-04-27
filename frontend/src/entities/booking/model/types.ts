export interface Booking {
    companyId: string;
    serviceId: string;
    startTime: Date;
    endTime: Date;
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
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