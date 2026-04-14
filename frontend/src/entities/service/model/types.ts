import type { CurrenciesType } from "@/shared/utils/selectorValues";

export interface Service {
    id: string;
    companyId: string;
    name: string;
    description?: string;
    duration: number;
    price: number;
    currency: CurrenciesType;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date | null;
}