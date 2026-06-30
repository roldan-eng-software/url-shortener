'use client';

import { useEffect, useState } from 'react';
import { MetricsGrid } from '@/components/admin/MetricsGrid';
import { RefreshCw } from 'lucide-react';

interface DatabaseMetrics {
  users: number;
  userLinks: number;
  anonLinks: number;
  urls: number;
  marketingLeads: number;
  privacyRequests: number;
  bioPages: number;
  bioLinks: number;
  totalRecords: number;
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<DatabaseMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchMetrics() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/metrics');

      if (!response.ok) {
        throw new Error('Erro ao carregar métricas');
      }

      const data = await response.json();
      setMetrics(data);
    } catch (err) {
      console.error('Error fetching metrics:', err);
      setError('Erro ao carregar métricas do banco de dados');
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
          <h2 className="text-lg font-semibold text-gray-900">Métricas do Banco de Dados</h2>
          <p className="text-sm text-gray-500">Visão geral de todos os registros do sistema</p>
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

      <MetricsGrid metrics={metrics} loading={loading} />

      {metrics && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {metrics.totalRecords.toLocaleString('pt-BR')}
              </p>
              <p className="text-sm text-gray-500">Total de Registros</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {metrics.users.toLocaleString('pt-BR')}
              </p>
              <p className="text-sm text-gray-500">Usuários Cadastrados</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">
                {(metrics.userLinks + metrics.anonLinks).toLocaleString('pt-BR')}
              </p>
              <p className="text-sm text-gray-500">Total de Links Criados</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
