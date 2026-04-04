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
                const refreshResponse = await authApi.refresh();

                if (refreshResponse.data.success) {
                    const accessToken = refreshResponse.data.data.accessToken;

                    const meResponse = await authApi.meWithToken(accessToken);

                    if (meResponse.data.success) {
                        setAuth(
                            accessToken,
                            meResponse.data.data
                        );
                    }
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