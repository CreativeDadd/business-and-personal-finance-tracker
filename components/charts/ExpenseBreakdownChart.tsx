import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Transaction } from '../../types';
import { TransactionType } from '../../types';
import { formatCurrency } from '../../utils/currency';

interface OutflowBreakdownChartProps {
  transactions: Transaction[];
}

const COLORS = ['#ef4444', '#f97316', '#8b5cf6', '#3b82f6', '#10b981', '#6b7280', '#ec4899', '#f59e0b'];

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

export const OutflowBreakdownChart: React.FC<OutflowBreakdownChartProps> = ({ transactions }) => {
  const data = useMemo(() => {
    const outflowData = new Map<string, number>();
    transactions
      .filter(t => t.type !== TransactionType.REVENUE) // Filter for all outflows
      .forEach(t => {
        // Use the transaction type as the category if no specific category exists
        const category = t.category || t.type;
        outflowData.set(category, (outflowData.get(category) || 0) + t.amount);
      });

    return Array.from(outflowData.entries()).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
  }, [transactions]);

  if (data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <p>No outflow data to display.</p>
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