import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import { ROUTES } from './config';
import GuestRoute from './GuestRoute';

const HomePage = lazy(() => import('@/pages/home'));
const AuthPage = lazy(() => import('@/pages/auth'));
const VerifyEmailPendingPage = lazy(() => import('@/pages/verify-email-pending'));
const VerifyEmailPage = lazy(() => import('@/pages/verify-email'));
const DashboardPage = lazy(() => import('@/pages/dashboard'));


export const router = createBrowserRouter([
    {
        path: ROUTES.HOME,
        element: (
            <HomePage />
        ),
    },
    {
        path: ROUTES.AUTH.LOGIN,
        element: (
            <GuestRoute>
                <AuthPage variant="login" />
            </GuestRoute>
        ),
    },
    {
        path: ROUTES.AUTH.REGISTER,
        element: (
            <GuestRoute>
                <AuthPage variant="register" />
            </GuestRoute>
        ),
    },
    {
        path: ROUTES.AUTH.VERIFY_EMAIL_PENDING,
        element: <VerifyEmailPendingPage />,
    },
    {
        path: ROUTES.AUTH.VERIFY_EMAIL,
        element: <VerifyEmailPage />,
    },
    {
        path: ROUTES.NOT_FOUND,
        element: <Navigate to={ROUTES.HOME} replace />,
    },
    {
        path: ROUTES.DASHBOARD,
        element: <DashboardPage />,
    },
]);