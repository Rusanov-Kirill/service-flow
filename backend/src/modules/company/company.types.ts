export interface CreateCompanyDto {
    name: string;
    slug: string;
    description?: string;
    tags: string[];
    timezone: string;
    city: string;
    currency: string;
    address?: string;
    logo?: string;
    phone?: string;
    email?: string;
    website?: string;
    ownerId: string;
    bookingLeadDays: number;
    workScheduleType: WorkScheduleType;
    defaultStartTime: string;
    defaultEndTime: string;
    customWorkDays?: CustomWorkDay[];
    holidays: Date[];
    autoConfirmBooking: boolean;
    paymentMethods: PaymentMethod;
}

export type WorkScheduleType = 'FIVE_TWO' | 'EVERY_DAY' | 'CUSTOM';
export type PaymentMethod = 'CASH' | 'PREPAYMENT' | 'BOTH';

interface CustomWorkDay {
    dayOfWeek: number; 
    startTime: string; 
    endTime: string;   
}