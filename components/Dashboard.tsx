import React, { useMemo, useState } from 'react';
import type { Transaction, TimePeriod } from '../types';
import { TransactionType } from '../types';
import { StatCard } from './StatCard';
import { IncomeExpenseChart } from './charts/IncomeExpenseChart';
import { OutflowBreakdownChart } from './charts/ExpenseBreakdownChart';
import { formatCurrency } from '../utils/currency';
import { isWithinPeriod } from '../utils/dateUtils';

interface DashboardProps {
  transactions: Transaction[];
}

const PeriodSelector: React.FC<{
  selectedPeriod: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
}> = ({ selectedPeriod, onPeriodChange }) => {
  const periods: { value: TimePeriod; label: string }[] = [
    { value: 'day', label: 'Daily' },
    { value: 'week', label: 'Weekly' },
    { value: 'month', label: 'Monthly' },
    { value: 'all', label: 'All Time' },
  ];

  return (
    <div className="flex items-center bg-gray-200/60 rounded-lg p-1 space-x-1">
      {periods.map(period => (
        <button
          key={period.value}
          onClick={() => onPeriodChange(period.value)}
          className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
            selectedPeriod === period.value
              ? 'bg-white text-primary shadow-sm'
              : 'text-gray-600 hover:bg-white/60'
          }`}
          aria-pressed={selectedPeriod === period.value}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
};

export const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('month');

  const filteredTransactions = useMemo(() =>
    transactions.filter(t => isWithinPeriod(t.date, timePeriod)),
    [transactions, timePeriod]
  );

  const {
    totalRevenue,
    totalBusinessExpenses,
    totalPersonalExpenses,
    netIncome,
    totalCapitalOutflows,
    netCashFlow,
  } = useMemo(() => {
    let totalRevenue = 0;
    let totalBusinessExpenses = 0;
    let totalPersonalExpenses = 0;
    let totalInvestments = 0;
    let totalSavings = 0;
    let totalReinvested = 0;
    
    filteredTransactions.forEach(t => {
      switch (t.type) {
        case TransactionType.REVENUE: totalRevenue += t.amount; break;
        case TransactionType.BUSINESS_EXPENSE: totalBusinessExpenses += t.amount; break;
        case TransactionType.PERSONAL_EXPENSE: totalPersonalExpenses += t.amount; break;
        case TransactionType.INVESTMENT: totalInvestments += t.amount; break;
        case TransactionType.SAVINGS: totalSavings += t.amount; break;
        case TransactionType.REINVESTED_FUNDS: totalReinvested += t.amount; break;
      }
    });
    
    const netIncome = totalRevenue - totalBusinessExpenses;
    const totalCapitalOutflows = totalInvestments + totalSavings + totalReinvested;
    const totalOutflows = totalBusinessExpenses + totalPersonalExpenses + totalCapitalOutflows;
    const netCashFlow = totalRevenue - totalOutflows;

    return { totalRevenue, totalBusinessExpenses, totalPersonalExpenses, netIncome, totalCapitalOutflows, netCashFlow };
  }, [filteredTransactions]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <PeriodSelector selectedPeriod={timePeriod} onPeriodChange={setTimePeriod} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Revenue" value={formatCurrency(totalRevenue)} colorClass="#22c55e" />
        <StatCard title="Net Income (Business)" value={formatCurrency(netIncome)} colorClass="#3b82f6" description="Revenue - Biz Expenses" />
        <StatCard title="Net Cash Flow" value={formatCurrency(netCashFlow)} colorClass="#10b981" description="Revenue - All Outflows" />
        <StatCard title="Business Expenses" value={formatCurrency(totalBusinessExpenses)} colorClass="#ef4444" />
        <StatCard title="Personal Expenses" value={formatCurrency(totalPersonalExpenses)} colorClass="#f97316" />
        <StatCard title="Capital Outflows" value={formatCurrency(totalCapitalOutflows)} colorClass="#8b5cf6" description="Investments, Savings etc." />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Income vs Outflows Trend</h3>
          <IncomeExpenseChart transactions={filteredTransactions} timePeriod={timePeriod} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Outflow Breakdown</h3>
          <OutflowBreakdownChart transactions={filteredTransactions} />
        </div>
      </div>
    </div>
  );
};