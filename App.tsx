import React, { useState } from 'react';
import type { Transaction } from './types';
import { TransactionType } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import { AddTransactionForm } from './components/AddTransactionForm';
import { TransactionList } from './components/TransactionList';
import { Dashboard } from './components/Dashboard';
import { ChartBarIcon } from './components/icons/ChartBarIcon';
import { DocumentTextIcon } from './components/icons/DocumentTextIcon';

// Dummy data for initial state if local storage is empty
const getInitialData = (): Transaction[] => {
  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(today.getMonth() - 2);

  return [
    { id: '1', date: twoMonthsAgo.toISOString().split('T')[0], description: 'Client Project A', amount: 3500, type: TransactionType.REVENUE },
    { id: '2', date: new Date(twoMonthsAgo.getTime() + 86400000 * 2).toISOString().split('T')[0], description: 'Monthly Software Subscription', amount: 75, type: TransactionType.BUSINESS_EXPENSE, category: 'Software' },
    { id: '3', date: oneMonthAgo.toISOString().split('T')[0], description: 'Client Project B', amount: 5200, type: TransactionType.REVENUE },
    { id: '4', date: new Date(oneMonthAgo.getTime() + 86400000 * 5).toISOString().split('T')[0], description: 'Office Supplies', amount: 120.50, type: TransactionType.BUSINESS_EXPENSE, category: 'Office Supplies' },
    { id: '5', date: new Date(oneMonthAgo.getTime() + 86400000 * 10).toISOString().split('T')[0], description: 'Groceries', amount: 210.75, type: TransactionType.PERSONAL_EXPENSE, category: 'Groceries' },
    { id: '6', date: new Date(today.getTime() - 86400000 * 5).toISOString().split('T')[0], description: 'New Client Retainer', amount: 2000, type: TransactionType.REVENUE },
    { id: '7', date: new Date(today.getTime() - 86400000 * 2).toISOString().split('T')[0], description: 'Facebook Ads', amount: 300, type: TransactionType.BUSINESS_EXPENSE, category: 'Marketing' },
    { id: '8', date: new Date(today.getTime() - 86400000 * 4).toISOString().split('T')[0], description: 'Invest in XYZ Stocks', amount: 1000, type: TransactionType.INVESTMENT, category: 'Stocks' },
    { id: '9', date: new Date(today.getTime() - 86400000 * 3).toISOString().split('T')[0], description: 'Move to emergency fund', amount: 500, type: TransactionType.SAVINGS, category: 'Emergency Fund' },
    { id: '10', date: new Date(today.getTime() - 86400000 * 1).toISOString().split('T')[0], description: 'Reinvest profits into marketing', amount: 450, type: TransactionType.REINVESTED_FUNDS },
  ];
};


type View = 'dashboard' | 'transactions';

const App: React.FC = () => {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('finance-tracker-transactions', getInitialData());
  const [activeView, setActiveView] = useState<View>('dashboard');

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      id: new Date().getTime().toString(),
      ...transaction
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  // Fix: Explicitly type NavButton as a React.FC with its expected props to resolve the type inference error for the `children` prop.
  const NavButton: React.FC<{ view: View, label: string, children: React.ReactNode }> = ({ view, label, children }) => (
    <button
      onClick={() => setActiveView(view)}
      className={`flex items-center space-x-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        activeView === view
          ? 'bg-primary text-white shadow'
          : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
      }`}
    >
      {children}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-base-100 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-white p-4 md:p-6 border-b md:border-r border-gray-200 flex-shrink-0">
        <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
            </div>
            <h1 className="text-xl font-bold text-gray-800">FinTrack</h1>
        </div>
        <nav className="flex flex-row md:flex-col gap-2">
            <NavButton view="dashboard" label="Dashboard">
                <ChartBarIcon className="w-5 h-5" />
            </NavButton>
            <NavButton view="transactions" label="Transactions">
                <DocumentTextIcon className="w-5 h-5" />
            </NavButton>
        </nav>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-auto">
        {activeView === 'dashboard' && <Dashboard transactions={transactions} />}
        {activeView === 'transactions' && (
          <div className="space-y-6">
            <AddTransactionForm onAddTransaction={addTransaction} />
            <TransactionList transactions={transactions} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;