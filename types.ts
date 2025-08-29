
export enum TransactionType {
  REVENUE = 'Revenue',
  BUSINESS_EXPENSE = 'Business Expense',
  PERSONAL_EXPENSE = 'Personal Expense',
}

export const ExpenseCategories = [
  // Business
  'Software', 'Marketing', 'Office Supplies', 'Travel', 'Contractors', 'Utilities (Biz)',
  // Personal
  'Groceries', 'Rent/Mortgage', 'Utilities (Personal)', 'Entertainment', 'Transportation', 'Healthcare', 'Shopping'
] as const;

export type ExpenseCategory = typeof ExpenseCategories[number];

export interface Transaction {
  id: string;
  date: string; // ISO string format YYYY-MM-DD
  description: string;
  amount: number;
  type: TransactionType;
  category?: ExpenseCategory;
}

export type TimePeriod = 'day' | 'week' | 'month' | 'all';
