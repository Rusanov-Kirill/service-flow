export const ROUTES = {
    HOME: '/',
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        VERIFY_EMAIL_PENDING: '/auth/verify-email-pending',
        VERIFY_EMAIL: '/auth/verify-email'
    },
    DASHBOARD: '/dashboard',
    NOT_FOUND: '*',
} as const;

export type AppRoutes = typeof ROUTES[keyof typeof ROUTES];