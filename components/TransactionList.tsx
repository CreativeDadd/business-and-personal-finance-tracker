import React, { useState, useMemo } from 'react';
import type { Transaction } from '../types';
import { TransactionType } from '../types';
import { formatCurrency } from '../utils/currency';

interface TransactionListProps {
  transactions: Transaction[];
}

const getTypeColor = (type: TransactionType) => {
  switch (type) {
    case TransactionType.REVENUE:
      return 'bg-green-100 text-green-800';
    case TransactionType.BUSINESS_EXPENSE:
      return 'bg-red-100 text-red-800';
    case TransactionType.PERSONAL_EXPENSE:
      return 'bg-orange-100 text-orange-800';
    case TransactionType.INVESTMENT:
      return 'bg-purple-100 text-purple-800';
    case TransactionType.SAVINGS:
      return 'bg-blue-100 text-blue-800';
    case TransactionType.REINVESTED_FUNDS:
      return 'bg-gray-200 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions;
    if (filterType !== 'all') {
      filtered = transactions.filter(t => t.type === filterType);
    }
    
    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
  }, [transactions, filterType, sortOrder]);
  
  const filterOptions: string[] = ['all', ...Object.values(TransactionType)];

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2 sm:mb-0">All Transactions</h2>
          <select 
            value={sortOrder} 
            onChange={e => setSortOrder(e.target.value as 'desc' | 'asc')}
            className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
        <div className="flex flex-wrap items-center gap-2 border-t border-gray-200 pt-4">
          <span className="text-sm font-medium text-gray-600 mr-2">Filter by type:</span>
          {filterOptions.map(option => (
            <button
              key={option}
              onClick={() => setFilterType(option)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                filterType === option
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option === 'all' ? 'All' : option}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedTransactions.length > 0 ? (
              filteredAndSortedTransactions.map(t => (
                <tr key={t.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(t.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>{t.description}</div>
                    {t.category && <div className="text-xs text-gray-500">{t.category}</div>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(t.type)}`}>
                      {t.type}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${t.type === TransactionType.REVENUE ? 'text-success' : 'text-error'}`}>
                    {t.type === TransactionType.REVENUE ? '+' : '-'}
                    {formatCurrency(t.amount)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-10 text-gray-500">No transactions found for the selected filter.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};