'use client';

import { useCallback, useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { FunnelChart, type FunnelData } from '@/components/admin/FunnelChart';

const DEFAULT_WINDOW_DAYS = 30;

function toDateInput(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export default function AdminFunnelPage() {
  const today = new Date();
  const defaultFrom = new Date(today.getTime() - DEFAULT_WINDOW_DAYS * 24 * 60 * 60 * 1000);

  const [from, setFrom] = useState(toDateInput(defaultFrom));
  const [to, setTo] = useState(toDateInput(today));
  const [groupBySource, setGroupBySource] = useState(false);
  const [data, setData] = useState<FunnelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFunnel = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ from, to });
      if (groupBySource) {
        params.set('groupBy', 'source');
      }

      const response = await fetch(`/api/admin/funnel?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Erro ao carregar o funil');
      }

      const payload = (await response.json()) as FunnelData;
      setData(payload);
    } catch (err) {
      console.error('Error fetching funnel:', err);
      setError('Erro ao carregar o funil. Verifique se a migration foi aplicada.');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [from, to, groupBySource]);

  useEffect(() => {
    fetchFunnel();
  }, [fetchFunnel]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Funil anônimo → Premium</h2>
          <p className="text-sm text-gray-500">
            Conversão por etapa e por origem, a partir dos eventos de funil.
          </p>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col text-xs font-semibold text-gray-600">
            De
            <input
              type="date"
              value={from}
              onChange={(event) => setFrom(event.target.value)}
              className="mt-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
            />
          </label>

          <label className="flex flex-col text-xs font-semibold text-gray-600">
            Até
            <input
              type="date"
              value={to}
              onChange={(event) => setTo(event.target.value)}
              className="mt-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
            />
          </label>

          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={groupBySource}
              onChange={(event) => setGroupBySource(event.target.checked)}
              className="h-4 w-4"
            />
            Agrupar por origem
          </label>

          <button
            onClick={fetchFunnel}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <FunnelChart data={data} loading={loading} groupBySource={groupBySource} />
    </div>
  );
}
