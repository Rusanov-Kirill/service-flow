export interface CreateCustomerDto {
    userId: string;
    companyId: string;
    email: string;
}

export interface CustomerResponse {
    id: string;
    userId: string | null;
    companyId: string;
    email: string;
    totalBookings: number;
    createdAt: Date;
    updatedAt: Date;
}