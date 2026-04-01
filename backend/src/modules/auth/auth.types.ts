export interface Tokens {
    accessToken: string;
    refreshToken: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        emailVerified: boolean;
    };
}