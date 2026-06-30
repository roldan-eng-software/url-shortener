'use client';

import { useEffect, useState } from 'react';
import { PaymentStatus } from '@/components/admin/PaymentStatus';
import { RevenueGrid } from '@/components/admin/RevenueCard';
import { RefreshCw } from 'lucide-react';

interface PaymentMetrics {
  stripeConnected: boolean;
  totalRevenue: number;
  mrr: number;
  activeSubscriptions: number;
  trialSubscriptions: number;
}

export default function PaymentsPage() {
  const [metrics, setMetrics] = useState<PaymentMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchMetrics() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/payments');

      if (!response.ok) {
        throw new Error('Erro ao carregar métricas de pagamento');
      }

      const data = await response.json();
      setMetrics(data);
    } catch (err) {
      console.error('Error fetching payment metrics:', err);
      setError('Erro ao carregar métricas de pagamento');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Pagamentos</h2>
          <p className="text-sm text-gray-500">Status do Stripe e métricas financeiras</p>
        </div>
        <button
          onClick={fetchMetrics}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <PaymentStatus connected={metrics?.stripeConnected ?? false} loading={loading} />

      {metrics && metrics.stripeConnected && (
        <>
          <RevenueGrid metrics={metrics} loading={loading} />

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo Financeiro</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">Receita Mensal Recorrente (MRR)</h4>
                <p className="text-3xl font-bold text-blue-600">
                  {(metrics.mrr / 100).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Calculado com base em todas as assinaturas ativas
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">Projeção Anual</h4>
                <p className="text-3xl font-bold text-green-600">
                  {((metrics.mrr * 12) / 100).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  MRR × 12 meses
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
