
import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  colorClass: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, description, colorClass }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border-l-4" style={{ borderLeftColor: colorClass }}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
          {description && <p className="text-sm text-gray-500 mt-2">{description}</p>}
        </div>
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colorClass}20` }}>
          <span className="text-xl font-bold" style={{ color: colorClass }}>₦</span>
        </div>
      </div>
    </div>
  );
};
