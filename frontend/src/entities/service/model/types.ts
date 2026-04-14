import type { CurrenciesType } from "@/shared/utils/selectorValues";

export interface ClientService {
    id: string;
    name: string;
    description?: string;
    duration: number;
    price: number;
    currency: CurrenciesType;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date | null;
}

export interface Service extends ClientService {
    companyId: string;
}