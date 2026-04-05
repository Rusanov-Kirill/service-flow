import { Navigate } from 'react-router-dom';

import { ROUTES } from '@/app/router/config';
import { useAuthStore } from '@/app/store/useAuthStore';

interface Props {
    children: React.ReactNode;
}

const GuestRoute = ({ children }: Props) => {
    const { accessToken, isInitialized } = useAuthStore();

    if (!isInitialized) {
        return <div>Loading...</div>;
    }

    if (accessToken) {
        return <Navigate to={ROUTES.HOME} replace />;
    }

    return children;
};

export default GuestRoute;