export interface CreateBookingDto {
    companyId: string;
    customerId: string;
    serviceId: string;
    startTime: Date;
    endTime: Date;
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export interface UpdateBookingDto {
    startTime?: Date;
    endTime?: Date;
    status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    totalPrice?: number;
}