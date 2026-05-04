import type { CompanyMember } from "@/entities/company_member";
import { apiClient } from "@/shared/api/client";

type CreateCompanyMemberDto = Omit<CompanyMember, 'id'>;
type UpdateCompanyMemberDto = Partial<Omit<CompanyMember, 'id' | 'userId' | 'companyId' | 'permissions'>>;

export const companyMemberApi = {
    create: async (data: CreateCompanyMemberDto) => {
        const response = await apiClient.post('/company-members', data);
        return response.data;
    },

    update: async (id: string, data: UpdateCompanyMemberDto) => {
        const response = await apiClient.patch(`/company-members/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await apiClient.delete(`/company_members/${id}`);
        return response.data;
    },

    getMemberByUserId: async (companyId: string, userId: string) => {
        const response = await apiClient.get(`/company-members/user/${userId}/company/${companyId}`);
        return response.data;
    },
}