import { create } from 'zustand';

import type { User } from '@/entities/user';

interface AuthStore {
    accessToken: string | null;
    user: User | null;
    isInitialized: boolean;
    setAuth: (token: string, user: User | null) => void;
    logout: () => void;
    setInitialized: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    accessToken: null,
    user: null,
    isInitialized: false,

    setAuth: (token, user) => set({ accessToken: token, user }),
    logout: () => set({ accessToken: null, user: null }),
    setInitialized: () => set({ isInitialized: true }),
}));