import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/app/router/config';

export const useRedirect = () => {
    const navigate = useNavigate();

    return {
        redirectToLogin: () => navigate(ROUTES.AUTH.LOGIN),
        redirectToRegister: () => navigate(ROUTES.AUTH.REGISTER),
        redirectToHome: () => navigate(ROUTES.HOME),
    };
};