export interface CreateCustomerDto {
    userId: string;
    companyId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
}

export interface CustomerResponse {
    id: string;
    userId: string | null;
    companyId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    totalBookings: number;
    createdAt: Date;
    updatedAt: Date;
}