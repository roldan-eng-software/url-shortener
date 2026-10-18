'use client';

import { LucideIcon } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  description?: string;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'gray';
}

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  yellow: 'bg-yellow-50 text-yellow-600',
  red: 'bg-red-50 text-red-600',
  gray: 'bg-gray-50 text-gray-600',
};

export function MetricsCard({
  title,
  value,
  icon: Icon,
  description,
  color = 'blue',
}: MetricsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value.toLocaleString('pt-BR')}</p>
          {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
