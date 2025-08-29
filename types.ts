export enum TransactionType {
  REVENUE = 'Revenue',
  BUSINESS_EXPENSE = 'Business Expense',
  PERSONAL_EXPENSE = 'Personal Expense',
  INVESTMENT = 'Investment',
  SAVINGS = 'Savings',
  REINVESTED_FUNDS = 'Reinvested Funds',
}

export const ExpenseCategories = [
  // Business
  'Software', 'Marketing', 'Office Supplies', 'Travel', 'Contractors', 'Utilities (Biz)',
  // Personal
  'Groceries', 'Rent/Mortgage', 'Utilities (Personal)', 'Entertainment', 'Transportation', 'Healthcare', 'Shopping'
] as const;

export const InvestmentCategories = [
    'Bonds', 'Stocks', 'Forex', 'New Ventures', 'Other'
] as const;

export const SavingsCategories = [
    'Short-term', 'Long-term', 'Emergency Fund'
] as const;


export type ExpenseCategory = typeof ExpenseCategories[number];
export type InvestmentCategory = typeof InvestmentCategories[number];
export type SavingsCategory = typeof SavingsCategories[number];

export type AllCategories = ExpenseCategory | InvestmentCategory | SavingsCategory;


export interface Transaction {
  id: string;
  date: string; // ISO string format YYYY-MM-DD
  description: string;
  amount: number;
  type: TransactionType;
  category?: AllCategories;
}

export type TimePeriod = 'day' | 'week' | 'month' | 'all';