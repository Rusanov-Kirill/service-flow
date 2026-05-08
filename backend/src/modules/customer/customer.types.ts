export interface CreateCustomerDto {
    userId: string;
    companyId: string;
    email: string;
    preferredServiceIds?: string[];
    preferredStaffIds?: string[];
    preferredTimeOfDay?: TimeOfDay | null;
    preferredWeekDays?: number[];
    discountRate?: number | null;
    status?: CustomerStatus;
    blacklisted?: boolean;
    blacklistReason?: string | null;
    notes?: string | null;
}

export interface CreateCustomerDbDto extends CreateCustomerDto {
    totalBookings: number;
    totalSpent: number;
    averageCheck: number;
}

export interface CustomerResponse {
    id: string;
    userId: string | null;
    companyId: string;
    email: string;
    preferredServiceIds: string[];
    preferredStaffIds: string[];
    preferredTimeOfDay: TimeOfDay | null;
    preferredWeekDays: number[];
    totalBookings: number;
    totalSpent: number;
    averageCheck: number;
    discountRate: number | null;
    lastBookingDate: Date | null;
    firstBookingDate: Date | null;
    status: CustomerStatus;
    blacklisted: boolean;
    blacklistReason: string | null;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export type CustomerStatus = 'active' | 'inactive' | 'blocked';
export type TimeOfDay = 'morning' | 'afternoon' | 'evening';