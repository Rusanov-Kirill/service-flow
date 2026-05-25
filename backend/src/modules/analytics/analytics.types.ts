export type Period = 'day' | 'week' | 'month' | 'year';

export interface AnalyticsFilters {
    startDate: Date;
    endDate: Date;
    period?: Period;
}

export interface RevenueResponse {
    totalRevenue: number;
    averageCheck: number;
    bookingsCount: number;
    periodData: {
        date: string;
        revenue: number;
        bookingsCount: number;
    }[];
}

export interface TopService {
    serviceId: string;
    serviceName: string;
    bookingsCount: number;
    revenue: number;
    percentage: number;
}

export interface PopularTimeSlot {
    dayOfWeek: number;
    dayName: string;
    bookingsCount: number;
    revenue: number;
}

export interface StatusDistribution {
    status: string;
    count: number;
    percentage: number;
}

export interface FinanceResponse {
    totalRevenue: number;
    totalExpenses: number;
    totalCost: number; 
    grossProfit: number; 
    netProfit: number; 
    profitMargin: number; 
    taxAmount?: number; 
}

export interface CustomerAnalyticsResponse {
    totalCustomers: number;
    activeCustomers: number;
    inactiveCustomers: number;
    blockedCustomers: number;
    newCustomers: number; 
    returningCustomers: number; 
    topCustomers: {
        customerId: string;
        customerName: string;
        totalSpent: number;
        bookingsCount: number;
    }[];
}