import { useEffect } from 'react';

import { useAuthStore } from '@/app/store/authStore';
import { authApi } from '@/shared/api/authApi';

export const useInitAuth = () => {
    const setAuth = useAuthStore((state) => state.setAuth);
    const logout = useAuthStore((state) => state.logout);
    const setInitialized = useAuthStore((s) => s.setInitialized);

    useEffect(() => {
        const init = async () => {
            try {
                const response = await authApi.refresh();

                if (response.data.success) {
                    setAuth(
                        response.data.data.accessToken,
                        response.data.data.user
                    );
                }
            } catch {
                logout();
            } finally {
                setInitialized();
            }
        };

        init();
    }, [setAuth, logout, setInitialized]);
};