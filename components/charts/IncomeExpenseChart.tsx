import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Transaction, TimePeriod } from '../../types';
import { TransactionType } from '../../types';
import { formatCurrency } from '../../utils/currency';

interface IncomeExpenseChartProps {
  transactions: Transaction[];
  timePeriod: TimePeriod;
}

const formatYAxis = (tickItem: number) => {
    const value = formatCurrency(tickItem);
    // Remove cents for cleaner axis labels
    return value.substring(0, value.length - 3);
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/80 backdrop-blur-sm p-3 border border-gray-200 rounded-lg shadow-sm">
          <p className="label font-bold text-gray-700">{label}</p>
          {payload.map((pld: any, index: number) => (
            <div key={index} style={{ color: pld.color }}>
              {`${pld.name}: ${formatCurrency(pld.value)}`}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

const getLocalDate = (isoDate: string): Date => {
    const [year, month, day] = isoDate.split('-').map(Number);
    return new Date(year, month - 1, day);
};

export const IncomeExpenseChart: React.FC<IncomeExpenseChartProps> = ({ transactions, timePeriod }) => {
  const data = useMemo(() => {
    const dataMap: { [key: string]: { revenue: number, outflows: number } } = {};

    const getGroupKey = (date: Date): string => {
        switch (timePeriod) {
            case 'day':
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            case 'week':
                return date.toLocaleDateString('en-US', { weekday: 'short' }); // e.g., 'Mon'
            case 'month':
                return date.getDate().toString(); // e.g., '15'
            case 'all':
            default:
                return date.toLocaleDateString('en-US', { year: '2-digit', month: 'short' });
        }
    };
    
    transactions.forEach(t => {
      const date = getLocalDate(t.date);
      const key = getGroupKey(date);
      if (!dataMap[key]) {
        dataMap[key] = { revenue: 0, outflows: 0 };
      }
      if (t.type === TransactionType.REVENUE) {
        dataMap[key].revenue += t.amount;
      } else {
        dataMap[key].outflows += t.amount;
      }
    });

    const sortedKeys = Object.keys(dataMap).sort((a, b) => {
        if (timePeriod === 'week') {
            const daysOrder = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            return daysOrder.indexOf(a) - daysOrder.indexOf(b);
        }
        if (timePeriod === 'month') {
            return parseInt(a, 10) - parseInt(b, 10);
        }
        if (timePeriod === 'all') {
            const parseDate = (key: string) => {
                // Handles format "Mmm 'YY", e.g., "May '24"
                const [monthStr, yearStr] = key.split(" '");
                return new Date(`${monthStr} 1, 20${yearStr}`);
            };
            return parseDate(a).getTime() - parseDate(b).getTime();
        }
        // No specific sort for 'day' as there's likely only one data point
        return 0;
    });

    return sortedKeys.map(key => ({
      name: key,
      Revenue: dataMap[key].revenue,
      'Total Outflows': dataMap[key].outflows,
    }));
  }, [transactions, timePeriod]);
  
  if (data.length === 0) {
    return (
        <div className="h-full flex items-center justify-center text-gray-500">
          <p>No data available for this period.</p>
        </div>
      );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis dataKey="name" stroke="#6b7280" />
        <YAxis tickFormatter={formatYAxis} stroke="#6b7280" />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line type="monotone" dataKey="Revenue" stroke="#22c55e" strokeWidth={2} activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="Total Outflows" name="Total Outflows" stroke="#ef4444" strokeWidth={2} activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};