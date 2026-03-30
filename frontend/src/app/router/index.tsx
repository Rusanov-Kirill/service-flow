import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from './config';

const HomePage = lazy(() => import('@/pages/home'));
const AuthPage = lazy(() => import('@/pages/auth'));

export const router = createBrowserRouter([
    {
        path: ROUTES.HOME,
        element: <HomePage />,
    },
    {
        path: ROUTES.AUTH.LOGIN,
        element: <AuthPage variant="login" />,
    },
    {
        path: ROUTES.AUTH.REGISTER,
        element: <AuthPage variant="register" />,
    },
    {
        path: ROUTES.NOT_FOUND,
        element: <Navigate to={ROUTES.HOME} replace />,
    },
]);