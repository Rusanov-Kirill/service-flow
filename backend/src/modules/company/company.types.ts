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
    taxationType: TaxationType;
    bookingLeadDays: number;
    workScheduleType: WorkScheduleType;
    slotInterval: number;
    defaultStartTime: string;
    defaultEndTime: string;
    customWorkDays?: CustomWorkDay[];
    holidays: string[];
    autoConfirmBooking: boolean;
    paymentMethods: PaymentMethod;
}

export type WorkScheduleType = 'FIVE_TWO' | 'EVERY_DAY' | 'CUSTOM';
export type PaymentMethod = 'CASH' | 'PREPAYMENT' | 'BOTH';

interface CustomWorkDay {
    dayOfWeek: number; 
    startTime: string; 
    endTime: string;   
    slotInterval: number;
}

export type TaxationType = 'SELF_EMPLOYED' | 'SOLE_PROPRIETOR' | 'LEGAL_ENTITY';    
