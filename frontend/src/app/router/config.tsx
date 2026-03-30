export const ROUTES = {
    HOME: '/',
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
    },
    NOT_FOUND: '*',
} as const;

export type AppRoutes = typeof ROUTES[keyof typeof ROUTES];