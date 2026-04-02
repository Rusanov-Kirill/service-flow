import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@app/store/authStore';
import { ROUTES } from '@/app/router/config';

interface Props {
    children: React.ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
    const { accessToken, isInitialized } = useAuthStore();

    if (!isInitialized) {
        return <div>Loading...</div>; 
    }

    if (!accessToken) {
        return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
    }

    return children;
};

export default ProtectedRoute;