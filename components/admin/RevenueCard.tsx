'use client';

import { DollarSign, TrendingUp, Users, Clock } from 'lucide-react';

interface RevenueCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  format?: 'currency' | 'number';
  color?: 'green' | 'blue' | 'yellow' | 'gray';
}

const colorClasses = {
  green: 'bg-green-50 text-green-600',
  blue: 'bg-blue-50 text-blue-600',
  yellow: 'bg-yellow-50 text-yellow-600',
  gray: 'bg-gray-50 text-gray-600',
};

export function RevenueCard({ label, value, icon: Icon, format = 'number', color = 'green' }: RevenueCardProps) {
  const formatValue = (val: number) => {
    if (format === 'currency') {
      // Convert from centavos to reais
      const reais = val / 100;
      return reais.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
    }
    return val.toLocaleString('pt-BR');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{formatValue(value)}</p>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

interface PaymentMetrics {
  stripeConnected: boolean;
  totalRevenue: number;
  mrr: number;
  activeSubscriptions: number;
  trialSubscriptions: number;
}

interface RevenueGridProps {
  metrics: PaymentMetrics | null;
  loading: boolean;
}

export function RevenueGrid({ metrics, loading }: RevenueGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-500">Erro ao carregar métricas de pagamento</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <RevenueCard
        label="Receita Total"
        value={metrics.totalRevenue}
        icon={DollarSign}
        format="currency"
        color="green"
      />
      <RevenueCard
        label="MRR (Receita Mensal)"
        value={metrics.mrr}
        icon={TrendingUp}
        format="currency"
        color="blue"
      />
      <RevenueCard
        label="Assinaturas Ativas"
        value={metrics.activeSubscriptions}
        icon={Users}
        color="green"
      />
      <RevenueCard
        label="Em Trial"
        value={metrics.trialSubscriptions}
        icon={Clock}
        color="yellow"
      />
    </div>
  );
}
