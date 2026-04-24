import { useNavigate } from "react-router-dom";

import { useAuthStore } from "@/entities/user/store/useAuthStore";
import { authApi } from "@/entities/user/api/authApi";

export const useLogout = () => {
    const navigate = useNavigate();
    const { logout } = useAuthStore();

    return async () => {
        try {
            await authApi.logout();
        } catch (error) {
            console.error('Logout API error:', error);
        } finally {
            logout();
            navigate('/');
        }
    };
};