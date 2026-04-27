import { useNavigate } from "react-router-dom";

import { authApi } from "@/entities/user/api/authApi";
import { useAuthStore } from "@/entities/user/store/useAuthStore";

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