import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import { ROUTES } from './config';
import GuestRoute from './GuestRoute';

const HomePage = lazy(() => import('@/pages/landing'));
const AuthPage = lazy(() => import('@/pages/auth'));
const VerifyEmailPendingPage = lazy(() => import('@/pages/verify-email-pending'));
const VerifyEmailPage = lazy(() => import('@/pages/verify-email'));
const DashboardPage = lazy(() => import('@/pages/dashboard'));
const DashboardMain = lazy(() => import('@/widgets/dashboard/dashboard-main'));
const Profile = lazy(() => import('@/widgets/dashboard/profile'));
const Companies = lazy(() => import('@/widgets/dashboard/companies'));


export const router = createBrowserRouter([
    {
        path: ROUTES.LANDING,
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
        element: <Navigate to={ROUTES.LANDING} replace />,
    },
    {
        path: ROUTES.HOME.ROOT,
        element: <DashboardPage />,
        children: [
            {
                index: true,
                element: <Navigate to={ROUTES.HOME.MY_PROFILE} replace />
            },
            {
                path: ROUTES.HOME.DASHBOARD,
                element: <DashboardMain />,
            },
            {
                path: ROUTES.HOME.COMPANY_DASHBOARD,
                element: <DashboardMain />,
            },
            {
                path: ROUTES.HOME.MY_PROFILE,
                element: <Profile />,
            },
            {
                path: ROUTES.HOME.MY_COMPANIES,
                element: <Companies />,
            }
        ],
    },
]);