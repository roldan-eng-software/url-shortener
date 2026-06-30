'use client';

import { Filter } from 'lucide-react';

interface LeadFiltersProps {
  statusFilter: string;
  interestFilter: string;
  sourceFilter: string;
  onStatusChange: (value: string) => void;
  onInterestChange: (value: string) => void;
  onSourceChange: (value: string) => void;
}

export function LeadFilters({
  statusFilter,
  interestFilter,
  sourceFilter,
  onStatusChange,
  onInterestChange,
  onSourceChange,
}: LeadFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Filtros:</span>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="status" className="text-sm text-gray-600">Status:</label>
        <select
          id="status"
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Todos</option>
          <option value="new">Novo</option>
          <option value="contacted">Contactado</option>
          <option value="converted">Convertido</option>
          <option value="lost">Perdido</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="interest" className="text-sm text-gray-600">Interesse:</label>
        <select
          id="interest"
          value={interestFilter}
          onChange={(e) => onInterestChange(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Todos</option>
          <option value="premium">Premium</option>
          <option value="enterprise">Enterprise</option>
          <option value="partnership">Parceria</option>
          <option value="other">Outro</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="source" className="text-sm text-gray-600">Fonte:</label>
        <select
          id="source"
          value={sourceFilter}
          onChange={(e) => onSourceChange(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Todas</option>
          <option value="home_conversion_band">Homepage</option>
          <option value="seo">SEO</option>
          <option value="social">Redes Sociais</option>
          <option value="referral">Indicação</option>
          <option value="other">Outra</option>
        </select>
      </div>
    </div>
  );
}
