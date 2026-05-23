export interface FavoriteResponse {
    id: string;
    userId: string;
    companyId: string;
    createdAt: Date;
    company: {
        id: string;
        name: string;
        slug: string;
        logo?: string | null;
        city: string;
        tags: string[];
        description?: string | null;
    };
}

export interface AddFavoriteDto {
    companyId: string;
}

export interface RemoveFavoriteDto {
    companyId: string;
}