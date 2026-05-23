export const ROUTES = {
    LANDING: '/',
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        VERIFY_EMAIL_PENDING: '/auth/verify-email-pending',
        VERIFY_EMAIL: '/auth/verify-email'
    },
    HOME: {
        ROOT: '/home',

        DASHBOARD: 'dashboard',
        COMPANY_DASHBOARD: 'dashboard/:slug',
        MY_PROFILE: 'profile',
        MY_COMPANIES: 'companies',
        CREATE_COMPANY: 'companies/create',
        FAVORITE_COMPANIES: 'favorite',
        MY_BOOKINGS: 'my-bookings',
        COMPANY_SETTINGS: 'companies/:slug/settings',
    },
    NOT_FOUND: '*',
} as const;

export type AppRoutes = typeof ROUTES[keyof typeof ROUTES];