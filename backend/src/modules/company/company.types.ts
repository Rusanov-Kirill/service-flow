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
}