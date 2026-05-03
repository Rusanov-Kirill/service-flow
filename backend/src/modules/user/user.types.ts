import type { MemberRole } from "../company_member/company_member.types";

export interface UpdateProfileInput {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    avatar?: string;
}

export interface UserResponse {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    avatar: string | null;
    phoneNumber: string | null;
    emailVerified: boolean;
    role: string;
    createdAt: Date;
    updatedAt: Date;
    lastLogin: Date | null,
}

export interface UserCompaniesResponse {
    role: MemberRole;
    name: string;
    slug: string;
    city: string;
    logo: string | null;
}