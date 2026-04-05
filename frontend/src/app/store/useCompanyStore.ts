import { create } from 'zustand';

import type { Company } from '@/entities/company';

interface CompanyStore {
  selectedCompany: Company | null
  setSelectedCompany: (company: Company | null) => void
};

export const useCompanyStore = create<CompanyStore>((set) => ({
  selectedCompany: null,
  setSelectedCompany: (company) => set({ selectedCompany: company }),
}));