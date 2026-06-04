import { Navigate } from 'react-router-dom';

import { ROUTES } from '@/app/router/config';
import { useAuthStore } from '@/entities/user/store/useAuthStore';

interface Props {
    children: React.ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
    const { accessToken, isInitialized } = useAuthStore();
    
    const content = (() => {
        if (!isInitialized) return <div>Loading...</div>;
        if (!accessToken) return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
        return children;
    })();
    
    return <>{content}</>;
};

export default ProtectedRoute;