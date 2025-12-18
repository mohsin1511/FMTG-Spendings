
export enum Category {
  Housing = 'Housing',
  Food = 'Food',
  Transport = 'Transport',
  Utilities = 'Utilities',
  Entertainment = 'Entertainment',
  Health = 'Health',
  Shopping = 'Shopping',
  Others = 'Others'
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: Category;
}

export interface InsightResponse {
  summary: string;
  tips: string[];
}

export type CategoryBudgets = Partial<Record<Category, number>>;
