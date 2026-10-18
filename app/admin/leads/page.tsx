'use client';

import { useEffect, useState, useCallback } from 'react';
import { LeadsTable } from '@/components/admin/LeadsTable';
import { LeadFilters } from '@/components/admin/LeadFilters';
import { RefreshCw } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  interest: string;
  source: string;
  message: string | null;
  status: string;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [interestFilter, setInterestFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.set('status', statusFilter);
      }
      if (interestFilter !== 'all') {
        params.set('interest', interestFilter);
      }
      if (sourceFilter !== 'all') {
        params.set('source', sourceFilter);
      }

      const response = await fetch(`/api/admin/leads?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Erro ao carregar leads');
      }

      const data = await response.json();
      setLeads(data.leads);
      setPagination(data.pagination);
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError('Erro ao carregar lista de leads');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, interestFilter, sourceFilter]);

  async function handleStatusUpdate(leadId: string, newStatus: string) {
    try {
      const response = await fetch('/api/admin/leads', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ leadId, status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar status');
      }

      // Update local state
      setLeads((prevLeads) =>
        prevLeads.map((lead) => (lead.id === leadId ? { ...lead, status: newStatus } : lead))
      );
    } catch (err) {
      console.error('Error updating lead status:', err);
      setError('Erro ao atualizar status do lead');
    }
  }

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Leads</h2>
          <p className="text-sm text-gray-500">
            {pagination ? `${pagination.total} leads encontrados` : 'Carregando...'}
          </p>
        </div>
        <button
          onClick={fetchLeads}
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

      <LeadFilters
        statusFilter={statusFilter}
        interestFilter={interestFilter}
        sourceFilter={sourceFilter}
        onStatusChange={setStatusFilter}
        onInterestChange={setInterestFilter}
        onSourceChange={setSourceFilter}
      />

      <LeadsTable leads={leads} loading={loading} onStatusUpdate={handleStatusUpdate} />

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Página {pagination.page} de {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <button
              disabled={pagination.page <= 1}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              disabled={!pagination.hasMore}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
