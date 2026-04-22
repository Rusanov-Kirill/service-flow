import { create } from 'zustand';

import type { Company } from '@/entities/company';
import { companyApi } from '@/shared/api/companyApi';

type CompanyStore = {
    companies: Company[];
    isLoading: boolean;
    error: string | null;

    lastFetched: number | null;
    staleTime: number;

    fetchCompanies: () => Promise<void>;
    invalidateCompanies: () => void;
};

export const useCompanyStore = create<CompanyStore>((set, get) => ({
    companies: [],
    isLoading: false,
    error: null,

    lastFetched: null,
    staleTime: 1000 * 60 * 5, 

    fetchCompanies: async () => {
        const { lastFetched, staleTime, isLoading } = get();

        const now = Date.now();

        if (lastFetched && now - lastFetched < staleTime) {
            return;
        }

        if (isLoading) return;

        set({ isLoading: true, error: null });

        try {
            const companies = await companyApi.getAll();

            set({
                companies,
                lastFetched: Date.now(),
            });
        } catch {
            set({ error: 'Failed to load companies' });
        } finally {
            set({ isLoading: false });
        }
    },

    invalidateCompanies: () => {
        set({
            lastFetched: null,
        });

        get().fetchCompanies();
    },
}));