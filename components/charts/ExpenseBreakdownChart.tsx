
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Transaction } from '../../types';
import { TransactionType } from '../../types';
import { formatCurrency } from '../../utils/currency';

interface ExpenseBreakdownChartProps {
  transactions: Transaction[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ff4d4d', '#4dff4d', '#4d4dff'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/80 backdrop-blur-sm p-2 border border-gray-200 rounded-lg shadow-sm">
        <p className="label font-semibold">{`${payload[0].name} : ${formatCurrency(payload[0].value)}`}</p>
      </div>
    );
  }
  return null;
};

export const ExpenseBreakdownChart: React.FC<ExpenseBreakdownChartProps> = ({ transactions }) => {
  const data = useMemo(() => {
    const expenseData = new Map<string, number>();
    transactions
      .filter(t => t.type === TransactionType.BUSINESS_EXPENSE || t.type === TransactionType.PERSONAL_EXPENSE)
      .forEach(t => {
        const category = t.category || 'Uncategorized';
        expenseData.set(category, (expenseData.get(category) || 0) + t.amount);
      });

    return Array.from(expenseData.entries()).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
  }, [transactions]);

  if (data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <p>No expense data to display.</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconSize={10}
          layout="vertical"
          verticalAlign="middle"
          align="right"
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
