export const ROUTES = {
    LANDING: '/',
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        VERIFY_EMAIL_PENDING: '/auth/verify-email-pending',
        VERIFY_EMAIL: '/auth/verify-email'
    },
    HOME: {
        DASHBOARD: '/home/dashboard',
        COMPANY_DASHBOARD: '/home/dashboard/:slug',
    },
    NOT_FOUND: '*',
} as const;

export type AppRoutes = typeof ROUTES[keyof typeof ROUTES];