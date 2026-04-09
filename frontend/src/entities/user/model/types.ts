import type { Company } from "@/entities/company";

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    phoneNumber?: string;
    emailVerified: boolean;
    role?: 'user' | 'admin' | 'owner';
    companies: Company[]
    isActive?: boolean;
    lastLogin?: string;
    createdAt?: string;
}