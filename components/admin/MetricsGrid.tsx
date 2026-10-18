'use client';

import {
  Database,
  Link2,
  Users,
  FileText,
  Shield,
  Globe,
  Layout,
  MousePointer,
} from 'lucide-react';
import { MetricsCard } from './MetricsCard';

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

interface MetricsGridProps {
  metrics: DatabaseMetrics | null;
  loading: boolean;
}

export function MetricsGrid({ metrics, loading }: MetricsGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
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
        <p className="text-gray-500">Erro ao carregar métricas</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricsCard
        title="Usuários"
        value={metrics.users}
        icon={Users}
        description="Total de contas criadas"
        color="blue"
      />
      <MetricsCard
        title="Links Premium"
        value={metrics.userLinks}
        icon={Link2}
        description="Links de usuários premium"
        color="green"
      />
      <MetricsCard
        title="Links Anônimos"
        value={metrics.anonLinks}
        icon={Globe}
        description="Links criados sem conta"
        color="yellow"
      />
      <MetricsCard
        title="URLs Totais"
        value={metrics.urls}
        icon={Database}
        description="Todas as URLs no sistema"
        color="gray"
      />
      <MetricsCard
        title="Leads"
        value={metrics.marketingLeads}
        icon={FileText}
        description="Potenciais clientes"
        color="blue"
      />
      <MetricsCard
        title="Solicitações LGPD"
        value={metrics.privacyRequests}
        icon={Shield}
        description="Pedidos de privacidade"
        color="red"
      />
      <MetricsCard
        title="Páginas Bio"
        value={metrics.bioPages}
        icon={Layout}
        description="Links de bio criados"
        color="green"
      />
      <MetricsCard
        title="Links Bio"
        value={metrics.bioLinks}
        icon={MousePointer}
        description="Links dentro das páginas bio"
        color="yellow"
      />
    </div>
  );
}
