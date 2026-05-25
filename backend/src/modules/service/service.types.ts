export interface CreateServiceDto {
    companyId?: string;
    name: string;
    description?: string;
    duration: number;
    price: number;
    currency: string;
    cost?: number;
    isActive: boolean;
}