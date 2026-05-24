import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import { ROUTES } from './config';
import GuestRoute from './GuestRoute';
import LazyRoute from './LazyRoute';

const HomePage = lazy(() => import('@/pages/landing'));
const AuthPage = lazy(() => import('@/pages/auth'));
const VerifyEmailPendingPage = lazy(() => import('@/pages/verify-email-pending'));
const VerifyEmailPage = lazy(() => import('@/pages/verify-email'));
const DashboardPage = lazy(() => import('@/pages/dashboard'));
const DashboardMain = lazy(() => import('@/widgets/dashboard/dashboard-main'));
const Profile = lazy(() => import('@/widgets/dashboard/profile'));
const Companies = lazy(() => import('@/widgets/dashboard/companies'));
const CreateCompany = lazy(() => import('@/features/create-company'));
const CompanySettings = lazy(() => import('@/features/company-settings'));
const FavoriteCompanies = lazy(() => import('@/widgets/dashboard/favorite-companies'));
const MyBookings = lazy(() => import('@/widgets/dashboard/my-bookings'));

export const router = createBrowserRouter([
    {
        path: ROUTES.LANDING,
        element: (
            <LazyRoute>
                <HomePage />
            </LazyRoute>
        ),
    },
    {
        path: ROUTES.AUTH.LOGIN,
        element: (
            <GuestRoute>
                <LazyRoute>
                    <AuthPage variant="login" />
                </LazyRoute>
            </GuestRoute>
        ),
    },
    {
        path: ROUTES.AUTH.REGISTER,
        element: (
            <GuestRoute>
                <LazyRoute>
                    <AuthPage variant="register" />
                </LazyRoute>
            </GuestRoute>
        ),
    },
    {
        path: ROUTES.AUTH.VERIFY_EMAIL_PENDING,
        element: (
            <LazyRoute>
                <VerifyEmailPendingPage />
            </LazyRoute>
        ),
    },
    {
        path: ROUTES.AUTH.VERIFY_EMAIL,
        element: (
            <LazyRoute>
                <VerifyEmailPage />
            </LazyRoute>
        ),
    },
    {
        path: ROUTES.NOT_FOUND,
        element: <Navigate to={ROUTES.LANDING} replace />,
    },
    {
        path: ROUTES.HOME.ROOT,
        element: (
            <LazyRoute>
                <DashboardPage />
            </LazyRoute>
        ),
        children: [
            {
                index: true,
                element: <Navigate to={ROUTES.HOME.MY_PROFILE} replace />,
            },
            {
                path: ROUTES.HOME.DASHBOARD,
                element: (
                    <LazyRoute>
                        <DashboardMain />
                    </LazyRoute>
                ),
            },
            {
                path: ROUTES.HOME.COMPANY_DASHBOARD,
                element: (
                    <LazyRoute>
                        <DashboardMain />
                    </LazyRoute>
                ),
            },
            {
                path: ROUTES.HOME.MY_PROFILE,
                element: (
                    <LazyRoute>
                        <Profile />
                    </LazyRoute>
                ),
            },
            {
                path: ROUTES.HOME.MY_COMPANIES,
                element: (
                    <LazyRoute>
                        <Companies />
                    </LazyRoute>
                ),
            },
            {
                path: ROUTES.HOME.CREATE_COMPANY,
                element: (
                    <LazyRoute>
                        <CreateCompany />
                    </LazyRoute>
                ),
            },
            {
                path: ROUTES.HOME.FAVORITE_COMPANIES,
                element: (
                    <LazyRoute>
                        <FavoriteCompanies />
                    </LazyRoute>
                ),
            },
            {
                path: ROUTES.HOME.MY_BOOKINGS,
                element: (
                    <LazyRoute>
                        <MyBookings />
                    </LazyRoute>
                ),
            },
            {
                path: ROUTES.HOME.COMPANY_SETTINGS,
                element: (
                    <LazyRoute>
                        <CompanySettings />
                    </LazyRoute>
                ),
            },
        ],
    },
]);