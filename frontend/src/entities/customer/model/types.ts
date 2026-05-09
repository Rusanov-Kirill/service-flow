export interface Customer {
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
    user?: CustomerUserPreview;
    createdAt: Date;
    updatedAt: Date;
}

export interface UpdateCustomerDto {
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

export interface CustomerUserPreview {
    firstName: string | null;
    lastName: string | null;
    avatar: string | null;
};

export type CustomerStatus = 'active' | 'inactive' | 'blocked';
type TimeOfDay = 'morning' | 'afternoon' | 'evening';