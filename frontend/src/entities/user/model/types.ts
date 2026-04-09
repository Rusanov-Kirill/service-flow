export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    phoneNumber?: string;
    emailVerified: boolean;
    role?: 'user' | 'admin' | 'owner';
    isActive?: boolean;
    lastLogin?: string;
    createdAt?: string;
}