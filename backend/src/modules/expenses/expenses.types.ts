export type ExpenseCategory = 'advertising' | 'rent' | 'materials' | 'salary' | 'taxes' | 'other';

export interface ExpenseResponse {
    id: string;
    companyId: string;
    amount: number;
    category: ExpenseCategory;
    description: string | null;
    date: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateExpenseDto {
    companyId: string;
    amount: number;
    category: ExpenseCategory;
    description?: string | null;
    date?: Date;
}

export interface UpdateExpenseDto {
    amount?: number;
    category?: ExpenseCategory;
    description?: string | null;
    date?: Date;
}