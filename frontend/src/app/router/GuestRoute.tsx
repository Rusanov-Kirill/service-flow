import { Navigate } from 'react-router-dom';

import { ROUTES } from '@/app/router/config';
import { useAuthStore } from '@/entities/user/store/useAuthStore';

interface Props {
    children: React.ReactNode;
}

const GuestRoute = ({ children }: Props) => {
    const { accessToken, isInitialized } = useAuthStore();
    
    const content = (() => {
        if (!isInitialized) return <div>Loading...</div>;
        if (accessToken) return <Navigate to={ROUTES.HOME.ROOT} replace />;
        return children;
    })();
    
    return <>{content}</>;
};

export default GuestRoute;