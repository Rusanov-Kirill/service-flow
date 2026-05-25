export type ExpenseCategory = 'advertising' | 'rent' | 'materials' | 'salary' | 'taxes' | 'other';

export interface Expense {
    id: string;
    companyId: string;
    amount: number;
    category: ExpenseCategory;
    description: string | null;
    date: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateExpenseDto {
    companyId: string;
    amount: number;
    category: ExpenseCategory;
    description?: string | null;
    date?: string;
}

export interface UpdateExpenseDto {
    amount?: number;
    category?: ExpenseCategory;
    description?: string | null;
    date?: string;
}

export interface ExpensesResponse {
    expenses: Expense[];
    total: number;
    count: number;
}

export interface CategoryStats {
    category: ExpenseCategory;
    total: number;
    count: number;
    percentage: number;
}

export const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
    advertising: 'Реклама',
    rent: 'Аренда',
    materials: 'Материалы',
    salary: 'Зарплата',
    taxes: 'Налоги',
    other: 'Прочее',
};

export const EXPENSE_CATEGORIES = [
    { value: 'advertising' as const, label: 'Реклама' },
    { value: 'rent' as const, label: 'Аренда' },
    { value: 'materials' as const, label: 'Материалы' },
    { value: 'salary' as const, label: 'Зарплата' },
    { value: 'taxes' as const, label: 'Налоги' },
    { value: 'other' as const, label: 'Прочее' },
];